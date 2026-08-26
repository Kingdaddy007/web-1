---
status: implemented-study
scope: private-speculative-prototype
project_id: tta-designs-digital-showroom
updated_at: 2026-08-26
owner: Studio Director
branch: concept/material-registration
---

# TTA Designs Experience Blueprint — Material Registration

## Decision status

The approved Constructed Axis logo arrival remains authoritative through its exact-master settlement. The approved Axis Light Threshold branch remains untouched. The Material Registration opening and its first scroll-led proof chapter are now implemented on this isolated branch for visual judgement; the new proof passage is not yet user-approved.

## Implemented first slice

- Wall source: `public/assets/tta-wall-macro-v1.jpeg`.
- Room source: `public/assets/tta-living-cinematic-master-v1.png`.
- Mechanism: synchronized DOM/CSS room planes with a foreground television occluder; no Canvas/WebGL dependency is active.
- Verification viewports: 1440×900, 1920×1080, and 390×844 reduced motion.
- Local preview route: the Vite root on the port reported by `npm run dev`.

## Implemented proof passage

- Proof source: `public/assets/akoka-site-ceiling-open.jpg`.
- Scroll law: **the finished room yields as attention tilts upward toward the structure that made it possible.**
- Choreography: the hero softens and enlarges; the Akoka construction frame rises and settles; the argument enters only after the image is legible; four early-decision labels complete the hold.
- Final copy: **The room is decided long before the final layer.**
- Evidence boundary: the Akoka image proves process and supervision in its own right. It is not represented as the construction stage of the living-room hero.
- Full timing and responsive behavior: `.agents/contexts/scroll-storyboard.md`.

## One thing the experience must make the viewer feel

TTA's founder should feel that the intelligence already present in the studio's work has finally been given a digital form worthy of it.

## Controlling argument

TTA's refinement is not decoration applied at the end. It is the visible result of decisions made around how people live, before costly mistakes become fixed.

## Audience and desired self-image

- Immediate audience: TTA's founder or decision-maker receiving the private outreach.
- Simulated visitor: a design-conscious Lagos homeowner planning a substantial interior project.
- Desired self-image: discerning, considered, and in control—not merely shopping for a fashionable room.
- Brand tension to escape: beautiful-looking interiors whose function, process, and delivery remain uncertain.

## Governing experience law

**Nothing wipes the room into existence. The camera discovers that the identity and the room already occupy the same material world.**

The opening field is a macro view of the champagne wall-panel material from the selected living room. Its central join carries the wordmark's D-axis. After the logo settles, spatial depth is restored: the camera pulls back, the television and foreground furniture cross in front of the wordmark, and the complete room becomes legible. The mark leaves by physical occlusion, not opacity, a rectangular aperture, a curtain split, or a generic page swipe.

## Selected narrative form

An atmosphere-led opening followed immediately by point-of-view and process proof. The concept earns desire first, then explains why the room feels resolved.

## Compact chapter sequence

### 1. Material signature

- Job: recognition and authorship.
- Visual: warm champagne wall material, restrained grazing light, approved Constructed Axis logo motion.
- Motion: logo constructs; the surface remains almost still.
- Intended feeling: recognition.

### 2. The room reveals its life

- Job: desire and revaluation.
- Visual: the complete living room, room-first and full-width.
- Provisional hero line: **Designed around the way life is lived.**
- Provisional support line: **Refined interiors shaped by movement, comfort, and the decisions that make everything else work.**
- Motion: one architectural pullback into stillness; later hero footage is low-amplitude and does not compete with copy.
- Intended feeling: surprise, then calm desire.
- Primary remembered peak: the moment the wall material registers as part of the complete room.

### 3. Before the finish

- Job: prove design intelligence rather than styling alone.
- Visual: one disciplined Akoka site sequence, led by the open ceiling frame and a short founder/process fragment.
- Copy direction: **The room is decided long before the final layer.**
- Proof to expose: layout, electrical points, plumbing, ceiling, movement, supervision, and early corrections; use only claims already supported by the evidence dossier.
- Intended feeling: respect and authority.
- Implementation status: first static proof frame and pinned scroll choreography implemented; any future founder/process footage remains out of scope for this checkpoint.

### 4. A room with a job

- Job: return process to lived use.
- Visual: truthful fragments from `residential-lagos-portrait.mp4` showing people occupying the finished room, followed by one quiet room/detail frame.
- Copy direction: every space has a job—rest, movement, work, entertainment, or hosting.
- Truth rule: do not identify visible people as clients, residents, or testimonials without verification.
- Intended feeling: reassurance.

### 5. A considered beginning

- Job: show the possibility of inquiry without pretending the prototype is a live funnel.
- Visual: calm editorial close; no loud form, WhatsApp button, or fabricated availability.
- Copy direction: **The right room begins with the right conversation.**
- Intended feeling: confidence and invitation.

## Intended feeling curve

`recognition -> surprise -> desire -> authority -> reassurance -> invitation`

The reveal into the complete room is the single visual peak. The process chapter carries the strongest proof. Every later movement must become quieter.

## Hero composition and typography

- The room remains the largest element and primary proof.
- Use the dark left curtain field as the principal desktop text-safe zone after the pullback.
- Keep the main heading to two or three lines at the target laptop viewport; do not cover the television, chandelier, central wall datum, or sofa silhouette.
- Keep navigation and text as semantic DOM, never inside Canvas.
- Remove `BEGIN A CONVERSATION` from the hero. Inquiry belongs at the end of the compact story.
- A small `RESIDENTIAL INTERIORS — LAGOS` eyebrow is permitted because it is evidenced.
- No serif-as-luxury shortcut, gold UI, fabricated project metadata, statistics, or testimonial language.

## Stillness and motion posture

- Still: the settled logo, the legible complete room, proof captions, and inquiry copy.
- Narrative motion: one material-to-room registration event and one restrained process transition.
- Ambient motion: the hero film performs one subtle curtain/light/camera breath, then resolves to a stable hold for reading.
- Interactive motion: none in the first slice. Pointer parallax is not required to prove the idea.
- Pattern budget: one dominant opening mechanic; supporting movement must remain subordinate.

## Proof choreography

1. Finished atmosphere establishes desire.
2. Early-stage site evidence explains the hidden decisions.
3. Real occupancy footage returns those decisions to daily life.
4. Inquiry appears only after taste and process have both been demonstrated.

## Mobile and reduced motion

- Mobile: begin with a warm material still and the settled wordmark, then cut or crossfade to a separately composed portrait crop of the room. Do not imitate the desktop depth pullback.
- Reduced motion: show the settled logo for a short hold, then a restrained crossfade to the complete room. The same headline and proof order remain available.
- Failure/loading: show the final room poster immediately beneath the opening layer; never leave a blank canvas or hide content while media loads.

## Acceptance and rejection conditions

Accept the direction only if:

1. the logo geometry remains exact;
2. the material surface is visibly related to the final room;
3. the wordmark disappears by credible occlusion or spatial registration;
4. the complete room is readable within roughly two seconds after the logo hold;
5. typography and room retain separate visual authority;
6. the sequence remains convincing with ambient motion disabled.

Reject it if it reads as a zoom preset, a TV commercial, a generic camera pullback, a curtain/wipe in disguise, a synthetic 3D room, or another effect added after an already complete logo animation.
