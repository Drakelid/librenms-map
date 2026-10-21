<?php

namespace LibreMap\Topology;

use App\Models\Device;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/** Coordinates of the LibreNMS locations assigned to the devices a user may view. */
class DeviceLocations
{
    public function forUser(User $user): array
    {
        $maxDevices = max(1, (int) config('libremap.max_devices', 2000));
        // Two plain queries rather than a join: the host's hasAccess scope may
        // join permission tables, where unqualified columns become ambiguous.
        $devices = Device::hasAccess($user)->whereNotNull('location_id')
            ->orderBy('device_id')->limit($maxDevices + 1)
            ->toBase()->get(['device_id', 'location_id']);
        abort_if($devices->count() > $maxDevices, 422, 'LibreMap device limit exceeded. Increase libremap.max_devices before loading this network.');

        $locationIds = $devices->pluck('location_id')->map(fn ($id) => (int) $id)->unique()->values()->all();
        $locations = [];
        if ($locationIds !== []) {
            foreach (DB::table('locations')->whereIntegerInRaw('id', $locationIds)->get(['id', 'location', 'lat', 'lng']) as $row) {
                $lat = $this->coordinate($row->lat, 90);
                $lng = $this->coordinate($row->lng, 180);
                // As LibreNMS's coordinatesValid(): a zero latitude or longitude means "not set".
                if ($lat === null || $lng === null || $lat == 0.0 || $lng == 0.0) {
                    continue;
                }
                $locations[(string) $row->id] = ['id' => (string) $row->id, 'name' => (string) $row->location, 'lat' => $lat, 'lng' => $lng];
            }
        }

        $placed = [];
        foreach ($devices as $device) {
            if (isset($locations[(string) $device->location_id])) {
                $placed[(string) $device->device_id] = (string) $device->location_id;
            }
        }

        return [
            'locations' => array_values($locations),
            // Device ID => location ID, only for devices this user may view.
            'devices' => (object) $placed,
            'map' => $this->mapConfig(),
        ];
    }

    private function coordinate(mixed $value, float $limit): ?float
    {
        if (! is_numeric($value)) {
            return null;
        }
        $number = (float) $value;

        return is_finite($number) && abs($number) <= $limit ? $number : null;
    }

    /**
     * Tiles follow LibreNMS's own world map (leaflet.tile_url) unless
     * libremap.world_tiles overrides them; an empty string disables tiles.
     */
    private function mapConfig(): array
    {
        $template = config('libremap.world_tiles');
        if ($template === null) {
            $host = $this->librenmsConfig('leaflet.tile_url', '{s}.tile.openstreetmap.org');
            $template = is_string($host) && trim($host) !== ''
                ? 'https://'.preg_replace('#^(https?:)?//#i', '', rtrim(trim($host), '/')).'/{z}/{x}/{y}.png'
                : '';
        }
        $valid = is_string($template) && preg_match('#^https?://[^\s"\'<>]+$#i', $template) === 1
            && str_contains($template, '{z}') && str_contains($template, '{x}') && str_contains($template, '{y}');
        $attribution = config('libremap.world_attribution', '© OpenStreetMap contributors');

        return [
            'tiles' => $valid ? $template : null,
            'attribution' => $valid && is_string($attribution) ? mb_substr($attribution, 0, 200) : '',
            'maxZoom' => max(1, min(19, (int) config('libremap.world_max_zoom', 18))),
            'center' => [
                'lat' => $this->coordinate($this->librenmsConfig('leaflet.default_lat', 0), 90) ?? 0.0,
                'lng' => $this->coordinate($this->librenmsConfig('leaflet.default_lng', 0), 180) ?? 0.0,
                'zoom' => max(1, min(18, (int) $this->librenmsConfig('leaflet.default_zoom', 2))),
            ],
        ];
    }

    /** LibreNMS renamed its configuration facade; read whichever this host has. */
    private function librenmsConfig(string $key, mixed $default): mixed
    {
        foreach (['App\Facades\LibrenmsConfig', 'LibreNMS\Config'] as $class) {
            if (class_exists($class)) {
                try {
                    return $class::get($key, $default);
                } catch (\Throwable) {
                    // Try the next facade.
                }
            }
        }

        return $default;
    }
}
