<?php

namespace LibreMap\Tests\Host;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use LibreNMS\Interfaces\Plugins\PluginManagerInterface;
use LibreNMS\Tests\TestCase;
use Mockery;

/** The "Topology Map" Maps submenu entry, rendered through LibreNMS's `menu.custom` include. */
class NavbarIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    private const VIEW = __DIR__.'/../../resources/navbar/menu/custom.blade.php';

    protected function setUp(): void
    {
        parent::setUp();
        $manager = Mockery::mock(PluginManagerInterface::class);
        $manager->shouldReceive('pluginEnabled')->with('libremap')->andReturn(true);
        $this->app->instance(PluginManagerInterface::class, $manager);
        require __DIR__.'/../../routes/web.php';
        // Route names set fluently after registration need a lookup refresh.
        $this->app['router']->getRoutes()->refreshNameLookups();
    }

    public function testMapsEntryLinksToTheMapWithItsIcon(): void
    {
        $this->actingAs(User::factory()->create(['enabled' => 1]));

        $html = view()->file(self::VIEW)->render();

        $this->assertStringContainsString('Topology Map', $html);
        $this->assertStringContainsString('href="'.route('libremap.index').'"', $html);
        $this->assertStringContainsString('fa-sitemap', $html);
    }

    public function testGuestsGetNoMapsEntry(): void
    {
        $this->assertStringNotContainsString('Topology Map', view()->file(self::VIEW)->render());
    }

    public function testTheHostsOwnCustomMenuStillRenders(): void
    {
        $custom = resource_path('views/menu/custom.blade.php');
        if (is_file($custom)) {
            $this->markTestSkipped('This host has its own custom menu; the test will not overwrite it.');
        }
        $this->actingAs(User::factory()->create(['enabled' => 1]));
        if (! is_dir(dirname($custom))) {
            mkdir(dirname($custom), 0777, true);
        }
        file_put_contents($custom, '<li id="host-custom-menu">{{ $marker }}</li>');
        try {
            $html = view()->file(self::VIEW, ['marker' => 'Host menu'])->render();
        } finally {
            unlink($custom);
        }

        $this->assertStringContainsString('Topology Map', $html);
        // The host's view receives the same data LibreNMS passed to `menu.custom`.
        $this->assertStringContainsString('<li id="host-custom-menu">Host menu</li>', $html);
    }
}
