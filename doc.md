= LibreMap for LibreNMS: user guide =

{{toc/}}

== What LibreMap is ==

LibreMap is a plugin for LibreNMS that draws the network as maps. It has three pages:

* **Topology Map**: the network as AGG sites and ER tiers, with live link load.
* **World Map**: devices placed at their LibreNMS locations on a map of Norway, with live link load, MET Norway weather warnings and power outages from the grid operators.
* **Custom Maps**: maps you draw yourself, privately or shared read-only with colleagues.

All three pages use your LibreNMS login. You only ever see the devices and interfaces you are allowed to see in LibreNMS.

{{info}}
LibreMap reads LibreNMS's data; it never changes devices, ports or alerts. Everything you do on the maps (filters, pins, saved views, custom maps) affects only your own view, unless you share a custom map.
{{/info}}

== Opening the maps ==

In the LibreNMS navigation bar, open **Maps** and choose **Topology Map**, **World Map** or **Custom Maps**. The pages are also listed under **Plugins**. Each LibreMap page links to the other two in its header, and **LibreNMS ↗** takes you back to LibreNMS.

The maps refresh themselves every 60 seconds. **↻ Refresh** fetches new data at once.

== Reading link colours ==

Links are coloured the same way on all three pages, by the load of their busiest direction, rounded to whole percent:

|=Line|=Meaning
|Blue|Below 50 % load
|Yellow|50 % to 70 % load
|Red|Above 70 % load
|Red, dashed|Link down
|Grey, dashed|Administratively disabled, no recent traffic sample (stale), or no speed or counters in LibreNMS (unknown)

A link is "stale" when LibreNMS has not measured it for 15 minutes.

== Topology Map ==

The topology map shows each site's AGG devices as roots, and the ER devices below them in hop tiers. Rings, dual-homed ERs and parallel links are all drawn. AGG and ER devices are shown from the start; other devices are hidden until you select **Show other devices**.

=== Finding and focusing ===

