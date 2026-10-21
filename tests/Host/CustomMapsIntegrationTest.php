<?php

namespace LibreMap\Tests\Host;

use App\Models\Device;
use App\Models\Port;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use LibreNMS\Interfaces\Plugins\PluginManagerInterface;
use LibreNMS\Tests\TestCase;
use Mockery;

/** Run with the LibreNMS bootstrap and a disposable TEST database, after migrations. */
class CustomMapsIntegrationTest extends TestCase
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

    /** See SavedViewsIntegrationTest: the factory leaves `enabled` unset. */
    private function user(bool $admin = false): User
    {
        $factory = User::factory();

        return ($admin ? $factory->admin() : $factory)->create(['enabled' => 1]);
    }

    private function port(Device $device, array $attributes = []): Port
    {
        return Port::factory()->create($attributes + [
            'device_id' => $device->device_id, 'deleted' => 0, 'disabled' => 0,
            'ifOperStatus' => 'up', 'ifAdminStatus' => 'up', 'ifSpeed' => 1000000000,
            'ifInOctets_rate' => 12500000, 'ifOutOctets_rate' => 0, 'poll_time' => time(),
        ]);
    }

    private function payload(array $devices = [], array $links = [], bool $shared = false): array
    {
        return ['name' => 'Rossa ring', 'shared' => $shared, 'document' => [
            'devices' => array_map(fn ($device, $index) => ['key' => 'd-'.$index, 'deviceId' => (string) $device->device_id, 'x' => $index * 250, 'y' => 0], $devices, array_keys($devices)),
            'shapes' => [['key' => 's-area', 'kind' => 'box', 'x' => 0, 'y' => 0, 'width' => 600, 'height' => 300, 'text' => 'Rossa']],
            'links' => $links,
            'zoom' => 1, 'pan' => ['x' => 0, 'y' => 0],
        ]];
    }

    public function testOwnerCreatesUpdatesAndDeletesWithRevisionChecks(): void
    {
        $owner = $this->user(admin: true);
        [$a, $b] = [Device::factory()->create(), Device::factory()->create()];
        $port = $this->port($a);
        $payload = $this->payload([$a, $b], [['key' => 'l-1', 'source' => 'd-0', 'target' => 'd-1', 'label' => '', 'portId' => (string) $port->port_id]]);

        $created = $this->actingAs($owner)->postJson('/libremap/custom-maps', $payload)
            ->assertCreated()->assertJsonPath('map.revision', 1)->assertJsonPath('map.owned', true)
            ->assertJsonPath('map.document.links.0.portId', (string) $port->port_id)
            ->assertJsonPath('live.ports.'.$port->port_id.'.inBps', 100000000.0)
            ->json('map');
        $url = '/libremap/custom-maps/'.$created['id'];
        $this->getJson('/libremap/custom-maps')->assertOk()->assertJsonPath('maps.0.id', $created['id'])
            ->assertJsonMissingPath('maps.0.document');
        $this->putJson($url, array_merge($payload, ['name' => 'Renamed', 'revision' => 1]))
            ->assertOk()->assertJsonPath('map.revision', 2)->assertJsonPath('map.name', 'Renamed');
        $this->putJson($url, array_merge($payload, ['revision' => 1]))->assertStatus(409);
        $this->deleteJson($url.'?revision=1')->assertStatus(409);
        $this->deleteJson($url.'?revision=2')->assertNoContent();
        $this->getJson('/libremap/custom-maps')->assertExactJson(['maps' => []]);
    }

    public function testPrivateMapsAreInvisibleAndSharedMapsAreReadOnlyToOthers(): void
    {
        $owner = $this->user();
        $other = $this->user(admin: true);
        $map = $this->actingAs($owner)->postJson('/libremap/custom-maps', $this->payload())->assertCreated()->json('map');
        $url = '/libremap/custom-maps/'.$map['id'];

        $this->actingAs($other)->getJson('/libremap/custom-maps')->assertExactJson(['maps' => []]);
        $this->getJson($url)->assertNotFound();

        $this->actingAs($owner)->putJson($url, array_merge($this->payload(shared: true), ['revision' => 1]))->assertOk();
        $this->actingAs($other)->getJson('/libremap/custom-maps')->assertJsonPath('maps.0.owned', false)
            ->assertJsonPath('maps.0.ownerName', $owner->username);
        $this->getJson($url)->assertOk()->assertJsonPath('map.shared', true)->assertJsonPath('map.document.shapes.0.text', 'Rossa');
        // Sharing grants reading only, even to an administrator.
        $this->putJson($url, array_merge($this->payload(shared: true), ['revision' => 2]))->assertNotFound();
        $this->deleteJson($url.'?revision=2')->assertNotFound();
    }

    public function testSharedReadersSeeOnlyTheirOwnDevicesAndInterfaces(): void
    {
        $owner = $this->user(admin: true);
        $reader = $this->user();
        [$visible, $hidden] = [Device::factory()->create(), Device::factory()->create()];
        $hiddenPort = $this->port($hidden);
        $reader->devicesOwned()->attach($visible->device_id);
        $map = $this->actingAs($owner)->postJson('/libremap/custom-maps', $this->payload([$visible, $hidden],
            [['key' => 'l-1', 'source' => 'd-0', 'target' => 'd-1', 'label' => 'Fibre', 'portId' => (string) $hiddenPort->port_id]], shared: true))
            ->assertCreated()->json('map');

        $read = $this->actingAs($reader)->getJson('/libremap/custom-maps/'.$map['id'])->assertOk()->json();

        $this->assertSame([(string) $visible->device_id], array_column($read['map']['document']['devices'], 'deviceId'));
        $this->assertSame([], $read['map']['document']['links']);
        $this->assertSame([(string) $visible->device_id], array_map('strval', array_keys($read['live']['devices'])));
        $this->assertSame([], $read['live']['ports']);
    }

    public function testWritesRejectUnavailableDevicesAndForeignInterfaces(): void
    {
        $user = $this->user();
        [$mine, $alsoMine, $other] = [Device::factory()->create(), Device::factory()->create(), Device::factory()->create()];
        $user->devicesOwned()->attach([$mine->device_id, $alsoMine->device_id]);
        $this->actingAs($user)->postJson('/libremap/custom-maps', $this->payload([$mine, $other]))
            ->assertStatus(422)->assertJsonValidationErrors('document.devices');

        // A bound interface must belong to one end of its line.
        $foreign = $this->port($other);
        $user->portsOwned()->attach($foreign->port_id);
        $this->postJson('/libremap/custom-maps', $this->payload([$mine, $alsoMine],
            [['key' => 'l-1', 'source' => 'd-0', 'target' => 'd-1', 'label' => '', 'portId' => (string) $foreign->port_id]]))
            ->assertStatus(422)->assertJsonValidationErrors('document.links');

        $this->postJson('/libremap/custom-maps', $this->payload([$mine, $alsoMine],
            [['key' => 'l-1', 'source' => 'd-0', 'target' => 'd-0', 'label' => '', 'portId' => null]]))
            ->assertStatus(422)->assertJsonValidationErrors('document.links');
    }

    public function testEditorCatalogsArePermissionScoped(): void
    {
        $user = $this->user();
        [$mine, $other] = [Device::factory()->create(), Device::factory()->create()];
        $user->devicesOwned()->attach($mine->device_id);
        $port = $this->port($mine, ['ifName' => 'xe-0/0/1']);
        $this->port($other);

        $this->actingAs($user)->getJson('/libremap/devices')->assertOk()
            ->assertJsonCount(1, 'devices')->assertJsonPath('devices.0.id', (string) $mine->device_id);
        $this->getJson('/libremap/devices/'.$mine->device_id.'/ports')->assertOk()
            ->assertJsonPath('ports.0.id', (string) $port->port_id)->assertJsonPath('ports.0.name', 'xe-0/0/1');
        $this->getJson('/libremap/devices/'.$other->device_id.'/ports')->assertNotFound();
    }

    public function testMapsAreRemovedWithTheirOwner(): void
    {
        $owner = $this->user();
        $this->actingAs($owner)->postJson('/libremap/custom-maps', $this->payload())->assertCreated();
        $owner->delete();

        $this->assertSame(0, DB::table('libremap_custom_maps')->where('user_id', $owner->getKey())->count());
    }
}
