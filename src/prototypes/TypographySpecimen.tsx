import { useEffect, useId, useRef, useState } from 'react';
import './typography-specimen.css';

type DirectionId = 'editorial' | 'humanist' | 'architectural';

const HERO_LABEL = 'Designed around the way life is lived.';
const PROCESS_PROPOSITION = 'What feels effortless is decided long before the room is complete.';
const PRACTICE_HEADING = 'The eye stays close to the work.';
const INQUIRY_HEADING = 'Let’s begin with the way you want to live.';

const DIRECTIONS = [
  {
    id: 'editorial',
    code: 'A',
    name: 'Editorial Grotesk',
    qualities: 'Precise, quiet, architectural',
    displayFamily: 'Segoe UI / Arial',
    supportFamily: 'Segoe UI / Arial',
    detail: 'One calm grotesk voice. Scale and spacing carry the atmosphere.',
    recommended: true,
  },
  {
    id: 'humanist',
    code: 'B',
    name: 'Humanist Precision',
    qualities: 'Warmer, softer, residential',
    displayFamily: 'Candara / Trebuchet MS',
    supportFamily: 'Segoe UI / Arial',
    detail: 'A more conversational display stand-in with a measured, editorial body voice.',
    recommended: false,
  },
  {
    id: 'architectural',
    code: 'C',
    name: 'Architectural Accent',
    qualities: 'Measured, technical, restrained',
    displayFamily: 'Segoe UI / Arial',
    supportFamily: 'Segoe UI / Arial',
    detail: 'A calm display voice with Bahnschrift reserved for notation and evidence labels.',
    recommended: false,
  },
] as const;

type Direction = (typeof DIRECTIONS)[number];

type LineMaskProps = {
  lines: readonly string[];
  variant: 'wide' | 'mobile';
};

function LineMask({ lines, variant }: LineMaskProps) {
  return (
    <span className={`typography-specimen__line-set typography-specimen__line-set--${variant}`} aria-hidden="true">
      {lines.map((line, index) => (
        <span className="typography-specimen__line-mask" key={`${line}-${index}`}>
          <i>{line}</i>
        </span>
      ))}
    </span>
  );
}

function MaskedHeading({
  as: Heading,
  className,
  id,
  label,
  mobileLines,
  wideLines,
}: {
  as: 'h1' | 'h2';
  className: string;
  id: string;
  label: string;
  mobileLines: readonly string[];
  wideLines: readonly string[];
}) {
  return (
    <Heading
      id={id}
      className={`typography-specimen__heading typography-specimen__heading--masked ${className}`}
      aria-label={label}
      data-typography-reveal="true"
    >
      <LineMask lines={wideLines} variant="wide" />
      <LineMask lines={mobileLines} variant="mobile" />
    </Heading>
  );
}

