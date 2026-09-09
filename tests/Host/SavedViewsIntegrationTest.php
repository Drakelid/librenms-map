<?php

namespace LibreMap\Tests\Host;

use App\Models\Device;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
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
            'rootId' => $id, 'site' => '', 'search' => '', 'backbone' => false,
            'positions' => $id === null ? (object) [] : (object) [$id => ['x' => 10, 'y' => 20]],
            'pinned' => $id === null ? [] : [$id], 'zoom' => 1, 'pan' => ['x' => 0, 'y' => 0],
        ]];
    }

    public function testCreateUpdateConflictAndDeleteAcrossRequests(): void
    {
        $user = User::factory()->admin()->create();
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
        $this->deleteJson($url, ['revision' => 2])->assertNoContent();
        $this->getJson('/libremap/views')->assertExactJson(['views' => []]);
    }

    public function testOtherOwnerCannotListUpdateOrDeletePrivateView(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->admin()->create();
        $view = $this->actingAs($owner)->postJson('/libremap/views', $this->payload())
            ->assertCreated()->json('view');
        $this->actingAs($other)->getJson('/libremap/views')->assertExactJson(['views' => []]);
        $this->putJson('/libremap/views/'.$view['id'], array_merge($this->payload(), ['revision' => 1]))->assertNotFound();
        $this->deleteJson('/libremap/views/'.$view['id'], ['revision' => 1])->assertNotFound();
    }

    public function testUnauthorizedDeviceReferencesAreRejectedAndExistingReferencesAreRedacted(): void
    {
        $user = User::factory()->create();
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
        $this->actingAs(User::factory()->admin()->create());
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

    public function testOwnerLimitDoesNotApplyToOtherUsers(): void
    {
        $owner = User::factory()->create();
        $this->actingAs($owner);
        for ($i = 0; $i < 50; $i++) {
            $this->postJson('/libremap/views', $this->payload())->assertCreated();
        }
        $this->postJson('/libremap/views', $this->payload())->assertUnprocessable();
        $this->actingAs(User::factory()->create())->postJson('/libremap/views', $this->payload())->assertCreated();
    }

    public function testDisabledPluginRejectsSavedViewRequests(): void
    {
        $manager = Mockery::mock(PluginManagerInterface::class);
        $manager->shouldReceive('pluginEnabled')->with('libremap')->andReturn(false);
        $this->app->instance(PluginManagerInterface::class, $manager);
        $this->actingAs(User::factory()->create())->getJson('/libremap/views')->assertNotFound();
        $this->postJson('/libremap/views', $this->payload())->assertNotFound();
    }

    public function testGuestCannotReadSavedViews(): void
    {
        $this->getJson('/libremap/views')->assertUnauthorized();
    }

    public function testUnreadableRowDegradesToAnEmptyViewInsteadOfFailingTheListing(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $broken = $this->postJson('/libremap/views', $this->payload())->assertCreated()->json('view');
        $intact = $this->postJson('/libremap/views', $this->payload())->assertCreated()->json('view');
        DB::table('libremap_views')->where('id', $broken['id'])->update(['state' => 'not json']);

        $views = collect($this->getJson('/libremap/views')->assertOk()->json('views'))->keyBy('id');

        $this->assertCount(2, $views);
        $this->assertSame([], $views[$broken['id']]['state']['pinned']);
        $this->assertNull($views[$broken['id']]['state']['rootId']);
        $this->assertSame(1, $views[$intact['id']]['revision']);
    }
}
