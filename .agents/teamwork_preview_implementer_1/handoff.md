# Handoff: Hero-to-Process Parallax Underpass & Pinned Process Window Experiment

## Summary of Implementation
- **Branch:** `experiment/process-window-parallax`
- **Scope:** Completed full implementation of the hero-to-process dimensional parallax underpass transition and pinned single-window process chapter for TTA Designs.

### Key Changes
1. **Preserved Hero Opening:**
   - Identity construction, exact-master hold, and material-to-room pullback (`0.00–7.15s`) intact.
   - Foreground TV occluder, color grade, and responsive framing preserved without regression.

2. **Dimensional Parallax Underpass:**
   - Replaced flat vertical slide with a continuous depth underpass.
   - Foreground hero plane lifts away (`translate3d(0, -100svh, 0)` with copy traveling at `1.12x`), revealing the process scene emerging from underneath with slower depth travel (`(1 - handoff) * 36svh`) and subtle scale settling (`0.96 -> 1.00`).
   - Principal planes maintain opacity 1 with seamless spatial connection.

3. **Pinned Single-Window Process Chapter:**
   - Single fixed 16:9 architectural viewport framing the project sequence without cards/carousels.
   - 4 clean 16:9 landscape assets sequenced in exact narrative order:
     1. `akoka-site-ceiling-open-wide-clean-v1.png` (01 Read the room)
     2. `akoka-site-conversation-wide-clean-v1.png` (02 Align the work)
     3. `akoka-site-painting-wide-clean-v1.png` (03 Refine the surface)
     4. `akoka-site-installation-wide-clean-v1.png` (04 Carry it through)
   - Multi-layer internal counter-parallax: incoming slide translates `100% -> 0%` while inner image counter-travels `-18% -> 0%` (scaled 1.12x), plus living resting glide and outgoing glide.
   - Preloaded in HTML head and JavaScript for zero-flicker decoding.

4. **Typographic & Stage Choreography:**
   - Approved bridge headline (`Before it looks complete, it has to work beautifully.`) with phrase-level baseline reveals.
   - Synchronized stage progress tracker (`01`, `02`, `03`, `04` pills + progress line).
   - Dynamic baseline transition for active stage captions.

5. **Responsive & Accessibility:**
   - Tested and verified at 1440×900, 1920×1080, and mobile 390×844.
   - Full `prefers-reduced-motion: reduce` support with clean discrete states.

## Verification Evidence
- Build: `npm run build` completed with 0 errors.
- Automated Test Runner: Playwright execution tested across all viewports, full scroll and reverse cycle, and confirmed 0 console errors and 0 page exceptions.
- Screenshots generated in `.agents/teamwork_preview_implementer_1/screenshots/`:
  - `01_hero_rest_1440.png`
  - `02_underpass_transition_1440.png`
  - `03_process_stage_01_1440.png`
  - `04_process_stage_02_1440.png`
  - `05_process_stage_03_1440.png`
  - `06_process_stage_04_1440.png`
  - `07_process_stage_release_1440.png`
  - `08_process_stage_02_1920.png`
  - `09_mobile_hero_390.png`
  - `10_mobile_process_stage_01_390.png`
  - `11_mobile_process_stage_03_390.png`
  - `12_reduced_motion_stage_02.png`
