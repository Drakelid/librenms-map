# LibreMap

An AGG-first topology map for LibreNMS, with a permission-scoped live data endpoint, private saved views, and a runnable interactive demo.

- [Requirements](#requirements)
- [Run the demo](#run-the-demo)
- [Implemented](#implemented)
- [Build assets](#build-assets)
- [Install on a LibreNMS staging host](#install-on-a-librenms-staging-host)
- [Saved views and pins](#saved-views-and-pins)
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
- Numbered-site hostname classification: `rossa1agg1`, `rossa1agg2`, `rossa1er1`; case-insensitive, FQDN normalization, configurable prefixes and device-ID overrides.
- Search with immediate-neighbor context, site filter, AGG backbone toggle, device/link details, light/dark themes, zoom and fullscreen. Inside LibreNMS the map follows the user's site style, including live switches in "device" mode, and uses the LibreNMS page background; the standalone demo follows the OS color scheme and keeps a Theme toggle.
- Directional maximum utilization and explicit down/stale/unknown states. The topology is fetched every 60 seconds; link states are re-evaluated every 10 seconds from the current snapshot. Neither refresh relayouts the graph.
- AGG root focus includes same-site peers and discovered ER branches, stopping traversal at neighboring AGG sites. Boundary AGGs remain visible for context.
- Pin/unpin device positions. Pinned devices cannot be dragged and remain fixed during Re-layout; automatic nodes are placed clear of them. Use Unpin all to release them.
- Browser workspace persistence and private named views stored in LibreNMS. Views capture root/site/search filters, backbone mode, positions, pins, zoom and pan. The explicit demo stores named views in this browser only.
- Create, update, copy and delete named views. Revision checks prevent stale tabs from overwriting newer saves. Reload views restores the newest saved state before another update.
- A Composer package integrated with LibreNMS sessions, a **Topology Map** navigation-bar button, the plugin menu and permission scopes. Both devices and both ports must be authorized before a link is serialized. Plugin routes are rate limited to 120 requests per minute per user, on a counter separate from other LibreNMS routes.

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

**4. Open the map.** Click **Topology Map** in the LibreNMS navigation bar (also listed under **Plugins**), or go to `/libremap` under the instance's base URL.

### Navigation bar

LibreNMS offers plugins no hook for top-level navigation items, but its navigation bar includes one optional `menu.custom` view. While libremap is enabled, the package supplies that view with the **Topology Map** button. A host's own `resources/views/menu/custom.blade.php` keeps working: LibreMap renders it right after the button. As with routes, clear caches after enabling or disabling the plugin.

### Route cache

**Clear the route cache whenever you enable or disable the plugin.** The provider registers this package's routes only while libremap is enabled, and Laravel skips that registration entirely when routes are cached, which `php artisan optimize` and `route:cache` do. Enabling libremap on a host with a warm route cache leaves `/libremap` returning 404 until `php artisan optimize:clear` (or `route:clear`) runs. Disabling needs no clear: the request middleware still returns 404 for routes served from cache.

### Database migration

The migrations add `libremap_views` and `libremap_view_owners`; they do not change LibreNMS topology tables. The owner table supplies one stable lock row per owner so simultaneous creates cannot bypass the 50-view cap, including the first create. Rows remain after deleting the last view. The explicit `--path` runs only this package's migrations on an existing LibreNMS database. These options are supported by [Laravel's migration command](https://github.com/laravel/framework/blob/12.x/src/Illuminate/Database/Console/Migrations/MigrateCommand.php). Apply it through your usual staging/deployment process. If a required table is absent, the affected saved-view operation reports an error while the topology map remains available.

No migration has been run on your LibreNMS server from this workspace.

### Updating an existing installation

For a Packagist install, rerun `scripts/install.sh`. For a source install, rebuild the assets, remove `public/vendor/libremap`, republish them with `php artisan vendor:publish --tag=libremap-assets --force`, apply any new plugin migration, and clear application caches. The map page adds the published bundle's modification time to its asset URLs, so browsers load the new build instead of a cached one.

This update requires the new owner-lock migration before creating saved views. From the LibreNMS checkout, run `php artisan migrate --path=/opt/libremap/database/migrations --realpath`. Existing saved views are preserved; owner rows are created on demand.

## Saved views and pins

Select an **AGG root** to focus its site group. Site/search/backbone filters intersect that scope; search context does not bypass those filters. Click a device and choose **Pin position** to preserve its current coordinates. **Re-layout** moves unpinned devices only.

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

The default role rule requires a site ending in a digit before `agg` or `er`, preventing `server01` from being classified as ER. When the hostname does not match, as for devices added by IP address, the device's sysName is tried next. Use overrides for other conventions. Config entries of the wrong type are ignored rather than failing the map. Names classify placement only; links come from active, resolved LibreNMS neighbor records. Unresolved or unauthorized remote endpoints are omitted in this initial slice. LAG grouping, discovery-history retention and manual links are planned.

Exceeding `max_devices` or `max_links` returns an error rather than a partial graph.

## Measurement and display

Unknown speeds and missing rates display N/A. LibreNMS stores octet rates in a 32-bit column, so a rate at that column's ceiling (about 17 Gbit/s) is treated as unknown rather than shown as a false utilization. Stale data displays STALE; staleness is judged on the server's clock, so a skewed browser clock does not change it. Bandwidth is measured at a deterministic endpoint and not added to the other endpoint's observation. Device root placement does not imply an active routing path.

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

## Uninstall

Disable libremap in plugin administration, then remove the package and its repository entry as the LibreNMS application user from `/opt/librenms`:

```sh
composer remove libremap/librenms-plugin
composer config --unset repositories.libremap
php artisan optimize:clear
```

For an install made with `scripts/install.sh`, run `./lnms plugin:remove libremap/librenms-plugin` instead of `composer remove`; it also drops the package from `composer.plugins.json`, and no repository entry needs unsetting. Then clear caches with `php artisan optimize:clear`.

Published files are left in place and can be removed separately after reviewing their paths: assets at `public/vendor/libremap/` and config at `config/libremap.php`.

Both `libremap_views` and `libremap_view_owners` are retained by package removal. Removing `libremap_views` or rolling back its migration deletes saved workspaces and should be a deliberate database maintenance action.
