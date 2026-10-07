# Changelog

## 0.14.1
- Map: the dotted background moves and zooms with the map instead of standing still while you pan, and its dots mark the 20-unit snap grid (spread out further when zoomed out).

## 0.14.0
- Map: a layout's background picture from CMR is drawn under the cables and nodes, placed and scaled as CMR does. Home Assistant reads it from the controller once in the background, shrinks it (a 99-megapixel photo becomes a 160 KB WebP) and reads it again only when the file changes, so the map opens without waiting. Opacity (default 50 %) and repeating the picture are card and dashboard options. Reading files needs the router user's `ftp` and `test` policies; without them the map says so.
- Edit layout: Shift-click or Shift-drag selects several nodes, *Select all* takes every node, and a selection moves together. On a layout with a picture, *Move picture* and *Picture scale* line a floor plan up with the devices; saving moves the nodes rather than the picture, since CMR centres it, so CMR's own editor shows the same map.
- *Last upgrade job* shows the newest job. An upgrade scheduled for a later date no longer hides an install started after it.
- Large networks: each device model is matched to the product catalog once instead of on every poll, and the daily catalog download runs in the background, so a slow or unreachable catalog no longer delays setup or polling.
- A controller that lists itself twice with the same serial (a stale record next to the live one) keeps the live record, whatever order the two arrive in.
- A reply that isn't the REST API (a proxy's error page, another web server on that port) names its HTTP status in the error.
- A missing card bundle no longer stops the integration from loading; the entities work and the log says the cards are missing.

## 0.13.1
- Elbow links now use long runs with small rounded corners and shared branch lanes, matching a network wiring diagram. Nearly aligned nodes connect straight without tiny zigzags; shared port labels are grouped. Node positions stay unchanged, and PoE pulses follow the rounded path.

## 0.13.0
- Map: optional elbow links with right-angle routing around nodes, available in the dashboard and card editors. Port labels, cable details and PoE pulses follow the route.
- Map: administrators can drag existing nodes or move them with arrow keys, optionally snap to a grid, and save their positions back to CMR. Save checks for stale edits, verifies each position and retains any failed changes. Negative coordinates work with both signed and unsigned controller APIs.
- Product photos use transparent WebP images from MikroTik's catalog, thanks to @Anrijs.

## 0.12.2
- Map: a node that opens another layout counts the devices of that layout and the layouts inside it, not the layouts it links back to. With two layouts linking to each other, each node showed the devices of both, and which count a node showed depended on the order the map drew them. The cable between two layouts is found from the same, corrected device sets.

## 0.12.1
- Discontinued devices get their product photo, name and front panel too: the catalog is now fetched with MikroTik's discontinued products. A board name falls back to a discontinued product only when no current one fits, so existing matches stay as they are; the cached catalog keeps serving until the new one is downloaded.
- README: pushing or clearing alert HTTP actions makes the controller run the actions of active state alerts again.

