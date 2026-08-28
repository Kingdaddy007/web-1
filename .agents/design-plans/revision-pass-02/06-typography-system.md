# Cinematic Typography System

## Comments answered

Browser comments 1, 2, 4, 5, 8, and the user’s explicit concern that the current font does not feel cinematic enough.

## Confirmed current issue

The stylesheet requests `Helvetica Neue`, then `Inter`, then `Arial`. Neither Helvetica Neue nor Inter is installed in the present Windows environment, so the current local page resolves to Arial. The typography being judged is therefore not the intended typography system.

This is not merely a taste problem. Arial’s proportions and spacing change headline shape, wrapping, negative space, and the perceived quality of the motion.

## Typography principle

Use one coherent display family and one supporting text family at most. The site should feel authored through proportion, spacing, and timing—not through an assortment of decorative fonts.

The TTA logo remains unchanged. The site typography should relate to its precision without attempting to imitate the logo letterforms.

## Specimen directions

No font should be installed or imported until an isolated real-content specimen has been approved and its licence/source verified.

### Direction A — Editorial Grotesk (recommended)

Qualities: precise, quiet, architectural, capable of very large headlines without becoming software-like.

Candidate class: Neue Montreal, Suisse Intl, ABC Diatype, or an open-source family with comparable proportions such as Instrument Sans if the specimen proves suitable.

Why recommended: it supports the site’s asymmetry and cinematic scale while allowing body copy and captions to remain restrained. It also creates a useful contrast with the geometric TTA logo.

Risk: several ideal candidates are commercial. Licence and webfont delivery must be resolved before implementation.

### Direction B — Humanist Precision

Qualities: slightly softer, warmer, more residential and conversational.

Candidate class: Söhne/Aktiv-style grotesks, with Manrope as an open-source specimen candidate.

Why consider it: the project needs warmth and human presence, not only architectural severity.

Risk: rounded forms can make the brand feel like a contemporary product company if spacing and weight are not tightly controlled.

### Direction C — Architectural Accent Pairing

Use a calm display grotesk for headings and a condensed/engineered face only for site notations, stage labels, and captions. The installed Bahnschrift family can be tested as the accent—not as the main headline face.

Why consider it: it could distinguish technical process evidence from finished-room storytelling.

Risk: overuse becomes exhibition graphics or engineering signage. The accent must remain a minor voice.

## Role specifications

These are starting ranges for the specimen, not final CSS tokens.

| Role | Weight | Line height | Tracking | Intent |
| --- | ---: | ---: | ---: | --- |
| Display XL | 300–400 | 0.88–0.94 | -0.045em to -0.065em | Hero and major chapter headings |
| Display L | 350–450 | 0.92–1.00 | -0.035em to -0.05em | Project and inquiry statements |
| Body | 400 | 1.45–1.65 | -0.005em to 0 | Readable explanation |
| Eyebrow | 600 | 1.15–1.30 | 0.11em to 0.15em | Section orientation |
| Caption | 500–600 | 1.25–1.40 | 0.07em to 0.12em | Evidence notation |

Avoid the current tendency toward extremely wide tracking on small labels. It weakens legibility and makes every phrase look ceremonial.

## Universal heading motion grammar

Major chapter headings may share one family resemblance:

- each line is masked independently;
- the visible movement is short and mostly vertical, approximately 0.7–1.0em;
- lines overlap in time by 35–50%;
- a small opacity/blur correction may accompany the movement, but characters should not wobble;
- the reveal occurs once on purposeful section entry, not every time an observer toggles near the threshold.

This is the system for true chapter headings such as the hero, practice, and inquiry.

## Deliberate exceptions

Not every large sentence is a chapter heading.

- **Hero-to-process proposition:** exposed through changing material/light.
- **Process instructions:** registered with the evidence image; mostly still.
- **Portfolio proposition:** formed with the first project composition.
- **Footer wordmark:** uncovered by the inquiry field; it does not use the heading reveal.

These exceptions prevent the repetition criticised in comments 1 and 2 while preserving consistency across genuine headings.

## Letter-level effects

Per-letter motion should be reserved for one or two short phrases only. For long headings it becomes noisy and slows comprehension.

Acceptable uses:

- a brief chromatic/weight resolve in the opening logo-adjacent moment;
- a single CTA label roll;
- a short stage word changing inside the process chapter.

Do not colour-cycle full headlines or stagger every letter across the page.

## Responsive type behavior

- Compose desktop line breaks intentionally rather than letting browser width decide all phrasing.
- Supply mobile line-break variants where needed; do not scale desktop headlines until words become awkward fragments.
- Set a minimum readable body/caption size and never use opacity as the only hierarchy device.
- Test at the user’s laptop viewport as well as the design preview viewport.

## Specimen route required

Create one isolated local route showing the same real TTA content in all three directions:

1. hero headline and support copy;
2. process proposition and stage label;
3. practice heading and note;
4. inquiry heading, CTA, and subtext;
5. footer identity and utilities.

The comparison must include still states, reveal motion, desktop, and mobile. Approve the type system before rebuilding all section motion, because typography changes line breaks and choreography.

## Acceptance tests

- The rendered font is the actual approved webfont, not a local fallback.
- Headline shapes remain composed at laptop and mobile aspect ratios.
- Chapter headings feel related without being identically animated.
- Body copy and inquiry subtext meet practical contrast/readability needs.
- Eyebrows orient the visitor without dominating the page.
- The type remains premium with animation disabled.

