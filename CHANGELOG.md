# Changelog

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
