# Revision Pass 03 — Scroll Rhythm Repair

## Objective

Repair the eye path without replacing the approved opening, changing the project story, or adding another spectacle layer.

## Motion ownership

| Chapter | Job | Enter | Hold | Exit | Mobile / reduced motion |
| --- | --- | --- | --- | --- | --- |
| Hero to Process | Shift from atmosphere to proof | Hero plane lifts; proposition is legible first; first evidence rises from below-right | Evidence settles before the stage sequence begins | Process chamber releases normally | Ordinary stacked hero, proposition, first image |
| Process evidence | Prove four decisions | First image uses a physical plane arrival | Incoming images register laterally inside one stable frame | Stable chamber gives way to Portfolio | Static image/copy chapters |
| Selected residences | Guide attention through proof | Each dominant image travels in from its architectural side while its crop relaxes | Copy and detail settle only after the room is legible | Image lifts and tightens slightly as the next project enters | Stacked project spreads with restrained reveal |
| Lived use | Human reassurance | Large ambient film is already established | Normal loop; no scrub | Dark tonal release | Poster or normal loop |
| Life-to-practice hinge | Explain why another film follows | Text sharpens in place; no travel | Brief editorial pause | Practice film takes over | Static statement |
| Practice | Show sustained attention | Full-bleed site film establishes before the heading registers horizontally | Film plays normally | Material settles into inquiry | Poster or normal loop |

## Repairs

1. Remove the TTA wordmark from the Process instrumentation row. It reads as a duplicated global header.
2. Give the first Process evidence frame an authored vertical arrival before the internal lateral registrations begin.
3. Replace Portfolio's one-time intersection animation with scroll-derived entrance, settle, and exit states per project.
4. Add one quiet text-led hinge between the lived-use and practice films. It must explain the narrative relation rather than act as decoration.
5. Keep only one realtime material field: Inquiry.

## Rejection conditions

- No new full-screen blank interlude.
- No repeated fade-up preset across consecutive chapters.
- No second pinned gallery.
- No image movement that covers copy or hides project proof.
- No new dependency or smooth-scroll hijacking.

## Evidence boundary

The two supplied reports are mediated evidence. Their most reliable transferable principle is varied layout under a consistent shell and deliberate pacing; exact hover, drag, and library claims remain unverified. Implementation uses the existing DOM, requestAnimationFrame scroll loop, CSS transforms, and current media.

## Revision 04 timing and residence formation

Text reveal ranges are measured from the visible copy block, not from the full section. A reveal begins when the copy reaches roughly 94% of the viewport and resolves near 28–30%, leaving enough scroll distance to observe the full movement.

Selected Residences uses a restrained **Cinematic Window** formation adapted from the motion-library reference:

- the outer image frame travels horizontally from its architectural side;
- the image counter-translates inside the frame so the movement reads as a window rather than a sliding card;
- copy moves at a slower opposing rate;
- the detail image follows at a third rate after the main room is legible;
- desktop receives the full multi-plane parallax; tablet and mobile retain a stacked vertical composition;
- reduced motion resolves every layer immediately with no clip or translation.

The life-to-practice canvas remains a contained custom 2D material field. Its fallback must sit behind the active canvas, never over it. No Canvas UI upstream component is imported in this revision.

## Revision 05 — Residence Procession

The three residences become one authored chapter rather than three consecutive page sections. The chapter adapts the reference report's stack-to-fan spatial idea without copying its site, artwork, or inferred technology.

| Beat | Narrative job | Desktop movement | Reading hold | Exit / handoff |
| --- | --- | --- | --- | --- |
| Chapter opening | Announce the selected work before asking the visitor to read a project | Three room plates begin as one stack and fan apart behind the thesis | Thesis remains stable while the stack opens | Thesis and stack dissolve into the first full residence |
| Residence 01 | Establish the clearest expression of the studio's decisions | Frame arrives from the right while the image counter-moves inside it | Room settles first; title follows; support copy and detail arrive last | Entire panel transfers left as the second residence enters |
| Residence 02 | Change the spatial register without changing the design language | Opposing copy/media arrangement travels through the same horizontal datum | Full-frame pause with its own baseline-led typography | Panel transfers left under Residence 03 |
| Residence 03 | Resolve the sequence in a quieter room | Final frame arrives with the same window logic and a softer type formation | Longest final hold; detail resolves after the room | Three rooms compress into a closing triptych |
| Triptych release | Make the portfolio feel complete before lived human proof begins | The three rooms align as one compact collection | Brief visual resolution | Normal vertical scroll releases into A Room in Use |

### Responsive contract

- Desktop above 960px uses one sticky chapter driven by vertical scroll; there is no native horizontal scrollbar or scroll hijacking.
- Tablet and mobile keep the existing stacked project spreads and their viewport-timed typography reveals.
- Reduced motion removes the sticky procession and shows all residences in ordinary document flow with fully resolved type and imagery.
- The chapter changes only the Selected Residences section. The opening sequence, Process, Lived Use, Practice, Inquiry, and footer retain their current structure.

