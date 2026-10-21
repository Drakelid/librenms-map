<?php

namespace LibreMap\Topology;

use App\Models\Device;
use App\Models\DeviceGroup;
use App\Models\Link;
use App\Models\Port;
use App\Models\User;
use Illuminate\Support\Collection;

class LibreNmsTopology
{
    // display, ip and overwrite_ip feed the host's Device::displayName().
    public const DEVICE_COLUMNS = ['device_id', 'hostname', 'sysName', 'display', 'ip', 'overwrite_ip', 'status', 'disabled'];
    public const PORT_COLUMNS = ['port_id', 'device_id', 'ifName', 'ifDescr', 'ifSpeed', 'ifOperStatus', 'ifAdminStatus', 'disabled', 'ifInOctets_rate', 'ifOutOctets_rate', 'poll_time'];

    public function forUser(User $user): array
    {
        $devices = $this->devices($user);
        $deviceIds = $devices->pluck('device_id')->all();
        $maxLinks = max(1, (int) config('libremap.max_links', 10000));

        // Both devices must be known and authorized, and the measuring (local)
        // port authorized and current. Do not expose unresolved neighbor
        // hostnames or infer links from device names.
        //
        // LibreNMS often resolves the neighbor device but not its port (an LLDP
        // neighbor reporting a description or MAC as its port ID). Requiring a
        // resolved remote port would silently drop those links, so they are
        // kept with the port name the neighbor reported. A remote port that is
        // resolved must still be authorized and current.
        $links = Link::hasAccess($user)
            ->where('active', 1)
            ->whereIntegerInRaw('local_device_id', $deviceIds)
            ->whereIntegerInRaw('remote_device_id', $deviceIds)
            ->whereHas('port', fn ($query) => $query->hasAccess($user)->where('deleted', 0))
            ->where(fn ($query) => $query->whereNull('remote_port_id')->orWhere('remote_port_id', 0)
                ->orWhereHas('remotePort', fn ($query) => $query->hasAccess($user)->where('deleted', 0)))
            ->select(['id', 'local_device_id', 'remote_device_id', 'local_port_id', 'remote_port_id', 'remote_port'])
            ->orderBy('id')->limit($maxLinks + 1)->get();
        abort_if($links->count() > $maxLinks, 422, 'LibreMap link limit exceeded. Increase libremap.max_links before loading this network.');

        $portIds = $links->pluck('local_port_id')->merge($links->pluck('remote_port_id'))->filter()->unique()->all();
        $ports = Port::hasAccess($user)->where('deleted', 0)
            ->whereIntegerInRaw('port_id', $portIds)
            ->get(self::PORT_COLUMNS)
            ->keyBy('port_id');

        $resultLinks = [];
        foreach ($links as $link) {
            $source = $ports->get($link->local_port_id);
            $resolved = (int) $link->remote_port_id > 0;
            $target = $resolved ? $ports->get($link->remote_port_id) : null;
            if (! $source || (int) $source->device_id !== (int) $link->local_device_id
                || ($resolved && (! $target || (int) $target->device_id !== (int) $link->remote_device_id))) {
                continue;
            }

            $resultLinks[] = [
                'id' => (string) $link->id,
                'source' => (string) $link->local_device_id,
                'target' => (string) $link->remote_device_id,
                'sourcePort' => $this->portName($source),
                'targetPort' => $target ? $this->portName($target) : $this->reportedPort($link->remote_port),
                'sourcePortId' => (string) $source->port_id,
                // Empty when LibreNMS has not matched the neighbor's port.
                'targetPortId' => $target ? (string) $target->port_id : '',
                'speedBps' => $this->number($source->ifSpeed, positive: true),
                'inBps' => $this->rate($source->ifInOctets_rate),
                'outBps' => $this->rate($source->ifOutOctets_rate),
                'sampledAt' => $this->number($source->poll_time, positive: true),
                'status' => $this->linkStatus($source, $target ?? $source),
            ];
        }

        return [
            'devices' => $devices->map(fn (Device $device) => $this->device($device))->values()->all(),
            'links' => $resultLinks,
            'deviceGroups' => $this->deviceGroups($user, $deviceIds),
            'generatedAt' => time(),
            'config' => [
                'prefixes' => $this->prefixes(),
                'staleAfter' => max(1, (int) config('libremap.stale_after', 900)),
                // Only return overrides for devices visible to this user.
                'overrides' => (object) $this->overrides($deviceIds),
            ],
        ];
    }

    /** Every device the user may view, failing explicitly above the configured limit. */
    public function devices(User $user): Collection
    {
        $maxDevices = max(1, (int) config('libremap.max_devices', 2000));
        $devices = Device::hasAccess($user)->select(self::DEVICE_COLUMNS)
            ->orderBy('device_id')->limit($maxDevices + 1)->get();
        abort_if($devices->count() > $maxDevices, 422, 'LibreMap device limit exceeded. Increase libremap.max_devices before loading this network.');

        return $devices;
    }

