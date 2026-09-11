<?php

namespace LibreMap\Views;

use App\Models\Device;
use App\Models\DeviceGroup;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ViewState
{
    // Matches HOPS_MAX in frontend/view-state.ts.
    private const HOPS_MAX = 5;

    public function validate(array $input, User $user): array
    {
        // Bounds match the client's own limits so the server never stores a
        // coordinate or zoom level that normalizeView() would silently discard.
        $number = function (string $attribute, mixed $value, $fail): void {
            if ((! is_int($value) && ! is_float($value)) || ! is_finite((float) $value) || abs($value) > 1000000) {
                $fail('Coordinates must be finite numbers between -1000000 and 1000000.');
            }
        };
        $data = Validator::make($input, [
            'name' => ['required', 'string', 'max:100'],
            'state' => ['required', 'array:rootId,deviceGroupId,site,search,backbone,showOther,hops,positions,pinned,zoom,pan'],
            'state.rootId' => ['present', 'nullable', 'string', 'regex:/^[1-9][0-9]{0,9}$/'],
            'state.deviceGroupId' => ['sometimes', 'nullable', 'string', 'regex:/^[1-9][0-9]{0,9}$/'],
            'state.site' => ['present', 'nullable', 'string', 'max:200'],
            'state.search' => ['present', 'nullable', 'string', 'max:200'],
            'state.backbone' => ['required', function ($attribute, $value, $fail): void {
                if (! is_bool($value)) { $fail('Backbone must be a boolean.'); }
            }],
            'state.showOther' => ['sometimes', function ($attribute, $value, $fail): void {
                if (! is_bool($value)) { $fail('Show other devices must be a boolean.'); }
            }],
            'state.hops' => ['sometimes', function ($attribute, $value, $fail): void {
                if (! is_int($value) || $value < 1 || $value > self::HOPS_MAX) { $fail('Highlight hops must be a whole number from 1 to '.self::HOPS_MAX.'.'); }
            }],
            'state.positions' => ['present', 'array', 'max:'.self::positionLimit()],
            'state.positions.*' => ['required', 'array:x,y'],
            'state.positions.*.x' => ['required', $number],
            'state.positions.*.y' => ['required', $number],
            'state.pinned' => ['present', 'array', 'max:'.self::positionLimit()],
            'state.pinned.*' => ['required', 'string', 'regex:/^[1-9][0-9]{0,9}$/', 'distinct'],
            'state.zoom' => ['required', 'numeric', 'min:0.15', 'max:2.5', $number],
            'state.pan' => ['required', 'array:x,y'],
            'state.pan.x' => ['required', $number],
            'state.pan.y' => ['required', $number],
        ])->validate();

        foreach (array_keys($data['state']['positions']) as $id) {
            if (! preg_match('/^[1-9][0-9]{0,9}$/', (string) $id)) {
                throw ValidationException::withMessages(['state.positions' => 'Position keys must be device IDs.']);
            }
        }
        if (! array_is_list($data['state']['pinned'])) {
            throw ValidationException::withMessages(['state.pinned' => 'Pinned devices must be a list.']);
        }
        $data['name'] = trim($data['name']);
        if ($data['name'] === '') {
            throw ValidationException::withMessages(['name' => 'A view name is required.']);
        }
        // Laravel's ConvertEmptyStringsToNull middleware applies to JSON too.
        $data['state']['site'] ??= '';
        $data['state']['search'] ??= '';
        $data['state']['showOther'] ??= false;
        $data['state']['hops'] ??= 1;
        $data['state']['deviceGroupId'] ??= null;
        $ids = $this->ids($data['state']);
        if (array_diff($ids, $this->accessible($ids, $user))) {
            throw ValidationException::withMessages(['state' => 'The view contains unavailable devices.']);
        }
        $groupId = $data['state']['deviceGroupId'];
        if (is_string($groupId) && $this->accessibleGroups([$groupId], $user) === []) {
            throw ValidationException::withMessages(['state.deviceGroupId' => 'The selected device group is unavailable.']);
        }

        return $data;
    }

    /** A view must hold a position for every device the map can load. */
    public static function positionLimit(): int
    {
        return max(2000, (int) config('libremap.max_devices', 2000));
    }

    public function forUser(array $state, User $user): array
    {
        return $this->forUserMany([$state], $user)[0];
    }

    /** Resolve the union once so listing many views costs one authorization query. */
    public function forUserMany(array $states, User $user): array
    {
        $states = array_map(fn ($state) => $this->defaults($state), $states);
        $ids = [];
        foreach ($states as $state) {
            $ids = array_merge($ids, $this->ids($state));
        }
        $allowed = array_fill_keys($this->accessible(array_values(array_unique($ids)), $user), true);
        $groupIds = array_values(array_unique(array_filter(array_column($states, 'deviceGroupId'), 'is_string')));
        $allowedGroups = array_fill_keys($this->accessibleGroups($groupIds, $user), true);

        return array_map(fn ($state) => $this->redact($state, $allowed, $allowedGroups), $states);
    }

    private function redact(array $state, array $allowed, array $allowedGroups): array
    {
        $state['rootId'] = is_string($state['rootId']) && isset($allowed[$state['rootId']]) ? $state['rootId'] : null;
        $state['deviceGroupId'] = is_string($state['deviceGroupId']) && isset($allowedGroups[$state['deviceGroupId']]) ? $state['deviceGroupId'] : null;
        $state['positions'] = (object) array_intersect_key($state['positions'], $allowed);
        $state['pinned'] = array_values(array_filter($state['pinned'], fn ($id) => is_string($id) && isset($allowed[$id])));

        return $state;
    }

    /**
     * Reads must tolerate a row written by an older version or edited directly
     * in the database: one malformed view should not fail the whole listing.
     */
    private function defaults(array $state): array
    {
        $defaults = [
            'rootId' => null, 'deviceGroupId' => null, 'site' => '', 'search' => '', 'backbone' => false, 'showOther' => false, 'hops' => 1,
            'positions' => [], 'pinned' => [], 'zoom' => 1, 'pan' => ['x' => 0, 'y' => 0],
        ];
        // Return only the bounded schema; a row edited directly in the database
        // may carry keys that writes would have rejected.
        $state = array_intersect_key($state, $defaults) + $defaults;
        if (! is_array($state['positions'])) {
            $state['positions'] = [];
        }
        if (! is_array($state['pinned'])) {
            $state['pinned'] = [];
        }

        return $state;
    }

    private function ids(array $state): array
    {
        $values = array_merge(
            array_keys($state['positions']),
            array_values($state['pinned']),
            is_string($state['rootId']) ? [$state['rootId']] : [],
        );

        return array_values(array_unique(array_map('strval',
            array_filter($values, fn ($value) => is_string($value) || is_int($value))
        )));
    }

    private function accessible(array $ids, User $user): array
    {
        // A list can reference more IDs than MySQL's prepared-statement binding
        // limit. Only bounded numeric device IDs may enter the integer IN list.
        $ids = array_values(array_filter($ids, fn ($id) => preg_match('/^[1-9][0-9]{0,9}$/', (string) $id)));

        return $ids === [] ? [] : Device::hasAccess($user)->whereIntegerInRaw('device_id', $ids)
            ->pluck('device_id')->map(fn ($id) => (string) $id)->all();
    }

    private function accessibleGroups(array $ids, User $user): array
    {
        $ids = array_values(array_filter($ids, fn ($id) => preg_match('/^[1-9][0-9]{0,9}$/', (string) $id)));

        return $ids === [] ? [] : DeviceGroup::hasAccess($user)->whereIntegerInRaw('id', $ids)
            ->pluck('id')->map(fn ($id) => (string) $id)->all();
    }
}
