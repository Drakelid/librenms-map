<?php

namespace LibreMap\Http;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;
use LibreMap\Power\DriftException;
use LibreMap\Power\DriftPowerOutages;

/**
 * The browser's view of DRIFT's power-outage API. Requests go from the
 * LibreNMS server to DRIFT with the server's token; browsers only ever see
 * these routes and the simplified answers.
 */
class PowerOutageController extends Controller
{
    /** Current and planned outages with their areas, for the world map. */
    public function outages(Request $request, DriftPowerOutages $drift): JsonResponse
    {
        abort_unless(DriftPowerOutages::enabled(), 404);
        $filters = $this->filters($request);

        return $this->answer(function () use ($drift, $filters): array {
            $shapes = $drift->outagesGeoJson($filters['kind'], null, $filters['provider']);
            // The GeoJSON carries no completeness flag; the outage list does.
            $list = $drift->outages($filters['kind'], null, $filters['provider']);

            return $shapes + ['count' => $list['count'], 'complete' => $list['complete']];
        });
    }

    /** Whether a place is inside or near an outage on the operators' maps. */
    public function outageAt(Request $request, DriftPowerOutages $drift): JsonResponse
    {
        abort_unless(DriftPowerOutages::enabled(), 404);
        $valid = $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lon' => ['required', 'numeric', 'between:-180,180'],
            'radius_km' => ['nullable', 'numeric', 'between:0,50'],
            'provider' => ['nullable', Rule::in(DriftPowerOutages::PROVIDERS)],
        ]);

        return $this->answer(fn () => $drift->outageAt(
            (float) $valid['lat'], (float) $valid['lon'], null,
            isset($valid['radius_km']) ? (float) $valid['radius_km'] : null, $valid['provider'] ?? null,
        ));
    }

    /** When each operator's map was last read, and any read errors. */
    public function health(DriftPowerOutages $drift): JsonResponse
    {
        abort_unless(DriftPowerOutages::enabled(), 404);

        return $this->answer(fn () => $drift->health());
    }

    /** @return array{kind: ?string, provider: ?string} */
    private function filters(Request $request): array
    {
        $valid = $request->validate([
            'kind' => ['nullable', Rule::in(DriftPowerOutages::KINDS)],
            'provider' => ['nullable', Rule::in(DriftPowerOutages::PROVIDERS)],
        ]);

        return ['kind' => $valid['kind'] ?? 'all', 'provider' => $valid['provider'] ?? null];
    }

    private function answer(callable $read): JsonResponse
    {
        try {
            return response()->json($read())->header('Cache-Control', 'private, max-age=60');
        } catch (DriftException $error) {
            // Its message is safe to log and to show; it never carries the token.
            report($error);
            abort($error->status, $error->getMessage());
        }
    }
}
