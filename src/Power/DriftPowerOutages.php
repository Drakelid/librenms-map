<?php

namespace LibreMap\Power;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Sleep;

/**
 * Power outages on the Norwegian grid operators' maps (Fagne, BKK, Glitre
 * Nett, Lyse Elnett), read through DRIFT's power-outage API by the LibreNMS
 * server. The DRIFT token stays on the server: it is read from config, sent
 * only to DRIFT, and never logged, cached or passed to the browser.
 *
 * DRIFT reads the operators' maps every five minutes, so answers are cached
 * for a minute, keyed by path and query.
 */
class DriftPowerOutages
{
    public const KINDS = ['current', 'planned', 'all'];
    public const PROVIDERS = ['fagne', 'bkk', 'glitre', 'lyse'];
    public const VERDICTS = ['in_outage_area', 'near_outage', 'no_known_outage'];
    private const CACHE_SECONDS = 60;
    private const TIMEOUT_SECONDS = 30;
    private const RETRY_DELAY_MS = 500;
    // Bounds what one malformed or unexpected answer can make every browser draw.
    private const MAX_POINTS = 200000;

    /** The feature is on once DRIFT's address is set; a missing token is then reported, not hidden. */
    public static function enabled(): bool
    {
        return self::baseUrl() !== '';
    }

    /** @return array{outages: list<array>, count: int, kind: string, complete: bool, evidence: array} */
    public function outages(?string $kind = null, ?string $municipality = null, ?string $provider = null): array
    {
        $data = $this->get('/outages', ['kind' => $kind, 'municipality' => $municipality, 'provider' => $provider]);
        $outages = $this->outageList($data['outages'] ?? null, 300);

        return [
            'outages' => $outages,
            'count' => is_int($data['count'] ?? null) ? $data['count'] : count($outages),
            'kind' => in_array($data['kind'] ?? null, self::KINDS, true) ? $data['kind'] : ($kind ?? 'all'),
            'complete' => ($data['complete'] ?? false) === true,
            'evidence' => $this->evidence($data['evidence'] ?? null),
        ];
    }

    /**
     * Outages with their affected areas, lines or point, as plain shapes of
     * [lon, lat] points rather than raw GeoJSON.
     *
     * @return array{outages: list<array>, evidence: array}
     */
    public function outagesGeoJson(?string $kind = null, ?string $municipality = null, ?string $provider = null): array
    {
        $data = $this->get('/outages.geojson', ['kind' => $kind, 'municipality' => $municipality, 'provider' => $provider]);
        if (($data['type'] ?? null) !== 'FeatureCollection' || ! is_array($data['features'] ?? null)) {
            throw new DriftException('The outage service returned an unexpected response.', 502);
        }
        $outages = [];
        $points = 0;
        foreach ($data['features'] as $feature) {
            $properties = is_array($feature) && is_array($feature['properties'] ?? null) ? $feature['properties'] : null;
            $outage = $properties === null ? null : $this->outage($properties);
            if ($outage === null) {
                continue;
            }
            $shape = $this->shape(is_array($feature['geometry'] ?? null) ? $feature['geometry'] : [], $points);
            // A Point geometry places the outage when its properties give no point.
            $outage['point'] ??= $shape['point'];
            $outage['polygons'] = $shape['polygons'];
            $outage['lines'] = $shape['lines'];
            if ($outage['polygons'] === [] && $outage['lines'] === [] && $outage['point'] === null) {
                continue;
            }
            $outages[] = $outage;
        }

        return ['outages' => $this->uniqueIds($outages), 'evidence' => $this->evidence($data['evidence'] ?? null)];
    }

    /** @return array{verdict: string, why: string, at: ?string, coordinates: ?array, outages: list<array>, evidence: array} */
    public function outageAt(float $lat, float $lon, ?string $at = null, ?float $radiusKm = null, ?string $provider = null): array
    {
        $data = $this->get('/outage-at', [
            'lat' => round($lat, 5), 'lon' => round($lon, 5), 'at' => $at,
            'radius_km' => $radiusKm, 'provider' => $provider,
        ]);
        if (! in_array($data['verdict'] ?? null, self::VERDICTS, true)) {
            throw new DriftException('The outage service returned an unexpected response.', 502);
        }
        $outages = [];
        foreach (is_array($data['outages'] ?? null) ? array_slice($data['outages'], 0, 100) : [] as $item) {
            $outage = is_array($item) ? $this->outage($item) : null;
            if ($outage !== null) {
                $outages[] = $outage + ['distance_km' => is_numeric($item['distance_km'] ?? null) ? round((float) $item['distance_km'], 2) : null];
            }
        }

        return [
            'verdict' => $data['verdict'],
            'why' => $this->text($data['why'] ?? '', 500),
            'at' => $this->time($data['at'] ?? null),
            'coordinates' => $this->point($data['coordinates'] ?? null),
            'outages' => $this->uniqueIds($outages),
            'evidence' => $this->evidence($data['evidence'] ?? null),
        ];
    }

