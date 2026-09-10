<?php

namespace LibreMap\Tests\Host;

use App\Models\Device;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use LibreMap\Views\ViewState;
use LibreNMS\Interfaces\Plugins\PluginManagerInterface;
use LibreNMS\Tests\TestCase;
use Mockery;

/** Run with the LibreNMS bootstrap and a disposable TEST database, after migrations. */
class SavedViewsIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        $manager = Mockery::mock(PluginManagerInterface::class);
        $manager->shouldReceive('pluginEnabled')->with('libremap')->andReturn(true);
        $this->app->instance(PluginManagerInterface::class, $manager);
        require __DIR__.'/../../routes/web.php';
    }

    private function payload(?string $id = null): array
    {
        return ['name' => 'Rossa operations', 'state' => [
            'rootId' => $id, 'site' => '', 'search' => '', 'backbone' => false, 'showOther' => false,
            'positions' => $id === null ? (object) [] : (object) [$id => ['x' => 10, 'y' => 20]],
            'pinned' => $id === null ? [] : [$id], 'zoom' => 1, 'pan' => ['x' => 0, 'y' => 0],
        ]];
    }

    /**
     * LibreNMS's UserFactory leaves `enabled` unset on the returned model (the
     * column default applies only in the database), and its web middleware
     * treats that as a disabled account and redirects every request.
     */
    private function user(bool $admin = false): User
    {
        $factory = User::factory();

        return ($admin ? $factory->admin() : $factory)->create(['enabled' => 1]);
    }

    public function testCreateUpdateConflictAndDeleteAcrossRequests(): void
    {
        $user = $this->user(admin: true);
        $device = Device::factory()->create();
        $payload = $this->payload((string) $device->device_id);
        $created = $this->actingAs($user)->postJson('/libremap/views', $payload)
            ->assertCreated()->assertJsonPath('view.revision', 1)->json('view');
        $url = '/libremap/views/'.$created['id'];
        $this->getJson('/libremap/views')->assertOk()->assertJsonPath('views.0.id', $created['id']);
        $this->putJson($url, array_merge($payload, ['name' => 'Updated', 'revision' => 1]))
            ->assertOk()->assertJsonPath('view.revision', 2);
        $this->putJson($url, array_merge($payload, ['revision' => 1]))->assertStatus(409);
        $this->deleteJson($url, ['revision' => 1])->assertStatus(409);
        // The client sends the revision in the query string; a body works too (above).
        $this->deleteJson($url.'?revision=2')->assertNoContent();
        $this->getJson('/libremap/views')->assertExactJson(['views' => []]);
    }

    public function testOtherOwnerCannotListUpdateOrDeletePrivateView(): void
    {
        $owner = $this->user();
        $other = $this->user(admin: true);
        $view = $this->actingAs($owner)->postJson('/libremap/views', $this->payload())
            ->assertCreated()->json('view');
        $this->actingAs($other)->getJson('/libremap/views')->assertExactJson(['views' => []]);
        $this->putJson('/libremap/views/'.$view['id'], array_merge($this->payload(), ['revision' => 1]))->assertNotFound();
        $this->deleteJson('/libremap/views/'.$view['id'], ['revision' => 1])->assertNotFound();
    }

    public function testUnauthorizedDeviceReferencesAreRejectedAndExistingReferencesAreRedacted(): void
    {
        $user = $this->user();
        $device = Device::factory()->create();
        $payload = $this->payload((string) $device->device_id);
        $this->actingAs($user)->postJson('/libremap/views', $payload)->assertUnprocessable();
        // Simulate a persisted view whose owner no longer has access to its devices.
        $view = $this->postJson('/libremap/views', $this->payload())->assertCreated()->json('view');
        DB::table('libremap_views')->where('id', $view['id'])->update(['state' => json_encode($payload['state'])]);
        $response = $this->getJson('/libremap/views')->assertOk()
            ->assertJsonPath('views.0.state.rootId', null)->assertJsonPath('views.0.state.pinned', []);
        $this->assertSame([], $response->json('views.0.state.positions'));
        $this->assertStringContainsString('"positions":{}', $response->getContent());
        $this->putJson('/libremap/views/'.$view['id'], array_merge($payload, ['revision' => 1]))->assertUnprocessable();
    }

    public function testInputLimitsAndMetadataAreEnforced(): void
    {
        $this->actingAs($this->user(admin: true));
        // A tab opened before this field was introduced can still save a view.
        $legacy = $this->payload();
        unset($legacy['state']['showOther']);
        $this->postJson('/libremap/views', $legacy)->assertCreated()
            ->assertJsonPath('view.state.showOther', false);
        $payload = $this->payload();
        $payload['state']['showOther'] = 'true';
        $this->postJson('/libremap/views', $payload)->assertUnprocessable();
        $payload = $this->payload();
        $payload['state']['positions'] = ['hostname.example' => ['x' => 0, 'y' => 0]];
        $this->postJson('/libremap/views', $payload)->assertUnprocessable();
        $payload = $this->payload();
        $payload['state']['pan']['x'] = 1000001;
        $this->postJson('/libremap/views', $payload)->assertUnprocessable();
        $payload = $this->payload();
        $payload['state']['zoom'] = '1';
        $this->postJson('/libremap/views', $payload)->assertUnprocessable();
        // Bounds match the client's own clamps, so the server never stores a
        // zoom level the map would discard on load.
        $payload = $this->payload();
        $payload['state']['zoom'] = 3.0;
        $this->postJson('/libremap/views', $payload)->assertUnprocessable();
        $payload = $this->payload();
        $payload['state']['hostname'] = 'must-not-be-stored';
        $this->postJson('/libremap/views', $payload)->assertUnprocessable();
        $payload = $this->payload();
        $payload['name'] = str_repeat('x', 101);
        $this->postJson('/libremap/views', $payload)->assertUnprocessable();
    }

    public function testUnicodeLengthBoundariesAreAcceptedAndRejected(): void
    {
        $this->actingAs($this->user(admin: true));
        $payload = $this->payload();
        $payload['name'] = str_repeat("\u{1F30D}", 100);
        $payload['state']['site'] = str_repeat("\u{00F8}", 200);
        $payload['state']['search'] = str_repeat("\u{1F30D}", 200);
        $this->postJson('/libremap/views', $payload)->assertCreated()
            ->assertJsonPath('view.name', $payload['name'])
            ->assertJsonPath('view.state.site', $payload['state']['site'])
            ->assertJsonPath('view.state.search', $payload['state']['search']);
        foreach (['name', 'site', 'search'] as $field) {
            $invalid = $payload;
            if ($field === 'name') {
                $invalid['name'] .= "\u{1F30D}";
            } else {
                $invalid['state'][$field] .= "\u{1F30D}";
            }
            $this->postJson('/libremap/views', $invalid)->assertUnprocessable();
        }
    }

    public function testListingBatchesAuthorizationAndRedactsEachViewSeparately(): void
    {
        $user = $this->user();
        $visible = Device::factory()->create();
        $hidden = Device::factory()->create();
        DB::table('devices_perms')->insert(['user_id' => $user->getKey(), 'device_id' => $visible->device_id]);
        $this->actingAs($user);
        for ($i = 0; $i < 4; $i++) {
            $view = $this->postJson('/libremap/views', $this->payload((string) $visible->device_id))
                ->assertCreated()->json('view');
            $state = $this->payload((string) $visible->device_id)['state'];
            $state['positions'] = [(string) $visible->device_id => ['x' => 10, 'y' => 20], (string) $hidden->device_id => ['x' => 30, 'y' => 40]];
            $state['pinned'][] = (string) $hidden->device_id;
            if ($i % 2 === 0) {
                $state['rootId'] = (string) $hidden->device_id;
            }
            DB::table('libremap_views')->where('id', $view['id'])->update(['state' => json_encode($state)]);
        }
        DB::flushQueryLog();
        DB::enableQueryLog();
        try {
            $response = $this->getJson('/libremap/views')->assertOk();
            $queries = DB::getQueryLog();
        } finally {
            DB::disableQueryLog();
        }
        $authorizationQueries = array_filter($queries, fn ($query) => preg_match('/from [`"]?devices[`"]?\s/i', $query['query']));
        $this->assertCount(1, $authorizationQueries, 'Device access must be resolved once per list.');
        $views = $response->json('views');
        $this->assertCount(4, $views);
        $this->assertCount(2, array_filter($views, fn ($view) => $view['state']['rootId'] === null));
        foreach ($views as $view) {
            $this->assertSame([(string) $visible->device_id], $view['state']['pinned']);
            $this->assertSame([(string) $visible->device_id], array_map('strval', array_keys($view['state']['positions'])));
        }
    }

    public function testOwnerLimitDoesNotApplyToOtherUsers(): void
    {
        $owner = $this->user();
        $this->actingAs($owner);
        for ($i = 0; $i < 50; $i++) {
            $this->postJson('/libremap/views', $this->payload())->assertCreated();
        }
        $this->postJson('/libremap/views', $this->payload())->assertUnprocessable();
        $this->actingAs($this->user())->postJson('/libremap/views', $this->payload())->assertCreated();
    }

    public function testDisabledPluginRejectsSavedViewRequests(): void
    {
        $manager = Mockery::mock(PluginManagerInterface::class);
        $manager->shouldReceive('pluginEnabled')->with('libremap')->andReturn(false);
        $this->app->instance(PluginManagerInterface::class, $manager);
        $this->actingAs($this->user())->getJson('/libremap/views')->assertNotFound();
        $this->postJson('/libremap/views', $this->payload())->assertNotFound();
    }

    public function testGuestCannotReadSavedViews(): void
    {
        $this->getJson('/libremap/views')->assertUnauthorized();
    }

    public function testUnreadableRowDegradesToAnEmptyViewInsteadOfFailingTheListing(): void
    {
        $this->actingAs($this->user(admin: true));
        $broken = $this->postJson('/libremap/views', $this->payload())->assertCreated()->json('view');
        $intact = $this->postJson('/libremap/views', $this->payload())->assertCreated()->json('view');
        DB::table('libremap_views')->where('id', $broken['id'])->update(['state' => json_encode('not a view object')]);

        $views = collect($this->getJson('/libremap/views')->assertOk()->json('views'))->keyBy('id');

        $this->assertCount(2, $views);
        $this->assertSame([], $views[$broken['id']]['state']['pinned']);
        $this->assertNull($views[$broken['id']]['state']['rootId']);
        $this->assertSame(1, $views[$intact['id']]['revision']);
    }

    public function testDeletingAUserRemovesTheirPrivateViews(): void
    {
        $owner = $this->user();
        $this->actingAs($owner)->postJson('/libremap/views', $this->payload())->assertCreated();

        $owner->delete();

        $this->assertSame(0, DB::table('libremap_views')->where('user_id', $owner->getKey())->count());
        $this->assertSame(0, DB::table('libremap_view_owners')->where('user_id', $owner->getKey())->count());
    }

    public function testPositionLimitFollowsMaxDevices(): void
    {
        config(['libremap.max_devices' => 2500]);
        $this->assertSame(2500, ViewState::positionLimit());
        config(['libremap.max_devices' => 100]);
        $this->assertSame(2000, ViewState::positionLimit());
    }

    public function testRoutesUseTheirOwnNamedRateLimiter(): void
    {
        $this->assertNotNull(RateLimiter::limiter('libremap'));
    }
}
