# Portfolio Proof System

## Comments answered

Browser comments 1 and 2, with the media-selection concern repeated in comments 3 and 10.

## Current failure

The portfolio begins with a full statement—`What was decided becomes what is felt`—but provides no immediate visual proof. The following compositions then reuse the same broad motion language as the process chapter. On mobile, the visitor can encounter a complete viewport of proposition before seeing what it refers to.

The selected imagery also behaves like a general mood board. A gaming/lived-in clip, a warm lacquer detail, and unrelated room views cannot all carry the same claim. The problem is not only animation; it is evidence architecture.

## Communication job

Convert process intelligence into visible, believable residential outcomes. Each project should feel like one authored atmosphere with supporting details, not a collection of attractive files.

## Recommended direction — Project Constellations

Remove the empty standalone portfolio bridge. Fuse its proposition into the opening project so that language and proof arrive together.

Each project family uses:

- one dominant room view or short 16:9 film;
- one supporting crop that proves material, light, or joinery;
- optionally one lived-use moment that proves comfort or human use;
- one concise title and one factual note.

Do not force every project to have all three media roles. Two coherent assets are stronger than four unrelated ones.

### Opening composition

The first project is already visible when the proposition begins:

- eyebrow: `SELECTED RESIDENCES`
- proposition: `What was decided becomes what is felt.`
- project note: one grounded sentence tied to the visible room.

The proposition occupies no more than 35–45% of the viewport and never appears on an empty field. On mobile, the first room image must share the first viewport with at least part of the sentence.

### Motion law

This chapter uses **formation**, not another vertical parallax deck.

1. A dominant image enters already large and legible.
2. As the visitor progresses, its crop relaxes rather than simply translating upward.
3. A supporting detail aligns to an architectural edge inside the dominant image.
4. Copy resolves only after that visual relationship is legible.
5. At the project boundary, the composition re-forms into the next project family using measured layout interpolation.

The desired impression is that one designed composition is being re-authored into another. It should not feel like cards, a slider, or stacked webpages.

### Suitable implementation principle

- Use measured DOM layout and GSAP/FLIP-style interpolation for the composition change.
- Use small internal media counter-motion—approximately 3–5%—only when it reinforces depth.
- Keep captions and metadata in semantic DOM.
- Allow one controlled overlap between projects; do not keep three active layers on screen.
- Never animate text, media position, media crop, and background simultaneously.

## Asset intelligence pass required

Before implementation, audit the extracted frame library and the two portrait videos by project, room, and narrative role.

Create a contact sheet with these fields:

| Field | Meaning |
| --- | --- |
| Project family | Which real project/space the media belongs to |
| Room | Living, bedroom, kitchen, office, site, or unknown |
| Evidence role | Atmosphere, material, light, human use, or process |
| Quality | Hero-capable, supporting, or reject |
| Format need | Keep, crop, outpaint, restore, or animate |
| Claim safety | What can honestly be said from the image |

Do not select by colour harmony alone. The project relationship must be known or explicitly presented as a general study rather than a named project.

## Treatment of current videos

- The gaming/lived-room footage is not a generic “atmosphere resolved” image. Reserve it for a lived-use proof moment where the copy concerns comfort, occupation, or rooms supporting daily life.
- The site/process portrait video belongs in the practice or process chapter, not a finished-residence constellation.
- The 16:9 cinematic living-room clip may lead the first project if its final colour and framing agree with the hero’s story.

## Option B — Material Slit to Room

If the standalone sentence is retained, place a narrow but unmistakable material/room aperture beneath it from the first frame. As the sentence resolves, the aperture expands into the first project image. The transition should feel like a material sample becoming a room, not a wipe opening a window.

This option is simpler and more editorial, but it is less distinctive than Project Constellations and risks returning to the reveal language already used in the opening sequence.

## Copy structure

Each project should use only:

1. a project or room name that can be supported;
2. a one-line atmosphere statement;
3. one factual observation about light, movement, storage, material, or use.

Avoid abstract labels such as `RESOLVED` unless the visible sequence demonstrates what was resolved.

## Mobile translation

- Use one project family per vertical chapter.
- Keep the dominant image at 70–82svh, followed by its supporting detail.
- Let the title remain briefly sticky while evidence passes; do not pin an empty proposition.
- Disable multi-plane overlap when the viewport cannot preserve the intended relationships.

## Reduced motion

Render the same project compositions as static editorial spreads. Cross-project changes may use a short opacity transition, but each project must remain understandable without motion.

## Acceptance tests

- The first portfolio claim is visually supported in the same viewport.
- Every media item has a declared narrative role.
- No two consecutive chapters use the same reveal grammar.
- A visitor can tell when one project ends and another begins.
- Mobile never shows a full viewport of unsupported abstract copy.
- The gaming and site footage appear only where their content supports the copy.

