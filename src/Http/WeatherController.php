<?php

namespace LibreMap\Http;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use LibreMap\Weather\MetAlerts;

class WeatherController extends Controller
{
    public function index(MetAlerts $alerts): JsonResponse
    {
        abort_unless(config('libremap.weather_warnings', true), 404);
        $current = $alerts->current();

        return response()->json([
            'source' => 'MET Norway',
            'attribution' => 'Weather warnings © MET Norway',
            'fetchedAt' => $current['fetchedAt'],
            'stale' => $current['stale'] ?? false,
            'warnings' => $current['warnings'],
        ])->header('Cache-Control', 'private, max-age=60');
    }
}
