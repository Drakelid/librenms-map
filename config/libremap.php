<?php

return [
    // Hostname prefixes stripped before classification, e.g. ['hk-'].
    'prefixes' => [],
    'stale_after' => 900,
    // Device ID => ['role' => 'AGG'|'ER'|'OTHER', 'site' => 'rossa1'].
    'overrides' => [],
    // Fail explicitly instead of displaying a silently truncated topology.
    'max_devices' => 2000,
    'max_links' => 10000,
    // World map tiles. null follows LibreNMS's leaflet.tile_url; '' disables
    // tiles (devices still show on a plain background); or a full template
    // such as 'https://tiles.example.net/{z}/{x}/{y}.png' ({s} = a, b or c).
    'world_tiles' => null,
    'world_attribution' => '© OpenStreetMap contributors',
    'world_max_zoom' => 18,
    // The area the world map stays within: it cannot be panned or zoomed out
    // beyond it, and locations outside it are listed rather than placed.
    // Mainland Norway by default; null shows the whole world.
    'world_bounds' => ['south' => 57.8, 'west' => 4.3, 'north' => 71.3, 'east' => 31.3],
    // World map weather warnings from MET Norway (MetAlerts). The LibreNMS
    // server fetches and caches them; false removes the toggle.
    'weather_warnings' => true,
    'weather_lang' => 'en', // 'en' or 'no'
    // Optional contact for MET Norway's terms of use (an email address or
    // URL), added to the User-Agent of the server's requests.
    'weather_contact' => null,
    // World map power outages from DRIFT's power-outage API (Fagne, BKK,
    // Glitre Nett, Lyse Elnett). Set both in LibreNMS's .env, never here:
    //   DRIFT_POWER_API_URL=http://drift.example.net:8080/api/power-outages
    //   DRIFT_API_TOKEN=<a DRIFT API token>
    // The LibreNMS server calls DRIFT; the token never reaches browsers.
    // Without a URL the toggle and the endpoints are removed.
    'drift_url' => env('DRIFT_POWER_API_URL'),
    'drift_token' => env('DRIFT_API_TOKEN'),
];
