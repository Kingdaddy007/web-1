# Inquiry and Footer Direction

## Comments answered

Browser comments 4, 5, and 6.

## Current failure

The inquiry already contains an animated shader, but it is so restrained and low-contrast that it reads as a plain warm field. The headline and CTA therefore carry the complete section while the background contributes little. The CTA rule and arrow also appear as disconnected geometry.

The footer repeats `WORK`, `PRACTICE`, and `INQUIRY` in a horizontal row, causing it to resemble another header. It lacks the information hierarchy and arrival behavior of a true ending.

## Inquiry communication job

Shift from evidence to invitation. The visitor should feel the site becoming more responsive and personal, while the interface remains calm enough for a serious residential inquiry.

## Recommended inquiry direction — Living Lacquer Field

Create a warm, materially responsive field inspired by lacquer, grazing light, and subtle refraction—not liquid for its own sake.

### Visual behavior

- A broad light body travels slowly through the field, revealing depth and slight material variation.
- Pointer movement produces a delayed, low-amplitude response, as though pressure is travelling beneath a finished surface.
- Scroll entry gathers the field toward the headline; scroll exit lets it settle toward the footer edge.
- Refraction is concentrated around one or two large forms. Avoid constant small waves, particles, ribbons, or obvious noise.
- Preserve a stable quiet zone behind the headline and CTA.

The effect must be visible enough to read at first glance, but slow enough that the inquiry remains the page’s resolution rather than a second opening spectacle.

### Implementation recommendation

Prototype as a custom Three.js fragment shader because Three is already part of the project and the scene needs an exact brand-specific material law. Keep the headline, CTA, and supporting copy in semantic DOM above it.

An external Canvas UI fluid/refraction component may be tested only in an isolated comparison after its exact source, licence, package impact, and cleanup behavior are verified and approved. Do not import a library merely because its demo is dramatic.

Cap device pixel ratio, suspend rendering when offscreen, and destroy all listeners/materials on unmount. Only one heavy realtime scene should be active at a time.

## Inquiry option B — Topographic Glass

Use very thin contour fields derived from the logo axis and room geometry. Lines bend optically around an invisible central volume and slowly resolve toward the CTA.

This is more graphic and brand-specific than Living Lacquer, but it risks resembling a technical diagram. Choose it only if the material shader appears too decorative in the prototype.

## Inquiry typography and CTA

- Make `FOR A CONSIDERED RESIDENCE` medium or semibold, with less tracking than the current style.
- Use the approved universal display-heading reveal for `Let’s begin with the way you want to live.`
- Increase the supporting sentence’s contrast and size; it should not look disabled.
- Replace the current detached underline/vertical line with one horizontal CTA baseline that has a clear start and end.
- On hover/focus, roll the CTA label once while the baseline travels toward the arrow. Preserve a visible focus state and do not make the link depend on hover.
- Align the arrow optically to the cap height, not to the container edge.

The CTA should eventually open a dedicated inquiry experience, but that page is a separate product and content task. Do not invent its questions inside this visual revision.

## Footer communication job

Close with identity, contact routes, and a final sense of authorship. It should feel like the underside of the inquiry material has been revealed—not like the navigation has been repeated.

## Recommended footer direction — The Colophon Underlay

The footer exists beneath the inquiry scene. As the visitor reaches the end, the warm material field loses luminance and withdraws upward, uncovering a deep espresso/oxblood colophon. This is a reveal caused by the inquiry material leaving, not a new panel sliding over the page.

### Information architecture

Use three functional zones:

1. **Studio** — `TTA DESIGNS`, residential/commercial interior descriptor, Lagos, Nigeria.
2. **Connect** — only verified routes such as Instagram and the inquiry link.
3. **Utility** — back to top, copyright/legal line, and optional email only if verified.

Finish with a large cropped TTA wordmark or a restrained logo lockup. Do not repeat `WORK`, `PRACTICE`, and `INQUIRY` as if they were the primary navigation. If section links are retained, demote them to a small utility list beneath the identity hierarchy.

### Footer entrance

1. Inquiry headline and CTA settle.
2. The material field darkens at the bottom edge.
3. Footer identity appears beneath the receding field.
4. Utility lines reveal in a slower secondary cadence.
5. The wordmark arrives last and holds as the final frame.

No centre split, generic opacity fade, or repeated line-by-line page transition.

## Footer option B — Identity Horizon

The footer begins as a thin dark horizon at the bottom of the inquiry. On final scroll, the horizon grows while the inquiry remains partially visible above it. The oversized wordmark crosses the boundary once and then settles below.

This is more theatrical but must be tested carefully on mobile so it does not resemble another wipe.

## Mobile translation

- Reduce shader resolution and pointer response; preserve only the slow scroll-settle behavior.
- Stack footer zones with generous separation.
- Keep the inquiry CTA visible before the footer begins revealing.
- Avoid sticky/pinned footer behavior on short mobile viewports.

## Reduced motion

- Show one static material frame behind the inquiry.
- Use a simple, short colour/luminance boundary between inquiry and footer.
- Keep all CTA and footer information immediately available.

## Acceptance tests

- The inquiry background is clearly alive without distracting from the action.
- The CTA rule, label, and arrow read as one aligned control.
- The footer cannot be mistaken for a header.
- All contact/social details are verified before publication.
- The footer has a distinct arrival caused by material withdrawal.
- Canvas/WebGL failure leaves a complete, readable inquiry and footer.

