<?php

namespace LibreMap\Tests\Host;

use App\Models\Device;
use App\Models\Link;
use App\Models\Port;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use LibreMap\Topology\LibreNmsTopology;
use LibreNMS\Tests\TestCase;

/** Run with the LibreNMS PHPUnit bootstrap and a disposable TEST database. */
class TopologyIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    private function connect(Port $source, Port $target): Link
    {
        $link = new Link;
        $link->forceFill([
            'local_device_id' => $source->device_id, 'remote_device_id' => $target->device_id,
            'local_port_id' => $source->port_id, 'remote_port_id' => $target->port_id,
            'active' => 1, 'protocol' => 'lldp', 'remote_hostname' => 'neighbor',
            'remote_port' => 'test', 'remote_version' => '',
        ])->save();

        return $link;
    }

    public function testLiveStatusesUseTheHostsRealPortCasts(): void
    {
        $source = Device::factory()->create();
        $target = Device::factory()->create();
        $user = User::factory()->admin()->create();
        $local = Port::factory()->create(['device_id' => $source->device_id, 'deleted' => 0]);
        $remote = Port::factory()->create(['device_id' => $target->device_id, 'deleted' => 0]);
        $link = $this->connect($local, $remote);
        foreach ([
            ['up', 'up', 0, 'up'],
            ['down', 'up', 0, 'down'],
            ['up', 'down', 0, 'down'],
            ['up', 'up', 1, 'unknown'],
            ['unknown', 'up', 0, 'unknown'],
            [null, 'up', 0, 'unknown'],
        ] as [$oper, $admin, $disabled, $expected]) {
            // Exercise each endpoint independently, retaining real Eloquent casts.
            foreach ([$local, $remote] as $endpoint) {
                foreach ([$local, $remote] as $port) {
                    $port->forceFill(['ifOperStatus' => 'up', 'ifAdminStatus' => 'up', 'disabled' => 0])->save();
                }
                $endpoint->forceFill(['ifOperStatus' => $oper, 'ifAdminStatus' => $admin, 'disabled' => $disabled])->save();
                $result = app(LibreNmsTopology::class)->forUser($user);
                $actual = collect($result['links'])->firstWhere('id', (string) $link->id);
                $this->assertNotNull($actual);
                $this->assertSame($expected, $actual['status']);
            }
        }
    }

    public function testPartialDeviceAndPortGrantsDoNotLeakRemoteDevices(): void
    {
        $user = User::factory()->create();
        $visible = Device::factory()->create();
        $alsoVisible = Device::factory()->create();
        $hidden = Device::factory()->create();
        $ports = collect([$visible, $alsoVisible, $hidden])->map(fn ($device) => Port::factory()->create([
            'device_id' => $device->device_id, 'deleted' => 0,
            'ifOperStatus' => 'up', 'ifAdminStatus' => 'up', 'disabled' => 0,
        ]));
        $allowed = $this->connect($ports[0], $ports[1]);
        $this->connect($ports[0], $ports[2]);
        $this->connect($ports[2], $ports[0]);
        $user->devicesOwned()->attach([$visible->device_id, $alsoVisible->device_id]);
        // A port grant alone must not expose its otherwise unauthorized device.
        $user->portsOwned()->attach($ports[2]->port_id);
        config(['libremap.overrides' => [$hidden->device_id => ['role' => 'AGG', 'site' => 'secret']]]);

        $result = app(LibreNmsTopology::class)->forUser($user);

        $this->assertEqualsCanonicalizing([(string) $visible->device_id, (string) $alsoVisible->device_id], array_column($result['devices'], 'id'));
        $this->assertSame([(string) $allowed->id], array_column($result['links'], 'id'));
        $this->assertSame([], (array) $result['config']['overrides']);
    }

    public function testDeletedEndpointPortsAreOmitted(): void
    {
        $devices = Device::factory()->count(2)->create();
        $ports = $devices->map(fn ($device) => Port::factory()->create(['device_id' => $device->device_id, 'deleted' => 0]));
        $link = $this->connect($ports[0], $ports[1]);
        $user = User::factory()->admin()->create();
        foreach ($ports as $port) {
            $port->forceFill(['deleted' => 1])->save();
            $result = app(LibreNmsTopology::class)->forUser($user);
            $this->assertNotContains((string) $link->id, array_column($result['links'], 'id'));
            $port->forceFill(['deleted' => 0])->save();
        }
    }

    public function testUnprivilegedUserReceivesNoDeviceOrOverrideData(): void
    {
        $device = Device::factory()->create(['hostname' => 'hidden1agg1']);
        config(['libremap.overrides' => [$device->device_id => ['role' => 'AGG', 'site' => 'hidden1']]]);

        $result = app(LibreNmsTopology::class)->forUser(User::factory()->create());

        $this->assertSame([], $result['devices']);
        $this->assertSame([], $result['links']);
        $this->assertSame([], (array) $result['config']['overrides']);
    }

    public function testRatesAreBitsPerSecondAndCredentialsAreNotSerialized(): void
    {
        $source = Device::factory()->create(['hostname' => 'rossa1agg1']);
        $target = Device::factory()->create(['hostname' => 'rossa1er1']);
        $local = Port::factory()->create([
            'device_id' => $source->device_id, 'ifSpeed' => 1000000000,
            'ifInOctets_rate' => 12500000, 'ifOutOctets_rate' => null,
            'poll_time' => 1700000000, 'ifOperStatus' => 'up', 'ifAdminStatus' => 'up',
            'deleted' => 0, 'disabled' => 0,
        ]);
        $remote = Port::factory()->create([
            'device_id' => $target->device_id, 'ifOperStatus' => 'up',
            'ifAdminStatus' => 'up', 'deleted' => 0, 'disabled' => 0,
        ]);
        $link = new Link;
        $link->forceFill([
            'local_device_id' => $source->device_id, 'remote_device_id' => $target->device_id,
            'local_port_id' => $local->port_id, 'remote_port_id' => $remote->port_id,
            'active' => 1, 'protocol' => 'lldp', 'remote_hostname' => $target->hostname,
            'remote_port' => 'test', 'remote_version' => '',
        ])->save();

        $result = app(LibreNmsTopology::class)->forUser(User::factory()->admin()->create());
        $actual = collect($result['links'])->firstWhere('id', (string) $link->id);

        $this->assertSame(100000000.0, $actual['inBps']);
        $this->assertNull($actual['outBps']);
        $this->assertSame(1000000000.0, $actual['speedBps']);
        $this->assertSame('up', $actual['status']);
        foreach ($result['devices'] as $device) {
            $this->assertSame(['id', 'hostname', 'status', 'url'], array_keys($device));
        }
    }
}
