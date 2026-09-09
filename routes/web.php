<?php

use Illuminate\Support\Facades\Route;
use LibreMap\Http\EnsurePluginEnabled;
use LibreMap\Http\TopologyController;
use LibreMap\Http\ViewController;

// The topology query is expensive; throttle it well above the 60-second
// client poll so a stuck tab cannot hammer the host database.
Route::middleware(['web', 'auth', EnsurePluginEnabled::class, 'throttle:120,1'])->group(function (): void {
    Route::get('/libremap', [TopologyController::class, 'index'])->name('libremap.index');
    Route::get('/libremap/topology', [TopologyController::class, 'topology'])->name('libremap.topology');
    Route::get('/libremap/views', [ViewController::class, 'index'])->name('libremap.views');
    Route::post('/libremap/views', [ViewController::class, 'store']);
    Route::put('/libremap/views/{id}', [ViewController::class, 'update'])->whereUuid('id');
    Route::delete('/libremap/views/{id}', [ViewController::class, 'destroy'])->whereUuid('id');
});