* **Find a device** (or press ##/##): search by name, hostname or sysName. Matches are shown with their direct neighbours.
* **Device group**: show only a LibreNMS device group you may view.
* **AGG root**: focus on one AGG site and its ER branches. Neighbouring AGG sites stay visible at the edge for context.
* **Site**: show one site.
* **AGG backbone**: show only the links between AGG sites.
* **Highlight**: when you select a device, its neighbourhood 1 to 5 hops away is highlighted.

The filters combine: a search never shows devices outside the selected device group, AGG root or site.

=== Devices and links ===

* Click a device for its details and a link to it in LibreNMS.
* Click a link, or its load label, for both interfaces and the load.
* Hold the pointer over a link for a moment to see both interfaces' traffic graphs for the last 24 hours.
* The **Down** count steps through down devices one at a time (or press ##D##).

=== Arranging the map ===

* Drag devices to move them. Choose **Pin position** in a device's details to keep it where it is; pinned devices cannot be dragged and stay put during **Re-layout**.
* **Re-layout** moves only unpinned devices. **Unpin all** releases every pin.
* **Fit** (or ##F##) shows the whole map; ##+## and ##−## zoom.
* **Export PNG** downloads everything visible on the map as an image, not just the part on screen.
* ##Esc## clears the selection.

=== Saved views ===

Your current filters, positions, pins, zoom and pan are remembered in your browser. To keep a named version in LibreNMS:

* **Save view** saves a new view, or updates the view you have selected.
* **Save as new** saves a copy under a new name.
* **Reload views** fetches the newest saved version, for example after you changed a view in another tab.

Saved views are private to you, also from administrators. If a view was changed elsewhere since you opened it, saving it reports a conflict instead of overwriting the newer version; use **Reload views** and save again.

== World Map ==

The world map places each device at the coordinates of its LibreNMS location, on a map of Norway.

* Each marker is one **location**. Its size shows how many devices are there, and its colour the worst status among them: green up, red down, grey unknown. Locations with a down device pulse.
* Each line joins two locations that have discovered links between them, coloured by the busiest of those links.
* Click a location for its devices and connected locations, a device for its details and LibreNMS link, or a line for its links.

=== Link utilization ===

Click a line to see every physical link between the two locations, busiest first. For each link you see:

* a bar per direction (for example ##rossa1agg1 → heiane1er1##) with the load in percent and the traffic rate;
* the interface speed, and where and how recently LibreNMS measured it;
* why there is no load, for a link that is down, disabled, stale or unmeasured;
* **Traffic, last 24 hours**: open it to load the LibreNMS traffic graph for the interface.

Links between devices at the same location are listed under that location, as **Links within this location**.

=== Toolbar ===

|=Control|=What it does
|Find a device or location (##/##)|Search by device name, hostname, sysName or site.
|Device group|Show only one LibreNMS device group.
|Only problems|Show only locations with a down device.
|Core Network|Show only AGG and ER devices (see below) and the links between them.
|Links|Show or hide the lines between locations.
|⚠ Weather warnings|Draw MET Norway's active weather warnings.
|⚡ Power outages|Draw power outages from the grid operators' outage maps.
|Device names|Label markers with their devices' names.
|Addresses|Show the LibreNMS location text and coordinates.
|↻ Refresh|Fetch new data now.
|⛶|Fullscreen.

Core Network, Device names, Addresses, Weather warnings and Power outages are remembered in your browser.

=== Core Network ===

**Core Network** keeps only AGG and ER devices, recognised from their names: a numbered site, then ##agg## or ##er##, then a number. A ##-## or ##_## between the parts is allowed:

* ##name1agg1##, ##name1-agg1##, ##name1_agg1##, ##name1-agg-1## are AGG devices;
* ##name2er1##, ##name2-er1## are ER devices;
* ##router2##, ##fileserver1## and ##aggregator1## are not, because there is no numbered site before the role.

Name prefixes your administrator has configured (for example ##hk-##) are ignored. Devices added by IP address are recognised by their sysName. An administrator can also mark a device as AGG or ER directly.

=== Names and addresses ===

LibreNMS location text is often a street address, so the map hides addresses and device names by default. Markers then show only their device count, and screen readers hear "Location 1", "Location 2" and so on.

* **Addresses** shows the location text and coordinates on the map, and lets search match them.
* **Device names** labels each marker with its devices' names.

The details panel always shows a selected location's and device's real names.

=== The map area: Norway ===

The map stays on mainland Norway. Any place in Norway, the outermost coast included, can be put in the middle of the map, with some sea or neighbouring land around it, but you cannot pan out over the open sea or into Sweden, and zooming out stops where all of Norway is in view. **Fit** (##F##) shows all your located devices, or all of Norway when no devices match the filters.

* Devices **without coordinates** are counted as **No coordinates** and listed in the details panel.
* Devices whose location lies **outside Norway** are not placed on the map. They are counted as **Outside map area** and listed in the details panel. This is usually a wrong coordinate or geocode: correct the device's location in LibreNMS to place it.

=== Weather warnings ===

**⚠ Weather warnings** draws MET Norway's active warnings (wind, rain, snow, ice, storm surge, forest fire and more) as yellow, orange and red areas.

* Locations inside a warning get a **!** badge, and the summary shows how many are **Under warning**.
* Click a warning area, or a flagged location, for MET's description, consequences, advice and the affected locations.

If MET Norway cannot be reached, the map shows the last warnings received, up to six hours old, with a notice.

=== Power outages ===

**⚡ Power outages** shows current and planned outages from the grid operators' outage maps (Fagne, BKK, Glitre Nett and Lyse Elnett / L-nett), read through DRIFT.

On the map:

* **Current outages** are solid red-purple areas; **planned outages** are dashed purple areas. Outages that affect power lines are drawn as thick lines.
* Every outage has a **⚡ pin**, so even a small area, or an outage known only as a point, is visible at every zoom. Click a pin or an area to open the outage.

Locations affected by an outage are marked clearly:

|=Marker|=Meaning
|Heavy ring in the outage colour, pulsing, with an **⚡ OUTAGE** tag|The location is inside a current outage area.
|Dashed ring with a **⚡ PLANNED** tag|The location is inside a planned outage area.
|Dashed ring and a small ⚡ badge|The location is within 1 km of an outage.

* Selecting such a location, or one of its devices, opens the details with a coloured banner, for example **⚡ INSIDE A POWER OUTAGE AREA** with the grid operator, municipality, customers affected and expected end. **Show the outage** opens the outage itself.
* The summary shows **In outage area**. Click it, or press ##O##, to step through the affected locations.
* An outage's details list its state, type, customers affected, times, reason, and the locations and devices inside its area and within 1 km. **Show on the map** fits the whole outage into view.

The details panel, with nothing selected, shows:

* the totals of current and planned outages and customers affected;
* **At your locations**: the outages at or near your located devices;
* **All outages**: the full list, folded away, with **Current**, **Planned** and **All** filters;
* the status line: **Maps read at** shows when DRIFT last read the operators' maps, followed by any map that is stale or could not be read, and any outages that could not be placed on the map.

Selecting a location also asks DRIFT whether that exact place is inside or near an outage, under **Power here**.

{{warning}}
"No outage on the grid operators' maps here" means only that nothing is on those maps at that place. It does **not** confirm that the power is on. The maps are read every five minutes and can lag behind events.
{{/warning}}

=== Keyboard shortcuts ===

Shortcuts work when you are not typing in a text field.

|=Key|=Action
|##/##|Find
|##F##|Fit
|##+## / ##−##|Zoom in / out
|Arrow keys|Pan
|##D##|Next location with a down device
|##O##|Next location inside a power outage area
|##Esc##|Clear the selection

You can also drag to pan, scroll or double-click to zoom in, and Shift+double-click to zoom out.

== Custom Maps ==

**Custom Maps** lets you draw your own maps beside the discovered topology, for example of one site or one service. Choose **New map**, then **Edit**:

* **Add device** places a device you may view; each device appears at most once per map.
* **Add area** draws a labelled box, for example around a site. **Add text** places a free note. Set their label and size in the details panel.
* **Draw line** joins two devices: select the device at each end. A line is dotted until you bind it to an **Interface** of one of its end devices; it then shows that interface's live load with the colours above.
* Drag to arrange. Elements snap to the 20 px grid.
* **Undo** and **Redo** (##Ctrl+Z##, ##Ctrl+Shift+Z## or ##Ctrl+Y##) step through up to 100 edits. ##Delete## removes the selection; ##Esc## stops drawing or clears it.
* **Save** when you are done. **Done editing** saves pending changes; **Discard changes** goes back to the last save. **Export PNG** downloads the map as an image.

=== Sharing ===

Maps are private until you choose **Share read-only**. A shared map appears under **Shared with me** for every LibreNMS user, and its page address can be sent to colleagues. Only you can edit, rename, unshare or delete it.

Each reader sees only the devices and interfaces they may view in LibreNMS. Area and text labels are shown to every reader, so do not put information in them that some readers should not see.

Lines you draw are your own notes: they never change the discovered topology.

=== Limits ===

You can own up to 50 maps, each with up to 500 devices, 2,000 lines and 200 areas or text labels. If the map was saved from another tab or session since you opened it, saving reports a conflict instead of overwriting the newer version.

== Privacy and permissions ==

* Every page shows only the devices, interfaces and links your LibreNMS account may view.
* Saved views and custom maps belong to you. Administrators cannot open your private ones, and they are deleted with your LibreNMS account.
* Weather warnings and power outages are fetched by the LibreNMS server; your browser never contacts MET Norway or DRIFT.

== Troubleshooting ==

|=You see|=What to do
|A device is not on the World Map|Check **No coordinates** and **Outside map area** in the details panel. Give the device's LibreNMS location correct coordinates.
|"Map tiles could not be loaded"|The background map server cannot be reached. Devices and links are still shown.
|"The DRIFT token is missing or wrong"|Power outages are not configured correctly. Contact the LibreNMS administrator.
|"The outage service is unavailable"|DRIFT, or the grid operators' maps, cannot be reached. Try again later; the map keeps the last outages it received.
|An outage you expect is missing|Read the status line under **Power outages** in the details panel. It shows when the maps were read, any map that is stale, and outages that could not be placed.
|The map is black|Reload the page. If it happens again, tell the administrator which browser you use, what you had just done, and anything shown in the browser console (F12).
|"Too many requests"|You have refreshed very often. The map retries on its next refresh.
|A saved view or custom map reports a conflict|It was changed in another tab or session. Reload it, then save again.

== For administrators ==

These settings are made on the LibreNMS server, not in the browser.

=== Power outages (DRIFT) ===

Set the DRIFT address and API token in LibreNMS's ##.env## file (normally ##/opt/librenms/.env##), then run ##php artisan config:clear##:

{{code language="ini"}}
DRIFT_POWER_API_URL=http://drift.example.net:8080/api/power-outages
DRIFT_API_TOKEN=<a DRIFT API token>
{{/code}}

The token stays on the server: it is never sent to browsers or written to logs. Without ##DRIFT_POWER_API_URL##, the **⚡ Power outages** button is not shown.

=== Other settings ===

Further settings are in ##config/libremap.php##:

* ##world_bounds##: the World Map's area, mainland Norway by default; ##null## shows the whole world.
* ##prefixes## and ##overrides##: name prefixes to ignore, and devices whose role (AGG, ER) or site is set by hand.
* ##weather_warnings##, ##weather_lang## and ##weather_contact##: MET Norway weather warnings.
* ##world_tiles##: the background map server.

Installation, upgrades and every setting are described in the project's [[README>>https://github.com/Drakelid/librenms-map#readme]].

After changing any setting, run ##php artisan config:clear## on the LibreNMS server.
