# Verification record

## Confirmed locally

- `npm test`: 15 passing domain tests covering topology/metrics, root-group boundaries, device-group/search/role-visibility scope, corrupt/unauthorized saved-state filtering, pin collision avoidance, dense placement across 400 colliding nodes, distinct lateral arcs with reversed observations, Unicode filter limits, the sysName classification fallback with malformed config, and saved views above 2,000 positions.
- `npm run build`: TypeScript strict checking and production asset build pass. ELK runs in a separately emitted web worker with a relative asset URL.
- `node tests/php-syntax.cjs`: 17 PHP files, including both migrations and expanded host tests, parse in PHP 8.2 mode. This uses a JavaScript PHP parser; PHP itself is unavailable locally.
- `npm run test:browser`: 22 Chromium tests pass: original topology/controls/failure/compiled-bundle checks, lazy dual-interface graph previews on link hover, permission-scoped device-group selection and persistence, default hiding and scoped reveal of other devices, actionable topology-limit errors, drag persistence, authorization loss, root/device-group focus with pin/named-view persistence, malformed demo-view storage recovery, mocked live CRUD with CSRF and revision conflict recovery, migration-pending error isolation, workspace survival across a failed refresh, independently selectable parallel lateral links, stale selected details with retained keyboard focus, server-sized Unicode names/filters, staleness under a skewed browser clock, the server's reason for a rejected save, the map following LibreNMS's `dark` class and page background live, and the standalone map following the OS color scheme. The LibreNMS case uses a fixture that reproduces LibreNMS's body backgrounds (`#fff`, and `#272b30` under `.dark`); it has not been checked inside a running LibreNMS browser session.
- Light/dark screenshots, `test-results/libremap-views.png` and `test-results/libremap-link-preview.png` captured. The link preview was inspected visually with two labeled endpoint graph panels; the operator-controls screenshot was inspected with a focused root, pinned AGG and selected named view.
- Dependency installation audit reported zero vulnerabilities at installation time.

The local Node runtime was found at `C:/Users/ex_410156/Documents/FieldOps/.tools/node-v22.14.0-win-x64`; browser checks used the installed Microsoft Edge Chromium executable via `CHROMIUM_PATH`. Playwright requested a browser build newer than any installed, so an existing Chromium browser was selected explicitly rather than downloading one. No global runtime installation or live system modification was performed.

## Corrections supported by failures

- A domain test exposed `server01` being misclassified as ER. Requiring a numbered site boundary fixed it while retaining the supplied naming pattern.
- Browser execution exposed ELK's bundled fallback worker constructor failing inside another worker. Replaced it with the ELK API using a dedicated browser worker.
- Production inspection exposed an absolute `/assets/` worker URL. A relative Vite base and a compiled-bundle browser test verify loading beneath a plugin asset directory.
- Operator-workflow inspection found that search context bypassed site/backbone filters. Scope tests now ensure neighbor expansion stays inside explicit filters.
- A code review found that a failed topology fetch destroyed the stored browser workspace. The error path left the search box and layout controls enabled while the graph was empty, so one keystroke persisted an empty state over the operator's saved positions and pins, and the error path also emptied the in-memory baseline that recovery re-persists. `persist()` now refuses to write without a snapshot, those controls disable while no topology is loaded, and the error path reloads the stored workspace instead of clearing it. The new browser test was confirmed to fail against the previous behaviour (`0 pinned` where `1 pinned` was expected) before the fix was restored.
- Two new browser regressions were run before and after their fixes. Parallel same-tier links originally had identical midpoints; they now have separately selectable paths, retained through refresh and theme changes. Advancing the clock originally changed an edge to STALE while its selected details stayed at 10%; both now update together without replacing the focused close button.
- The first host CI run failed every saved-view HTTP test with a 302 before reaching the plugin: LibreNMS's `UserFactory` leaves `enabled` unset on the returned model, and the `VerifyUserEnabled` web middleware logs such users out. Test users are now created with `enabled => 1`, and the next run passed on all four host combinations.
- One browser test failed once on Linux CI and passed on the same commit's tag run, on both Dependabot branches, on the next two runs and in 60 local repetitions. It has not been identified; Playwright's github reporter now annotates any failure on CI.

## Host CI added in this update

[Host workflow](.github/workflows/host.yml) targets LibreNMS 26.7.0 and 26.8.0, PHP 8.4, and MySQL 8.0/MariaDB 11.7. Its 29 test methods cover real port enum/string attributes, partial device and device-group permissions, deleted ports, private views, group-focus redaction, revision conflicts, batched authorization, Unicode limits, migration schema, cached routes, map and navbar rendering, concurrent creates, sanitized config, the octet-rate column ceiling, view deletion with the owner account, the position limit and the named rate limiter. The concurrency method exercises both isolation levels, first creates, the 49-to-50 boundary and a deliberately held owner lock. CI fails if a required test is skipped.

