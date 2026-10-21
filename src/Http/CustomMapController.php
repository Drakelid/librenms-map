<?php

namespace LibreMap\Http;

use App\Models\Device;
use App\Models\Port;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use LibreMap\CustomMaps\MapDocument;
use LibreMap\Topology\LibreNmsTopology;

/** Hand-drawn maps: private to their owner unless shared read-only with every signed-in user. */
class CustomMapController extends Controller
{
    private const PER_OWNER = 50;
    private const TABLE = 'libremap_custom_maps';
    // A device's interface list for binding a line; far above a real chassis.
    private const MAX_PORTS = 2000;

    /** @var array<string, true> Tables already confirmed present during this request. */
    private array $tables = [];

    public function index(Request $request): JsonResponse
    {
        $rows = $this->readable($request)->orderBy('name')->orderBy('id')->limit(1000)
            ->get(['id', 'user_id', 'name', 'shared', 'revision', 'updated_at']);
        $owners = $this->ownerNames($rows->pluck('user_id')->all());

        return $this->json(['maps' => $rows->map(fn ($row) => $this->summary($row, $request->user(), $owners))->all()]);
    }

    public function show(Request $request, string $id, MapDocument $documents, LibreNmsTopology $topology): JsonResponse
    {
        $row = $this->readable($request)->where('id', $id)->first();
        abort_unless($row, 404);

        return $this->json($this->full($row, $request->user(), $documents, $topology));
    }

    public function store(Request $request, MapDocument $documents, LibreNmsTopology $topology): JsonResponse
    {
        $this->requireTable(self::TABLE);
        $this->requireTable('libremap_view_owners');
        $data = $documents->validate($request->all(), $request->user());
        $row = DB::transaction(function () use ($request, $data) {
            // The plugin's persistent owner row serializes an owner's creates (see ViewController).
            $owner = $request->user()->getKey();
            DB::table('libremap_view_owners')->insertOrIgnore(['user_id' => $owner]);
            DB::table('libremap_view_owners')->where('user_id', $owner)->lockForUpdate()->first();
            abort_if($this->owned($request)->select('id')->lockForUpdate()->get()->count() >= self::PER_OWNER, 422, 'You can create up to '.self::PER_OWNER.' custom maps.');
            $id = (string) Str::uuid();
            DB::table(self::TABLE)->insert([
                'id' => $id, 'user_id' => $owner, 'name' => $data['name'], 'shared' => $data['shared'],
                'revision' => 1, 'document' => json_encode($data['document'], JSON_THROW_ON_ERROR),
                'created_at' => now(), 'updated_at' => now(),
            ]);

            return $this->owned($request)->where('id', $id)->first();
        }, 3);

        return $this->json($this->full($row, $request->user(), $documents, $topology), 201);
    }

    public function update(Request $request, string $id, MapDocument $documents, LibreNmsTopology $topology): JsonResponse
    {
        // A shared map is still read-only to everyone but its owner.
        abort_unless($this->owned($request)->where('id', $id)->exists(), 404);
        $revision = $request->validate(['revision' => ['required', 'integer', 'min:1', 'max:4294967294']])['revision'];
        $data = $documents->validate($request->all(), $request->user());
        $row = DB::transaction(function () use ($request, $id, $revision, $data) {
            $changed = $this->owned($request)->where('id', $id)->where('revision', $revision)->update([
                'name' => $data['name'], 'shared' => $data['shared'],
                'document' => json_encode($data['document'], JSON_THROW_ON_ERROR),
                'revision' => $revision + 1, 'updated_at' => now(),
            ]);
            abort_unless($changed, 409, 'This map changed in another session. Reload it before saving.');

            return $this->owned($request)->where('id', $id)->first();
        });

        return $this->json($this->full($row, $request->user(), $documents, $topology));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        abort_unless($this->owned($request)->where('id', $id)->exists(), 404);
        // Sent in the query string because some proxies drop DELETE bodies.
        $revision = $request->validate(['revision' => ['required', 'integer', 'min:1', 'max:4294967295']])['revision'];
        $deleted = $this->owned($request)->where('id', $id)->where('revision', $revision)->delete();
        abort_unless($deleted, 409, 'This map changed in another session. Reload it before deleting.');

        return $this->json([], 204);
    }

    /** The devices an editor may place: everything the user can view. */
    public function devices(Request $request, LibreNmsTopology $topology): JsonResponse
    {
        return $this->json(['devices' => $topology->devices($request->user())
            ->map(fn (Device $device) => $topology->device($device))->values()->all()]);
    }

    /** The interfaces of one device that a drawn line may be bound to. */
    public function ports(Request $request, string $id, LibreNmsTopology $topology): JsonResponse
    {
        $user = $request->user();
        abort_unless(Device::hasAccess($user)->where('device_id', $id)->exists(), 404);
        $ports = Port::hasAccess($user)->where('device_id', $id)->where('deleted', 0)
            ->orderBy('ifIndex')->orderBy('port_id')->limit(self::MAX_PORTS)
            ->get(LibreNmsTopology::PORT_COLUMNS);

        return $this->json(['ports' => $ports->map(fn (Port $port) => $topology->port($port))->values()->all()]);
    }

    private function full(object $row, User $user, MapDocument $documents, LibreNmsTopology $topology): array
    {
        $document = json_decode((string) $row->document, true);
        $presented = $documents->present(is_array($document) ? $document : [], $user, $topology);

        return [
            'map' => $this->summary($row, $user, $this->ownerNames([$row->user_id])) + ['document' => $presented['document']],
            'live' => $presented['live'],
            'generatedAt' => time(),
            'config' => ['staleAfter' => max(1, (int) config('libremap.stale_after', 900))],
        ];
    }

    private function summary(object $row, User $user, array $owners): array
    {
        $owned = (string) $row->user_id === (string) $user->getKey();

        return [
            'id' => $row->id, 'name' => $row->name, 'shared' => (bool) $row->shared, 'owned' => $owned,
            'ownerName' => $owned ? null : ($owners[(string) $row->user_id] ?? 'Another user'),
            'revision' => (int) $row->revision,
            'updatedAt' => Carbon::parse($row->updated_at)->toIso8601String(),
        ];
    }

    /** @return array<string, string> Usernames of map owners, keyed by user ID. */
    private function ownerNames(array $ids): array
    {
        $ids = array_values(array_unique($ids));

        return $ids === [] ? [] : User::query()->whereKey($ids)->get()
            ->mapWithKeys(fn (User $owner) => [(string) $owner->getKey() => (string) $owner->username])->all();
    }

    private function owned(Request $request)
    {
        $this->requireTable(self::TABLE);

        return DB::table(self::TABLE)->where('user_id', $request->user()->getKey());
    }

    private function readable(Request $request)
    {
        $this->requireTable(self::TABLE);

        return DB::table(self::TABLE)->where(fn ($query) => $query
            ->where('user_id', $request->user()->getKey())->orWhere('shared', true));
    }

    /** One schema lookup per table per request, instead of one per query. */
    private function requireTable(string $table): void
    {
        if (! isset($this->tables[$table])) {
            abort_unless(Schema::hasTable($table), 503, 'Custom maps are unavailable. An administrator must run the LibreMap database migration.');
            $this->tables[$table] = true;
        }
    }

    private function json(array $body, int $status = 200): JsonResponse
    {
        return response()->json($body, $status)->header('Cache-Control', 'private, no-store');
    }
}