    /** @return array{hours: int, outages: list<array>, count: int, history_kept_days: ?int, evidence: array} */
    public function history(?int $hours = null, ?string $municipality = null, ?string $provider = null): array
    {
        $data = $this->get('/history', ['hours' => $hours, 'municipality' => $municipality, 'provider' => $provider]);
        $outages = $this->outageList($data['outages'] ?? null, 200);

        return [
            'hours' => is_int($data['hours'] ?? null) ? $data['hours'] : ($hours ?? 24),
            'outages' => $outages,
            'count' => is_int($data['count'] ?? null) ? $data['count'] : count($outages),
            'history_kept_days' => is_int($data['history_kept_days'] ?? null) ? $data['history_kept_days'] : null,
            'evidence' => $this->evidence($data['evidence'] ?? null),
        ];
    }

    /** @return array{status: string, poll_seconds: ?int, providers: array<string, array>} */
    public function health(): array
    {
        $data = $this->get('/health', []);
        if (! in_array($data['status'] ?? null, ['ok', 'not_read_yet'], true)) {
            throw new DriftException('The outage service returned an unexpected response.', 502);
        }
        $providers = [];
        foreach (is_array($data['providers'] ?? null) ? $data['providers'] : [] as $key => $provider) {
            if (! is_string($key) || ! is_array($provider)) {
                continue;
            }
            $providers[$this->text($key, 40)] = [
                'name' => $this->text($provider['name'] ?? $key, 80),
                'fetched_at' => $this->time($provider['fetched_at'] ?? null),
                'last_error' => $this->text($provider['last_error'] ?? '', 300) ?: null,
                'last_error_at' => $this->time($provider['last_error_at'] ?? null),
            ];
        }

        return [
            'status' => $data['status'],
            'poll_seconds' => is_int($data['poll_seconds'] ?? null) ? $data['poll_seconds'] : null,
            'providers' => $providers,
        ];
    }

    // ---- Transport ----------------------------------------------------------

    private static function baseUrl(): string
    {
        $url = config('libremap.drift_url');

        return is_string($url) ? rtrim(trim($url), '/') : '';
    }

    /** One GET, cached for a minute; retried once on a network error or a 503, never on 400 or 401. */
    private function get(string $path, array $query): array
    {
        $base = self::baseUrl();
        $token = config('libremap.drift_token');
        if ($base === '') {
            throw new DriftException('The DRIFT power-outage API is not configured.', 404);
        }
        if (! is_string($token) || trim($token) === '') {
            throw new DriftException('The DRIFT token is missing or wrong.', 502);
        }
        $query = array_filter($query, fn ($value) => $value !== null && $value !== '');
        ksort($query);
        // The token is never part of the key, so it never reaches the cache store.
        $key = 'libremap:drift:'.sha1($base.$path.'?'.http_build_query($query));
        $cached = Cache::get($key);
        if (is_array($cached)) {
            return $cached;
        }

        for ($attempt = 1; ; $attempt++) {
            try {
                $response = Http::withToken(trim($token))->acceptJson()->timeout(self::TIMEOUT_SECONDS)
                    ->withUserAgent('LibreMap (+https://github.com/Drakelid/librenms-map)')
                    ->get($base.$path, $query);
            } catch (ConnectionException) {
                if ($attempt < 2) {
                    Sleep::for(self::RETRY_DELAY_MS)->milliseconds();
                    continue;
                }
                throw new DriftException('The outage service is unavailable: DRIFT could not be reached.', 503);
            }
            if ($response->status() === 503 && $attempt < 2) {
                Sleep::for(self::RETRY_DELAY_MS)->milliseconds();
                continue;
            }
            break;
        }

        $data = $this->decode($response);
        Cache::put($key, $data, self::CACHE_SECONDS);

        return $data;
    }

    private function decode(Response $response): array
    {
        $status = $response->status();
        if ($status === 401) {
            throw new DriftException('The DRIFT token is missing or wrong.', 502);
        }
        if ($status === 503) {
            throw new DriftException('The outage service is unavailable: DRIFT cannot reach the grid operators\' maps.', 503);
        }
        if ($status === 400) {
            $detail = $this->text(is_array($response->json()) ? ($response->json()['detail'] ?? '') : '', 300);

            throw new DriftException($detail !== '' ? 'DRIFT rejected the request: '.$detail : 'DRIFT rejected the request.', 422);
        }
        if (! $response->successful()) {
            throw new DriftException("The outage service returned HTTP {$status}.", 502);
        }
        $data = $response->json();
        if (! is_array($data)) {
            throw new DriftException('The outage service returned an unexpected response.', 502);
        }

        return $data;
    }

    // ---- Validation ---------------------------------------------------------

    private function outageList(mixed $items, int $max): array
    {
        $outages = [];
        foreach (is_array($items) ? array_slice($items, 0, $max) : [] as $item) {
            $outage = is_array($item) ? $this->outage($item) : null;
            if ($outage !== null) {
                $outages[] = $outage;
            }
        }

        return $this->uniqueIds($outages);
    }

