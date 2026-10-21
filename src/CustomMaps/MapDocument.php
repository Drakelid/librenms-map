<?php

namespace LibreMap\CustomMaps;

use App\Models\Device;
use App\Models\Port;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use LibreMap\Topology\LibreNmsTopology;

/**
 * A hand-drawn map: devices placed by the owner, free text, areas, and drawn
 * lines that may be bound to a real interface for live load. Drawn lines are
 * the owner's annotation; they never join the discovered topology.
 */
class MapDocument
{
    // Match CUSTOM_LIMITS in frontend/custom-map-document.ts.
    public const MAX_DEVICES = 500;
    public const MAX_LINKS = 2000;
    public const MAX_SHAPES = 200;
    private const KEY = '/^[a-z]-[a-z0-9]{1,32}$/';
    private const ID = '/^[1-9][0-9]{0,9}$/';

    public function validate(array $input, User $user): array
    {
        $number = function (string $attribute, mixed $value, $fail): void {
            if ((! is_int($value) && ! is_float($value)) || ! is_finite((float) $value) || abs($value) > 1000000) {
                $fail('Coordinates must be finite numbers between -1000000 and 1000000.');
            }
        };
        $size = function (string $attribute, mixed $value, $fail): void {
            if ((! is_int($value) && ! is_float($value)) || $value < 20 || $value > 5000) {
                $fail('Text and area sizes must be between 20 and 5000.');
            }
        };
        $key = ['required', 'string', 'regex:'.self::KEY];
        $data = Validator::make($input, [
            'name' => ['required', 'string', 'max:100'],
            'shared' => ['required', 'boolean'],
            'document' => ['required', 'array:devices,shapes,links,zoom,pan'],
            'document.devices' => ['present', 'array', 'max:'.self::MAX_DEVICES],
            'document.devices.*' => ['required', 'array:key,deviceId,x,y'],
            'document.devices.*.key' => $key,
            'document.devices.*.deviceId' => ['required', 'string', 'regex:'.self::ID],
            'document.devices.*.x' => ['required', $number],
            'document.devices.*.y' => ['required', $number],
            'document.shapes' => ['present', 'array', 'max:'.self::MAX_SHAPES],
            'document.shapes.*' => ['required', 'array:key,kind,x,y,width,height,text'],
            'document.shapes.*.key' => $key,
            'document.shapes.*.kind' => ['required', 'in:text,box'],
            'document.shapes.*.x' => ['required', $number],
            'document.shapes.*.y' => ['required', $number],
            'document.shapes.*.width' => ['required', $size],
            'document.shapes.*.height' => ['required', $size],
            'document.shapes.*.text' => ['present', 'nullable', 'string', 'max:200'],
            'document.links' => ['present', 'array', 'max:'.self::MAX_LINKS],
            'document.links.*' => ['required', 'array:key,source,target,label,portId'],
            'document.links.*.key' => $key,
            'document.links.*.source' => $key,
            'document.links.*.target' => $key,
            'document.links.*.label' => ['present', 'nullable', 'string', 'max:100'],
            'document.links.*.portId' => ['present', 'nullable', 'string', 'regex:'.self::ID],
            'document.zoom' => ['required', 'numeric', 'min:0.15', 'max:2.5', $number],
            'document.pan' => ['required', 'array:x,y'],
            'document.pan.x' => ['required', $number],
            'document.pan.y' => ['required', $number],
        ])->validate();

        $name = trim($data['name']);
        if ($name === '') {
            $this->fail('name', 'A map name is required.');
        }
        $document = $data['document'];
        foreach (['devices', 'shapes', 'links'] as $list) {
            if (! array_is_list($document[$list])) {
                $this->fail("document.$list", 'Map elements must be a list.');
            }
        }
        $keys = array_merge(...array_map(fn ($list) => array_column($document[$list], 'key'), ['devices', 'shapes', 'links']));
        if (count(array_unique($keys)) !== count($keys)) {
            $this->fail('document', 'Map element keys must be unique.');
        }
        $deviceIds = array_column($document['devices'], 'deviceId');
        if (count(array_unique($deviceIds)) !== count($deviceIds)) {
            $this->fail('document.devices', 'A device can appear only once on a map.');
        }
        $deviceOf = array_column($document['devices'], 'deviceId', 'key');
        foreach ($document['links'] as $link) {
            if ($link['source'] === $link['target'] || ! isset($deviceOf[$link['source']], $deviceOf[$link['target']])) {
                $this->fail('document.links', 'Lines must join two different devices on the map.');
            }
        }
        if (array_diff($deviceIds, array_keys($this->devices($deviceIds, $user)))) {
            $this->fail('document.devices', 'The map contains unavailable devices.');
        }
        $ports = $this->ports(array_column($document['links'], 'portId'), $user);
        foreach ($document['links'] as $link) {
            $port = is_string($link['portId']) ? ($ports[$link['portId']] ?? null) : null;
            if (is_string($link['portId']) && (! $port || ! in_array((string) $port->device_id, [$deviceOf[$link['source']], $deviceOf[$link['target']]], true))) {
                $this->fail('document.links', 'A bound interface must be available and belong to one of the connected devices.');
            }
        }

        // Laravel's ConvertEmptyStringsToNull middleware applies to JSON too.
        $document['shapes'] = array_map(fn ($shape) => ['text' => $shape['text'] ?? ''] + $shape, $document['shapes']);
        $document['links'] = array_map(fn ($link) => ['label' => $link['label'] ?? ''] + $link, $document['links']);

        return ['name' => $name, 'shared' => (bool) $data['shared'], 'document' => $document];
    }

