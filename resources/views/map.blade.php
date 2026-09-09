@extends('layouts.librenmsv1')

@section('content')
    <link rel="stylesheet" href="{{ asset('vendor/libremap/libremap.css') }}">
    <div id="libremap"
         data-endpoint="{{ route('libremap.topology') }}"
         data-views-endpoint="{{ route('libremap.views') }}"
         data-csrf="{{ csrf_token() }}"
         data-home-url="{{ url('/') }}"
         data-storage-key="libremap:{{ auth()->id() }}">
        <p role="status">Loading network topology…</p>
    </div>
    <script type="module" src="{{ asset('vendor/libremap/libremap.js') }}"></script>
@endsection
