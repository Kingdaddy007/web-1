---
status: delegated-experiment
scope: hero-handoff-and-process-window
branch: experiment/process-window-parallax
base_commit: f5e4184
updated_at: 2026-08-26
owner: Studio Director
---

# Delegation Brief — Process Window Parallax Experiment

## Your role

Act as a senior motion designer and frontend engineer. Build one coherent alternate version on this branch. Do not produce a menu of concepts. Make the strongest version, inspect it in a real browser, and iterate until the motion reads clearly.

## Objective

Replace the current hero-to-process handoff and process reel with a more dimensional, responsive scroll experience:

1. preserve the approved TTA logo construction and material-to-room opening exactly;
2. improve the hero typography choreography without competing with the logo animation;
3. transition from the settled hero into the process chapter through a restrained depth/parallax handoff—not a fade, blur, ordinary vertical page slide, wipe, or portal;
4. tell the process story inside one pinned architectural media window using a continuous scroll-driven image procession;
5. synchronize the active photograph, copy, numbering, and internal image parallax so the sequence explains itself.

## What must remain unchanged

- Approved Constructed Axis logo geometry and timing through the settled room.
- Hero room image, foreground-TV occlusion, color grade, and responsive framing logic.
- No fabricated statistics, testimonials, project claims, or direct before/after relationship between the hero room and Project Akoka.
- Existing `concept/material-registration` branch must remain untouched.

## Governing motion law

**The finished room becomes the foreground plane; the work behind it is discovered through depth. Once inside the process chapter, one fixed architectural window carries a continuous project reel.**

The transition should feel like the viewer's eye moving beyond the finished surface, not like one web section replacing another. Use differential vertical travel, scale, and occlusion to establish depth. Keep opacity at `1` for the principal hero and process planes during the handoff.

## Hero-to-process handoff

Design a short scroll-controlled parallax underpass:

- The complete hero is the near plane.
- The process field already exists behind it at a slower depth rate.
- As scrolling begins, hero copy and foreground furniture may travel slightly faster than the room plane; the room plane travels faster than the process field.
- The process field should become fully registered within roughly `0.7–1.1` viewport heights of scrolling.
- The last hero pixel and first process pixel must feel spatially connected. Avoid a visible blank strip, dark flash, opacity dissolve, or hard section boundary.
- Do not repeat the opening's logo/material trick. This is a quieter focal transfer.

The exact transform ratios are yours to tune from browser evidence. Start with a restrained amplitude hierarchy such as foreground `1.08`, room `1.0`, and process field `0.30–0.45`, then adjust optically rather than treating those values as requirements.

## Pinned single-window process chapter

Use one pinned media viewport rather than four independent cards.

- The window may occupy approximately `46–58vw × 58–70vh` on desktop.
- All process photographs pass through this same window.
- The outer window remains stable while outgoing and incoming media travel vertically.
- The image inside each moving media plane must counter-travel at a lower amplitude, creating a genuine parallax window rather than a normal slideshow.
- The sequence is scroll-bound and reversible. It must stop immediately when scrolling stops.
- It may feel continuous or apparently infinite while the pin is active, but it must have a definite beginning and end and must not trap the visitor.
- Keep captions and copy in semantic DOM outside the raster images.

Suggested image sequence:

1. `akoka-site-ceiling-open.jpg` — reading the exposed room and ceiling structure;
2. `akoka-site-conversation.jpg` — aligning decisions with the site team;
3. `akoka-site-painting-wide-clean-v1.png` — refining light, texture, and finish;
4. `akoka-site-installation.jpg` or a future clean landscape derivative — carrying the work into a resolved atmosphere.

The supplied originals are portrait source evidence. Do not crop away the communication subject merely to fit a landscape box. Use clean 16:9 derivatives when available. Preserve the originals unchanged.

## Copy direction

The current line `The finish is what you see. The thinking starts much earlier.` is not approved. Rewrite the bridge so it directly continues the hero promise `Designed around the way life is lived.`

Recommended provisional bridge:

- Kicker: `From the first site decision`
- Headline: **Before it looks complete, it has to work beautifully.**
- Support: `On site, TTA shapes how light lands, how people move, and how every finish meets—so the final room feels effortless.`

Treat this as a starting point, not mandatory final copy. Any rewrite must be shorter or clearer, conversational rather than corporate, evidence-safe, and understandable without design jargon.

Per-image copy may use:

1. `Read the room` — `See what the space needs before the ceiling closes.`
2. `Align the work` — `Resolve decisions with the people building them.`
3. `Refine the surface` — `Test light and texture in the room itself.`
4. `Carry it through` — `Let every early decision support the final atmosphere.`

## Typography motion

- Preserve the hero headline's current lower-center composition unless a browser comparison proves a stronger hierarchy.
- Replace generic whole-block fade/translate behavior with line-level or phrase-level clipping tied to the typographic baseline.
- The headline may resolve in two measured lines, with the second line completing the thought after the first—not letter scatter, random stagger, kinetic-type showreel behavior, or excessive masking.
- During the process pin, only the active phrase and its number should change. Use vertical line replacement, clip reveal, or baseline registration; avoid repeatedly fading the entire copy block.
- Text must remain readable when motion is disabled.

## Lenis and implementation boundary

- First test the experience with native scroll plus requestAnimationFrame or GSAP ScrollTrigger.
- You may add Lenis only if it measurably improves scrub continuity in browser testing. If added, integrate it correctly with ScrollTrigger, respect reduced motion, document the dependency, and prevent nested or doubled smoothing.
- GSAP is already available. Three.js exists but is not justified for this experiment.
- Do not add Canvas/WebGL merely for novelty; DOM/CSS/GSAP can own this composition.

## Image generation boundary

- `public/assets/akoka-site-painting-wide-clean-v1.png` is the first generated 16:9 feasibility test.
- It removes the embedded `INVESTING` text and TTA watermark and outpaints the portrait source into a landscape room.
- Generated side areas are speculative. Keep the asset clearly labeled as a derivative and do not describe it as an untouched documentary photograph.
- Do not overwrite any original selected visual.
- If producing further derivatives, use versioned filenames and record the exact prompt and source.

## Responsive and accessibility requirements

- Desktop targets: `1440×900` and `1920×1080`.
- Laptop crop must preserve the room ceiling and hero text hierarchy.
- Mobile target: `390×844`; use a deliberate portrait composition, not a shrunken desktop pin.
- Reduced motion: replace scrubbed continuous travel with discrete, fully readable image states or an ordinary stacked sequence. Never remove proof.
- No horizontal overflow, scroll trap, inaccessible text, or dependency on pointer movement.

## Verification requirements

Before reporting completion:

1. run the production build;
2. cold-scroll the complete sequence once without reading code;
3. sample hero rest, handoff entry/middle/exit, all four media states, and final release;
4. verify motion stops when scroll stops;
5. inspect console and network errors;
6. inspect desktop, mobile, and reduced-motion screenshots;
7. confirm embedded source words/watermarks are absent from all visible derivatives;
8. confirm the sequence has a real end and releases the pin normally.

## Return contract

Report:

- exact files changed;
- dependencies added, if any;
- the final physical motion law and why it suits TTA;
- local preview command and URL;
- screenshots/contact sheet covering all required states;
- build and browser-test results;
- remaining visual or truth-boundary risks;
- the final commit hash pushed to `experiment/process-window-parallax`.

