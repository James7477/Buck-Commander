# Buck Command V4 — Guardian Edition

Free, phone-friendly hunting field companion. Open the published GitHub Pages link to launch the app. The README appears on the GitHub *repository* page, not in the app on GitHub Pages.

## Working features in V3
- Hunting map (Esri topographic tiles), GPS/manual place lookup, local saved stands/cameras/feeders and saved locations
- Live weather/wind and sunrise/sunset from online services; official-regulation web search links
- Personal hunting journal; original V1 JSON backup and restore for its spots, places, journal
- Emergency page: get **current phone GPS** (separate from searched places), view/copy coordinates and prepared distress text, open phone dialer (`tel:911`) or SMS (`sms:911`) where supported, speak distress text on compatible devices, search nearby help
- Guardian Hunt Plan: save details locally, attach phone GPS when permission granted, manually share/copy plan
- Hazard markers: save local GPS/coordinate hazards and open them in a map
- Hunting Club Finder: manual area or phone GPS opens online Maps search; directories; save favorite clubs on this device
- Club Pro feature preview / explanation

## NOT ACTIVE OR GUARANTEED
- No automatic alert to 911, contacts or hunting clubs; no reliable prerecorded message inside a 911 call. Call button only opens phone dialer.
- No server-backed hunt check-in timer or overdue alerts, automatic fall detection, breadcrumb recording, or offline maps.
- No real-time club member map, stand reservation sync, member accounts, invitations, location sharing, or admin dashboard. They require a secure database, consent/permissions, and additional development.
- No enforceable 7-day trial, billing or yearly subscription. Free vs Club Pro descriptions are a preview, **not** a live paid membership system.
- No verified live database of hunting clubs, vacancies, dues, or memberships. Directory searches show third-party listings.
- CB channel 9 is a US emergency/traveler-assistance channel, **not guaranteed to be monitored**; public safety agencies use other systems.

## Safety
**Do not rely on this app as your sole rescue method.** Call local emergency services in an emergency. GPS may be wrong or unavailable. Phone GPS is not the same as a manually searched map location. Text-to-911 is not universally supported; sending an SMS shortcut does not prove dispatch has received it. Speech synthesis plays through the device, not reliably into a phone call. Map, weather, lookup, and club search generally require internet. This is not satellite SOS.

## Storage and privacy
All saved spots, journal entries, hunting places, Hunt Plans, hazard markers and club favorites remain in *this browser on this device* via browser storage. Clearing data or switching devices may remove them. The original Backup button exports ONLY original spots, places, journal—not new V3 Hunt Plan/hazards/favorite clubs. Location is requested only when user presses a GPS button; other services see necessary search/map requests. Don't share private property markers or medical information publicly.

## Publishing to GitHub Pages
1. Extract this ZIP and upload `index.html` and `README.md` to the **root** of your existing GitHub repository. Replace the old `index.html` file without changing its name.
2. In repo Settings → Pages → Build and deployment, choose Deploy from a branch, `main` and `/(root)` and Save.
3. Open the Pages website link supplied by GitHub. Share **that** link, not the repository link. On iPhone use Safari → Share → Add to Home Screen.
4. Use HTTPS for geolocation (GitHub Pages serves HTTPS). Allow location permission when desired. Hard-refresh after updating.

No account, payment provider, or database is included. Keep the Pages link and browser storage consistent to preserve local records.


## V4: Guardian Compass, Trail Tracker and area records

- **Trail Tracker:** Start, pause/resume, finish, and save a GPS path while the page is open and active. GPS accuracy filtering helps reject very poor fixes. Export tracks as GPX for backup. Tracks and markers are saved only in the device/browser that recorded them.
- **Save Truck / Mark Point:** Use a recent phone GPS fix to save the truck or a point along the trail; target selection shows a true-north bearing and straight-line distance. This is **not** a turn-by-turn route or a guarantee of a safe path.
- **Guardian Compass:** On supported devices, with user-granted sensor permissions, displays a compass heading. Sensor support varies; iOS may need explicit authorization and some phones will show no heading. The bearing to a marker can still work with GPS without the compass sensor.
- **Area Hunting Records:** Search recognizable record-keeping organizations by selected region and species. These are third-party search links, **not** confirmed records, local ranking data, or live results inside the app.
- **Credit:** Designed by James Meadows.

### Important V4 limitations

**Browser GPS tracking is not reliable while backgrounded or the phone is locked.** Keep the app in the foreground and screen awake. GPS may drift or fail in thick woods. Verify position before depending on a trail; always bring a real navigation backup. Internet is needed for the map tiles; exporting GPX works offline once the page is loaded. Do not depend on a web app to summon emergency services. No live club tracking or enforceable subscription/trial is enabled in this build.

### Publishing an update without losing local data

Replace `index.html` in your existing GitHub Pages repository and update `README.md`; keep the same Pages URL and browser profile. V4 stores trails under its own `buck_command_field_v4` local storage key, separate from existing V3 hunting data. Browser data clearing or switching phones still loses locally saved tracks unless they were exported.
