# Alternate Model Review — 2026-08-29

## Objective

Perform an independent last-mile creative and technical review and polish of the TTA Designs cinematic website on branch `review/alternate-model-pass-2026-08-29`.

## Evidence & Inspection Summary

A cold-scroll inspection in headless Chrome across Desktop (1440x900), Mobile (390x844), and Reduced Motion modes identified the following defects:

1. **Residence Procession — Slide 3 Copy Premature Fade & Counter Collision**:
   - Slide 3 (*"Light gathers here"*) copy left the stage too early due to an aggressive `exitProgress` curve starting at `portfolioProgress = 0.90`.
   - Slide counter badges (`figcaption`: `01 / 03`, `02 / 03`, `03 / 03`) overlapped because all slide containers remained visible in the pinned frame without active slide occlusion.
2. **Mobile (390px) — Hero Logo Overflow**:
   - The rightmost character of the logo wordmark (`S` in `DESIGNS`) clipped on 390px viewports during the logo timeline due to `LOGO_AXIS` translation.
3. **Reduced-Motion Mode — Horizontal Overflow (2260px)**:
   - On desktop with reduced motion, `.project-main` retained `90vw` width and absolute horizontal offsets (`left: 40vw`, `left: 67vw`), creating horizontal overflow.
4. **Life Story — Coda Ascender Clipping**:
   - `.life-story-coda h2` top ascenders (*"A room holds together..."*) clipped at the top of the viewport due to tight line height and vertical translation without top clearance.
5. **Founder Portrait — Head Crop**:
   - On desktop viewports, `.founder-portrait img` cropped the top of Tolu Ajayi's head with `object-position: 50% 50%`.
6. **Inquiry Panel Drawer — Container Overflow**:
   - When closed, the transformed sheet could contribute to document overflow if not clipped by its modal container.

## Improvements Implemented

1. **Residence Procession Timing & Badge Isolation**:
   - Extended Residence 03 hold range up to `0.96` before fade-out.
   - Tied `figcaption` opacity and slide occlusion to individual panel reveal progress.
2. **Mobile Logo Sizing & Position Protection**:
   - Added responsive constraints for `.logo-wrapper` on screens under 480px.
3. **Reduced Motion Layout Repair**:
   - Normalized `.portfolio-stage`, `.project-constellation`, and `.project-main` in reduced motion mode into clean, centered vertical document flow.
4. **Typographic & Portrait Framing Polish**:
   - Adjusted `.life-story-coda` box model to prevent ascender clipping.
   - Refined `.founder-portrait img` `object-position` to `50% 16%` for head and eye preservation.
   - Strengthened proposition subtext legibility.
5. **Inquiry Drawer Containment**:
   - Added `overflow: hidden` to `.inquiry-panel` to prevent viewport scroll leakage.

## Verification

- `npm run build` passes with zero errors.
- Visual inspection confirms smooth procession hold, single counter badge per slide, preserved founder portrait framing, clean mobile logo fit, and 0 horizontal overflow across all modes.
