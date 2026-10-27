# Buck Command V12U — Hunting Records TEST

Based on V12T. Adds editable management records to saved property markers.

- Stands: type, condition, last check, next check, notes.
- Feeders: feed type, last fill amount in pounds, condition, dates, notes.
- Trail cameras: brand/model, battery percentage, recent sightings, condition, dates. No camera-cloud synchronization.
- Food plots: acreage, crop/seed, planting date, condition, dates.
- Select a marker to load its fields; use Save Marker Changes to update it.
- Existing markers and backups remain compatible. All records are saved locally with their property and included in the backup JSON.

## Test
Open index.html, open or save a property, add a marker, select it, change details, click Save Marker Changes, close/reopen that property and verify the details. Export Backup before switching versions.

This is an isolated preview. Do not deploy to GitHub. Recorded acres and conditions are user-provided and are not independently verified.
