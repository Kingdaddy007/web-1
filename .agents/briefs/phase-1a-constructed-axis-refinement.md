# TTA Designs — Concept A Refinement Delegation Brief

## Role

Act as the motion-design implementer for one tightly bounded revision of the approved direction, **Concept A: The Constructed Axis**. This is not a request for a new concept, hero section, Canvas experiment, website transition, or Phase 2 implementation.

Parent direction: Codex / Studio Director  
Mutation ceiling: local files inside the new refinement folder only  
Required output: a standalone, auditable revision that reports back for approval

## Objective

Refine Concept A so the logo animation feels quieter, more deliberate, more brand-specific and more suitable for the opening of a cinematic interior-design website.

Preserve the strongest governing idea:

> The vertical axis establishes order; the D confirms that the axis belongs inside the identity; the remaining typography resolves around that structure.

Remove the current weaknesses:

- No intermediate frame should accidentally read as `TA`, `TA DESIG`, or another malformed brand name.
- Do not animate every letter as an independent performance.
- Do not extend the sequence merely to demonstrate technique.
- Do not reinterpret, redraw, typeset, regenerate or “improve” the accepted logo geometry.

## Authoritative Inputs

- Existing study to inspect, but not overwrite:  
  `C:\Users\Oviks\Documents\WEB 1 Codex\.agents\studies\logo-motion\A-constructed-axis\`
- Approved transparent geometry master:  
  `C:\Users\Oviks\Documents\WEB 1 Codex\.agents\assets\logo-approved-candidates\tta-wordmark-black-transparent-provisional.png`
- Approved white-on-black reference:  
  `C:\Users\Oviks\Documents\WEB 1 Codex\.agents\assets\logo-approved-candidates\tta-wordmark-white-on-black-provisional.png`

The defining identity rule is non-negotiable: the vertical line passes through the counter of the `D`. It is not a separator placed before the `D`.

## Required Motion Law

Use one continuous structural law, not a collection of effects:

1. **Stillness / anticipation** — pure black stage; no decorative particles, glow, grain, HUD graphics or ambient movement.
2. **Axis establishes order** — the central vertical stroke appears with controlled linear growth from its centre or a similarly restrained construction. No bounce, overshoot or luminous flare.
3. **D confirms ownership** — the exact `D` geometry resolves around the already-established axis. This is the principal brand-recognition event.
4. **DESIGNS resolves as one fine structure** — treat `ESIGNS` as one coherent typographic plane or a tightly coupled reveal. Do not perform a visible letter-by-letter cascade.
5. **TTA locks as one grounded mass** — all three heavy letters arrive together as a single unit. There must be no sustained `TA`, `TT`, or isolated-letter reading.
6. **Authoritative settlement** — cross-resolve into the exact approved master and hold in complete stillness.

The motion should feel architectural: establish datum, define structure, balance mass and line, settle. It must not feel like a broadcast ident, tech calibration interface, kinetic-type showreel or nightclub title.

## Timing Target

Target total duration: **4.2–4.7 seconds**, including the resting hold.

Suggested rhythm, adjustable by taste within that boundary:

| Beat | Approximate range | Requirement |
| --- | ---: | --- |
| Black hold | 0.00–0.30s | Brief anticipation only |
| Axis formation | 0.30–1.05s | Controlled, precise, no overshoot |
| D construction | 0.80–1.55s | Overlap is allowed; D-axis relationship must become unmistakable |
| DESIGNS resolution | 1.25–2.35s | One coherent fine structure |
| TTA mass lock | 1.80–2.75s | One grouped arrival, subtle travel amplitude |
| Master settlement | 2.65–3.20s | Exact authoritative PNG takes over cleanly |
| Still hold | 3.20–4.50s | Zero jitter; enough time to recognise the finished identity |

Use long controlled ease-outs such as `cubic-bezier(0.16, 1, 0.3, 1)` where appropriate. The axis draw may remain more linear. Do not use bounce, elastic, back-ease, dramatic scale punches or unnecessary blur.

## Composition and Rendering Constraints

- Stage: 1440 × 900 desktop canvas, black background.
- Keep the logo optically centred at the approved proportion.
- Preserve original aspect ratio, spacing, stroke thickness, `D` counter and TTA/DESIGNS weight contrast.
- Use raster masks or exact crops derived from the approved master; do not substitute fonts.
- The final resting mark must be the approved master, not a separately reconstructed approximation.
- No glow, gold accent, lens flare, particles, chromatic aberration, 3D rotation or depth scattering.
- HUD controls may exist for inspection but must remain visually outside the cinematic composition.

## Accessibility and Fallback

When `prefers-reduced-motion: reduce` is active:

- show a black hold no longer than 200–300ms;
- crossfade directly to the authoritative complete mark;
- do not translate, stagger, scale, blur or construct individual components;
- make the HUD accurately report the **effective** reduced-motion state, including system preference and manual override.

## Output Location

Create a new sibling folder. Do not overwrite the original study:

`C:\Users\Oviks\Documents\WEB 1 Codex\.agents\studies\logo-motion\A-constructed-axis-refined\`

## Required Deliverables

1. `index.html`
2. `styles.css`
3. `script.js`
4. `storyboard.png` — six labelled beats using frames captured from the live implementation
5. `final-frame.png` — 1440 × 900 resting frame
6. `overlay-proof.png` — clear two-channel comparison against the approved master, with mismatches visible rather than hidden by a final-master crossfade
7. `motion-notes.md` — corrected timing table, governing law, geometry method, reduced-motion behavior and known limitations
8. `intermediate-proof.png` — contact sheet at approximately 0.8s, 1.3s, 1.8s, 2.3s and 2.8s proving there is no malformed `TA`/`TA DESIG` brand reading

## Verification Requirements

Before reporting completion:

- Run the sequence at 1440 × 900 in a real browser.
- Inspect the exact intermediate states listed above.
- Verify that once the `D` becomes legible, the axis penetrates its counter correctly.
- Verify the final frame against the approved master at 1:1 rendered scale.
- Verify replay, scrubbing and resize behavior.
- Emulate `prefers-reduced-motion: reduce` and capture the result.
- Check the browser console for errors.
- Confirm that actual runtime, storyboard labels, comparison metadata and `motion-notes.md` all state the same duration.

## Explicit Non-Goals / Phase Gate

Do not:

- build the hero section;
- introduce project imagery or video;
- design the transition from the logo into the hero;
- use Canvas UI, WebGL, Three.js, shaders, particles or external animation libraries;
- install dependencies;
- modify Concepts B or C;
- update the master comparison suite yet;
- begin Phase 2 Canvas Transition Laboratory work.

Phase 2 remains gated until Codex and the user approve this refined arrival sequence.

## Return Contract

Report back with:

1. the exact folder created;
2. the final duration and beat timings;
3. what changed from the original Concept A;
4. verification evidence and screenshots produced;
5. any remaining defect or uncertainty;
6. the localhost URL for audit.

Do not describe the work as approved or selected. Return it as a refinement candidate for Codex audit and user judgment.
