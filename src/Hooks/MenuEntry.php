<?php

namespace LibreMap\Hooks;

use LibreNMS\Interfaces\Plugins\Hooks\MenuEntryHook;

class MenuEntry implements MenuEntryHook
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function handle(string $pluginName): array
    {
        return ['libremap::menu', []];
    }
}
