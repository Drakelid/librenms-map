{{--
    LibreNMS has no plugin hook inside Maps; its navbar includes one optional
    `menu.custom` view. LibreMap's copy comes first in the view
    search path while the plugin is enabled, so it also renders the
    administrator's own resources/views/menu/custom.blade.php, if there is one.
--}}
@auth
    @if (\Illuminate\Support\Facades\Route::has('libremap.index'))
        <template id="libremap-maps-entry">
        <li class="{{ request()->routeIs('libremap.index') ? 'active' : '' }}">
            <a href="{{ route('libremap.index') }}" title="Topology Map">
                <i class="fa fa-sitemap fa-fw fa-lg" aria-hidden="true"></i>
                <span>Topology Map</span>
            </a>
        </li>
        </template>
        <script>
            (() => {
                const template = document.getElementById('libremap-maps-entry');
                const maps = document.querySelector('#navHeaderCollapse .navbar-nav > li.dropdown > a > i.fa-map')?.closest('li');
                const menu = maps?.querySelector(':scope > ul.dropdown-menu');
                if (template && menu) {
                    if (template.content.querySelector('li.active')) maps.classList.add('active');
                    menu.append(template.content);
                    template.remove();
                }
            })();
        </script>
    @endif
@endauth
@if (is_file($hostMenu = resource_path('views/menu/custom.blade.php')))
    {!! view()->file($hostMenu, \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path', 'hostMenu']))->render() !!}
@endif
