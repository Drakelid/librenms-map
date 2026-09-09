# LibreMap implementation plan

## Objective and contract

Create a LibreNMS topology plugin inspired by the supplied Orion screenshot, with readable device cards, AGG peer roots, ER branches, real discovered connections, utilization, and stable interaction. Target current LibreNMS PHP 8.2+ / Laravel 12 source; installed-instance compatibility remains a staging check. No live server access was supplied.

Device names classify roles; they never create links. `rossa1agg1` and `rossa1agg2` occupy the root tier. ER chains follow discovered hop distance from the nearest AGG. Dual-homed devices appear once. Rings, lateral links, and parallel physical ports remain visible. Unknown and disconnected devices remain accessible.

## Architecture

- Composer Laravel package, auto-discovered provider, menu hook, authenticated page and topology endpoint.
- Server adapter uses permission-scoped Device, Port and Link models, whitelists fields, and returns no credentials or unauthorized endpoints. No shared response cache in the initial slice.
- TypeScript topology functions normalize names, canonicalize reciprocal links by both ports, classify status and utilization, and assign deterministic tiers.
- Cytoscape.js renders the graph. ELK runs in a worker on a temporary layout graph with tier constraints; all real links remain in the displayed graph.
- Bundled local assets, no browser CDN or API token. Demo is explicit and never used as a live-data fallback.

## Phases

1. **Foundation and vertical slice — current implementation.** Save this plan; build package shell and data adapter; create demo fixture, AGG/ER layout, status and utilization, search/site filter, details, theme, zoom, and local saved positions. Verify graph invariants, build, and browser behavior. A live installation is a separate staging gate.
2. **Operator workflow — in progress.** Implemented root-group focus, private server-stored named views with revision checks, explicit pins, and browser workspace migration. Browser/domain checks pass; real host permissions and database persistence remain a staging gate. Next: site containers and collapsed network overview, minimap, interface graphs and export. Shared/team views require a separate access model and are not implemented.
3. **Topology fidelity.** LAG membership and expansion, manual links, last-known discovery retention with expiry, configurable role editor, unresolved-neighbor review. Do not infer LAGs or physical links from names.
4. **Release hardening.** Permission integration tests against LibreNMS, package install/uninstall and upgrade checks, stale/outage behavior, accessibility and dense-layout review. Benchmark 500 devices / 1,000 edges on agreed hardware, then tune limits from measured evidence.

## Measurement rules

Use a deterministic endpoint for each canonical link. Convert octets/s to bits/s once; utilization is max(in, out) / speed * 100, never the sum of opposite-end observations. Missing rates/speed are unknown; stale samples are explicit. A down interface takes precedence over utilization. Preserve >100% values for diagnosing speed mismatches. Suggested thresholds: 50/75/90%; refresh metrics at 60 seconds without automatic relayout.

## Acceptance and evidence

- Naming: short hostnames, FQDNs, uppercase, prefix removal, explicit overrides, and unknown roles.
- Graph: paired roots, dual-homing, cyclic ER chains, parallel ports, reciprocal records, disconnected components, no invented physical links.
- Metrics: 8x unit conversion at server boundary, directional maximum, missing/zero speed, stale data, down-link precedence.
- UI: usable initial render, filters/search, details, drag persistence, refresh position stability, empty/error states, no remote runtime assets.
- Security: authentication and authorization enforced server-side before serialization; no raw model serialization; no HTML interpolation of device data.
- Build/type/unit/browser checks recorded in VERIFICATION.md. Live LibreNMS behavior must not be marked verified without a real host.

## Sources inspected

- https://docs.librenms.org/Extensions/Plugin-System/
- https://docs.librenms.org/Extensions/Network-Map/
- https://docs.librenms.org/API/Ports/
- https://github.com/librenms/librenms (current composer manifest, Device/Port/Link models and routes)
- https://github.com/murrant/librenms-example-plugin
- https://js.cytoscape.org/
- https://eclipse.dev/elk/reference/algorithms/org-eclipse-elk-layered.html
- https://github.com/laravel/framework/blob/12.x/src/Illuminate/Database/Console/Migrations/MigrateCommand.php

## Operator workflow acceptance

- Root focus includes paired same-site AGGs and downstream ERs, with other AGGs acting as traversal boundaries; no physical links are invented.
- Re-layout preserves pinned coordinates; saved pins/positions survive reload and automatic placement avoids occupied coordinates.
- Saved views capture filters and viewport, use same-origin session/CSRF requests, and never use demo storage as a live fallback.
- Server CRUD is owner-scoped and revision-checked, with a bounded state schema and per-owner limit. Device references are checked against current permissions.
- Missing migration does not prevent topology browsing. Migration and host tests are supplied but require actual LibreNMS execution before production readiness can be claimed.
