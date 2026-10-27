# Buck Command V12T — Hunting Markers (TEST ONLY)

Preserves the V12S County Explorer, ArcGIS 2D/3D views, address suggestions, Alabama county boundaries, Mobile County parcels and owner labels, saved properties, and lease drawing.

## Test

1. Open `index.html` in Chrome while online.
2. Open an existing saved property or save a new property.
3. Under Hunting Markers, choose Stand, Feeder, Trail Camera or Food Plot. Enter a name and optional notes.
4. Click Place Marker on Map and click its location.
5. Use My Saved Properties > Open Selected to reopen that property; markers should return.
6. Export Backup; the same existing JSON format now also includes the markers. Import Backup will restore them.

Markers save locally per property in the same browser storage as V12S. Because `file://` browser storage can vary by file path or browser, **export a backup** before switching versions. Old V12S backups import without markers. No external camera connectivity or club syncing is included.

This does not alter GitHub or the user's live app.
