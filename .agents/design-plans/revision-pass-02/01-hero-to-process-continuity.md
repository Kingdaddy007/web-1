# Hero-to-Process Continuity Plan

## Comments answered

Browser comments 7, 8, 9, and 10.

## Current failure

The hero moves upward while a separate pale process layer rises over it. Although the motion is technically parallax, it reads as one page covering another. The process statement then occupies a mostly empty surface, so the transition changes layout without changing meaning.

## Communication job

Move the visitor from **desiring the finished room** to **recognising the intelligence behind it** without leaving the room’s visual world too early.

The visitor should feel: “I am still inside the same design story, but I am now being shown what made it possible.”

## Option A — Continuity Reframe (recommended)

### Scene concept

The hero room remains pinned and full bleed. On first scroll:

1. The hero heading and support copy separate from the room and leave earlier than the media.
2. The room film changes direction and focal emphasis rather than being covered. The camera drifts upward and slightly inward toward the ceiling, wall joints, or architectural light.
3. A warm veil grows from the room’s own lacquer/light values. It does not enter as a rectangular panel.
4. The process proposition develops inside that inherited field as though exposed by grazing light.
5. A real site image registers into the frame only after the proposition has been understood.

### Why it fits

- It directly answers the reference behavior described in comment 10.
- It keeps the hero as a continuity device instead of adding a new decorative anchor.
- It uses the existing room film and material palette.
- It makes the process chapter feel like a change of focus, not a new template section.

### Media requirement

Preferred production asset: a 4–6 second continuation derived from the final hero frame, with a slow upward/inward camera move toward the ceiling light or wall seam. The room geometry, chandelier, television wall, joinery, and sofa must remain unchanged.

Fallback: keep the existing hero video, freeze on its final clean frame, and use DOM transforms on a slightly oversized image plane. This produces a convincing camera redirection without generating new video.

### Copy architecture

- Label: `BEFORE THE FINISH`
- Main proposition: `Beautiful rooms are settled long before they look finished.`
- Practical annotation: `Layout, light, movement and services are resolved while change is still possible.`

The exact words remain provisional. Their job is to connect visible atmosphere with early decisions, not to repeat the hero claim.

### Type behavior

This is **not** the universal headline lift. The words begin close to the material tone and are exposed from left to right by a moving band of light. Opacity, contrast, and slight blur resolve together. The effect should feel like ink or relief becoming legible on a surface.

## Option B — Cove-Light Spill

The hero remains still while the ceiling cove light expands beyond its architectural boundary. The luminous spill becomes the warm process field; the process proposition sits inside it; site evidence appears as the light contracts into a disciplined image window.

### Strength

More visually authored and tied to interior lighting.

### Risk

It can resemble a generic light wipe if the source path does not trace a real cove or wall line. It also needs careful compositing to prevent a white-screen flash.

## Motion-library decisions

- **Dolly-In Spatial Room Transition:** reject in literal Three.js form. There is no real 3D room model, and a fake portal would overstate the available asset system. Retain only the principle of one continuous camera coordinate system.
- **Architectural/material threshold:** adapt as a DOM/video continuity reframe, not a portal.
- **Generic stacked panel or centre split:** reject. Both repeat already rejected laws.

## Desktop choreography

| Range | Media | Copy | Job |
| --- | --- | --- | --- |
| 0–18% | Complete hero room holds | Hero copy remains | Desire |
| 18–34% | Room begins redirected camera drift | Hero copy departs in two groups | Clear the stage |
| 34–55% | Room softens into inherited material/light field | Process label and proposition expose through light | Reframe |
| 55–72% | Material field holds; first process image begins registering | Practical annotation appears | Prepare proof |
| 72–100% | Process image owns the evidence window | First process caption becomes active | Authority |

## Mobile translation

- No long pin before evidence.
- Keep the hero media visible behind the first process phrase.
- Show at least the upper edge of the first site image in the same viewport as the proposition so the text never becomes an unsupported blank statement.
- Replace camera-depth travel with a controlled crop shift and light exposure.

## Reduced motion

Use three clear states: complete room → room with warm material veil and proposition → first process evidence. Crossfade only at state boundaries; all text remains immediately readable.

## Failure conditions

- The visitor perceives a beige panel sliding over the hero.
- The hero media disappears before process meaning arrives.
- The proposition occupies a full viewport with no visible evidence on mobile.
- The transition becomes a second visual peak louder than the logo/room reveal.

## Prototype required

Build only a 0–100% scroll slice from the final hero hold to the first process image. Test the generated-video route and the DOM final-frame route side by side before changing the complete page.

