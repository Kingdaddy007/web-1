---
status: implemented-vertical-slice
branch: concept/axis-of-decisions
base_commit: 61cc2d9
owner: Studio Director
updated_at: 2026-08-26
---

# Axis of Decisions — Production Contract

## R2 change brief

Objective: Build one authored alternative to the subcontractor's framed process window, preserving the approved TTA identity arrival while creating a physically clear upward passage from finished atmosphere to process evidence.

Non-goals: Do not modify the subcontractor branch, redesign the accepted logo geometry, claim that Project Akoka is the construction stage of the hero room, build a complete website, import third-party Canvas UI source, or add another heavy WebGL scene.

Changed surface and boundaries: The hero uses the supplied eight-second room film with the approved still as poster. The hero-to-process handoff, process composition, living background, stage copy, and responsive/reduced-motion behavior are authored on `concept/axis-of-decisions` only.

Highest-risk assumption: A long pinned process sequence can feel like a slideshow. It is acceptable only when the upward panel succession, internal counter-parallax, copy timing, and warm material continuity read as one restrained spatial movement.

Evidence plan: Production build; console and network inspection; sampled hero, handoff, four chapters, reverse scroll, mobile, and reduced-motion frames; verify the video poster/autoplay fallback and absence of horizontal overflow.

Recovery limit: Remove the isolated `LivingMaterialCanvas` and retain `.material-fallback`; revert this branch without affecting `experiment/process-window-parallax` or `concept/material-registration`.

## Visual thesis

The website behaves like a warm architectural memory surface. Light, grain, and panel rhythm continue behind the proof sequence while each stage rises from the previous one like a new layer of the same room story.

## Physical motion law

**The atmosphere is the final expression of decisions made much earlier.**

- The approved logo construction and material-to-room pullback remain the arrival track.
- The supplied hero film establishes atmosphere and lived spatial movement.
- Scroll moves the complete hero upward while the living process field rises directly beneath it.
- Each Project Akoka image occupies the same large spatial field and layers upward from the bottom edge.
- Images counter-travel slightly inside the viewport to preserve spatial depth.
- Active chapter copy changes directly over the photography without a card, glass veil, horizontal frame, or vertical divider.

## Media choreography

### Hero

- Journey stage: Recognition and desire.
- Belief job: TTA's work can carry a composed cinematic identity.
- Media: Muted eight-second loop with approved poster.
- Behavior: Autoplay arrival; pause when the complete story stage is offscreen.
- Text zone: Lower centre on desktop; lower left on mobile.
- Fallback: Approved hero still.

### Process field

- Journey stage: Authority and proof.
- Belief job: The atmosphere is the result of site reading, alignment, refinement, and follow-through.
- Media: Four generated 16:9 derivatives in semantic DOM.
- Behavior: Scroll-controlled stacked vertical procession with counter-parallax; reversible and finite.
- Text zone: Semantic copy floating over a protected dark photographic zone; never rasterized into the media.
- Fallback: Static CSS material field, discrete chapter states, and complete readable copy.

## Canvas decision

Visual job: Create one continuous warm material background that can move light and panel rhythm with the proof sequence without becoming a black space, generic gradient, or video wallpaper.

Alternatives:

- Still: visually coherent but cannot register light with scroll.
- CSS only: valid fallback, but repeated gradient animation would be less controlled and harder to pause precisely.
- Video: creates a large additional media burden and cannot adapt its light field to viewport and scroll.
- WebGL/third-party Canvas UI: rejected; the effect needs no depth buffer, shader import, experimental HTML-in-canvas, or additional dependency.
- Selected: contained custom 2D canvas with capped DPR, offscreen pause, reduced-motion still state, and CSS fallback.

The canvas never owns text, navigation, images, or interaction. Removing it leaves the complete experience usable.

## Truth boundary

The Akoka landscape images are AI-assisted derivatives of portrait source evidence. Their added landscape areas are speculative. They must not be described as untouched documentary photographs or used to claim exact unseen architecture. No relationship is asserted between the hero room and Project Akoka.
