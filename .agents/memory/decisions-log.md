# Architectural Decisions Log — TTA Designs Speculative Prototype

### Decision 001: Logo Motion Direction — Concept A "The Constructed Axis"
- **Date:** 2026-08-25
- **Status:** APPROVED WORKING ARRIVAL; HERO INTEGRATION NOT YET SELECTED
- **Decision:** The Terra-corrected implementation in `A-constructed-axis-refined` is the authoritative logo-arrival source for the private concept. The arrival through exact-master settlement is locked; the post-settlement hero transition remains unresolved.
- **Rationale:** 
  1. *Architectural Datum:* The vertical centerline establishes alignment and sightlines before surface decoration or letterforms emerge, echoing high-end spatial practice.
  2. *Identity Proof:* The letter `D` constructs around the existing vertical line, resolving any ambiguity and proving that the line belongs inside the counter of `D`.
  3. *Balance of Form & Mass:* The refined geometry of `DESIGNS` extends rightward first, followed by the heavy structural authority of `TTA` locking leftward.
- **Downstream Transition Integration:** Not selected. The coded hero studies `The Line Becomes Light`, `The Room in Three Truths`, and `The Anamorphic Interior` were audited and rejected as selection candidates. Their underlying ideas may inform future thinking, but none of their layouts, copy, UI, or code is approved for integration.

### Decision 002: Logo Asset Authority
- **Date:** 2026-08-25
- **Status:** LOCKED
- **Decision:** The approved provisional PNGs (`tta-wordmark-black-transparent-provisional.png` and `tta-wordmark-white-on-black-provisional.png`) serve as the authoritative working masters.
- **Rule:** The vertical line penetrates through the body and counter of `D` (not as an arbitrary divider before `D`). All decomposed layers, masks, and transitions must derive from this exact geometry.

### Decision 003: Hero Destination Before Hero Motion

- **Date:** 2026-08-25
- **Status:** LOCKED PROCESS DECISION
- **Decision:** Select the final static hero composition before implementing the logo-to-hero transition.
- **Rationale:** The rejected hero studies mixed composition, imagery, typography, copy, motion, and technical effects, making it impossible to distinguish a weak concept from weak execution. Three static destination territories will now be judged before any animation or Canvas decision.
- **Canvas UI:** Deferred, not rejected. It may be evaluated after composition selection only for one named optical job that simpler still, DOM/CSS, SVG, or pre-rendered media cannot perform.

### Decision 004: Monolithic Aperture Development Direction

- **Date:** 2026-08-25
- **Status:** SELECTED FOR ONE INTEGRATION SLICE
- **Decision:** Territory 06 supplies the hero composition grammar. The corrected centred 2.39:1 aperture is the preferred arrival hold; the corrected near-full-bleed frame is the preferred first-scroll destination.
- **Media:** The gaming-led source is rejected. `tta-living-cinematic-master-v1.png`, derived from `residential-living-arrival.jpg`, is the working private speculative plate.
- **Motion boundary:** Optical Alignment contributes only a possible seam/refraction mechanic. It does not become a separate hero composition.
- **Canvas UI:** A contained seam may be evaluated only after a DOM/CSS/SVG integration baseline exists. Canvas does not own the room or semantic interface.

### Decision 005: Identity-to-Room Integration Law

