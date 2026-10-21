@extends('layouts.librenmsv1')

@push('styles')
    <link rel="stylesheet" href="{{ asset('vendor/libremap/libremap.css') }}?v={{ $assetVersion }}">
@endpush

@section('content')
    <div id="libremap"
         data-mode="{{ $mode }}"
         data-endpoint="{{ route('libremap.topology') }}"
         data-views-endpoint="{{ route('libremap.views') }}"
         data-maps-endpoint="{{ route('libremap.custom-maps') }}"
         data-devices-endpoint="{{ route('libremap.devices') }}"
         data-locations-endpoint="{{ route('libremap.locations') }}"
         @if (config('libremap.weather_warnings', true)) data-weather-endpoint="{{ route('libremap.weather') }}" @endif
         data-topology-url="{{ route('libremap.index') }}"
         data-world-url="{{ route('libremap.world') }}"
         data-custom-url="{{ route('libremap.custom') }}"
         data-csrf="{{ csrf_token() }}"
         data-home-url="{{ url('/') }}"
         data-storage-key="libremap:{{ auth()->id() }}"
         data-host-theme="true">
        <p role="status">Loading network topology…</p>
    </div>
    <script type="module" src="{{ asset('vendor/libremap/libremap.js') }}?v={{ $assetVersion }}"></script>
@endsection