The workflow performs migration, repeated migration, rollback and reapply before the suite. Cached-route tests run separately after enabling the plugin and building a real Laravel route cache. [Frontend workflow](.github/workflows/frontend.yml) also verifies committed assets match the build.

The v0.3.0 workflows passed on GitHub Actions at commit `63b7eeb`: every host combination ran the host suite with `--fail-on-skipped`, so the concurrency test executed rather than skipping, followed by the cached-route suite against a real route cache. Failing, erroring and skipped host tests are published as public check-run annotations, because job logs need authentication to read. Local PHP syntax parsing does not validate database behavior or framework bootstrapping.

## Audit fixes in 0.2.0

An audit of 0.1.0 led to these changes. The local suites above pass with them, and so does the host suite in CI (see Host CI above).

- Host CI could not start: `job.services` is not available in job-level `env`. The mapped database port is now exported from a step and the app key is generated per run. Actions are pinned to commit SHAs, kept current by Dependabot. The workflow now runs end to end.
- Asset URLs carry the published bundle's modification time. The install script and README remove `public/vendor/libremap` before republishing, so old hashed workers do not accumulate. Source maps are built hidden, so shipped bundles no longer reference unshipped files.
- Saved views accept `max(2000, max_devices)` positions; the client no longer truncates at 2,000 when a larger map is loaded.
- A rejected save shows the server's 422 reason, such as the 50-view limit. Conflict messages match the method, views list newest first, and the demo generates IDs outside secure contexts.
- Link staleness is judged on the server clock, using the offset from `generatedAt`. A timed-out layout terminates and recreates the ELK worker. Search fits the viewport once typing pauses.
- A named `libremap` rate limiter replaces `throttle:120,1`, whose counter was shared with every other plain-throttled host route.
- Classification falls back to sysName; config values are type-checked before serialization; the default prefix is empty; octet rates at the host's 32-bit column ceiling are reported as unknown.
- Views and owner rows are deleted with the LibreNMS user. The stylesheet uses the layout's `styles` stack, DELETE sends its revision in the query string, and table checks run once per request.

The new unit and browser tests were written together with the fixes and were not run against the previous code. The layout-worker reset has no automated test.

## Audit fix in 0.3.1

- Malformed JSON in the demo's saved-view browser storage is discarded and replaced with an empty list. Listing and saving views remain usable without asking the operator to clear site data manually. A Chromium regression covers load, reset and a successful save after recovery. Production LibreNMS-backed views are unchanged.

## Role visibility update

- Devices classified as AGG or ER remain visible by default; all other roles start hidden. **Show other devices** reveals them without escaping the selected AGG branch or active site/search filters. The preference persists in the browser workspace and private named views. Legacy view payloads and stored rows that predate the field default safely to hidden.
- Topology HTTP 422 responses now surface the server's bounded error message. A network over the configured device or link limit therefore receives the existing actionable configuration instruction instead of the generic HTTP status alone.

## Link traffic previews

- A 180 ms dwell on a live topology edge opens a bounded hover card with the source and destination interface names and their one-day `port_bits` graphs. The graph URLs use the configured LibreNMS base path, remain same-origin and include the current snapshot timestamp as a refresh key. A browser regression verifies lazy loading, both authorized port IDs, graph parameters, base-path handling and dismissal when the pointer leaves.

## Device-group focus

- The live snapshot lists only LibreNMS device groups visible to the signed-in user and serializes only members already present in that user's authorized device snapshot. The selector intersects AGG-root, site, search, backbone, and role-visibility filters. Its value persists in browser workspaces and private named views; missing, deleted, and inaccessible group references safely revert to all groups.

## Not yet verified

- A Packagist install with `scripts/install.sh` on a real LibreNMS host, and browser loading of the published assets from a real LibreNMS page. Host CI installs the package from a path repository and exercises its routes, models, migrations, Blade page and menu entry, but does not publish or load the frontend assets in a browser hosted by LibreNMS.
- A request actually being rate-limited. Host CI only confirms the named `libremap` limiter is registered.
- The layout-worker reset after a timed-out layout, which has no automated test.
- Behavior against actual neighbor coverage, interface data, and naming conventions beyond supplied examples.
- Large-network performance, upgrade/uninstall on a host, keyboard navigation of every graph element, and full accessibility review.

## Scope of this slice

Implemented phase 1 and the root-focus, pins and private named-views portion of phase 2. Site containers/collapse, shared views, LAG expansion, manual and retained links, export/minimap, and release hardening remain planned. There is no live deployment and no claim of production readiness.
