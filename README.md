# LibreMap

An AGG-first topology map for LibreNMS, with a permission-scoped live data endpoint, private saved views, and a runnable interactive demo.

- [Requirements](#requirements)
- [Run the demo](#run-the-demo)
- [Implemented](#implemented)
- [Build assets](#build-assets)
- [Install on a LibreNMS staging host](#install-on-a-librenms-staging-host)
- [Saved views and pins](#saved-views-and-pins)
- [World map](#world-map)
- [Custom maps](#custom-maps)
- [Configuration](#configuration)
- [Measurement and display](#measurement-and-display)
- [Verification commands](#verification-commands)
- [Uninstall](#uninstall)

See [PLAN.md](PLAN.md) for later phases and [VERIFICATION.md](VERIFICATION.md) for execution evidence and limitations.

## Requirements

| Component | Requirement |
| --- | --- |
| Node.js | 20.19+ or 22.12+ (build tooling only; not needed on the LibreNMS host) |
| PHP | 8.2+ |
| Laravel | 12.x, as shipped with the LibreNMS host |
| LibreNMS | A release providing the plugin system's `PluginManagerInterface` and `MenuEntryHook` |

The host CI targets LibreNMS 26.7.0 and 26.8.0 on PHP 8.4, with MySQL 8.0 and MariaDB 11.7. Port status handling accepts both enum casts and older string attributes. The host workflow passes on all four combinations.

## Run the demo

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:5173>. The demo is explicitly labeled and uses illustrative data. Production pages never fall back to demo data on errors.

## Implemented

- Paired AGG roots and ER hop tiers, with rings, dual-homing and parallel physical links retained.
- Large hop tiers wrap into compact, centered row bands with reduced horizontal and vertical gaps instead of stretching the map into one extremely wide viewport; small tiers remain on a single row. Selecting an AGG root or device group temporarily packs the visible subset even tighter, then restores the full-map coordinates when focus is cleared. Gaps between cards leave room for link load labels. Previously saved wide layouts and the earlier 260x210 and 238x135 automatic grids are repacked automatically while pinned devices retain their coordinates.
- Numbered-site hostname classification: `rossa1agg1`, `rossa1agg2`, `rossa1er1`; case-insensitive, FQDN normalization, configurable prefixes and device-ID overrides.
- AGG and ER devices are visible by default; other roles start hidden and can be revealed with **Show other devices**. Search with immediate-neighbor context, site and permission-scoped LibreNMS device-group filters, AGG backbone toggle, device/link details, a 1–5 hop highlight around a selected device, light/dark themes, zoom and fullscreen. Inside LibreNMS the map follows the user's site style, including live switches in "device" mode, and uses the LibreNMS page background; the standalone demo follows the OS color scheme and keeps a Theme toggle.
- Directional maximum utilization and explicit down/stale/unknown states. Links are blue below 50% load, yellow from 50% and red above 70%, judged on the rounded percentage shown. Down links are red and dashed; administratively disabled, stale and unknown links are grey and dashed. Parallel connections use wider, stable curves so their individual utilization labels remain readable. Load labels are clickable, and inspecting a link keeps a selected device's neighborhood in focus. The topology is fetched every 60 seconds; link states are re-evaluated every 10 seconds from the current snapshot. Neither refresh relayouts the graph.
- Hovering a physical link on the live LibreNMS page lazily loads the source and destination interfaces' one-day traffic graphs from LibreNMS's authenticated `port_bits` graph endpoint. Moving away closes the preview; no graph images are requested during ordinary map loading or pointer movement that does not dwell on a link.
- AGG root focus includes same-site peers and discovered ER branches, stopping traversal at neighboring AGG sites. Boundary AGGs remain visible for context.
- The **Down** count in the summary steps through down devices that the current filters show, selecting and centring each in turn. **Export PNG** downloads every visible element of the map, not only the current viewport, as an image (capped at 8000 px per side). Keyboard shortcuts outside text fields: `/` find, `F` fit, `+`/`−` zoom, `D` next down device, `Esc` clear the selection.
- Pin/unpin device positions. Pinned devices cannot be dragged and remain fixed during Re-layout; automatic nodes are placed clear of them. Use Unpin all to release them.
- Browser workspace persistence and private named views stored in LibreNMS. Views capture device-group/root/site/search filters, backbone and other-device visibility, highlight hops, positions, pins, zoom and pan. The explicit demo stores named views in this browser only.
- Create, update, copy and delete named views. Revision checks prevent stale tabs from overwriting newer saves. Reload views restores the newest saved state before another update.
- A Composer package integrated with LibreNMS sessions, a **Maps → Topology Map** navigation entry, the plugin menu and permission scopes. Both devices and the measuring port must be authorized before a link is serialized, and so must the far port when LibreNMS has matched it. Plugin routes are rate limited to 120 requests per minute per user, on a counter separate from other LibreNMS routes.

## Build assets

```sh
npm run build
```

Keep the entire `dist/` directory, including `dist/assets/`, alongside the PHP package. The ELK layout worker is a separate local asset. No CDN, API token, or additional polling service is needed.

`dist/` is committed so Composer installations include the assets. Rebuild it whenever frontend source changes; CI checks that the shipped bundle matches the source.

## Install on a LibreNMS staging host

These are staging instructions, not evidence of an installation.

### From Packagist

[`scripts/install.sh`](scripts/install.sh) installs the newest stable release from [Packagist](https://packagist.org/packages/libremap/librenms-plugin) with `lnms plugin:add`, replaces previously published assets, publishes default config, runs this package's migrations, enables the plugin and clears caches. Run it on the LibreNMS host as the application user:

```sh
curl -fsSL -o /tmp/libremap-install.sh https://raw.githubusercontent.com/Drakelid/librenms-map/main/scripts/install.sh
sudo -H -u librenms bash /tmp/libremap-install.sh
```

Rerun it to upgrade. Use `--dir` for a LibreNMS checkout outside `/opt/librenms`, or `--version` to install a specific release. An existing `config/libremap.php` is kept. If a source install left a `repositories.libremap` path entry, the script removes it, because Composer would otherwise keep resolving the package from that path. The script requires LibreNMS with `lnms plugin:add`.

### From source

**1. Build, then copy.** Run `npm run build` locally and copy this project, including the built `dist/`, to `/opt/libremap` on the LibreNMS host.

**2. Register the package.** Run these commands as the LibreNMS application user from `/opt/librenms`:

```sh
composer config repositories.libremap path /opt/libremap
composer require 'libremap/librenms-plugin:@dev'
rm -rf public/vendor/libremap
php artisan vendor:publish --tag=libremap-assets --force
php artisan vendor:publish --tag=libremap-config
php artisan migrate --path=/opt/libremap/database/migrations --realpath
```

These alter the host Composer configuration and lockfile; retain those changes through your normal upgrade process. Removing `public/vendor/libremap` first drops the previous build's hashed worker file, which `vendor:publish` would otherwise leave behind.

**3. Enable, then clear caches.** Enable **libremap** in LibreNMS plugin administration, then run:

```sh
php artisan optimize:clear
```

**4. Open the map.** Click **Maps → Topology Map** in the LibreNMS navigation bar (also listed under **Plugins**), or go to `/libremap` under the instance's base URL.

### Navigation bar

LibreNMS offers plugins no hook inside the Maps dropdown, but its navigation bar includes one optional `menu.custom` view. While libremap is enabled, the package supplies that view and uses JavaScript to add **Topology Map**, **World Map** and **Custom Maps** to the existing **Maps** dropdown. Each LibreMap page also links to the others from its header. A host's own `resources/views/menu/custom.blade.php` keeps working: LibreMap also renders it. As with routes, clear caches after enabling or disabling the plugin.

### Route cache

**Clear the route cache whenever you enable or disable the plugin.** The provider registers this package's routes only while libremap is enabled, and Laravel skips that registration entirely when routes are cached, which `php artisan optimize` and `route:cache` do. Enabling libremap on a host with a warm route cache leaves `/libremap` returning 404 until `php artisan optimize:clear` (or `route:clear`) runs. Disabling needs no clear: the request middleware still returns 404 for routes served from cache.

### Database migration

The migrations add `libremap_views`, `libremap_view_owners` and `libremap_custom_maps`; they do not change LibreNMS topology tables. The owner table supplies one stable lock row per owner so simultaneous creates cannot bypass the 50-view cap, including the first create. Rows remain after deleting the last view. The explicit `--path` runs only this package's migrations on an existing LibreNMS database. These options are supported by [Laravel's migration command](https://github.com/laravel/framework/blob/12.x/src/Illuminate/Database/Console/Migrations/MigrateCommand.php). Apply it through your usual staging/deployment process. If a required table is absent, the affected saved-view operation reports an error while the topology map remains available.

No migration has been run on your LibreNMS server from this workspace.

### Updating an existing installation

For a Packagist install, rerun `scripts/install.sh`. For a source install, rebuild the assets, remove `public/vendor/libremap`, republish them with `php artisan vendor:publish --tag=libremap-assets --force`, apply any new plugin migration, and clear application caches. The map page adds the published bundle's modification time to its asset URLs, so browsers load the new build instead of a cached one.

Custom maps require the `libremap_custom_maps` migration; until it runs, the Custom Maps page reports that an administrator must run it, and the topology map is unaffected.

This update requires the new owner-lock migration before creating saved views. From the LibreNMS checkout, run `php artisan migrate --path=/opt/libremap/database/migrations --realpath`. Existing saved views are preserved; owner rows are created on demand.

## Saved views and pins

Select a **Device group** to focus on a LibreNMS device group the signed-in user may view, or select an **AGG root** to focus its discovered site branch. Device-group, AGG-root, site, search and backbone filters intersect; search context does not bypass them. Devices not classified as AGG or ER are hidden initially. **Show other devices** reveals them without escaping the selected device group, AGG branch, or active site/search filters. Click a device and choose **Pin position** to preserve its current coordinates. **Re-layout** moves unpinned devices only.

Use **Save view** to create a named workspace or update the selected view. **Save as new** makes a separate copy. Views are private to their owner, including when another user is an administrator, and are deleted with the owner's LibreNMS account. A user can store up to 50 views, each with at most 2,000 positions, or `max_devices` positions when that is higher. Saved views contain device IDs and display preferences, not copied device records or traffic history. Reads redact device references that the owner can no longer access; writes reject unavailable device IDs.

Names support 100 Unicode characters; site and search filters support 200. Listing views resolves device access once for the union of referenced IDs, then redacts each view independently.

When another tab has changed a view, the save/delete operation returns a conflict. **Reload views** loads the current revision and applies its saved state. Browser workspace autosave remains separate from explicit named saves, and is never overwritten while no topology is loaded. Existing position-only browser data is read on first load of this version.

## Configuration

Published `config/libremap.php` supports prefixes, freshness cutoff, size limits, and explicit classification overrides. No hostname prefix is stripped by default; this example strips `hk-`:

```php
return [
    'prefixes' => ['hk-'],
    'stale_after' => 900,
    // Device ID => ['role' => 'AGG'|'ER'|'OTHER', 'site' => 'rossa1'].
    'overrides' => [
        42 => ['role' => 'AGG', 'site' => 'rossa1'],
    ],
    // Fail explicitly instead of displaying a silently truncated topology.
    'max_devices' => 2000,
    'max_links' => 10000,
];
```

The default role rule requires a site ending in a digit before `agg` or `er`, preventing `server01` from being classified as ER. When the hostname does not match, as for devices added by IP address, the device's sysName is tried next. Map labels use the device's LibreNMS display name; when that resolves to an IP address and a sysName is known, the sysName is shown instead. Search also matches the hostname and sysName. Use overrides for other conventions. Config entries of the wrong type are ignored rather than failing the map. Names classify placement only; links come from active LibreNMS neighbor records whose remote device LibreNMS has identified. When it identified the neighbor device but not its port, as often happens with LLDP neighbors that report a description or MAC address as their port, the link is still shown with the port name the neighbor reported, marked as unmatched; a record from the other end that resolves the same cable takes its place. Neighbors LibreNMS has not matched to a device, and unauthorized endpoints, are omitted. LAG grouping, discovery-history retention and manual links are planned.

Exceeding `max_devices` or `max_links` returns an error rather than a partial graph.
The role-visibility toggle is a display filter and does not weaken these server-side safety limits. A host with 2,048 authorized devices must set `max_devices` above that count (for example, `3000`) in `/opt/librenms/config/libremap.php`, then run `php artisan optimize:clear` as the LibreNMS application user.

## Measurement and display

Unknown speeds and missing rates display N/A. A port shut down administratively at either end displays DISABLED rather than DOWN, so intentional shutdowns are not mistaken for faults. Stale data displays STALE; staleness is judged on the server's clock, so a skewed browser clock does not change it. Bandwidth is measured at a deterministic endpoint and not added to the other endpoint's observation. Device root placement does not imply an active routing path.

## Verification commands

```sh
npm ci
npm test
npm run build
node tests/php-syntax.cjs
npx playwright install chromium
npm run test:browser
```

Browser tests include the built production bundle, so build first. An existing Chromium can be selected with `CHROMIUM_PATH` instead of downloading one. PHP parsing is a syntax check, not a replacement for executing the plugin in LibreNMS.

Tests in `tests/Host/` are intended to run with the LibreNMS PHPUnit bootstrap and a disposable test database, after installing the package and running its migration in that test environment. From the LibreNMS checkout:

```sh
DBTEST=1 vendor/bin/phpunit --exclude-group=cached-routes /opt/libremap/tests/Host
```

PHPUnit loads these files by path, so no additional autoload wiring is required on the host. Do not point the host test environment at a production database. They run in the host CI workflow; they have not been executed locally.

The concurrency test requires Linux PHP with `pcntl` and `posix`, and MySQL/MariaDB. It uses committed transactions on separate connections under both REPEATABLE READ and READ COMMITTED, including deliberately held owner locks. The CI workflow requires this coverage to run rather than be skipped.

Run cached-route coverage separately in the same disposable environment, with libremap enabled and `DB_CONNECTION=testing` plus the `DB_TEST_*` connection settings exported:

```sh
php artisan route:cache
DBTEST=1 vendor/bin/phpunit /opt/libremap/tests/Host/CachedRoutesIntegrationTest.php
php artisan route:clear
```

[Host CI](.github/workflows/host.yml) installs the package on the explicit host/database matrix, exercises migration/rollback/reapply, and runs the real-model, permission, persistence, concurrency and cached-route tests. [Frontend CI](.github/workflows/frontend.yml) runs domain tests, type checking, the build, PHP syntax parsing and Chromium regressions.

## World map

**Maps → World Map** (`/libremap/world`) places devices at the coordinates of their LibreNMS location. Each marker is one location, sized by its number of devices and coloured by the worst device status there; locations with a down device pulse. Lines are the discovered links between locations, coloured like the topology map by their busiest link, and dashed red when a link is down. Click a location for its devices and connected locations, a device for its details and LibreNMS link, or a line for each link's interfaces and its load in each direction: a bar, the percentage and the rate against the interface speed, when LibreNMS last measured it, and a folded one-day traffic graph that loads only when opened. A link between two devices at the same location, or to a device without coordinates, cannot be a line: the details panel counts these, and each location lists its internal links.

- **Addresses are hidden by default.** LibreNMS location text is often a street address, and the coordinates are left out too. The toggles govern only the map itself: marker labels, their screen-reader text and link tooltips. On the map, a location without its address is labelled with its devices' LibreMap site (for example `rossa1`) only while **Device names** is on, because sites are usually read from hostnames; with both off, only a site an administrator set in `libremap.overrides` is shown, and other markers have no label (they still show their device count; screen readers hear `Location 1`, `Location 2`…). Selecting a location or device always shows its full names in the details panel: the address when **Addresses** is on, otherwise the site, and each device's name. **Addresses** shows the location text and coordinates; coordinates written into the text in LibreNMS's `[lat,lng]` form are left out of the address itself; while they are hidden, search does not match them either. The choice is remembered in the browser.
- **Device names** labels each marker with its devices' names (the first three, then a count), at any zoom level. It is off by default, and then no device name, hostname or site read from one appears on the map itself. Selecting a location or device always shows the devices' real names in the details panel. The choice is remembered in the browser.
- The world map names a device by its **hostname**; when the hostname is only an IP address (a device added by IP), by its **sysName**; and without a sysName, by that **IP address**. A device's details list the identifiers not used as its name.
- Search matches device names, hostnames, sysNames and sites. **Device group** and **Only problems** narrow the map; **Core Network** shows only AGG and ER devices (named like `rossa1agg1` and `rossa1er1`, after the configured prefixes, or set as AGG or ER in `libremap.overrides`), hiding other devices and their links, and is remembered in the browser; **Links** hides the lines.
- **⚠ Weather warnings** draws MET Norway's active warnings (wind, rain, snow, ice, storm surge, forest fire and more) as yellow, orange and red areas. Locations inside a warning get a badge and an **Under warning** count; click an area or a flagged location for MET's description, consequences, advice and the affected locations. The toggle is off until selected and remembered in the browser.
- **⚡ Power outages** draws the outages on the Norwegian grid operators' outage maps (Fagne, BKK, Glitre Nett, Lyse Elnett / L-nett), read through [DRIFT](#power-outages-drift). Current outages are solid areas and planned outages dashed ones; affected lines are drawn as strokes. Every outage also has a ⚡ pin of fixed size, so an area too small to see at the current zoom, or an outage known only by a point, is still marked. A location inside an outage area gets a heavy ring in the outage colour, a pulse and an **OUTAGE** tag (a dashed ring and **PLANNED** for planned ones); a location within 1 km of an outage gets a dashed ring. Its details, and each of its devices' details, open with a banner saying so. **In outage area** counts the affected locations; click it, or press `O`, to step through them. If DRIFT sends an outage the map cannot place, or an area too detailed to draw (then shown as a pin), the status line says how many and why. Click an outage for its operator, municipality, customers affected, times, state and reason. Select a location to ask DRIFT whether that place is inside or near an outage. **"No outage on the grid operators' maps" only means nothing is on those maps there; it does not confirm the power is on.** The status line shows when DRIFT last read the maps ("Maps read at …") and names any map that is stale or failed to read. The toggle appears only when DRIFT is configured; it is off until selected and remembered in the browser.
- Drag to pan, scroll or double-click to zoom (Shift+double-click zooms out). Keys outside text fields: `/` find, `F` fit, `+`/`−` zoom, arrows pan, `D` next location with a down device, `Esc` clear.
- The map refreshes every 60 seconds and re-judges link staleness every 10 seconds, as the topology map does.

Coordinates come from **LibreNMS locations**: set them on the Locations page or let LibreNMS geocode the location text. The map stays within mainland Norway: it can be panned a little past its edges (a fifth of the map's height) so the coast is never on the edge of the screen, but no further, and zooming out stops where all of Norway is in view; and **Fit** uses only locations inside it, or shows all of Norway when there are none. A device whose location lies outside (usually a wrong coordinate or geocode) is not placed; it is counted as **Outside map area** and listed in the details panel so the location can be corrected. Set `world_bounds` to another box, or to `null` for the whole world:

```php
'world_bounds' => ['south' => 57.8, 'west' => 4.3, 'north' => 71.3, 'east' => 31.3], // or null
```
 As in LibreNMS, a location whose latitude or longitude is zero counts as not placed. Devices without coordinates are listed in the details panel. The server sends only locations of devices the signed-in user may view.

Map tiles follow LibreNMS's own world map (`leaflet.tile_url`, OpenStreetMap by default), so the browser loads tiles from that server as LibreNMS does. Override them in `config/libremap.php`, or set `world_tiles` to `''` for no tiles; devices then show on a plain background:

```php
'world_tiles' => 'https://tiles.example.net/{z}/{x}/{y}.png', // {s} becomes a, b or c
'world_attribution' => '© OpenStreetMap contributors',
'world_max_zoom' => 18,
```

Weather warnings come from [MET Norway's MetAlerts API](https://api.met.no/weatherapi/metalerts/2.0/documentation) and cover Norway and its waters. The **LibreNMS server** fetches them, never the browser, so the server needs outbound HTTPS to `api.met.no`. Responses are cached for five minutes, as MET asks, and if MET is unreachable the last copy (up to six hours old) is shown with a notice. Requests identify LibreMap in their `User-Agent`; MET's terms ask for a way to contact the operator, which `weather_contact` adds. Warning texts follow `weather_lang`, and `weather_warnings => false` removes the toggle and the endpoint:

```php
'weather_warnings' => true,
'weather_lang' => 'en',                  // or 'no'
'weather_contact' => 'noc@example.net',  // email address or URL
```

### Power outages (DRIFT)

Power outages come from DRIFT's power-outage API. Set two values in the LibreNMS host's `.env` (`/opt/librenms/.env`), then run `php artisan config:clear` (or `optimize:clear`):

```sh
DRIFT_POWER_API_URL=http://drift.example.net:8080/api/power-outages
DRIFT_API_TOKEN=<a DRIFT API token>
```

| Setting | Meaning |
| --- | --- |
| `DRIFT_POWER_API_URL` | DRIFT's power-outage API base URL, ending in `/api/power-outages`. Without it the toggle and the `/libremap/power/*` endpoints are removed. |
| `DRIFT_API_TOKEN` | A DRIFT API token, sent as `Authorization: Bearer …`. Keep it in `.env` or your secrets store. Never put it in `config/libremap.php` or commit it. |

The **LibreNMS server** calls DRIFT, never the browser, so it needs network access to the DRIFT host. The token stays on the server: it is not sent to browsers or put in the page, and it is not logged or used in cache keys. Browsers call LibreMap's own `/libremap/power/outages`, `/libremap/power/outage-at` and `/libremap/power/health`.

DRIFT reads the operators' maps every five minutes. LibreMap caches each answer for 60 seconds and the world map refreshes outages every five minutes. Requests time out after 30 seconds. A network error or a 503 is retried once; a 400 or 401 is not. Errors are explicit:

- "The DRIFT token is missing or wrong." means the token is missing or wrong.
- "The outage service is unavailable…" means DRIFT or its outage service cannot be reached.
- "DRIFT rejected the request: …" passes on DRIFT's reason for rejecting a parameter.

## Custom maps

**Maps → Custom Maps** (`/libremap/custom`) lets each user draw their own maps next to the discovered topology. Choose **New map**, then **Edit**:

- **Add device** places any device you may view; each device appears at most once per map.
- **Add area** draws a labelled box, for example around a site; **Add text** places a free note. Set their label and size in the details panel.
- **Draw line** joins two devices: select the device at each end. A drawn line is dotted until you bind it to an **Interface** of either end device. A bound line shows that interface's live load, down, disabled and stale states with the topology map's colors, measured at that one interface.
- Drag to arrange; elements snap to the 20 px background grid, which pans and zooms with the map. **Undo**/**Redo** (`Ctrl+Z`, `Ctrl+Shift+Z` or `Ctrl+Y`) step through up to 100 edits; typing in one field counts as one step. `Delete` removes the selection and `Esc` stops drawing or clears it.
- **Save** when done. **Done editing** saves pending changes; **Discard changes** reverts to the last save. **Export PNG** downloads the map as an image.

Drawn lines are your annotation. They never join the discovered topology, its tiers or its focus filters.

Maps are private until their owner selects **Share read-only**. A shared map appears under **Shared with me** for every signed-in LibreNMS user and can be opened directly with the page address (`?map=<id>`). Only the owner can edit, rename, unshare or delete it, including when another user is an administrator. Each reader sees only the devices and interfaces they may view: other devices, the lines ending on them, and interface bindings they cannot access are removed by the server before the map is sent. Area and text labels are shown to every reader, so do not put information in them that some readers should not see.

A user can own up to 50 maps, each with up to 500 devices, 2,000 lines and 200 areas or text labels. Writes reject devices the owner cannot view, and interfaces that are unavailable or do not belong to one end of their line. Saves are revision-checked: a map changed in another session returns a conflict instead of being overwritten. Open maps refresh live data every 60 seconds without disturbing edits in progress. Maps are deleted with their owner's LibreNMS account.

## Uninstall

Disable libremap in plugin administration, then remove the package and its repository entry as the LibreNMS application user from `/opt/librenms`:

```sh
composer remove libremap/librenms-plugin
composer config --unset repositories.libremap
php artisan optimize:clear
```

For an install made with `scripts/install.sh`, run `./lnms plugin:remove libremap/librenms-plugin` instead of `composer remove`; it also drops the package from `composer.plugins.json`, and no repository entry needs unsetting. Then clear caches with `php artisan optimize:clear`.

Published files are left in place and can be removed separately after reviewing their paths: assets at `public/vendor/libremap/` and config at `config/libremap.php`.

The `libremap_views`, `libremap_view_owners` and `libremap_custom_maps` tables are retained by package removal. Removing them or rolling back their migrations deletes saved workspaces and custom maps, and should be a deliberate database maintenance action.