## 0.12.0
- Wi-Fi view and card: the Wi-Fi networks and radio settings CMR applies (bands, security, VLAN, channel), the access points each reaches, and warnings for setups the CMR guide says don't work (a network without a VLAN leaves its clients without network access; radio settings without a band label reach every band). Passphrases are dropped as they arrive, also from diagnostics. Live client counts aren't available from the controller's API yet.
- A *Reboot* button per device, also on the device's card on the map (after a confirmation).
- New setups start with *Allow actions on the controller* on: a router user with `write` is the expected setup. A read-only user turns it off in the options; existing entries keep their setting.
- Pushed alerts carry the upgrade result, the job's counts and run time and the interface change, so the timeline says "Upgrade failed: no upgrade available" or "1 of 1 devices upgraded in 1 min 46 s". The rule's name and severity now come from the controller (verified on 7.26beta1), and the rule is matched by its id, so a renamed rule still maps. The alerts card offers *Update* for rules set up by an earlier version. A rule's *Test* on the controller shows in the timeline as a test push and no longer fires `cmr_alert` or the alert event entities.
- *Install*: a job that fails at once (for example a pinned version the controller doesn't have, "no upgrade available") ends the install on the update entity right away instead of after 20 minutes, so it can be retried; while the device reboots the entity keeps showing the target version.
- Upgrades card: a one-off install job reads "Install …" instead of "? → all", and *Run now* on it says that it simply runs now.
- Brand icon, served by Home Assistant 2026.3+ from the integration itself.
- The product catalog is always on: product photos, names and front panels come from MikroTik's public product list without setting anything up. The *Product catalog URL* option is gone; a URL saved there is ignored.

## 0.11.1
- *Install* failed with "no upgrade available" when the controller didn't already have the new version's packages, for example on the CMR controller itself (the only device with the `cmr` package). It pinned the exact version, and the controller installs a pinned version only from packages it already has. Install now upgrades through the device's channel like the controller's own Upgrade button, which downloads what is needed; only an explicitly requested other version is pinned.
- Upgrades card: a failed pinned job explains why, and the controller's own upgrade no longer shows as stuck in "rebooting" (it restarts before the job can record the result).

## 0.11.0
- Alerts follow CMR's two kinds of rules: a state alert (thresholds, connected/disconnected, update available) is *active* while it matches and is what the cards count; an event alert (reboots, finished upgrades and jobs, interface changes, log lines) fires per occurrence and never stays active, so its row shows how often it fired and explains why it lists no devices, and the timeline reports its occurrences from each poll unless it pushes them itself. *Alert rules firing* is now *Active alert rules* (existing entity ids stay). A finished-upgrade-job alert is recognised by its outcome value too (`success`/`fail`), so it no longer picks up a device from its text.
- Map: hovering a device lists the cables it uses (port, far end, PoE) and, with the product catalog on, draws its front panel from the catalog's port counts: linked ports lit, PoE-out ports marked, SFP and QSFP cages apart. The catalog cache is refetched once to pick up the port data.
- Map: *Rebuild links* (administrators, with actions allowed) creates a layout's links from the ports the controller detected, without the controller's GUI.
- Upgrades card: select a job to see its devices with the controller's state and reason for each (e.g. *no upgrade available*, which CMR counts as failed). Administrators can run a scheduled job now or cancel a scheduled, queued or running job.
- Upgrades card: a rule step with more than 12 devices lists them by version transition ("306× 7.24.2 → 7.24.5", most first) instead of a row of icons; each opens the matching devices.
- Events: CMR's own log lines (upgrades, alert actions) belong to the device they name instead of the controller, and so do pushed alerts that arrive without device placeholders (finished-job alerts stay fleet-wide). The events card's device filter is a search field with suggestions and accepts part of a name.
- Lighter dashboard updates: layouts and map nodes are sent again only when they change (links still every poll, for their counters), each catalog product once per controller, and fields no card reads are gone. The status card shows its counts from the fleet sensors while the first update is on its way.
- Map for big fleets and phones: zoomed out, devices are status dots, then names, then cards; a click or tap opens a device card with its address to copy and links to its update, its device page and the device table (a double-click zooms instead); *Find on map* and *Zoom to problems*; one-finger pan and two-finger pinch on touch screens; on a phone the map opens readable from its left edge, 240 px to 60 % of the screen tall.

## 0.10.9
- The "pre-release" marker on versions is gone from the map tooltip, status card and device table: it was our own reading of the version string, not a RouterOS notion, and the channel is shown anyway.
- The integration's own HTTP session is a plain aiohttp session (closed on reload and at shutdown), which removes a Home Assistant warning about closing a helper-created session.

## 0.10.8
- Overview layout: Devices and Events share the left column, Alerts and Upgrades the right one, so a short device list no longer leaves a gap beside a long alert list.

## 0.10.7
- A device already on its channel's newest version showed its RouterOS update as "Unknown" (the controller reports no available version for it); it now reads up to date.

## 0.10.6
- Pushed alerts use the controller's own `[alert-name]`, `[severity]` and `[category]` placeholders, so a renamed rule keeps pushing the right name; the values set at push time stay in the body as a fallback for builds without these placeholders. Pushed alerts carry a `category`.
- Housekeeping: Wi-Fi dedup bookkeeping only while that feed is on; tests run with the shipped defaults; stricter TypeScript checks.

## 0.10.5
- Detected issues can be dismissed (✕ on the events card and in the status card's issues panel, administrators only): the issue clears everywhere and comes back only on new occurrences.
- Alert firing is amber and disconnected red (they were both red); a device waiting to pair is purple; offline devices lose their colour on the map.

## 0.10.4
- Each controller gets its own HTTP session, closed on reload: the router keeps a REST session's rights as they were at login, so after granting the user `write`, reloading the integration now really logs in again (before, upgrades kept failing with "not enough permissions"). The upgrade error says so.

## 0.10.3
- Clicking a device on the map or in the device table opens its RouterOS update (with Install) when one is waiting, instead of the connectivity sensor.
- "Firmware" is now "RouterOS" everywhere (entity names, the per-device tile, the README): in MikroTik terms firmware is RouterBOOT, and these are RouterOS upgrades. Existing entity ids are unchanged.

## 0.10.2
- Map tiles show the available version with an up-arrow instead of "installed → available", which overflowed the tile; the tooltip still shows both.

## 0.10.1
- Firefox (and other browsers without native scoped custom element registries): the dashboard always failed with "Timeout waiting for strategy element ll-strategy-dashboard-cmr". The cards and the strategy are now registered once Home Assistant's own elements are, so its registry polyfill sees them.

## 0.10.0
- CMR is public with RouterOS 7.26beta1: the integration is now called "MikroTik CMR", and the README names the platform and the RouterOS requirement.
- Update entities link to MikroTik's changelog for the device's release channel.
- Releases are regular releases from here on, so HACS offers them without "Show beta versions".

## 0.9.2
- "Timeout waiting for strategy element" after an update: the page now reloads itself once when that happens, and the card script logs its load timing for bug reports.
- A dashboard pinned to one controller no longer shows another controller while its own is still starting; it says so instead.

## 0.9.1
- The overview's device card is compact: only devices needing attention, eight rows, a link to the full table (`compact` option).
- Label chips show the eight most used labels; the rest open from "+N more" with a search box.

## 0.9.0
- Alert rules open to the devices they fire on (alerts card and the status card's alerts panel), with "Show in Devices" and "Show on map": the device table filters to them, the map dims everything else. Needs the REST user to run console commands; `?cmr_alert=<rule id>` deep-links.
- The healthy status is called "OK" (it was "Online", which read like the connection count).

## 0.8.2
- Repetitive log lines that differ only in an address or a number fold into one timeline row.
- The card script is cached by the browser (faster dashboard loads).

## 0.8.1
- Add dashboard asks which controller the CMR network dashboard shows; the "first of several controllers" note is gone.
- The map grows to fit large layouts (up to 85% of the window, `max_height`), zooms closer, and double-click zooms in.

## 0.8.0
- Large fleets: per-device diagnostic sensors are off by default (also turned off once on existing installs), the Devices view is the table only above 24 devices, the auto map wraps.
- "Edit dashboard" on a CMR network dashboard picks the controller; with several controllers, each dashboard says which one it shows.
- The fleet Wi-Fi probe is off until controllers filter it properly.

## 0.7.2
- Connection errors name the port you entered, and say when a port speaks plain HTTP while HTTPS is on.

## 0.7.1
- Connection errors say what to fix (service refused on port 443/80, no route, timeout, certificate) instead of a raw error.

## 0.7.0
- Device table for large fleets: attention first, status chips with counts, search, a version filter, and the healthy devices fold into one line.
- The status card's tiles open the list behind the number (offline since when, updates, firing rules, issues, devices to approve); the version bar lists who runs what.
- "Open in Devices" from those panels; `?cmr_status=…` links pre-filter the table on any dashboard.

## 0.6.0
- One click on the alerts card makes every alert rule push to Home Assistant (and one to stop); the script is only shown when actions are off.

## 0.5.2
- Pairing Repair texts pass Home Assistant's translation validation.

## 0.5.1
- Upgrade jobs show their real state and "starts in …" for scheduled ones.
- A Repair hint when the controller's topology tracking is off.
- Wi-Fi client events from every access point, used as soon as the controller serves them over REST.

## 0.5.0
- Approve the pairing of new devices from Home Assistant: a Repair issue per waiting device (fixable when actions are allowed) and an Approve button on the Devices card.
- The upgrades option is now "Allow actions on the controller" (same setting, wider meaning).

## 0.4.1
- Scheduled upgrade jobs no longer show as "installing" for days.
- Label selectors follow the controller's grammar (`+and`, `-not`, `all`).
- Pairing shows where to approve (controller or device); offline time comes from the controller.

## 0.4.0
- Reconfigure: change the controller's address, user or HTTPS settings without re-adding it.
- Options: issue-detection thresholds, catalog URL checked on save, changes apply without a reload.
- Map nodes work with the keyboard; legend stays on small screens.

## 0.3.0
- Every card shows when the controller is unreachable, and how old its data is.
- Cards share one base; the map reuses its scene between renders (smoother dragging).

## 0.2.4
- Per-device alert counters now work (they were never returned over REST).
- Home Assistant integration test suite and GitHub Actions CI.

## 0.2.3
- Fixes: stuck offline issue for removed devices, install progress for rule-driven
  upgrades, events card per controller, copy button on plain-http Home Assistant.
- No more guessed device "roles"; photo or generic icon instead.

## 0.2.2
- Fix a crash when an alert rule starts firing.

## 0.2.1
- No empty space under the topology map.

## 0.2.0
- Optional product photos from a product catalog URL.

## 0.1.0
- First release.
