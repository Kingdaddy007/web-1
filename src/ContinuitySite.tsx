import { HeroProcessContinuity } from './prototypes/HeroProcessContinuity';
import { TypographySpecimen } from './prototypes/TypographySpecimen';

/**
 * Production composition for the two bounded agent deliverables.
 *
 * The continuity slice owns the opening and process handoff. The typography
 * deliverable owns the remaining practice, inquiry, and footer sections in
 * integrated mode, without exposing its comparison controls.
 */
export function ContinuitySite() {
  return (
    <main className="agent-merged-site" id="top">
      <HeroProcessContinuity />
      <TypographySpecimen integrated />
    </main>
  );
}
