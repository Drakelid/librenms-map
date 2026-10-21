<?php

use Illuminate\Support\Facades\Route;
use LibreMap\Http\CustomMapController;
use LibreMap\Http\EnsurePluginEnabled;
use LibreMap\Http\TopologyController;
use LibreMap\Http\ViewController;
use LibreMap\Http\WeatherController;

// The topology query is expensive; the named limiter (LibreMapServiceProvider)
// allows well above the 60-second client poll so a stuck tab cannot hammer the
// host database, on a counter separate from other LibreNMS routes.
Route::middleware(['web', 'auth', EnsurePluginEnabled::class, 'throttle:libremap'])->group(function (): void {
    Route::get('/libremap', [TopologyController::class, 'index'])->name('libremap.index');
    Route::get('/libremap/topology', [TopologyController::class, 'topology'])->name('libremap.topology');
    Route::get('/libremap/views', [ViewController::class, 'index'])->name('libremap.views');
    Route::post('/libremap/views', [ViewController::class, 'store']);
    Route::put('/libremap/views/{id}', [ViewController::class, 'update'])->whereUuid('id');
    Route::delete('/libremap/views/{id}', [ViewController::class, 'destroy'])->whereUuid('id');

    Route::get('/libremap/world', [TopologyController::class, 'world'])->name('libremap.world');
    Route::get('/libremap/locations', [TopologyController::class, 'locations'])->name('libremap.locations');
    Route::get('/libremap/weather', [WeatherController::class, 'index'])->name('libremap.weather');
    Route::get('/libremap/custom', [TopologyController::class, 'custom'])->name('libremap.custom');
    Route::get('/libremap/devices', [CustomMapController::class, 'devices'])->name('libremap.devices');
    Route::get('/libremap/devices/{id}/ports', [CustomMapController::class, 'ports'])->where('id', '[1-9][0-9]{0,9}');
    Route::get('/libremap/custom-maps', [CustomMapController::class, 'index'])->name('libremap.custom-maps');
    Route::post('/libremap/custom-maps', [CustomMapController::class, 'store']);
    Route::get('/libremap/custom-maps/{id}', [CustomMapController::class, 'show'])->whereUuid('id');
    Route::put('/libremap/custom-maps/{id}', [CustomMapController::class, 'update'])->whereUuid('id');
    Route::delete('/libremap/custom-maps/{id}', [CustomMapController::class, 'destroy'])->whereUuid('id');
});
