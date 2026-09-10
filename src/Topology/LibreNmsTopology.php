<?php

namespace LibreMap\Topology;

use App\Models\Device;
use App\Models\Link;
use App\Models\Port;
use App\Models\User;

class LibreNmsTopology
{
    // LibreNMS stores port octet rates in a signed 32-bit column. A value at its
    // ceiling (about 17 Gbit/s) was clamped by the database, not measured.
    private const RATE_COLUMN_MAX = 2147483647;

    public function forUser(User $user): array
    {
        $maxDevices = max(1, (int) config('libremap.max_devices', 2000));
        $maxLinks = max(1, (int) config('libremap.max_links', 10000));
        $devices = Device::hasAccess($user)
            ->select(['device_id', 'hostname', 'sysName', 'status', 'disabled'])
            ->orderBy('device_id')->limit($maxDevices + 1)->get();
        abort_if($devices->count() > $maxDevices, 422, 'LibreMap device limit exceeded. Increase libremap.max_devices before loading this network.');
        $deviceIds = $devices->pluck('device_id')->all();

        // Require both known endpoints AND both authorized ports. Do not expose
        // unresolved neighbor hostnames or infer links from device names.
        $links = Link::hasAccess($user)
            ->where('active', 1)
            ->whereIntegerInRaw('local_device_id', $deviceIds)
            ->whereIntegerInRaw('remote_device_id', $deviceIds)
            ->whereHas('port', fn ($query) => $query->hasAccess($user)->where('deleted', 0))
            ->whereHas('remotePort', fn ($query) => $query->hasAccess($user)->where('deleted', 0))
            ->select(['id', 'local_device_id', 'remote_device_id', 'local_port_id', 'remote_port_id'])
            ->orderBy('id')->limit($maxLinks + 1)->get();
        abort_if($links->count() > $maxLinks, 422, 'LibreMap link limit exceeded. Increase libremap.max_links before loading this network.');

        $portIds = $links->pluck('local_port_id')->merge($links->pluck('remote_port_id'))->unique()->all();
        $ports = Port::hasAccess($user)->where('deleted', 0)
            ->whereIntegerInRaw('port_id', $portIds)
            ->get(['port_id', 'device_id', 'ifName', 'ifDescr', 'ifSpeed', 'ifOperStatus', 'ifAdminStatus', 'disabled', 'ifInOctets_rate', 'ifOutOctets_rate', 'poll_time'])
            ->keyBy('port_id');

        $resultLinks = [];
        foreach ($links as $link) {
            $source = $ports->get($link->local_port_id);
            $target = $ports->get($link->remote_port_id);
            if (! $source || ! $target
                || (int) $source->device_id !== (int) $link->local_device_id
                || (int) $target->device_id !== (int) $link->remote_device_id) {
                continue;
            }

            $resultLinks[] = [
                'id' => (string) $link->id,
                'source' => (string) $link->local_device_id,
                'target' => (string) $link->remote_device_id,
                'sourcePort' => (string) ($source->ifName ?: $source->ifDescr ?: $source->port_id),
                'targetPort' => (string) ($target->ifName ?: $target->ifDescr ?: $target->port_id),
                'sourcePortId' => (string) $source->port_id,
                'targetPortId' => (string) $target->port_id,
                'speedBps' => $this->number($source->ifSpeed, positive: true),
                'inBps' => $this->rate($source->ifInOctets_rate),
                'outBps' => $this->rate($source->ifOutOctets_rate),
                'sampledAt' => $this->number($source->poll_time, positive: true),
                'status' => $this->linkStatus($source, $target),
            ];
        }

        return [
            'devices' => $devices->map(fn (Device $device) => [
                'id' => (string) $device->device_id,
                'hostname' => (string) $device->hostname,
                // Classification falls back to sysName for devices added by IP address.
                'sysName' => is_string($device->sysName) && $device->sysName !== '' ? $device->sysName : null,
                'status' => $device->disabled ? 'disabled' : ($device->status === null ? 'unknown' : ($device->status ? 'up' : 'down')),
                'url' => url('device/device='.(int) $device->device_id.'/'),
            ])->values()->all(),
            'links' => $resultLinks,
            'generatedAt' => time(),
            'config' => [
                'prefixes' => $this->prefixes(),
                'staleAfter' => max(1, (int) config('libremap.stale_after', 900)),
                // Only return overrides for devices visible to this user.
                'overrides' => (object) $this->overrides($deviceIds),
            ],
        ];
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

    private function rate(mixed $octets): ?float
    {
        $rate = $this->number($octets);

        return $rate === null || $rate >= self::RATE_COLUMN_MAX ? null : $rate * 8;
    }

    private function linkStatus(Port $source, Port $target): string
    {
        foreach ([$source, $target] as $port) {
            if ($this->portStatus($port->ifOperStatus) === 'down' || $this->portStatus($port->ifAdminStatus) === 'down') {
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
