<?php

namespace LibreMap\Tests\Host;

use App\Models\Device;
use App\Models\Location;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use LibreNMS\Interfaces\Plugins\PluginManagerInterface;
use LibreNMS\Tests\TestCase;
use Mockery;

/** Run with the LibreNMS bootstrap and a disposable TEST database, after migrations. */
class WorldMapIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        $manager = Mockery::mock(PluginManagerInterface::class);
        $manager->shouldReceive('pluginEnabled')->with('libremap')->andReturn(true);
        $this->app->instance(PluginManagerInterface::class, $manager);
        require __DIR__.'/../../routes/web.php';
        // The provider registers the views only when the plugin was enabled at boot; here it is enabled afterwards.
        $this->app['view']->addNamespace('libremap', __DIR__.'/../../resources/views');
    }

    private function location(string $name, ?float $lat, ?float $lng): int
    {
        return (int) Location::create(['location' => $name, 'lat' => $lat, 'lng' => $lng])->id;
    }

    public function testLocationsArePermissionScopedAndSkipMissingCoordinates(): void
    {
        $user = User::factory()->create(['enabled' => 1]);
        $haugesund = $this->location('Haugesund', 59.4138, 5.268);
        $hidden = $this->location('Secret site', 60.0, 10.0);
        $unset = $this->location('No coordinates', null, null);
        $zero = $this->location('Not geocoded', 0.0, 0.0);
        $visible = Device::factory()->create(['location_id' => $haugesund]);
        $alsoVisible = Device::factory()->create(['location_id' => $unset]);
        $notGeocoded = Device::factory()->create(['location_id' => $zero]);
        Device::factory()->create(['location_id' => $hidden]);
        $user->devicesOwned()->attach([$visible->device_id, $alsoVisible->device_id, $notGeocoded->device_id]);
        config(['libremap.world_tiles' => 'https://tiles.example/{z}/{x}/{y}.png']);

        $result = $this->actingAs($user)->getJson('/libremap/locations')->assertOk()->json();

        // Only the user's located device, and only its location, are sent.
        $this->assertSame([['id' => (string) $haugesund, 'name' => 'Haugesund', 'lat' => 59.4138, 'lng' => 5.268]], $result['locations']);
        $this->assertSame([(string) $visible->device_id => (string) $haugesund], $result['devices']);
        $this->assertSame('https://tiles.example/{z}/{x}/{y}.png', $result['map']['tiles']);
    }

    public function testTileTemplatesMustBeWebUrlsWithTileCoordinates(): void
    {
        $this->actingAs(User::factory()->admin()->create(['enabled' => 1]));
        foreach (['', 'javascript:alert(1)//{z}/{x}/{y}', 'https://tiles.example/static.png'] as $template) {
            config(['libremap.world_tiles' => $template]);
            $this->getJson('/libremap/locations')->assertOk()->assertJsonPath('map.tiles', null)->assertJsonPath('map.attribution', '');
        }
        // By default the map follows LibreNMS's own leaflet tile server.
        config(['libremap.world_tiles' => null]);
        $this->assertMatchesRegularExpression('#^https://.+/\{z\}/\{x\}/\{y\}\.png$#', $this->getJson('/libremap/locations')->json('map.tiles'));
    }

    public function testWorldPageRenders(): void
    {
        $this->actingAs(User::factory()->create(['enabled' => 1]));
        $this->get('/libremap/world')->assertOk()->assertSee('data-mode="world"', false)
            ->assertSee('data-locations-endpoint=', false);
    }
}