    /** The outage fields the map uses, typed; a field DRIFT leaves out or nulls is null. */
    private function outage(array $o): ?array
    {
        $kind = $o['kind'] ?? null;
        if ($kind !== 'current' && $kind !== 'planned') {
            return null;
        }
        $optional = fn (string $field, int $max) => $this->text($o[$field] ?? '', $max) ?: null;

        return [
            'id' => $this->text($o['id'] ?? '', 120),
            'provider' => $this->text($o['provider'] ?? '', 80) ?: 'Grid operator',
            'kind' => $kind,
            'state' => $optional('state', 80),
            'type' => $optional('type', 80),
            'municipality' => $optional('municipality', 120),
            'customers' => is_numeric($o['customers'] ?? null) && $o['customers'] >= 0 ? (int) $o['customers'] : null,
            'text' => $optional('text', 1000),
            'grid_level' => $optional('grid_level', 80),
            'reason' => $optional('reason', 300),
            'start' => $this->time($o['start'] ?? null),
            'expected_end' => $this->time($o['expected_end'] ?? null),
            'ended_at' => $this->time($o['ended_at'] ?? null),
            'first_seen' => $this->time($o['first_seen'] ?? null),
            'last_seen' => $this->time($o['last_seen'] ?? null),
            'gone_at' => $this->time($o['gone_at'] ?? null),
            'point' => $this->point($o['point'] ?? null),
            'has_area' => ($o['has_area'] ?? false) === true,
        ];
    }

    /** Outage IDs can be missing or repeat across operators; the map needs each one unique. */
    private function uniqueIds(array $outages): array
    {
        $seen = [];
        foreach ($outages as $index => $outage) {
            $id = $outage['id'] !== '' ? $outage['provider'].':'.$outage['id'] : 'outage-'.$index;
            while (isset($seen[$id])) {
                $id .= '+';
            }
            $seen[$id] = true;
            $outages[$index]['id'] = $id;
        }

        return array_values($outages);
    }

    /** A GeoJSON geometry as polygons (rings of [lon, lat]), lines, or a point. */
    private function shape(array $geometry, int &$points): array
    {
        $coordinates = is_array($geometry['coordinates'] ?? null) ? $geometry['coordinates'] : [];
        $shape = ['polygons' => [], 'lines' => [], 'point' => null];
        switch ($geometry['type'] ?? null) {
            case 'Polygon':
                $coordinates = [$coordinates];
                // no break
            case 'MultiPolygon':
                foreach ($coordinates as $polygon) {
                    $rings = [];
                    foreach (array_values(is_array($polygon) ? $polygon : []) as $index => $ring) {
                        $clean = $this->line($ring, 4, $points);
                        // The first ring is the outline; without it the holes would be drawn as areas.
                        if ($clean === [] && $index === 0) {
                            break;
                        }
                        if ($clean !== []) {
                            $rings[] = $clean;
                        }
                    }
                    if ($rings !== []) {
                        $shape['polygons'][] = $rings;
                    }
                }
                break;
            case 'LineString':
                $coordinates = [$coordinates];
                // no break
            case 'MultiLineString':
                foreach ($coordinates as $line) {
                    $clean = $this->line($line, 2, $points);
                    if ($clean !== []) {
                        $shape['lines'][] = $clean;
                    }
                }
                break;
            case 'Point':
                $shape['point'] = $this->point($coordinates);
                break;
        }

        return $shape;
    }

    /** Valid [lon, lat] points rounded to about 10 m, or nothing when too few remain or the budget is spent. */
    private function line(mixed $points, int $minimum, int &$budget): array
    {
        $clean = [];
        foreach (is_array($points) ? $points : [] as $point) {
            $point = $this->point($point);
            if ($point !== null) {
                $clean[] = $point;
            }
        }
        if (count($clean) < $minimum || ($budget += count($clean)) > self::MAX_POINTS) {
            return [];
        }

        return $clean;
    }

    private function point(mixed $point): ?array
    {
        return is_array($point) && is_numeric($point[0] ?? null) && is_numeric($point[1] ?? null)
            && abs((float) $point[0]) <= 180 && abs((float) $point[1]) <= 90
            ? [round((float) $point[0], 4), round((float) $point[1], 4)] : null;
    }

    private function evidence(mixed $evidence): array
    {
        $evidence = is_array($evidence) ? $evidence : [];
        $limitations = [];
        foreach (is_array($evidence['limitations'] ?? null) ? array_slice($evidence['limitations'], 0, 20) : [] as $limitation) {
            $text = $this->text($limitation, 300);
            if ($text !== '') {
                $limitations[] = $text;
            }
        }

        return [
            'source' => $this->text($evidence['source'] ?? '', 120) ?: 'DRIFT',
            'retrieved_at' => $this->time($evidence['retrieved_at'] ?? null),
            'observed_at' => $this->time($evidence['observed_at'] ?? null),
            'limitations' => $limitations,
        ];
    }

    private function text(mixed $value, int $max): string
    {
        return is_string($value) || is_numeric($value) ? mb_substr(trim((string) $value), 0, $max) : '';
    }

    private function time(mixed $value): ?string
    {
        $time = is_string($value) ? strtotime($value) : false;

        return $time === false ? null : gmdate('c', $time);
    }
}
