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
    /** @var array<string, true> Tables already confirmed present during this request. */
    private array $tables = [];

    public function index(Request $request, ViewState $states): JsonResponse
    {
        $rows = $this->owned($request)->orderByDesc('updated_at')->orderBy('id')->get();

        $visible = $states->forUserMany($rows->map(fn ($row) => $this->decode($row))->all(), $request->user());

        return $this->json(['views' => $rows->map(fn ($row, $index) => $this->serialize($row, $visible[$index]))->all()]);
    }

    public function store(Request $request, ViewState $states): JsonResponse
    {
        $this->requireTable('libremap_views');
        $this->requireTable('libremap_view_owners');
        $data = $states->validate($request->all(), $request->user());
        $row = DB::transaction(function () use ($request, $data) {
            // A persistent plugin-owned row serializes even an owner's first
            // creates. Do not delete this row when the last view is removed.
            $owner = $request->user()->getKey();
            DB::table('libremap_view_owners')->insertOrIgnore(['user_id' => $owner]);
            DB::table('libremap_view_owners')->where('user_id', $owner)->lockForUpdate()->first();
            // Use a current locking read: a REPEATABLE READ snapshot established
            // before waiting for the owner lock must not hide a committed view.
            abort_if($this->owned($request)->select('id')->lockForUpdate()->get()->count() >= 50, 422, 'You can save up to 50 views.');
            $id = (string) Str::uuid();
            DB::table('libremap_views')->insert([
                'id' => $id, 'user_id' => $request->user()->getKey(), 'name' => $data['name'],
                'revision' => 1, 'state' => json_encode($data['state'], JSON_THROW_ON_ERROR),
                'created_at' => now(), 'updated_at' => now(),
            ]);

            return $this->owned($request)->where('id', $id)->first();
        }, 3);

        return $this->json(['view' => $this->serialize($row, $states->forUser($this->decode($row), $request->user()))], 201);
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

        return $this->json(['view' => $this->serialize($row, $states->forUser($this->decode($row), $request->user()))]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        abort_unless($this->owned($request)->where('id', $id)->exists(), 404);
        // The client sends the revision in the query string because some proxies
        // drop DELETE bodies; a JSON body is still accepted.
        $revision = $request->validate(['revision' => ['required', 'integer', 'min:1', 'max:4294967295']])['revision'];
        $deleted = $this->owned($request)->where('id', $id)->where('revision', $revision)->delete();
        abort_unless($deleted, 409, 'This view changed in another session. Reload before deleting.');

        return $this->json([], 204);
    }

    private function owned(Request $request)
    {
        $this->requireTable('libremap_views');

        return DB::table('libremap_views')->where('user_id', $request->user()->getKey());
    }

    /** One schema lookup per table per request, instead of one per query. */
    private function requireTable(string $table): void
    {
        if (! isset($this->tables[$table])) {
            abort_unless(Schema::hasTable($table), 503, 'Saved views are unavailable. An administrator must run the LibreMap database migration.');
            $this->tables[$table] = true;
        }
    }

    private function decode(object $row): array
    {
        $state = json_decode((string) $row->state, true);

        return is_array($state) ? $state : [];
    }

    private function serialize(object $row, array $state): array
    {
        return [
            'id' => $row->id, 'name' => $row->name, 'revision' => (int) $row->revision,
            'state' => $state,
            'updatedAt' => \Illuminate\Support\Carbon::parse($row->updated_at)->toIso8601String(),
        ];
    }

    private function json(array $body, int $status = 200): JsonResponse
    {
        return response()->json($body, $status)->header('Cache-Control', 'private, no-store');
    }
}
