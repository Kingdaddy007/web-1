# Alternate Model Review — 2026-08-30

## Verdict

The site has a credible authored thesis: atmosphere is presented as the result of prior decisions, and the opening earns attention through registration before yielding to the room. The strongest work was already present in the opening, the process proposition, the founder chapter, and the restrained practice proof. The main weakness was not a lack of spectacle; it was drift. The portfolio stopped behaving like one spatial argument, mobile typography lost its intended color and measure, and reduced motion exposed an unfinished fallback.

## Highest-leverage audit

### Must Fix

1. **Restore one spatial thesis.** The portfolio claimed to be one connected residence study but included an unrelated executive office and a generic lounge. Five equally weighted panels also made the sequence feel like a repeated component demo. The procession is now three connected Ogba moments, and its scroll length is reduced from `605svh` to `405svh`.
2. **Repair the mobile reading layer.** White caption overrides landed on a light portfolio surface, while the life-story grid expanded to min-content width and clipped its largest lines. Project copy now uses deliberate dark typographic color, the life-story grid can shrink, all headline lines wrap inside the viewport, and the page no longer pans horizontally at 390 × 844.
3. **Make reduced motion a complete static composition.** System and explicit reduced modes now pause all three videos at frame zero, collapse animated transitions, preserve a static inquiry material field, and use dark portfolio typography on the light fallback surface.
4. **Make inquiry interaction ready for keyboard and touch.** Opening the dialog now moves focus into it, Tab is contained within the sheet, Escape closes it, focus returns to the originating button, and the Close control has a 44 px target.

### Should Fix

1. **Remove the portfolio-to-life dead zone.** The final residence previously faded early, then the next chapter waited below the fold. The last caption now holds to the release, the portfolio exits only at its final edge, and the life-story thesis begins entering before the section reaches the viewport top.

### Could Improve

1. **Replace the clipboard-to-Instagram handoff when a verified inquiry channel exists.** The current path is honest and functional, but still asks the prospect to carry the brief between interfaces. No unverified email address, endpoint, or third-party form was invented in this pass.
2. **Commission a consistent image grade or new photography.** The code now protects crop and hierarchy, but variations in source lighting, sharpness, and color temperature still limit how fully the three residence frames can read as one editorial shoot.

## Evidence

- Inspected the implemented page as a continuous sequence at 1440 × 900 and 390 × 844 in the in-app browser.
- Verified normal motion, system `prefers-reduced-motion: reduce`, and the explicit `?reduced=1` route.
- Confirmed three connected project panels, desktop sticky pinning, mobile document width equal to client width, loaded imagery, active life/practice video playback in normal mode, and all videos paused at `0` in both reduced modes.
- Verified inquiry focus entry, forward and reverse Tab wrapping, Escape close, focus return, full-width mobile containment, and the 44 px Close target.
- Browser console: no errors or warnings during desktop, mobile, inquiry, or reduced-motion passes.
- `git diff --check`: clean apart from expected line-ending notices.
- `npm run build`: passed (`tsc -b && vite build`).

## Residual uncertainty

This pass verifies the local implementation and production bundle, not a deployed production URL, analytics, form delivery, or real-device GPU/media behavior. The local asset set does not establish final image licensing or photography provenance.
