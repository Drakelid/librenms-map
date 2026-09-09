<?php

namespace LibreMap;

use Illuminate\Support\ServiceProvider;
use LibreMap\Hooks\MenuEntry;
use LibreNMS\Interfaces\Plugins\Hooks\MenuEntryHook;
use LibreNMS\Interfaces\Plugins\PluginManagerInterface;

class LibreMapServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/libremap.php', 'libremap');
    }

    public function boot(PluginManagerInterface $pluginManager): void
    {
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        $pluginManager->publishHook('libremap', MenuEntryHook::class, MenuEntry::class);

        $this->publishes([
            __DIR__.'/../dist' => public_path('vendor/libremap'),
        ], 'libremap-assets');
        $this->publishes([
            __DIR__.'/../config/libremap.php' => config_path('libremap.php'),
        ], 'libremap-config');

        if (! $pluginManager->pluginEnabled('libremap')) {
            return;
        }

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'libremap');
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
    }
}
