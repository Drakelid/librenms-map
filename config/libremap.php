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
];
