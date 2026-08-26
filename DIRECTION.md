# TTA Authored Hero V1 — The Axis Opens

## Decision

This is one integrated opening and hero, not another transition sample. The approved **Constructed Axis** logo arrival remains authoritative through 3.05 seconds. Its D-axis then becomes the seam of a temporary optical membrane. The room bends through that seam, resolves full-bleed, and the canvas retires so the final hero is ordinary DOM and image content.

## Motion law

1. **Identity is constructed** — exact approved logo sequence, unchanged.
2. **The axis acquires depth** — the D-axis extends as one vertical line.
3. **Space passes through identity** — a refracted room field opens from the axis with sculpted, non-rectangular edges.
4. **The effect disappears** — refraction settles to the real room; the canvas fades out.
5. **The practice speaks** — provisional, evidence-grounded copy enters only after the image is legible.

## Why Canvas is used here

Canvas owns only the 2.35-second material transformation. It does not own navigation, copy, controls, or the resting hero. A custom Three.js shader was selected over Canvas UI Bend because the desired effect transforms a single image field, while Bend is designed around live-HTML folding and its best path relies on experimental HTML-in-canvas support.

The shader's temporary warmth, exposure compression, and vignette decay to zero before renderer handoff. One shared DOM colour grade sits above both the canvas and the resting image, so the final canvas frame and first DOM frame are visually identical.

The custom shader also passes its linear output through Three.js's tone-mapping and output-colour-space shader chunks. This matches the browser's sRGB presentation of the resting image instead of compensating with a fragile brightness multiplier.

The resting DOM image reaches the shader's exact crop and scale before the canvas opacity transfer begins. After the transfer, the clean room holds briefly before navigation and copy arrive; this prevents double exposure and lets the spatial result register first.

## Responsive image art direction

The working room plate is approximately 16:10. Standard laptop and desktop canvases retain its centred composition. Viewports wider than 1.8:1 progressively move the vertical focal point upward, preserving the ceiling architecture instead of allowing `cover` to crop it symmetrically. The DOM background and shader use the same responsive focal values, maintaining an invisible handoff.

## Truth boundary

`tta-living-cinematic-master-v1.png` is a private speculative landscape extension of observed TTA room imagery. It is a replaceable concept asset, not a verified original project photograph for public publishing.

## Review controls

- `R`: replay
- `Space`: pause/resume
- `?debug=1`: show the inspection HUD
- `?auditTime=4.40`: render a deterministic timeline frame
- `?reduced=1`: force the reduced-motion route for inspection

## Source contract

- Approved logo source: `.agents/studies/logo-motion/A-constructed-axis-refined/`
- Approved geometry and component crops copied without modification.
- Hero media source: `.agents/studies/hero-development/monolithic-aperture-refinement/assets/tta-living-cinematic-master-v1.png`
