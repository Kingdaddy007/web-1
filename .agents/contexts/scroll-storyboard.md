---
status: implementation-contract
scope: hero-to-process
updated_at: 2026-08-26
owner: Studio Director
branch: concept/material-registration
---

# Scroll Storyboard — The Work Beneath the Finish

## Activation rationale

The hero and process chapter must behave as one continuous vertical journey. The transition cannot be a dissolve between unrelated screens, and the process argument requires several photographs to become legible in sequence. A bounded sticky storyboard remains justified.

## Controlling argument

The final atmosphere is the visible outcome. TTA's value begins earlier, through decisions made in the room while the work can still be shaped.

## Feeling curve and peak

`desire -> descent into process -> recognition -> confidence`

The opening material-to-room registration remains the visual peak. This chapter is not another reveal effect. Its pleasure comes from seeing real work accumulate into a coherent result.

## Physical law

**The finished room lifts away like the top page of an architectural folio; the work beneath it continues upward as a measured project reel.**

The hero never fades. It travels out of the viewport on the same vertical axis as the user's scroll. The process canvas rises directly behind it. Once registered, a sequence of differently proportioned photographs moves upward through a fixed editorial field. Image crops travel more slowly than their frames, creating real depth without suggesting a false before-and-after relationship.

## Beat map

| Beat | Label | Scroll depth | Controlling idea | What the user sees | Feeling | Register | Continuity | Copy mode | Transition out |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | The Finished Hold | 0–10% | The desired atmosphere has been established | Settled hero with centered lower typography | Calm desire | FINISHED | Warm room and central axis | ATMOSPHERIC | VERTICAL LIFT |
| 2 | Beneath the Finish | 10–31% | The visible room rests on earlier work | The entire hero moves upward while a warm process canvas rises from below | Curiosity | TRANSITION | One continuous vertical trajectory | SILENT | REGISTER |
| 3 | Read the Room | 31–49% | Site conditions are understood before they are concealed | Open-ceiling supervision frame crosses the reading line | Attention | PROCESS | Vertical image reel | EDITORIAL | PROCESS RISE |
| 4 | Align the Work | 49–67% | Decisions are clarified with the people executing them | On-site conversation frame replaces the first | Recognition | PROCESS | Shared crop rhythm and captions | EDITORIAL | PROCESS RISE |
| 5 | Refine the Surface | 67–84% | Light and finish are resolved in the actual room | Surface-application frame passes through the composition | Respect | PROCESS | Material tone and measured spacing | EDITORIAL | PROCESS RISE |
| 6 | Carry It Through | 84–100% | Early attention becomes a composed final atmosphere | Finished Akoka frame settles and the closing statement becomes fully legible | Confidence | PROCESS | Ceiling geometry and warm light | DECLARATIVE | HOLD |

## Process copy

- Kicker: `How the room comes together`
- Headline: **The finish is what you see. The thinking starts much earlier.**
- Support: `TTA works through the room on site—reading the space, aligning the team, refining the surfaces, and carrying those decisions into the final atmosphere.`

Image captions:

1. `Read the room` — `The structure and services are considered before they disappear.`
2. `Align the work` — `Decisions are clarified with the people bringing the room to life.`
3. `Refine the surface` — `Light, texture and finish are tested where they will actually live.`
4. `Carry it through` — `The final atmosphere inherits every decision made before it.`

## Desktop choreography

- Scroll owner: one sticky stage of approximately `430svh`.
- Hero handoff: `translateY(0 -> -100svh)`; no blur, opacity, scale exit, wipe, or crossfade.
- Process canvas: `translateY(100svh -> 0)` on the same interval, producing a physical page-to-page handoff.
- Process copy: fixed left editorial field once the canvas registers.
- Image reel: right-side vertical track with four unequal frames; the track travels upward while internal crops counter-travel at lower amplitude.
- Captions remain attached to their photographs. There is no detached technical ledger.
- Final frame holds without an ambient loop.

## Mobile and reduced motion

- Mobile: hero still lifts vertically. The process copy becomes an introductory block, followed by an ordinary stacked image sequence with restrained crop movement; no long desktop pin is simulated.
- Reduced motion: use discrete stacked states. The hero and process section remain adjacent in document flow with no crossfade, blur, or counter-travel.
- Loading failure: the process argument and all captions remain readable against the warm field, with reserved frame dimensions preventing layout collapse.

## Truth boundary

The selected images are observed TTA process and completion material from Project Akoka. The section describes a general working sequence and does not claim that the Akoka project is the construction stage of the separate hero living room.

## Acceptance conditions

1. The approved autoplay opening remains unchanged at scroll position zero.
2. The hero leaves by vertical travel, never opacity.
3. Process images explain the sequence without detached labels such as `Electrical` or `Movement`.
4. Embedded social captions and logos remain outside every visible crop.
5. Image movement stops when scrolling stops.
6. The process chapter remains quieter than the opening while still feeling authored.
7. Mobile and reduced-motion experiences preserve the same sequence and truth boundary.
