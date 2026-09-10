# Verification record

## Confirmed locally

- `npm test`: 11 passing domain tests covering topology/metrics, root-group boundaries, search scope, corrupt/unauthorized saved-state filtering, pin collision avoidance, dense placement across 400 colliding nodes, distinct lateral arcs with reversed observations, and Unicode filter limits.
- `npm run build`: TypeScript strict checking and production asset build pass. ELK runs in a separately emitted web worker with a relative asset URL.
- `node tests/php-syntax.cjs`: 16 PHP files, including both migrations and expanded host tests, parse in PHP 8.2 mode. This uses a JavaScript PHP parser; PHP itself is unavailable locally.
- `npm run test:browser`: 13 Chromium tests pass: original topology/controls/failure/compiled-bundle checks, drag persistence, authorization loss, root focus/pin/named-view persistence, mocked live CRUD with CSRF and revision conflict recovery, migration-pending error isolation, workspace survival across a failed refresh, independently selectable parallel lateral links, stale selected details with retained keyboard focus, and server-sized Unicode names/filters.
- Light/dark screenshots and `test-results/libremap-views.png` captured. The operator-controls screenshot was inspected visually with a focused root, pinned AGG and selected named view.
- Dependency installation audit reported zero vulnerabilities at installation time.

The local Node runtime was found at `C:/Users/ex_410156/AppData/Local/node24/PFiles64/nodejs`; browser checks used existing Chromium via `CHROMIUM_PATH`. Playwright requested a browser build newer than any installed, so an existing Chromium was selected explicitly rather than downloading one. No global runtime installation or live system modification was performed.

## Corrections supported by failures

- A domain test exposed `server01` being misclassified as ER. Requiring a numbered site boundary fixed it while retaining the supplied naming pattern.
- Browser execution exposed ELK's bundled fallback worker constructor failing inside another worker. Replaced it with the ELK API using a dedicated browser worker.
- Production inspection exposed an absolute `/assets/` worker URL. A relative Vite base and a compiled-bundle browser test verify loading beneath a plugin asset directory.
- Operator-workflow inspection found that search context bypassed site/backbone filters. Scope tests now ensure neighbor expansion stays inside explicit filters.
- A code review found that a failed topology fetch destroyed the stored browser workspace. The error path left the search box and layout controls enabled while the graph was empty, so one keystroke persisted an empty state over the operator's saved positions and pins, and the error path also emptied the in-memory baseline that recovery re-persists. `persist()` now refuses to write without a snapshot, those controls disable while no topology is loaded, and the error path reloads the stored workspace instead of clearing it. The new browser test was confirmed to fail against the previous behaviour (`0 pinned` where `1 pinned` was expected) before the fix was restored.
- Two new browser regressions were run before and after their fixes. Parallel same-tier links originally had identical midpoints; they now have separately selectable paths, retained through refresh and theme changes. Advancing the clock originally changed an edge to STALE while its selected details stayed at 10%; both now update together without replacing the focused close button.

## Host CI added in this update

[Host workflow](.github/workflows/host.yml) targets LibreNMS 26.7.0 and 26.8.0, PHP 8.4, and MySQL 8.0/MariaDB 11.7. Its 19 test methods cover real port enum/string attributes, partial permissions, deleted ports, private views, revision conflicts, batched authorization, Unicode limits, migration schema, cached routes and concurrent creates. The concurrency method exercises both isolation levels, first creates, the 49-to-50 boundary and a deliberately held owner lock. CI fails if a required test is skipped.

The workflow performs migration, repeated migration, rollback and reapply before the suite. Cached-route tests run separately after enabling the plugin and building a real Laravel route cache. [Frontend workflow](.github/workflows/frontend.yml) also verifies committed assets match the build.

These workflows are configured and source-reviewed; no GitHub Actions or host run was executed from this workspace. Local PHP syntax parsing does not validate database behavior or framework bootstrapping.

## Not yet verified

- Composer installation, provider/menu registration, Blade integration and model queries inside a running LibreNMS instance.
- Real database permission behavior, migrations, transactional persistence, revision handling and the expanded host tests. Browser authorization and saved-view API tests use controlled HTTP responses.
- The `throttle:120,1` route middleware and the 429 messages added for it. No request has been rate-limited by a real host.
- The per-owner view cap now uses a persistent `libremap_view_owners` row, a current locking read of view IDs, and up to three transaction attempts for concurrency errors. Real concurrent execution under REPEATABLE READ and READ COMMITTED is covered by the new host test but has not run locally.
- Status normalization from current LibreNMS backed enums and older string attributes is implemented; the real-model status regression requires the host suite.
- Batching resolves device authorization once per listing; the query-count and per-view redaction regression requires the host suite.
- Tolerance of an unreadable `state` column, covered by a supplied host test that has not been run.
- Behavior against actual neighbor coverage, interface data, and naming conventions beyond supplied examples.
- Large-network performance, upgrade/uninstall on a host, keyboard navigation of every graph element, and full accessibility review.

## Scope of this slice

Implemented phase 1 and the root-focus, pins and private named-views portion of phase 2. Site containers/collapse, shared views, LAG expansion, manual and retained links, export/minimap, and release hardening remain planned. There is no live deployment and no claim of production readiness.
