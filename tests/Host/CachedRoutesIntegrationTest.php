<?php

namespace LibreMap\Tests\Host;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use LibreNMS\Interfaces\Plugins\PluginManagerInterface;
use LibreNMS\Tests\TestCase;
use Mockery;
use PHPUnit\Framework\Attributes\Group;

/** Run separately AFTER `php artisan route:cache`, with the plugin enabled. */
#[Group('cached-routes')]
class CachedRoutesIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    public function testCachedRoutesServeTopologyAndViews(): void
    {
        $this->assertTrue($this->app->routesAreCached(), 'Run artisan route:cache before this suite.');
        // The factory leaves `enabled` unset, which LibreNMS treats as a disabled account.
        $this->actingAs(User::factory()->create(['enabled' => 1]));
        // No manual require of routes: the provider and real route cache must work.
        $this->getJson('/libremap/topology')->assertOk()->assertJsonStructure(['devices', 'links', 'config']);
        $this->getJson('/libremap/views')->assertOk()->assertExactJson(['views' => []]);
    }

    public function testMapPageRendersWithTheNavbarButton(): void
    {
        $this->actingAs(User::factory()->create(['enabled' => 1]));
        // The real provider, with the plugin enabled, registered the navbar view.
        $this->get('/libremap')->assertOk()
            ->assertSee('Topology Map')
            ->assertSee('fa-sitemap', false)
            ->assertSee('data-host-theme="true"', false)
            ->assertSee('vendor/libremap/libremap.js?v=', false);
    }

    public function testCachedRoutesStillCheckAuthenticationAndPluginEnablement(): void
    {
        $this->assertTrue($this->app->routesAreCached());
        $this->getJson('/libremap/topology')->assertUnauthorized();
        $this->getJson('/libremap/views')->assertUnauthorized();
        $manager = Mockery::mock(PluginManagerInterface::class);
        $manager->shouldReceive('pluginEnabled')->with('libremap')->andReturn(false);
        $this->app->instance(PluginManagerInterface::class, $manager);
        $this->actingAs(User::factory()->create(['enabled' => 1]));
        $this->getJson('/libremap/topology')->assertNotFound();
        $this->getJson('/libremap/views')->assertNotFound();
        $this->postJson('/libremap/views', [])->assertNotFound();
    }
}
