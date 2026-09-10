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
];