    /**
     * Drop what this reader may not see and resolve live device and interface
     * data. The reader may be the owner or anyone reading a shared map.
     */
    public function present(array $document, User $reader, LibreNmsTopology $topology): array
    {
        $document = $this->defaults($document);
        $devices = $this->devices(array_column($document['devices'], 'deviceId'), $reader);
        $document['devices'] = array_values(array_filter($document['devices'], fn ($device) => isset($devices[$device['deviceId']])));
        $deviceOf = array_column($document['devices'], 'deviceId', 'key');
        $document['links'] = array_values(array_filter($document['links'], fn ($link) => isset($deviceOf[$link['source']], $deviceOf[$link['target']])));
        $ports = $this->ports(array_column($document['links'], 'portId'), $reader);
        $used = [];
        foreach ($document['links'] as &$link) {
            $port = is_string($link['portId']) ? ($ports[$link['portId']] ?? null) : null;
            // An inaccessible or moved interface leaves the drawn line, unbound.
            $link['portId'] = $port && in_array((string) $port->device_id, [$deviceOf[$link['source']], $deviceOf[$link['target']]], true) ? (string) $port->port_id : null;
            if ($link['portId'] !== null) {
                $used[$link['portId']] = $topology->port($port);
            }
        }
        unset($link);

        return [
            'document' => $document,
            'live' => [
                'devices' => (object) array_map(fn (Device $device) => $topology->device($device), $devices),
                'ports' => (object) $used,
            ],
        ];
    }

    /**
     * Reads tolerate a row written by an older version or edited directly in
     * the database: drop malformed elements rather than failing the map.
     */
    private function defaults(array $document): array
    {
        $list = fn ($value) => is_array($value) && array_is_list($value) ? array_values(array_filter($value, 'is_array')) : [];
        $key = fn ($value) => is_string($value) && preg_match(self::KEY, $value) === 1;
        $id = fn ($value) => is_string($value) && preg_match(self::ID, $value) === 1;

        return [
            'devices' => array_values(array_filter($list($document['devices'] ?? null),
                fn ($device) => $key($device['key'] ?? null) && $id($device['deviceId'] ?? null)
                    && is_numeric($device['x'] ?? null) && is_numeric($device['y'] ?? null))),
            'shapes' => array_values(array_filter($list($document['shapes'] ?? null),
                fn ($shape) => $key($shape['key'] ?? null) && in_array($shape['kind'] ?? null, ['text', 'box'], true))),
            'links' => array_values(array_map(fn ($link) => ['portId' => $id($link['portId'] ?? null) ? $link['portId'] : null] + $link,
                array_filter($list($document['links'] ?? null), fn ($link) => $key($link['source'] ?? null) && $key($link['target'] ?? null)))),
            'zoom' => is_numeric($document['zoom'] ?? null) ? (float) $document['zoom'] : 1,
            'pan' => is_array($document['pan'] ?? null) ? $document['pan'] : ['x' => 0, 'y' => 0],
        ];
    }

    /** @return array<string, Device> Accessible devices keyed by device ID. */
    private function devices(array $ids, User $user): array
    {
        $ids = array_values(array_unique(array_filter($ids, fn ($id) => is_string($id) && preg_match(self::ID, $id) === 1)));
        if ($ids === []) {
            return [];
        }

        return Device::hasAccess($user)->whereIntegerInRaw('device_id', $ids)
            ->select(LibreNmsTopology::DEVICE_COLUMNS)->get()
            ->keyBy(fn (Device $device) => (string) $device->device_id)->all();
    }

    /** @return array<string, Port> Accessible, current interfaces keyed by port ID. */
    private function ports(array $ids, User $user): array
    {
        $ids = array_values(array_unique(array_filter($ids, fn ($id) => is_string($id) && preg_match(self::ID, $id) === 1)));
        if ($ids === []) {
            return [];
        }

        return Port::hasAccess($user)->where('deleted', 0)->whereIntegerInRaw('port_id', $ids)
            ->get(LibreNmsTopology::PORT_COLUMNS)
            ->keyBy(fn (Port $port) => (string) $port->port_id)->all();
    }

    private function fail(string $field, string $message): never
    {
        throw ValidationException::withMessages([$field => $message]);
    }
}