- **Date:** 2026-08-25
- **Status:** REJECTED AFTER LIVE REVIEW; RETAINED AS NEGATIVE EVIDENCE
- **Decision:** The centered aperture and near-full-bleed frame are not competing heroes. They are two states of one opening: the approved Constructed Axis arrival resolves through 3.05 seconds; its axis becomes the room threshold; the centered aperture is the autoplay destination; first scroll expands it toward near full bleed.
- **Narrative law:** Identity establishes order; order cuts a threshold; the room takes possession of the screen.
- **Background:** The black field remains spatial silence. No particles, decorative texture, fabricated copy, claims, or generic ambient parallax are added.
- **Canvas UI:** Deferred after implementation comparison. The DOM/CSS baseline performs the named threshold job without a realtime dependency. Reconsider only as a contained seam-refraction enhancement if live review identifies a material flatness problem.
- **Implementation:** `C:\Users\Oviks\Documents\WEB 1 Codex\.agents\studies\hero-development\logo-to-aperture-integration-v1\`

### Decision 006: Reopen the Opening-to-Hero Design

- **Date:** 2026-08-25
- **Status:** ACTIVE EXPLORATION
- **Locked:** Only Logo Motion A — The Constructed Axis through exact-master settlement at approximately 3.05 seconds.
- **Rejected:** The black-dominant centered aperture, current room image as a committed asset, rectangular axis-to-slit reveal, and near-full-bleed continuation from Integration V1.
- **Open:** Hero image, destination composition, environmental color, transition law, parallax/scroll behavior, and contained Canvas/WebGL use.
- **Exploration:** Three independent working studies—Arc Procession, Architectural Unfolding, and Optical Bloom—must solve transition and destination together. No winner is preselected.
- **Delegation:** `C:\Users\Oviks\Documents\WEB 1 Codex\.agents\delegations\tta-opening-hero-reexploration-antigravity-brief.md`

### Decision 007: Reject Round 0 and Round 1 in Full

- **Date:** 2026-08-26
- **Status:** LOCKED REJECTION
- **Decision:** The static control and all five Round 1 laws are rejected. There are no surviving candidates to carry into ordinary destination or media permutations.
- **Observed failures:** Simple and visually convergent rectangular reveals; a weak pseudo-arc; no true optical system; black-dominant staging; inappropriate seated-people control image; insufficient art direction and professionalisation.
- **Consequence:** Any Round 2/3 implementation that inherits those laws is invalidated as a selection candidate. Round 2/3 may continue only as a destination and motion-system rescue/reset.
- **Correction:** `C:\Users\Oviks\Documents\WEB 1 Codex\.agents\delegations\tta-round-01-rejection-and-rescue-directive.md`

### Decision 008: Authored Integration V1 — The Axis Opens

- **Date:** 2026-08-26
- **Status:** READY FOR LIVE USER REVIEW; NOT YET APPROVED
- **Decision:** Replace the disconnected transition-study process with one authored opening and hero. Preserve the approved Constructed Axis logo arrival through 3.05 seconds. The D-axis then becomes the seam of a temporary refractive membrane; the room resolves full-bleed; the canvas retires; evidence-grounded DOM copy enters only after the room is legible.
- **Hero destination:** Warm, full-bleed room-first composition. No persistent black aperture, split-screen composition, card grid, or technical HUD in the ordinary route.
- **Canvas boundary:** A custom Three.js shader owns only the 2.35-second optical transformation. It does not own the resting hero, navigation, copy, or interface. Canvas UI Bend was evaluated but not imported because its live-HTML folding job and experimental strongest path do not fit this single-image transformation as safely as the contained shader.
- **Truth boundary:** `tta-living-cinematic-master-v1.png` remains a replaceable private speculative image derived from observed TTA media, not a verified publishable original photograph.
- **Implementation:** `C:\Users\Oviks\Documents\WEB 1 Codex\.agents\studies\hero-development\tta-authored-hero-v1\`
- **Verification:** Production TypeScript/Vite build passes; exact 3.05-second logo frame, transition frames, final 1440×900 hero, live autoplay, and forced reduced-motion route inspected in-browser with no console errors or warnings.
- **Refinement:** The shader-to-DOM handoff now uses one shared overlay grade, matching crop and settled scale, and Three.js tone-mapping/output-colour conversion. Shader-only warmth and vignette decay before the transfer. This removes the darker-canvas/clearer-image exposure jump and any double-exposed room geometry identified during live review.
- **Responsive framing:** The 16:10 concept plate remains centred through standard aspect ratios. At 1.8:1 and 2:1+, a shared responsive framing function moves the focal point upward to preserve ceiling architecture on short, wide laptop viewports. Both the shader and resting DOM image consume the same value.

### Decision 009: Single-Action Axis Light Threshold

- **Date:** 2026-08-26
- **Status:** APPROVED WORKING HERO
- **Decision:** Reject the Hinged Elevation for the current hero and collapse the Axis Light Commissioning experiment from two consecutive effects into one arrival law.
- **Motion law:** The approved logo resolves through 3.05 seconds. Its D-axis becomes a full-height light datum. Two proportional light fronts travel outward from that real axis, reveal the room, and finish together. The room then holds before typography enters.
- **Removed:** Refractive membrane bending, post-reveal commissioning pass, folded room planes, secondary wipe, and opening-stage scroll choreography.
- **Scroll boundary:** Parallax, pinning, and reverse-parallax remain deferred until the next section has a defined narrative job.
- **Implementation:** Branch `concept/axis-light-threshold`; detailed choreography in `DIRECTION.md`.
- **Approval note:** Approved by the user on 2026-08-26 as the current authoritative opening and hero. Further concepts must remain isolated alternatives and must not overwrite this branch.

### Decision 010: Spatial Focus Pull Alternative

- **Date:** 2026-08-26
- **Status:** ALTERNATIVE FOR LIVE REVIEW; NOT APPROVED
- **Decision:** Test one complete alternative to the approved Axis Light Threshold using cinematic camera perception instead of identity geometry.
- **Motion law:** After the locked logo arrival, subdued room colour appears under deep optical defocus. Blur, scale, saturation and exposure resolve together until the interior becomes legible; only then does the interface enter.
- **Hero destination:** Full-bleed room with a restrained three-column editorial rail. The room carries the first impression instead of another large left-overlay composition.
- **Canvas boundary:** One temporary custom Three.js focus shader; no Canvas UI upstream component or new dependency. Semantic content remains DOM-first, with direct reduced-motion and lower-DPR mobile paths.
- **Implementation:** Branch `concept/spatial-focus-pull`; detailed choreography in `DIRECTION.md`.
