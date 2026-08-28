# Revised Storyboard and Implementation Sequence

## Purpose

This is the integration plan for browser comments 1–10. It deliberately prevents a rushed full-page rewrite. Each high-judgement decision is first tested as a bounded visual slice, approved, and only then integrated.

## Revised page journey

| Chapter | Visitor meaning | Visual world | Motion law | Primary evidence |
| --- | --- | --- | --- | --- |
| 1. Arrival | This is TTA | Dark material logo stage → completed room | Authored opening sequence | Logo and hero film |
| 2. Reframe | Beauty begins before the finish | The same room redirects toward structure/light | Continuity | Final hero frame + first site evidence |
| 3. Process | Decisions are made close to the work | Registration Room | Spatial registration | Ceiling, conversation, finish, installation |
| 4. Residences | Those decisions become atmosphere | Project Constellations | Formation | Coherent room/detail families |
| 5. Lived use | The room supports actual life | Quiet human insert | Observation | Lived-room/gaming clip if context supports it |
| 6. Practice | TTA remains present | Full-bleed site film | Cinema | One 16:9 practice sequence |
| 7. Inquiry | Begin with how you want to live | Living Lacquer Field | Material response | Headline and CTA |
| 8. Closing | Identity and verified routes | Colophon Underlay | Material withdrawal | Wordmark and contact utilities |

## Global motion hierarchy

The page needs one primary peak and one controlled ending.

- **Primary peak:** logo-to-hero reveal.
- **Secondary moments:** hero reframe, one project formation, and practice film arrival.
- **Resolution:** inquiry material settles and withdraws to reveal the footer.

No later transition may exceed the opening in speed, contrast, layer count, or surprise.

## Sequenced implementation gates

### Gate 0 — Preserve the approved state

- Keep the current branch and live implementation untouched while planning.
- Record the current working tree before starting a new experiment.
- At implementation time, create a dedicated revision branch from the approved concept state; do not mix subcontractor or alternative-concept work.

Exit evidence: exact branch/commit base recorded and current local changes safely accounted for.

### Gate 1 — Typography specimen

Build the isolated specimen described in `06-typography-system.md`.

Compare three directions using the same TTA copy, including:

- desktop and laptop composition;
- mobile line breaks;
- static readability;
- heading reveal;
- CTA interaction.

Do not install or import a font until the candidate source and licence are approved.

Decision required: one display direction, one support direction if necessary, and final motion grammar.

### Gate 2 — Hero-to-process vertical slice

Prototype only the final hero hold through the first process image.

Build two bounded versions:

1. **Continuity Reframe** — recommended.
2. **Cove-Light Spill** — lower-complexity alternative.

Test with the generated hero film and the final-frame DOM fallback. Include mobile in the comparison.

Decision required: which threshold feels seamless without becoming another opening sequence.

### Gate 3 — Registration Room process prototype

Use the four existing process images and final approved type. Build one pinned desktop scene plus the vertical mobile translation.

Compare only the media-boundary behavior:

- contained material/displacement registration;
- authored clip/scale registration with no realtime distortion.

Do not add all copy or decorative systems until the media law is accepted.

Decision required: evidence movement and background material behavior.

### Gate 4 — Asset intelligence and portfolio proof

Audit all extracted frames and source video by project family and narrative role. Produce a contact sheet before coding the full portfolio.

Then build one Project Constellation with one dominant image and one supporting detail. Do not create a multi-project system until this single composition proves the grammar.

Decision required: approved project families, evidence roles, and formation behavior.

### Gate 5 — Practice media production

Select one site source frame and create:

- approved 16:9 restored/outpainted still;
- restrained 6–10 second film test;
- stable poster frame;
- mobile portrait/crop treatment.

Reject the film if people or architecture drift. Use the 2.5D still fallback instead.

Decision required: generated film versus cinematic still.

### Gate 6 — Inquiry shader and CTA

Build the Living Lacquer Field as an isolated full-height scene with real inquiry copy. Compare it with the Topographic Glass alternative only if the first prototype reads as generic fluid art.

Verify:

- visible material behavior;
- text-safe quiet zone;
- pointer and scroll response;
- offscreen pause and cleanup;
- reduced-motion fallback;
- CTA baseline/alignment/focus behavior.

Decision required: final material law and CTA interaction.

### Gate 7 — Footer underlay

Integrate only after the inquiry field is approved, because the footer transition is caused by that field withdrawing.

Use verified contact/social details only. Remove the header-like navigation repetition.

Decision required: Colophon Underlay versus Identity Horizon.

### Gate 8 — Full integration and assurance

Integrate approved slices into one storyboard. Then perform:

- cold-load test for hero-heading flash and logo-exit glitches;
- forward and reverse scroll testing;
- laptop, wide desktop, and representative mobile viewports;
- reduced-motion and Canvas/WebGL-disabled fallbacks;
- keyboard/focus and contrast checks;
- video poster/autoplay/slow-connection behavior;
- performance profiling with only one heavy realtime scene active;
- visual review of every chapter boundary.

Do not call the page final because isolated prototypes work. The complete scroll rhythm is the product.

## Canvas and realtime-rendering budget

- One heavy realtime scene active at a time.
- Inquiry receives the richest shader behavior because it has a clear material purpose.
- Process may use a contained shader only at the image boundary; its background can be Canvas2D/CSS if that is sufficient.
- Portfolio should prefer DOM/layout interpolation over WebGL.
- Practice should be video, not another canvas.
- Cap device pixel ratio and pause all offscreen video/render loops.

## Mobile law

Mobile is a re-authored narrative, not a scaled desktop pin sequence.

- Every proposition shares a viewport with evidence.
- Long pinned scenes become connected vertical chapters.
- Realtime distortion is replaced with discrete authored states on low-power devices.
- Headline line breaks are intentionally composed.
- No chapter requires precision scrubbing to understand it.

## Reduced-motion law

Every scene must have a complete still-state narrative:

- hero room;
- process proposition plus first evidence;
- four process chapters;
- static project spreads;
- practice poster;
- inquiry material still;
- readable footer.

Reduced motion is not a blank page with animations disabled.

## Comment coverage checklist

| Comment | Planned answer |
| --- | --- |
| 1 | Remove repeated portfolio heading animation; use formation with visible proof. |
| 2 | Fuse proposition to first project; audit assets; replace generic parallax and unsupported image choices. |
| 3 | Replace two portrait cards with one full-bleed practice film or stable 2.5D fallback. |
| 4 | Give inquiry a clearly perceptible material shader and practice/inquiry their own heading entrances. |
| 5 | Correct eyebrow weight and rebuild the CTA baseline/arrow alignment. |
| 6 | Replace header-like footer with a cinematic colophon underlay and verified utilities. |
| 7 | Replace the panel-cover transition with continuity from the hero media. |
| 8 | Add grounded practical notes and scene-native text reveals without over-writing. |
| 9 | Rebuild process as a larger, materially alive Registration Room with authored evidence changes. |
| 10 | Keep the hero environment present while copy leaves and camera/focus redirects into process. |

## Recommended next action

Do not begin with the complete page. Build two things first:

1. the typography specimen;
2. the hero-to-process Continuity Reframe vertical slice.

These decisions control line breaks, scene timing, and the visual language inherited by every later chapter. Approving them first prevents another expensive full-page iteration built on the wrong foundation.

