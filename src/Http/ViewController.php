<?php

namespace LibreMap\Http;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use LibreMap\Views\ViewState;

class ViewController extends Controller
{
    public function index(Request $request, ViewState $states): JsonResponse
    {
        $rows = $this->owned($request)->orderByDesc('updated_at')->orderBy('id')->get();

        return $this->json(['views' => $rows->map(fn ($row) => $this->serialize($row, $request, $states))->all()]);
    }

    public function store(Request $request, ViewState $states): JsonResponse
    {
        $this->owned($request);
        $data = $states->validate($request->all(), $request->user());
        $row = DB::transaction(function () use ($request, $data) {
            // Lock this owner's own rows so concurrent creates cannot exceed the
            // cap. Scoped to the plugin's table to avoid contending with the
            // host application over a LibreNMS-owned record.
            abort_if($this->owned($request)->lockForUpdate()->count() >= 50, 422, 'You can save up to 50 views.');
            $id = (string) Str::uuid();
            DB::table('libremap_views')->insert([
                'id' => $id, 'user_id' => $request->user()->getKey(), 'name' => $data['name'],
                'revision' => 1, 'state' => json_encode($data['state'], JSON_THROW_ON_ERROR),
                'created_at' => now(), 'updated_at' => now(),
            ]);

            return $this->owned($request)->where('id', $id)->first();
        });

        return $this->json(['view' => $this->serialize($row, $request, $states)], 201);
    }

    public function update(Request $request, string $id, ViewState $states): JsonResponse
    {
        abort_unless($this->owned($request)->where('id', $id)->exists(), 404);
        $revision = $request->validate(['revision' => ['required', 'integer', 'min:1', 'max:4294967294']])['revision'];
        $data = $states->validate($request->all(), $request->user());
        $row = DB::transaction(function () use ($request, $id, $revision, $data) {
            $changed = $this->owned($request)->where('id', $id)->where('revision', $revision)->update([
                'name' => $data['name'], 'state' => json_encode($data['state'], JSON_THROW_ON_ERROR),
                'revision' => $revision + 1, 'updated_at' => now(),
            ]);
            abort_unless($changed, 409, 'This view changed in another session. Reload before saving.');

            return $this->owned($request)->where('id', $id)->first();
        });

        return $this->json(['view' => $this->serialize($row, $request, $states)]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        abort_unless($this->owned($request)->where('id', $id)->exists(), 404);
        $revision = $request->validate(['revision' => ['required', 'integer', 'min:1', 'max:4294967295']])['revision'];
        $deleted = $this->owned($request)->where('id', $id)->where('revision', $revision)->delete();
        abort_unless($deleted, 409, 'This view changed in another session. Reload before deleting.');

        return $this->json([], 204);
    }

    private function owned(Request $request)
    {
        abort_unless(Schema::hasTable('libremap_views'), 503, 'Saved views are unavailable. An administrator must run the LibreMap database migration.');

        return DB::table('libremap_views')->where('user_id', $request->user()->getKey());
    }

    private function serialize(object $row, Request $request, ViewState $states): array
    {
        // Degrade an unreadable row to an empty view rather than failing the
        // whole listing; ViewState::forUser fills any missing keys.
        $state = json_decode((string) $row->state, true);

        return [
            'id' => $row->id, 'name' => $row->name, 'revision' => (int) $row->revision,
            'state' => $states->forUser(is_array($state) ? $state : [], $request->user()),
            'updatedAt' => \Illuminate\Support\Carbon::parse($row->updated_at)->toIso8601String(),
        ];
    }

    private function json(array $body, int $status = 200): JsonResponse
    {
        return response()->json($body, $status)->header('Cache-Control', 'private, no-store');
    }
}
