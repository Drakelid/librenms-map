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
        return view('libremap::map', ['pagetitle' => 'LibreMap']);
    }

    public function topology(Request $request, LibreNmsTopology $topology): JsonResponse
    {
        return response()->json($topology->forUser($request->user()))
            ->header('Cache-Control', 'private, no-store');
    }
}
