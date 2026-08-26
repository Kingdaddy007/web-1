---
status: production-brief-draft
scope: hero-media
updated_at: 2026-08-26
owner: Studio Director
---

# Hero Media Production Brief — Material Registration

## Authoritative source selection

Use:

`C:\Users\Oviks\Documents\web-1-material-registration\public\assets\tta-living-cinematic-master-v1.png`

Source lineage:

`residential-living-arrival.jpg` -> private speculative wide reconstruction -> `tta-living-cinematic-master-v1.png`

Why this source wins:

- it is the only available room plate with enough horizontal composition for a laptop hero;
- the wall-panel joins, television, chandelier, curtain field, sofa, and layered tables create usable depth planes;
- the left curtain gives typography a natural low-contrast text-safe zone;
- the visible entertainment objects imply lived use without inventing a person or testimonial;
- it can support a replacement path when TTA supplies original media.

Do not use the portrait residential video as the full-bleed hero. Its 720x1280 framing, repeated handheld movement, and human emphasis make it stronger as a later lived-use proof beat.

## Required media set

1. `hero-room-final`: the current 16:10 wide master, minimally corrected only when needed.
2. `hero-wall-macro`: a matching close material view of the champagne wall-panel surface with one vertical join aligned to the D-axis.
3. `hero-room-depth-layers`: wall/background, TV and console, curtain, sofa/table foreground, with clean alpha or masks if the web-native 2.5D route is selected.
4. `hero-room-film`: an optional 6–8 second settled-room shot created from the final master; it plays once and resolves to the poster rather than running as permanent wallpaper.
5. `hero-room-poster`: a compressed, color-matched fallback identical to the final resting composition.

## Still-generation prompt — hero wall macro

Use the selected TTA living-room master as the only visual reference. Create a photorealistic, straight-on macro plate of the same champagne-beige architectural wall panel behind the television. Preserve the exact warm-neutral hue, glossy-lacquer material, subtle vertical panel rhythm, top-front warm lighting direction, and the room's restrained contemporary character. Place one extremely fine vertical architectural join precisely at the center of the frame so it can align with the vertical axis passing through the D in the TTA Designs wordmark. The surface should show quiet material depth: restrained grazing-light falloff, minute finish variation, and soft realistic reflection—never glitter, marble veining, concrete brutality, black void, sci-fi particles, liquid distortion, fabric folds, gold decoration, or a generic luxury texture. Frame at 16:10, 2560x1600 or larger. No logo, no text, no television, no furniture, no chandelier, no people, and no added architecture. The generated plate must feel like a close camera position within the exact same room, not a different material sample.

Negative prompt:

`black background, dark void, marble, terrazzo, raw concrete, plaster cracks, fabric, velvet, metallic gold, sparkles, particles, smoke, liquid, portal, doorway, decorative pattern, visible furniture, visible television, text, logo, people, distorted panel lines, dramatic vignette, cold blue light`

## Image-to-video prompt — settled hero shot

Create a restrained 6–8 second cinematic interior shot from the supplied TTA living-room master. Preserve every architectural line, object, material, proportion, and placement exactly: chandelier, recessed ceiling channels, champagne wall panels, black television, floating console, PlayStation and controllers, curtains, sofa, layered coffee tables, rug, doorway, and artwork. Do not redesign, add, remove, morph, or clean away objects. Use an almost imperceptible camera drift of approximately 2–3 cm from left to right with a very slight forward breathing movement, as if captured on a locked cinema slider. Let only physically plausible ambient details move: an extremely subtle curtain response, minute warm-light fluctuation, and natural exposure breathing below the threshold of distraction. Keep the center wall and chandelier stable. Preserve the darker left curtain as a clean text-safe zone. The film must feel inhabited through atmosphere and existing objects, not through added people. Motion should be most perceptible in the first three seconds, then decay smoothly until the last two seconds are visually stable and match a clean final poster for typography and handoff. No zoom preset, orbit, handheld shake, rack focus, dolly rush, lens warping, object wobble, geometry drift, new decor, people, smoke, particles, or day-to-night change. 16:10 master, 24 fps, natural motion blur, high detail, warm neutral grade.

## Optional human-presence rule

Do not add a generated person to the hero film in the first pass. The existing room and entertainment objects already imply life. Use the real `residential-lagos-portrait.mp4` later for human proof. A generated human may be reconsidered only if a later storyboard names a specific communication job and TTA approves the representation.

## Web transition choreography

1. 0.00–3.05s: approved Constructed Axis logo arrival over `hero-wall-macro`; no hero motion.
2. 3.05–3.30s: exact-master hold; the wall join and D-axis remain registered.
3. 3.30–5.10s: controlled architectural pullback. Wall texture reduces in scale; perspective and real room layers restore depth. TV/foreground geometry crosses in front of the mark and occludes it.
4. 5.10–5.55s: complete room settles; transition layer retires.
5. 5.55–6.35s: eyebrow and headline enter in short grouped moves after the room is fully readable.
6. 6.35s onward: the room film decays into its final poster hold. No second reveal, light sweep, parallax cursor, infinite ambient loop, or continuous shader behavior.

## Text-safe and crop requirements

- Desktop target: 1440x900 and common wide laptop ratios up to 1920x1080.
- Preserve the chandelier, ceiling perimeter light, television, right sofa profile, and central tables.
- Place principal copy over the left curtain field; keep at least 6vw from the left edge and avoid the logo's opening axis.
- Mobile receives a separate portrait crop or still, with typography below or in a quiet upper field; do not center-crop the desktop master blindly.

## Canvas decision gate

Build the transition first with layered DOM/CSS transforms and real masks. Compare one contained Canvas/WebGL depth slice only if the DOM version cannot preserve convincing perspective and occlusion. Canvas does not own the settled hero and must dispose immediately after handoff.

Acceptance evidence for any Canvas slice:

- identical final frame and crop to the DOM hero;
- no geometry swimming, halos, texture tearing, or exposure jump;
- stable desktop resize and representative mobile fallback;
- reduced-motion path bypasses the effect;
- animation frames, listeners, textures, and WebGL resources release after handoff;
- no simultaneous heavy realtime canvas and hero-video decoding after settlement.

## Production stop conditions

Stop and return to the source plate if the generator changes the room, adds decor, turns the sequence into a generic luxury commercial, or cannot hold architectural geometry. A high-quality still with a web-native pullback is preferable to unstable AI video.
