{{--
    LibreNMS has no plugin hook for top-level navbar items; its navbar includes
    one optional `menu.custom` view. LibreMap's copy comes first in the view
    search path while the plugin is enabled, so it also renders the
    administrator's own resources/views/menu/custom.blade.php, if there is one.
--}}
@auth
    @if (\Illuminate\Support\Facades\Route::has('libremap.index'))
        <li class="{{ request()->routeIs('libremap.index') ? 'active' : '' }}">
            <a href="{{ route('libremap.index') }}" title="Topology Map">
                <i class="fa fa-sitemap fa-fw fa-lg fa-nav-icons" aria-hidden="true"></i>
                <span class="tw:md:hidden tw:2xl:inline-block">Topology Map</span>
            </a>
        </li>
    @endif
@endauth
@if (is_file($hostMenu = resource_path('views/menu/custom.blade.php')))
    {!! view()->file($hostMenu, \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path', 'hostMenu']))->render() !!}
@endif
