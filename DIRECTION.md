# TTA Alternative Concept — Spatial Focus Pull

## Visual thesis

The practice turns atmosphere into a resolved place. The transition therefore behaves like a cinematic focus pull rather than an architectural wipe: light, colour and mass become perceptible before individual details lock into clarity.

## Why this is a complete alternative

- The approved Axis Light Threshold uses identity geometry to reveal space.
- Spatial Focus Pull uses camera perception to reveal space.
- The approved destination uses a large left-weighted statement.
- This destination gives the room priority and places copy in a quiet editorial rail.

The concepts share only the approved logo arrival, evidence-grounded copy and source image so the comparison remains meaningful.

## Arrival choreography

1. `0.00–3.05s`: approved Constructed Axis logo animation.
2. `3.18–3.75s`: the black field acquires subdued room colour under deep defocus.
3. `3.75–5.36s`: optical blur, slight chromatic separation, low saturation and camera scale resolve together into the room.
4. `5.08–5.78s`: the final WebGL frame transfers to the matching DOM image.
5. `5.82–6.64s`: navigation and editorial rail enter after focus locks.
6. `6.64–7.90s`: still hold.

## Motion contract

- **Communication job:** shift from atmosphere to spatial proof.
- **Track:** arrival only. No scroll-bound or ambient timeline is included.
- **Why stillness is insufficient:** the concept depends on the perceptual change from feeling a room to reading its decisions.
- **Reduced motion:** direct logo-to-room crossfade with no defocus travel.
- **Mobile:** same narrative with a lower DPR cap and stacked editorial rail.

## Canvas decision

Canvas UI's optical family was evaluated but no upstream component is imported. The existing project-local Three.js stack is used for one temporary custom focus shader. This avoids an additional dependency and keeps the effect limited to the transition surface.

Semantic navigation, copy and CTA remain live DOM. The canvas caps DPR, redraws only when dirty, responds to its container, and disposes its texture, material, renderer, observer and animation frame on unmount.

## Final hero

The room remains full bleed. A three-column bottom rail carries:

- the chapter label;
- the central brand statement; and
- restrained supporting copy and exploration cue.

The layout intentionally avoids another giant left-overlay composition and does not introduce cards, split screens or decorative luxury signals.

## Truth boundary

The landscape room remains a replaceable private speculative plate. The optical transition is an authored presentation device and must not be represented as evidence of an actual project camera treatment or final TTA brand system.
