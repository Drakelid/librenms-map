<?php

namespace LibreMap\Http;

use Closure;
use Illuminate\Http\Request;
use LibreNMS\Interfaces\Plugins\PluginManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class EnsurePluginEnabled
{
    public function handle(Request $request, Closure $next): Response
    {
        // Also enforce this when Laravel serves previously cached routes.
        abort_unless(app(PluginManagerInterface::class)->pluginEnabled('libremap'), 404);

        return $next($request);
    }
}
