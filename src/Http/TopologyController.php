<?php

namespace LibreMap\Http;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\View\View;
use LibreMap\Topology\LibreNmsTopology;

class TopologyController extends Controller
{
    public function index(): View
    {
        return view('libremap::map', ['pagetitle' => 'LibreMap', 'assetVersion' => $this->assetVersion()]);
    }

    public function topology(Request $request, LibreNmsTopology $topology): JsonResponse
    {
        return response()->json($topology->forUser($request->user()))
            ->header('Cache-Control', 'private, no-store');
    }

    /** Changes whenever vendor:publish copies a new bundle, so browsers drop a cached one. */
    private function assetVersion(): string
    {
        $bundle = public_path('vendor/libremap/libremap.js');

        return is_file($bundle) ? (string) filemtime($bundle) : '0';
    }
}
