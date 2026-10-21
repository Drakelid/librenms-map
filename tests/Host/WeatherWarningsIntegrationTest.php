<?php

namespace LibreMap\Tests\Host;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use LibreNMS\Interfaces\Plugins\PluginManagerInterface;
use LibreNMS\Tests\TestCase;
use Mockery;

/** MET Norway is faked: these tests never contact api.met.no. */
class WeatherWarningsIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        $manager = Mockery::mock(PluginManagerInterface::class);
        $manager->shouldReceive('pluginEnabled')->with('libremap')->andReturn(true);
        $this->app->instance(PluginManagerInterface::class, $manager);
        require __DIR__.'/../../routes/web.php';
        Cache::forget('libremap:metalerts:en');
        Cache::forget('libremap:metalerts:no');
        $this->actingAs(User::factory()->create(['enabled' => 1]));
    }

    private function feature(array $properties, string $status = 'Actual'): array
    {
        return [
            'type' => 'Feature',
            'geometry' => ['type' => 'Polygon', 'coordinates' => [[[5.0, 60.0], [6.0, 60.0], [6.0, 61.0], [5.0, 61.0], [5.0, 60.0]]]],
            'when' => ['interval' => ['2026-10-21T12:00:00+00:00', '2026-10-22T06:00:00+00:00']],
            'properties' => $properties + [
                'id' => 'alert-1', 'status' => $status, 'event' => 'wind', 'eventAwarenessName' => 'Strong wind',
                'riskMatrixColor' => 'Orange', 'awareness_level' => '3; orange; Severe', 'area' => 'Vestland',
                'description' => 'Gusts up to 35 m/s.', 'instruction' => 'Secure loose objects.',
                'consequences' => 'Power outages are likely.', 'web' => 'https://www.met.no/', 'geographicDomain' => 'land',
            ],
        ];
    }

    public function testWarningsAreSimplifiedCachedAndIdentified(): void
    {
        Http::fake(['api.met.no/*' => Http::response(['type' => 'FeatureCollection', 'features' => [
            $this->feature([]),
            $this->feature(['id' => 'test-alert'], status: 'Test'),
            $this->feature(['id' => 'no-colour', 'riskMatrixColor' => 'Purple', 'awareness_level' => '']),
            $this->feature(['id' => 'script-link', 'web' => 'javascript:alert(1)', 'riskMatrixColor' => 'Yellow']),
        ]])]);

        $warnings = $this->getJson('/libremap/weather')->assertOk()
            ->assertJsonPath('source', 'MET Norway')->assertJsonPath('stale', false)->json('warnings');

        // Test messages and unknown levels are dropped; yellow draws beneath orange.
        $this->assertSame(['script-link', 'alert-1'], array_column($warnings, 'id'));
        $this->assertSame(['yellow', 'orange'], array_column($warnings, 'level'));
        $this->assertNull($warnings[0]['web']);
        $this->assertSame('Strong wind', $warnings[1]['title']);
        $this->assertSame('Power outages are likely.', $warnings[1]['consequences']);
        $this->assertSame([[[[5.0, 60.0], [6.0, 60.0], [6.0, 61.0], [5.0, 61.0], [5.0, 60.0]]]], $warnings[1]['polygons']);
        // Only what the map shows is passed on.
        $this->assertSame(['id', 'level', 'event', 'title', 'area', 'description', 'instruction', 'consequences', 'start', 'end', 'web', 'marine', 'polygons'], array_keys($warnings[1]));

        // A second request within five minutes is served from the cache.
        $this->getJson('/libremap/weather')->assertOk();
        Http::assertSentCount(1);
        Http::assertSent(fn (Request $request) => str_starts_with($request->url(), 'https://api.met.no/weatherapi/metalerts/2.0/current.json')
            && str_contains($request->url(), 'lang=en')
            && str_contains($request->header('User-Agent')[0] ?? '', 'github.com/Drakelid/librenms-map'));
    }

    public function testTheLastGoodCopyIsServedWhenMetIsUnreachable(): void
    {
        Http::fake(['api.met.no/*' => Http::sequence()
            ->push(['type' => 'FeatureCollection', 'features' => [$this->feature([])]])
            ->push('Service unavailable', 503)]);
        $this->getJson('/libremap/weather')->assertOk();
        // Make the cached copy too old to be fresh, but keep it.
        Cache::put('libremap:metalerts:en', ['fetchedAt' => time() - 600] + Cache::get('libremap:metalerts:en'), 3600);

        $this->getJson('/libremap/weather')->assertOk()->assertJsonPath('stale', true)->assertJsonPath('warnings.0.id', 'alert-1');
    }

    public function testFailureWithoutACachedCopyIsExplicit(): void
    {
        Http::fake(['api.met.no/*' => Http::response('Service unavailable', 503)]);

        $this->getJson('/libremap/weather')->assertStatus(503);
    }

    public function testWarningsCanBeTurnedOff(): void
    {
        Http::fake();
        config(['libremap.weather_warnings' => false]);

        $this->getJson('/libremap/weather')->assertNotFound();
        $this->get('/libremap/world')->assertOk()->assertDontSee('data-weather-endpoint', false);
        Http::assertNothingSent();
    }
}