## Revision 06 — Procession coherence repair

Direct screenshot review rejected the stack-to-fan opening, floating detail cards, translated full-page panels, and closing triptych. Together they created three unrelated gallery systems, exposed empty stage during transfers, and allowed copy and imagery to collide.

The corrected physical law is **one room replaces another across one architectural threshold**:

| Beat | Scroll range | Stage behavior | Copy behavior |
| --- | --- | --- | --- |
| Lead threshold | 0–18% | One dominant room opens from a contained crop into the established right-hand image plane | Chapter thesis holds in the protected left column |
| Residence 01 | 18–34.5% | The first room stays still at full authority | Project label, title, description, and material note replace the thesis in sequence |
| Room 01 → 02 | 34.5–49% | Residence 02 wipes from right to left across the complete stage; its inner photograph counter-moves slightly | Incoming copy is clipped with its panel and resolves only when its column is physically revealed |
| Residence 02 | 49–62.5% | The room holds with no competing inset or decorative card | Copy remains fixed to the same architectural column |
| Room 02 → 03 | 62.5–77% | Residence 03 repeats the same threshold law, preserving orientation | Copy resolves after the image plane arrives |
| Residence 03 / release | 77–100% | The final room remains complete until the sticky stage releases into A Room in Use | Final copy remains readable; there is no closing collage or fade-to-empty interlude |

Desktop owns the pinned threshold choreography. Mobile and reduced motion preserve the same content as ordinary single-image project spreads. Secondary detail images are removed from this chapter because they did not carry a distinct proof job.

## Revision 07 — Motion-library reimagination

Revision 06 repaired collision but still repeated the preceding chapter's horizontal travel and counter-parallax grammar. Motion-library review selected **Synchronized Dynamic Scroll List Pinning** as the primary family and adapted **Cinematic Aspect Ratio Squeeze** only for the threshold. FLIP/flying-block and overlapping parallax-deck candidates were rejected because they would reproduce card travel, container movement, or competing image planes.

The reimagined physical law is a **registration line** running through the room:

| Beat | Communication job | Motion behavior |
| --- | --- | --- |
| Process → Residences | Give the previous chapter a formal release and open a new proof register | The first room opens vertically from a luminous horizontal registration line as the chapter enters |
| Gallery formation | Convert atmosphere into an editorial project index | The full-bleed room is squeezed into one fixed right-hand gallery window; the image itself does not pan |
| Project selection | Guide attention through three residences without repeating parallax | Project titles move vertically through one active reading line while the room window remains physically stationary |
| Image change | Make each room feel revealed rather than slid | Each incoming room opens outward from the registration line inside the fixed window; the outgoing image remains underneath |
| Residences → Lived Use | Give the portfolio a formal exit and hand continuity to video | The final room closes into the line; the Lived Use film opens outward from the same line in the next chapter |

Mobile uses ordinary single-image project spreads. Reduced motion resolves the gallery and Lived Use film immediately without squeeze, pinning, or aperture travel. No new animation dependency is introduced; the existing requestAnimationFrame scroll controller owns the sequence.

## Revision 08 — Structural-column gallery

Screenshot review rejected the registration-line aperture because it exposed incoming photographs as accidental horizontal bands and retained the familiar split-layout composition. The selected replacement is the motion-library's **Staggered Structural Columns** reference.

Translation decisions:

- **Borrowed:** one incoming scene is divided into five vertical structural fields that construct upward with staggered timing.
- **Changed:** columns reveal full-bleed residences rather than a video or generic page transition; copy waits until the room is substantially assembled.
- **Rejected:** parallax, horizontal sliding containers, center apertures, side-by-side roster layouts, random grid tiles, and 3D dolly movement.
- **Exit:** the final columns withdraw in reverse into the same dark register used by A Room in Use; its video rises from the bottom as one continuous plane.

The chapter uses one full-viewport room at a time. The prior room remains complete beneath the assembling columns, preventing seams or empty stage. Project copy is a quiet museum label over a protected left-hand gradient, with independent entrance and exit timing. Mobile and reduced motion retain ordinary static project spreads.

## Revision 09 — Chapter architecture and architectural light cut

The page now uses shared thresholds rather than treating every section as an isolated module. The governing rhythm is **settle → read → reveal → hold → release**.