    /** One device as the client shows it. Never serialize the model itself. */
    public function device(Device $device): array
    {
        return [
            'id' => (string) $device->device_id,
            'hostname' => (string) $device->hostname,
            // Classification falls back to sysName for devices added by IP address.
            'sysName' => is_string($device->sysName) && $device->sysName !== '' ? $device->sysName : null,
            'displayName' => $this->displayName($device),
            'status' => $device->disabled ? 'disabled' : ($device->status === null ? 'unknown' : ($device->status ? 'up' : 'down')),
            'url' => url('device/device='.(int) $device->device_id.'/'),
        ];
    }

    /** One interface's live state, measured at that interface. */
    public function port(Port $port): array
    {
        return [
            'id' => (string) $port->port_id,
            'deviceId' => (string) $port->device_id,
            'name' => $this->portName($port),
            'speedBps' => $this->number($port->ifSpeed, positive: true),
            'inBps' => $this->rate($port->ifInOctets_rate),
            'outBps' => $this->rate($port->ifOutOctets_rate),
            'sampledAt' => $this->number($port->poll_time, positive: true),
            'status' => $this->linkStatus($port, $port),
        ];
    }

    private function portName(Port $port): string
    {
        return (string) ($port->ifName ?: $port->ifDescr ?: $port->port_id);
    }

    /** The port name a neighbor reported for itself, when LibreNMS could not match it. */
    private function reportedPort(mixed $name): string
    {
        $name = is_string($name) ? trim(preg_replace('/[\x00-\x1F\x7F]+/', ' ', $name)) : '';

        return $name !== '' ? mb_substr($name, 0, 128) : 'unknown port';
    }

    /** Return only groups the user may view, with only already-visible members. */
    private function deviceGroups(User $user, array $deviceIds): array
    {
        if ($deviceIds === []) {
            return [];
        }

        return DeviceGroup::hasAccess($user)
            ->whereHas('devices', fn ($query) => $query->whereIntegerInRaw('devices.device_id', $deviceIds))
            ->with(['devices' => fn ($query) => $query
                ->whereIntegerInRaw('devices.device_id', $deviceIds)
                ->select('devices.device_id')
                ->orderBy('devices.device_id')])
            ->orderBy('name')->orderBy('id')->get(['id', 'name'])
            ->map(fn (DeviceGroup $group) => [
                'id' => (string) $group->id,
                'name' => (string) $group->name,
                'deviceIds' => $group->devices->pluck('device_id')->map(fn ($id) => (string) $id)->values()->all(),
            ])->values()->all();
    }

    /** The LibreNMS display name, except that a known sysName beats a bare IP address. */
    private function displayName(Device $device): string
    {
        $name = trim((string) $device->displayName());
        $sysName = is_string($device->sysName) ? trim($device->sysName) : '';
        if ($sysName !== '' && ($name === '' || filter_var($name, FILTER_VALIDATE_IP) !== false)) {
            return $sysName;
        }

        return $name !== '' ? $name : (string) $device->hostname;
    }

    /** Config is admin-edited PHP; send the client only well-typed values. */
    private function prefixes(): array
    {
        return array_values(array_filter(
            (array) config('libremap.prefixes', []),
            fn ($prefix) => is_string($prefix) && $prefix !== '',
        ));
    }

    private function overrides(array $deviceIds): array
    {
        $result = [];
        foreach (array_intersect_key((array) config('libremap.overrides', []), array_flip($deviceIds)) as $id => $override) {
            if (! is_array($override)) {
                continue;
            }
            $result[$id] = array_filter([
                'role' => is_string($override['role'] ?? null) ? $override['role'] : null,
                'site' => is_string($override['site'] ?? null) ? $override['site'] : null,
            ], fn ($value) => $value !== null);
        }

        return $result;
    }

    private function number(mixed $value, bool $positive = false): ?float
    {
        if (! is_numeric($value)) {
            return null;
        }
        $number = (float) $value;

        return is_finite($number) && ($positive ? $number > 0 : $number >= 0) ? $number : null;
    }

    /** LibreNMS stores octet rates as unsigned 64-bit, so high-capacity links are real readings. */
    private function rate(mixed $octets): ?float
    {
        $rate = $this->number($octets);

        return $rate === null ? null : $rate * 8;
    }

    private function linkStatus(Port $source, Port $target): string
    {
        // An administratively shut port is intentional, not a fault.
        foreach ([$source, $target] as $port) {
            if ($this->portStatus($port->ifAdminStatus) === 'down') {
                return 'disabled';
            }
        }
        foreach ([$source, $target] as $port) {
            if ($this->portStatus($port->ifOperStatus) === 'down') {
                return 'down';
            }
        }
        if ($source->disabled || $target->disabled) {
            return 'unknown';
        }

        return $this->portStatus($source->ifOperStatus) === 'up' && $this->portStatus($target->ifOperStatus) === 'up' ? 'up' : 'unknown';
    }

    private function portStatus(mixed $status): ?string
    {
        // Current LibreNMS casts these attributes to backed enums; older hosts
        // return strings. Keep the topology contract independent of that cast.
        $value = $status instanceof \BackedEnum ? $status->value : $status;

        return is_string($value) ? $value : null;
    }
}
