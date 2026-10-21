<?php

namespace LibreMap\Weather;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Current weather warnings from MET Norway's MetAlerts API, fetched by the
 * LibreNMS server so browsers never contact MET directly. MET asks clients to
 * identify themselves and not to download repeatedly: responses are cached,
 * and the last good copy is served if MET is unreachable.
 */
class MetAlerts
{
    private const URL = 'https://api.met.no/weatherapi/metalerts/2.0/current.json';
    private const FRESH_SECONDS = 300;
    private const KEEP_SECONDS = 6 * 3600;
    // Bounds what one malformed or unexpected feed can make every browser draw.
    private const MAX_POINTS = 200000;
    private const LEVELS = ['yellow' => 1, 'orange' => 2, 'red' => 3];

    public function current(): array
    {
        $lang = config('libremap.weather_lang', 'en') === 'no' ? 'no' : 'en';
        $key = 'libremap:metalerts:'.$lang;
        $cached = Cache::get($key);
        if (is_array($cached) && ($cached['fetchedAt'] ?? 0) > time() - self::FRESH_SECONDS) {
            return $cached;
        }
        try {
            $response = Http::withHeaders(['User-Agent' => $this->userAgent(), 'Accept' => 'application/json'])
                ->timeout(10)->get(self::URL, ['lang' => $lang])->throw();
            $result = ['fetchedAt' => time(), 'stale' => false, 'warnings' => $this->simplify($response->json())];
            Cache::put($key, $result, self::KEEP_SECONDS);

            return $result;
        } catch (\Throwable $error) {
            report($error);
            if (is_array($cached)) {
                return ['stale' => true] + $cached;
            }
            abort(503, 'Weather warnings are unavailable right now.');
        }
    }

    /** MET's terms ask for an application name and a way to contact its operator. */
    private function userAgent(): string
    {
        $contact = config('libremap.weather_contact');

        return 'LibreMap (+https://github.com/Drakelid/librenms-map)'
            .(is_string($contact) && trim($contact) !== '' ? ' '.preg_replace('/[^\x21-\x7E]/', '', $contact) : '');
    }

    /** Keep only active, drawable warnings, and only the fields the map shows. */
    private function simplify(mixed $data): array
    {
        $features = is_array($data) && is_array($data['features'] ?? null) ? $data['features'] : [];
        $warnings = [];
        $points = 0;
        foreach ($features as $feature) {
            $properties = is_array($feature) ? ($feature['properties'] ?? null) : null;
            $geometry = is_array($feature) ? ($feature['geometry'] ?? null) : null;
            if (! is_array($properties) || ! is_array($geometry) || ($properties['status'] ?? 'Actual') !== 'Actual') {
                continue;
            }
            $level = $this->level($properties);
            $polygons = match ($geometry['type'] ?? null) {
                'Polygon' => [$geometry['coordinates'] ?? null],
                'MultiPolygon' => is_array($geometry['coordinates'] ?? null) ? $geometry['coordinates'] : [],
                default => [],
            };
            $polygons = $this->polygons($polygons, $points);
            if ($level === null || $polygons === []) {
                continue;
            }
            $interval = is_array($feature['when']['interval'] ?? null) ? $feature['when']['interval'] : [];
            $warnings[] = [
                'id' => $this->text($properties['id'] ?? '', 80) ?: md5(json_encode($properties)),
                'level' => $level,
                'event' => $this->text($properties['event'] ?? '', 40),
                'title' => $this->text($properties['eventAwarenessName'] ?? $properties['event'] ?? '', 120) ?: 'Weather warning',
                'area' => $this->text($properties['area'] ?? '', 200),
                'description' => $this->text($properties['description'] ?? '', 1000),
                'instruction' => $this->text($properties['instruction'] ?? '', 1000),
                'consequences' => $this->text($properties['consequences'] ?? '', 1000),
                'start' => $this->time($interval[0] ?? null),
                'end' => $this->time($interval[1] ?? $properties['eventEndingTime'] ?? null),
                'web' => $this->url($properties['web'] ?? null),
                'marine' => ($properties['geographicDomain'] ?? '') === 'marine',
                'polygons' => $polygons,
            ];
        }
        // Draw the most severe warnings last, on top.
        usort($warnings, fn ($a, $b) => self::LEVELS[$a['level']] <=> self::LEVELS[$b['level']]);

        return $warnings;
    }

    private function level(array $properties): ?string
    {
        $color = strtolower(trim((string) ($properties['riskMatrixColor'] ?? '')));
        if (! isset(self::LEVELS[$color])) {
            // awareness_level reads like "2; yellow; Moderate".
            $color = strtolower(trim(explode(';', (string) ($properties['awareness_level'] ?? ''))[1] ?? ''));
        }

        return isset(self::LEVELS[$color]) ? $color : null;
    }

    /** GeoJSON polygons as rings of [lng, lat], rounded to about 10 m. */
    private function polygons(array $polygons, int &$points): array
    {
        $result = [];
        foreach ($polygons as $polygon) {
            $rings = [];
            foreach (array_values(is_array($polygon) ? $polygon : []) as $index => $ring) {
                $clean = [];
                foreach (is_array($ring) ? $ring : [] as $point) {
                    if (is_array($point) && is_numeric($point[0] ?? null) && is_numeric($point[1] ?? null)
                        && abs((float) $point[0]) <= 180 && abs((float) $point[1]) <= 90) {
                        $clean[] = [round((float) $point[0], 4), round((float) $point[1], 4)];
                    }
                }
                $usable = count($clean) >= 4 && ($points += count($clean)) <= self::MAX_POINTS;
                // The first ring is the outline; without it the holes would be drawn as areas.
                if (! $usable && $index === 0) {
                    $rings = [];
                    break;
                }
                if ($usable) {
                    $rings[] = $clean;
                }
            }
            if ($rings !== []) {
                $result[] = $rings;
            }
        }

        return $result;
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

    private function url(mixed $value): ?string
    {
        return is_string($value) && preg_match('#^https://[^\s"\'<>]+$#i', $value) === 1 ? $value : null;
    }
}