| Section | Journey stage | Belief / proof job | Media and scroll behavior | Entry and exit | Fallback |
| --- | --- | --- | --- | --- | --- |
| Hero → Process | Atmosphere → method | Establish that the finished feeling begins with hidden decisions | Hero remains the closing image while the Process proposition reads first; evidence enters only after the reading hold | Hero releases upward; the first evidence rises and settles before the four-stage sequence | Static hero, proposition, then process image |
| Selected Residences | Finished proof | Show the atmosphere created by those decisions | One still room at a time in a pinned chapter; a single architectural light edge exposes each stationary photograph | Prologue reads before the first room; final room darkens into the life threshold | Ordinary stacked project spreads |
| Residences → Lived Use | Proof → lived consequence | Explain why human movement follows still project photography | Compact 56svh typography threshold; Lived Use film rises from the lower edge | No horizontal seam, middle aperture, or duplicate image plane | Static threshold followed by poster |
| Founder | Creative authority | Identify the founder and connect philosophy to practice | Still site portrait and DOM copy; no ambient video or canvas | Portrait registers from the right; the chapter darkens toward Practice | Fully resolved editorial portrait spread |
| Practice | Method proof | Show the founder's attention remaining present through delivery | Existing ambient site film; copy waits until the film has entered | Film enters laterally from the founder chapter and releases normally into Inquiry | Poster with resolved copy |

Revision 08's structural columns are rejected. The replacement borrows only the material-light principle: images do not pan, split, stack, or travel. Each room remains still while a light edge reveals it. Desktop uses the existing requestAnimationFrame controller and CSS clipping; no new dependency or WebGL scene is introduced. Portrait source images receive a subdued ambient echo behind the main crop so they can occupy the cinematic stage without adding a competing picture.

## Revision 10 — One residence, one life test, one continuous field

The final pass replaces section-by-section spectacle with one controlling argument:

> A considered room is not defined by appearance alone; it is resolved around how life will move, gather and feel.

The page now moves through six explicit communication jobs:

| Chapter | Visitor question | Answer / proof | Motion law |
| --- | --- | --- | --- |
| Hero | What kind of feeling does this studio create? | Calm interiors designed around lived experience | Cinematic room registration |
| Process | Why should I trust the work behind that feeling? | Use, circulation, light and completion are considered together | Proposition reads first, moves aside, evidence registers |
| Ogba residence study | What does that attention produce? | One residence shown through continuity, restraint and intimate light | Framed room plates travel left as one complete plane |
| Life test | Does the design work beyond photography? | Movement and ordinary use are the final evidence | One sticky shader chapter: proposition, right-hand video reveal, upward video exit, coda |
| Founder and practice | Who holds the point of view through delivery? | Tolu Ajayi's considered eye remains present on site | Portrait and copy resolve slowly; practice film follows |
| Inquiry and footer | What should I do next? | Share the room, location and life the project must support | Shared material field continues behind a compact footer and inquiry action |

### Residence asset contract

The three Ogba source photographs remain preserved. Dedicated 16:9 landscape derivatives extend the original architecture laterally so the pinned stage no longer destroys portrait compositions. The sequence is explicitly one residence study, not three unrelated projects:

1. living and dining: gathering, light and flow;
2. media wall: stone, reflection and restraint;
3. dining: light, reflection and intimacy.

### Timing and accessibility contract

- Desktop residence copy enters across roughly fourteen percent of chapter progress rather than finishing in a short seven-percent burst.
- Founder portrait enters before the copy; title, support, and Function / Flow / Feeling resolve as separate beats.
- The life chapter has authored entry, hold, video reveal, proof hold, video exit, and coda ranges with no centre-split aperture.
- Mobile translates every pinned scene into normal document flow.
- Reduced motion resolves all copy and media as a static sequence; no content is removed.
- The inquiry UI creates a local copyable project brief and does not claim an unverified email or form backend.

## Revision 11 — Framed procession and luminous textile field

Live image review rejected the previous proof language because the media-wall photograph did not visibly establish an architectural-storage claim. The Ogba chapter now uses only claims supported by the photographs:

1. living and dining are connected as one composition;
2. stone, reflection and the low dark console create a restrained focal point;
3. warm light and mirrored depth make the dining setting intimate.

The residence motion law is now **one complete framed photograph travelling from right to left over the previous photograph**. There is no central aperture, split window, alternating reveal direction or counter-parallax. The frame occupies ninety percent of the viewport width and eighty-two percent of its height so the material field remains visible at the edges. Image grading is near-native brightness with a local text-protection gradient rather than a page-wide dark grade.

The narrative Canvas effect changes from dark smoke/lacquer to **light passing through layered sheer curtains and ribbed glass**. Slow vertical folds, curved reflected-light contours and one moving architectural highlight use a mineral champagne and soft-sage palette. The existing semantic DOM, DPR cap, offscreen pause, static fallback and reduced-motion behavior remain unchanged.

The Life chapter proposition is already visible when its sticky frame reaches the viewport instead of beginning from zero only after the section is fully pinned. The founder bridge now states the narrative consequence directly: “A room holds together when every choice is seen as one.”
