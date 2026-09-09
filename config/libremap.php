<?php

return [
    'prefixes' => ['hk-'],
    'stale_after' => 900,
    // Device ID => ['role' => 'AGG'|'ER'|'UNKNOWN', 'site' => 'rossa1'].
    'overrides' => [],
    // Fail explicitly instead of displaying a silently truncated topology.
    'max_devices' => 2000,
    'max_links' => 10000,
];
