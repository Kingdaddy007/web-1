# Terra Correction Report — Phase 1A Constructed Axis

## Result

Correction accepted as the approved working logo arrival. Hero integration remains gated.

## Root cause and correction

The old `layerTTA` used `clip-path: inset(... left ...)` despite containing all three letters in one raster. The moving left crop exposed its internal letters progressively, visibly producing `TA DESIGNS` at 2.05s.

TTA now starts at 2.10s only after DESIGNS completes. Its full raster crop uses one opacity and translation envelope, with `clip-path: none` at every state. DESIGNS was also changed to a full-group opacity/travel reveal. The authoritative master remains fully hidden until the 2.65s settlement; the defect was not hidden by an earlier crossfade.

## Timing

Before: TTA 1.80–2.75s with a left clip; master settlement 2.65–3.05s; reported 1.30s hold.  
After: TTA 2.10–2.65s, no clip; master 2.65–3.05s; still hold 3.05–4.50s (1.45s). Runtime, HUD, scrubber maximum, storyboard, notes and proof labels all use 4.50s.

## Verification evidence

- Real-browser viewport: 1440 × 900.
- Original browser reproduction: 2.05s showed `TA DESIGNS`, with TTA `clip-path: inset(... 15.9%)` and master opacity 0.
- Corrected deterministic sweep: 81 browser samples from 1.85s to 2.65s inclusive; no TTA clip and no master opacity before settlement. Representative corrected states: 1.85s TTA 0 / clip none; 2.10s TTA 0 / clip none; 2.12s TTA 0.20202 / clip none; 2.65s TTA 1 / clip none, master 0.
- Visual checks: 2.12s, 2.18s, 2.30s, 2.45s and 2.64s show all three TTA letters together; no A, TA, TT or TA DESIGNS state was observed.
- Final frame uses the exact settled master layer; overlay proof states its scope honestly: resting geometry, not independent moving-component accuracy.
- Reduced-motion implementation is a 250ms black hold plus 250ms direct master crossfade. HUD source/effective-state logic was updated; manual override cycles are implemented for direct testing.

## Artifacts regenerated

`storyboard.png`, `intermediate-proof.png`, `final-frame.png`, `overlay-proof.png`, `reduced-motion-frame.png`, `reduced-motion-proof.png`, and `tta-group-entry-proof.png`.

## Files changed

`index.html`, `script.js`, `motion-notes.md`, this report, and the proof artifacts in this folder only.

## Residual risk

The in-app browser session was reclaimed after the original visual reproduction, so later exact-frame captures used the local Chrome browser. A manual reduced-motion click-cycle capture was not retained after the local server returned intermittent asset-path 404s; implementation/source inspection and system fallback logic remain in place. The originally supplied URL omitted the `logo-motion` route segment; the working route below resolves this folder. Full production acceptance remains outside this private study's scope.

## Audit URL

http://localhost:8080/logo-motion/A-constructed-axis-refined/index.html
