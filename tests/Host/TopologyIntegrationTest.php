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
