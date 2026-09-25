<?php

namespace LibreMap;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
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

        // A named limiter keeps its own counter; a plain throttle:N,M key is only
        // the user ID, shared with every other such route on the host. Register
        // it even while disabled: cached routes still reference it.
        RateLimiter::for('libremap', fn (Request $request) => Limit::perMinute(120)
            ->by((string) ($request->user()?->getAuthIdentifier() ?? $request->ip())));

        // Saved views are private to their owner; remove them with the account.
        User::deleted(function (User $user): void {
            foreach (['libremap_views', 'libremap_view_owners'] as $table) {
                if (Schema::hasTable($table)) {
                    DB::table($table)->where('user_id', $user->getKey())->delete();
                }
            }
        });

        if (! $pluginManager->pluginEnabled('libremap')) {
            return;
        }

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'libremap');
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        // The "Topology Map" submenu: LibreNMS offers plugins no hook inside
        // Maps, but its navbar includes an optional `menu.custom`
        // view. Search this package's copy first; it renders the host's own.
        $this->callAfterResolving('view', fn ($view) => $view->getFinder()->prependLocation(__DIR__.'/../resources/navbar'));
    }
}
