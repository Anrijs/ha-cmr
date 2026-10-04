# Changelog

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