export function TypographySpecimen({ integrated = false }: { integrated?: boolean } = {}) {
  const [directionId, setDirectionId] = useState<DirectionId>('editorial');
  const panelRef = useRef<HTMLElement>(null);
  const specimenId = useId().replaceAll(':', '');
  const directionGroupId = `${specimenId}-direction-group`;
  const panelId = `${specimenId}-panel`;
  const activeDirection = DIRECTIONS.find(({ id }) => id === directionId) as Direction;
  const panelTitleId = `${panelId}-title`;
  const heroTitleId = `${panelId}-hero-title`;
  const processTitleId = `${panelId}-process-title`;
  const practiceTitleId = `${panelId}-practice-title`;
  const inquiryTitleId = `${panelId}-inquiry-title`;
  const inquiryNoteId = `${panelId}-inquiry-note`;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const headings = Array.from(panel.querySelectorAll<HTMLElement>('[data-typography-reveal="true"]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      headings.forEach((heading) => {
        heading.classList.add('typography-specimen__heading--observed', 'is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const heading = entry.target as HTMLElement;
        heading.classList.add('is-revealed');
        observer.unobserve(heading);
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });

    headings.forEach((heading) => {
      heading.classList.add('typography-specimen__heading--observed');
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [directionId]);

  return (
    <section
      className={`typography-specimen typography-specimen--${directionId}${integrated ? ' typography-specimen--integrated' : ''}`}
      aria-label="TTA Designs typography specimen"
    >
      {!integrated && (
        <header className="typography-specimen__masthead">
          <div className="typography-specimen__identity">
            <p className="typography-specimen__wordmark">TTA Designs</p>
            <p className="typography-specimen__utility">Typography specimen · Revision pass 02</p>
          </div>
          <p className="typography-specimen__utility typography-specimen__utility--quiet">Real content / no webfonts loaded</p>
        </header>
      )}

      {!integrated && (
        <div className="typography-specimen__controls">
          <fieldset className="typography-specimen__switcher">
            <legend id={directionGroupId}>Compare directions</legend>
            <div className="typography-specimen__direction-list">
              {DIRECTIONS.map((option) => {
                const inputId = `${specimenId}-${option.id}`;
                const isActive = option.id === directionId;

                return (
                  <label
                    className={`typography-specimen__direction${isActive ? ' is-active' : ''}`}
                    htmlFor={inputId}
                    key={option.id}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={directionGroupId}
                      value={option.id}
                      checked={isActive}
                      onChange={() => setDirectionId(option.id)}
                      aria-controls={panelId}
                    />
                    <span className="typography-specimen__direction-code">{option.code}</span>
                    <span className="typography-specimen__direction-name">{option.name}</span>
                    {option.recommended && <span className="typography-specimen__recommended">Recommended</span>}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <p className="typography-specimen__selection" aria-live="polite">
            <span>{activeDirection.qualities}</span>
            <span>{activeDirection.detail}</span>
          </p>
        </div>
      )}

      <article
        className="typography-specimen__panel"
        id={panelId}
        key={directionId}
        ref={panelRef}
        aria-labelledby={integrated ? practiceTitleId : panelTitleId}
      >
        {!integrated && (
          <header className="typography-specimen__panel-meta">
            <div>
              <p className="typography-specimen__panel-kicker" id={panelTitleId}>
                {activeDirection.code} / {activeDirection.name}
              </p>
              <p className="typography-specimen__panel-qualities">{activeDirection.qualities}</p>
            </div>
            <p className="typography-specimen__font-note">
              Display stand-in: {activeDirection.displayFamily}
              <br />
              Supporting text: {activeDirection.supportFamily}
            </p>
          </header>
        )}

        {!integrated && (
          <section className="typography-specimen__hero" aria-labelledby={heroTitleId}>
            <div className="typography-specimen__section-index">
              <span>01</span>
              <span>Arrival</span>
            </div>
            <div className="typography-specimen__hero-copy">
              <p className="typography-specimen__eyebrow">Refined in feeling · Considered in use</p>
              <MaskedHeading
                as="h1"
                className="typography-specimen__hero-heading"
                id={heroTitleId}
                label={HERO_LABEL}
                wideLines={['Designed around', 'the way life is', 'lived.']}
                mobileLines={['Designed around', 'the way life', 'is lived.']}
              />
              <p className="typography-specimen__body typography-specimen__hero-support">
                Refined interiors shaped by movement, comfort, and the decisions that make everything else work.
              </p>
            </div>
            <aside className="typography-specimen__hero-aside" aria-label="Hero type role">
              <span className="typography-specimen__aside-label">Hero heading</span>
              <p>Atmospheric scale with a composed desktop hold and a shorter mobile cadence.</p>
            </aside>
          </section>
        )}

        {!integrated && (
          <section className="typography-specimen__process" aria-labelledby={processTitleId}>
            <div className="typography-specimen__section-index">
              <span>02</span>
              <span>Process</span>
            </div>
            <div className="typography-specimen__process-copy">
              <p className="typography-specimen__eyebrow">Before the finish</p>
              <MaskedHeading
                as="h2"
                className="typography-specimen__process-heading"
                id={processTitleId}
                label={PROCESS_PROPOSITION}
                wideLines={['What feels effortless', 'is decided long', 'before the room is', 'complete.']}
                mobileLines={['What feels', 'effortless is', 'decided long', 'before the room is', 'complete.']}
              />
              <p className="typography-specimen__process-caption">Structure · Movement · Light · Use</p>
            </div>
            <div className="typography-specimen__process-note">
              <span className="typography-specimen__aside-label">Process proposition</span>
              <p>Large enough to carry the argument, quiet enough to leave the evidence in charge.</p>
            </div>
          </section>
        )}

        <section className="typography-specimen__practice" aria-labelledby={practiceTitleId}>
          <div className="typography-specimen__section-index">
            <span>03</span>
            <span>Practice</span>
          </div>
          <div className="typography-specimen__practice-copy">
            <p className="typography-specimen__eyebrow">The practice</p>
            <MaskedHeading
              as="h2"
              className="typography-specimen__practice-heading"
              id={practiceTitleId}
              label={PRACTICE_HEADING}
              wideLines={['The eye stays', 'close to the work.']}
              mobileLines={['The eye stays', 'close to the', 'work.']}
            />
            <p className="typography-specimen__body typography-specimen__practice-note">
              From early site decisions to the final placement of light, furniture and art, the atmosphere is resolved through attention at every scale.
            </p>
            <div className="typography-specimen__values" aria-label="Practice values">
              <span>Function</span>
              <span>Flow</span>
              <span>Feeling</span>
            </div>
          </div>
          <aside className="typography-specimen__practice-aside" aria-label="Practice type role">
            <span className="typography-specimen__aside-label">Practice note</span>
            <p>Readable body copy stays close to 45 characters per line so the detail feels considered, not compressed.</p>
          </aside>
        </section>

        <section className="typography-specimen__inquiry" aria-labelledby={inquiryTitleId}>
          <div className="typography-specimen__inquiry-field" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="typography-specimen__inquiry-copy">
            <p className="typography-specimen__eyebrow">For a considered residence</p>
            <MaskedHeading
              as="h2"
              className="typography-specimen__inquiry-heading"
              id={inquiryTitleId}
              label={INQUIRY_HEADING}
              wideLines={['Let’s begin with', 'the way you want', 'to live.']}
              mobileLines={['Let’s begin', 'with the way', 'you want to', 'live.']}
            />
            <a className="typography-specimen__cta" href={`#${inquiryNoteId}`}>
              <span>Begin a conversation</span>
              <span aria-hidden="true">↗</span>
            </a>
            <p className="typography-specimen__subtext" id={inquiryNoteId}>
              A calm, direct project inquiry will live here in the commissioned experience.
            </p>
          </div>
        </section>

        <footer className="typography-specimen__footer">
          <div className="typography-specimen__footer-colophon">
            <div className="typography-specimen__footer-studio">
              <span className="typography-specimen__footer-label">Studio</span>
              <p className="typography-specimen__footer-identity">TTA Designs</p>
              <p className="typography-specimen__footer-address">
                Residential and commercial interiors
                <br />
                Lagos, Nigeria
              </p>
            </div>
            <div className="typography-specimen__footer-connect">
              <span className="typography-specimen__footer-label">Connect</span>
              <a className="typography-specimen__footer-social" href="https://www.instagram.com/ttadesigns/" target="_blank" rel="noreferrer">
                Instagram ↗
              </a>
            </div>
            <div className="typography-specimen__footer-utility">
              <span className="typography-specimen__footer-label">Utility</span>
              <a href={`#${panelTitleId}`}>Back to top ↑</a>
              <span>Private cinematic concept</span>
            </div>
          </div>
          <p className="typography-specimen__footer-wordmark">TTA Designs</p>
          <div className="typography-specimen__footer-meta">
            <span>Spaces shaped around the way life is lived.</span>
          </div>
        </footer>
      </article>
    </section>
  );
}
