<?php

namespace LibreMap\Tests\Host;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Log\Events\MessageLogged;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Sleep;
use LibreMap\Power\DriftPowerOutages;
use LibreNMS\Interfaces\Plugins\PluginManagerInterface;
use LibreNMS\Tests\TestCase;
use Mockery;

/** DRIFT is faked: these tests never contact a real DRIFT server. */
class PowerOutagesIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    private const BASE = 'http://drift.test/api/power-outages';
    private const TOKEN = 'drift-test-token-7f3a9c';

    protected function setUp(): void
    {
        parent::setUp();
        $manager = Mockery::mock(PluginManagerInterface::class);
        $manager->shouldReceive('pluginEnabled')->with('libremap')->andReturn(true);
        $this->app->instance(PluginManagerInterface::class, $manager);
        require __DIR__.'/../../routes/web.php';
        // Routes added after boot are not in the name lookup that route() reads until it is refreshed.
        $this->app['router']->getRoutes()->refreshNameLookups();
        // The provider registers the views only when the plugin was enabled at boot; here it is enabled afterwards.
        $this->app['view']->addNamespace('libremap', __DIR__.'/../../resources/views');
        config(['libremap.drift_url' => self::BASE.'/', 'libremap.drift_token' => self::TOKEN]);
        Cache::flush();
        Sleep::fake();
        $this->actingAs(User::factory()->create(['enabled' => 1]));
    }

    private function evidence(): array
    {
        return ['source' => 'DRIFT', 'retrieved_at' => '2026-10-22T12:06:00+00:00', 'observed_at' => '2026-10-22T12:05:00+00:00', 'limitations' => ['L-nett map is stale']];
    }

    private function outage(array $fields = []): array
    {
        return $fields + [
            'provider' => 'BKK', 'kind' => 'current', 'id' => '1001', 'state' => 'active', 'type' => 'fault',
            'municipality' => 'Bergen', 'customers' => 120, 'text' => 'Fault on the line.', 'grid_level' => 'distribution',
            'reason' => null, 'start' => '2026-10-22T11:40:00+02:00', 'expected_end' => '2026-10-22T15:00:00+02:00',
            'ended_at' => null, 'first_seen' => '2026-10-22T09:41:00Z', 'last_seen' => '2026-10-22T12:05:00Z',
            'gone_at' => null, 'point' => [5.32, 60.39], 'has_area' => true,
        ];
    }

    private function geojson(): array
    {
        $square = [[[5.0, 60.0], [6.0, 60.0], [6.0, 61.0], [5.0, 61.0], [5.0, 60.0]]];

        return ['type' => 'FeatureCollection', 'evidence' => $this->evidence(), 'features' => [
            ['type' => 'Feature', 'geometry' => ['type' => 'MultiPolygon', 'coordinates' => [$square]], 'properties' => $this->outage()],
            ['type' => 'Feature', 'geometry' => ['type' => 'MultiLineString', 'coordinates' => [[[5.1, 59.4], [5.3, 59.5]]]],
                'properties' => $this->outage(['provider' => 'Fagne', 'id' => '77', 'kind' => 'planned', 'point' => null])],
            ['type' => 'Feature', 'geometry' => ['type' => 'Point', 'coordinates' => [10.2, 59.7]],
                'properties' => $this->outage(['provider' => 'Glitre Nett', 'id' => null, 'point' => null, 'has_area' => false])],
            ['type' => 'Feature', 'geometry' => ['type' => 'Point', 'coordinates' => [10.2, 59.7]],
                'properties' => $this->outage(['id' => 'restored', 'kind' => 'restored'])],
        ]];
    }

    private function fakeOutages(): void
    {
        Http::fake([
            'drift.test/api/power-outages/outages.geojson*' => Http::response($this->geojson()),
            'drift.test/api/power-outages/outages?*' => Http::response(['outages' => [$this->outage()], 'count' => 3, 'kind' => 'all', 'complete' => false, 'evidence' => $this->evidence()]),
        ]);
    }

    public function testOutagesAreSimplifiedCachedAndAuthenticated(): void
    {
        $this->fakeOutages();

        $response = $this->getJson('/libremap/power/outages')->assertOk()
            ->assertJsonPath('complete', false)->assertJsonPath('count', 3)
            ->assertJsonPath('evidence.observed_at', '2026-10-22T12:05:00+00:00')
            ->assertJsonPath('evidence.limitations.0', 'L-nett map is stale');
        $outages = $response->json('outages');

        // An unknown kind is dropped; IDs are made unique across operators.
        $this->assertSame(['BKK:1001', 'Fagne:77', 'outage-2'], array_column($outages, 'id'));
        $this->assertEquals([[[[5.0, 60.0], [6.0, 60.0], [6.0, 61.0], [5.0, 61.0], [5.0, 60.0]]]], $outages[0]['polygons']);
        $this->assertEquals([[[5.1, 59.4], [5.3, 59.5]]], $outages[1]['lines']);
        $this->assertSame('planned', $outages[1]['kind']);
        // A Point geometry places an outage whose properties give no point.
        $this->assertEquals([10.2, 59.7], $outages[2]['point']);
        $this->assertSame(120, $outages[0]['customers']);
        $this->assertSame('2026-10-22T09:40:00+00:00', $outages[0]['start']);
        $this->assertNull($outages[0]['reason']);

        // A second request within a minute is served from the cache.
        $this->getJson('/libremap/power/outages')->assertOk();
        Http::assertSentCount(2);
        Http::assertSent(fn (Request $request) => str_starts_with($request->url(), self::BASE.'/outages.geojson?')
            && str_contains($request->url(), 'kind=all')
            && $request->header('Authorization') === ['Bearer '.self::TOKEN]
            && $request->method() === 'GET');

        // The cache is keyed by query: another kind is a new request.
        $this->getJson('/libremap/power/outages?kind=current')->assertOk();
        Http::assertSentCount(4);
        Http::assertSent(fn (Request $request) => str_contains($request->url(), 'outages.geojson?kind=current'));

        // Bad filters are rejected before DRIFT is asked.
        $this->getJson('/libremap/power/outages?kind=yesterday')->assertStatus(422);
        $this->getJson('/libremap/power/outages?provider=elvia')->assertStatus(422);
        Http::assertSentCount(4);
    }

    public function testLocationChecksAndHealthAreParsed(): void
    {
        Http::fake([
            'drift.test/api/power-outages/outage-at*' => Http::response([
                'verdict' => 'near_outage', 'why' => 'An outage 1.25 km away.', 'at' => '2026-10-22T12:06:00Z',
                'coordinates' => [5.32, 60.39], 'outages' => [$this->outage(['distance_km' => 1.2512])], 'evidence' => $this->evidence(),
            ]),
            'drift.test/api/power-outages/health' => Http::response(['status' => 'ok', 'poll_seconds' => 300, 'providers' => [
                'fagne' => ['name' => 'Fagne', 'fetched_at' => '2026-10-22T12:05:00Z', 'last_error' => null, 'last_error_at' => null],
                'lyse' => ['name' => 'Lyse Elnett', 'fetched_at' => '2026-10-22T11:00:00Z', 'last_error' => 'HTTP 502 from map', 'last_error_at' => '2026-10-22T12:05:00Z'],
            ]]),
        ]);

        $this->getJson('/libremap/power/outage-at?lat=60.39&lon=5.32&radius_km=5')->assertOk()
            ->assertJsonPath('verdict', 'near_outage')->assertJsonPath('why', 'An outage 1.25 km away.')
            ->assertJsonPath('outages.0.distance_km', 1.25)->assertJsonPath('outages.0.id', 'BKK:1001')
            ->assertJsonPath('coordinates', [5.32, 60.39]);
        Http::assertSent(fn (Request $request) => str_starts_with($request->url(), self::BASE.'/outage-at?')
            && str_contains($request->url(), 'lat=60.39') && str_contains($request->url(), 'lon=5.32') && str_contains($request->url(), 'radius_km=5'));

        foreach (['lat=95&lon=5', 'lat=60', 'lat=60&lon=5&radius_km=80', 'lat=60&lon=5&provider=elvia'] as $query) {
            $this->getJson('/libremap/power/outage-at?'.$query)->assertStatus(422);
        }

        $this->getJson('/libremap/power/health')->assertOk()
            ->assertJsonPath('status', 'ok')->assertJsonPath('poll_seconds', 300)
            ->assertJsonPath('providers.lyse.name', 'Lyse Elnett')
            ->assertJsonPath('providers.lyse.last_error', 'HTTP 502 from map')
            ->assertJsonPath('providers.fagne.last_error', null);
        Http::assertSentCount(2);
    }

    public function testHistoryIsParsed(): void
    {
        Http::fake(['drift.test/api/power-outages/history*' => Http::response([
            'hours' => 48, 'count' => 1, 'history_kept_days' => 30, 'evidence' => $this->evidence(),
            'outages' => [$this->outage(['ended_at' => '2026-10-21T18:00:00Z', 'gone_at' => '2026-10-21T18:05:00Z']), 'junk'],
        ])]);

        $history = app(DriftPowerOutages::class)->history(48, 'berg', 'bkk');

        $this->assertSame(48, $history['hours']);
        $this->assertSame(30, $history['history_kept_days']);
        $this->assertCount(1, $history['outages']);
        $this->assertSame('2026-10-21T18:05:00+00:00', $history['outages'][0]['gone_at']);
        Http::assertSent(fn (Request $request) => str_contains($request->url(), '/history?')
            && str_contains($request->url(), 'hours=48') && str_contains($request->url(), 'municipality=berg') && str_contains($request->url(), 'provider=bkk'));
    }

    public function testAWrongTokenIsExplainedAndNotRetried(): void
    {
        Http::fake(['drift.test/*' => Http::response(['detail' => 'Invalid token'], 401)]);

        $this->getJson('/libremap/power/health')->assertStatus(502)
            ->assertJsonPath('message', 'The DRIFT token is missing or wrong.');
        Http::assertSentCount(1);
    }

    public function testABadParameterIsExplainedAndNotRetried(): void
    {
        Http::fake(['drift.test/*' => Http::response(['detail' => 'at must be an ISO 8601 time'], 400)]);

        $this->getJson('/libremap/power/outage-at?lat=60&lon=5')->assertStatus(422)
            ->assertJsonPath('message', 'DRIFT rejected the request: at must be an ISO 8601 time');
        Http::assertSentCount(1);
    }

    public function testUnavailableIsRetriedOnceAndNotCached(): void
    {
        Http::fake(['drift.test/*' => Http::sequence()
            ->push(['detail' => 'Outage service unreachable'], 503)
            ->push(['detail' => 'Outage service unreachable'], 503)
            ->push(['status' => 'ok', 'poll_seconds' => 300, 'providers' => []])]);

        $this->getJson('/libremap/power/health')->assertStatus(503)
            ->assertJsonPath('message', 'The outage service is unavailable: DRIFT cannot reach the grid operators\' maps.');
        Http::assertSentCount(2);
        Sleep::assertSleptTimes(1);

        // The failure is not cached: the next request asks DRIFT again.
        $this->getJson('/libremap/power/health')->assertOk()->assertJsonPath('status', 'ok');
        Http::assertSentCount(3);
    }

    public function testANetworkErrorIsRetriedOnce(): void
    {
        $calls = 0;
        Http::fake(function () use (&$calls) {
            if (++$calls === 1) {
                throw new ConnectionException('cURL error 7: Failed to connect to drift.test');
            }

            return Http::response(['status' => 'not_read_yet', 'poll_seconds' => 300, 'providers' => []]);
        });

        $this->getJson('/libremap/power/health')->assertOk()->assertJsonPath('status', 'not_read_yet');
        $this->assertSame(2, $calls);
    }

    public function testRepeatedNetworkErrorsAreUnavailable(): void
    {
        $calls = 0;
        Http::fake(function () use (&$calls) {
            $calls++;

            throw new ConnectionException('cURL error 28: Operation timed out');
        });

        $this->getJson('/libremap/power/health')->assertStatus(503)
            ->assertJsonPath('message', 'The outage service is unavailable: DRIFT could not be reached.');
        $this->assertSame(2, $calls);
    }

    public function testTheTokenNeverReachesTheBrowserOrTheLogs(): void
    {
        $logged = [];
        // What a log line carries: the message, and any exception's message and trace.
        Event::listen(MessageLogged::class, function (MessageLogged $event) use (&$logged): void {
            $context = array_map(fn ($value) => $value instanceof \Throwable
                ? get_class($value).': '.$value->getMessage()."\n".$value->getTraceAsString()
                : json_encode($value), $event->context);
            $logged[] = $event->message.' '.implode(' ', $context);
        });
        Http::fake([
            'drift.test/api/power-outages/health' => Http::response(['detail' => 'Invalid token'], 401),
            'drift.test/api/power-outages/outage-at*' => Http::response(['detail' => 'Outage service unreachable'], 503),
            'drift.test/*' => Http::response($this->geojson() + ['outages' => [], 'count' => 0, 'complete' => true]),
        ]);

        $page = $this->get('/libremap/world')->assertOk()->assertSee('data-power-endpoint', false);
        $bodies = [
            $page->getContent(),
            $this->getJson('/libremap/power/outages')->assertOk()->getContent(),
            $this->getJson('/libremap/power/health')->assertStatus(502)->getContent(),
            $this->getJson('/libremap/power/outage-at?lat=60&lon=5')->assertStatus(503)->getContent(),
        ];

        foreach ($bodies as $body) {
            $this->assertStringNotContainsString(self::TOKEN, $body);
            $this->assertStringNotContainsString('drift.test', $body);
        }
        // The failures were reported, without the token.
        $this->assertNotEmpty($logged);
        foreach ($logged as $line) {
            $this->assertStringNotContainsString(self::TOKEN, $line);
        }
    }

    public function testAMissingTokenIsExplainedAndNothingIsSent(): void
    {
        Http::fake();
        config(['libremap.drift_token' => '  ']);

        $this->getJson('/libremap/power/health')->assertStatus(502)
            ->assertJsonPath('message', 'The DRIFT token is missing or wrong.');
        Http::assertNothingSent();
    }

    public function testPowerOutagesAreOffWithoutAUrl(): void
    {
        Http::fake();
        config(['libremap.drift_url' => null]);

        $this->getJson('/libremap/power/outages')->assertNotFound();
        $this->getJson('/libremap/power/outage-at?lat=60&lon=5')->assertNotFound();
        $this->getJson('/libremap/power/health')->assertNotFound();
        $this->get('/libremap/world')->assertOk()->assertDontSee('data-power-endpoint', false);
        Http::assertNothingSent();
    }
}
