import { useEffect, useId, useRef } from 'react';
import { getHeroVerticalFocus } from '../framing';
import './hero-process-continuity.css';

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

const FIRST_EVIDENCE = {
  image: '/assets/akoka-site-ceiling-open-wide-clean-v1.png',
  alt: 'TTA Designs supervising the exposed ceiling structure and services during work in progress at Project Akoka',
  caption: 'The structure and services are considered before they disappear.',
};

type ContinuityState = 'hero' | 'reframe' | 'proposition' | 'evidence';

function stateForProgress(progress: number): ContinuityState {
  if (progress < 0.18) return 'hero';
  if (progress < 0.34) return 'reframe';
  if (progress < 0.55) return 'proposition';
  return 'evidence';
}

export function HeroProcessContinuity() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const evidenceRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const id = useId().replaceAll(':', '');
  const heroTitleId = `${id}-hero-title`;
  const processTitleId = `${id}-process-title`;
  const evidenceTitleId = `${id}-evidence-title`;

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const process = processRef.current;
    const evidence = evidenceRef.current;
    if (!root || !stage || !process || !evidence || typeof window === 'undefined') return;

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    let frame = 0;
    let targetProgress = 0;
    let renderedProgress = 0;
    let smoothing = false;

    const applyProgress = (rawProgress: number) => {
      const progress = clamp(rawProgress);
      const reduced = reducedQuery.matches;
      const mobile = mobileQuery.matches;
      const desktopMotion = !reduced && !mobile;

      // Desktop ranges mirror the approved Continuity Reframe storyboard:
      // hero 0-.18, copy departure/reframe .18-.34, proposition .34-.55,
      // first evidence registration .55-.72, evidence hold .72-1.
      const heroPrimaryExit = desktopMotion ? smooth((progress - 0.18) / 0.1) : 0;
      const heroSecondaryExit = desktopMotion ? smooth((progress - 0.205) / 0.105) : 0;
      const roomReframe = desktopMotion ? smooth((progress - 0.18) / 0.26) : 0;
      const fieldProgress = desktopMotion ? smooth((progress - 0.27) / 0.38) : 1;
      const propositionProgress = desktopMotion ? smooth((progress - 0.34) / 0.21) : 1;
      const evidenceProgress = desktopMotion ? smooth((progress - 0.55) / 0.17) : 1;
      const evidenceSettle = desktopMotion ? smooth((progress - 0.72) / 0.28) : 1;
      const captionProgress = desktopMotion ? smooth((progress - 0.7) / 0.12) : 1;

      const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
      const baseFocus = getHeroVerticalFocus(aspect);
      const redirectedFocus = clamp(baseFocus - 0.18, 0.22, 0.5);

      root.classList.toggle('is-reduced-motion', reduced);
      root.classList.toggle('is-mobile', mobile);
      root.dataset.continuityState = desktopMotion ? stateForProgress(progress) : 'evidence';
      root.style.setProperty('--hero-focus-y', `${mix(baseFocus, redirectedFocus, roomReframe) * 100}%`);
      root.style.setProperty('--hero-primary-opacity', String(1 - heroPrimaryExit));
      root.style.setProperty('--hero-primary-x', `${(-heroPrimaryExit * 4.2).toFixed(2)}vw`);
      root.style.setProperty('--hero-primary-y', `${(-heroPrimaryExit * 38).toFixed(2)}px`);
      root.style.setProperty('--hero-primary-blur', `${(heroPrimaryExit * 2.2).toFixed(2)}px`);
      root.style.setProperty('--hero-secondary-opacity', String(1 - heroSecondaryExit));
      root.style.setProperty('--hero-secondary-x', `${(heroSecondaryExit * 2.6).toFixed(2)}vw`);
      root.style.setProperty('--hero-secondary-y', `${(heroSecondaryExit * 30).toFixed(2)}px`);
      root.style.setProperty('--hero-secondary-blur', `${(heroSecondaryExit * 2).toFixed(2)}px`);
      root.style.setProperty('--room-x', `${(-roomReframe * 1.4).toFixed(2)}%`);
      root.style.setProperty('--room-y', `${(-roomReframe * 5.8).toFixed(2)}%`);
      root.style.setProperty('--room-scale', mix(1, 1.075, roomReframe).toFixed(4));
      root.style.setProperty('--process-field-opacity', String(mix(0, 0.9, fieldProgress)));
      root.style.setProperty('--process-light-x', `${mix(-22, 8, fieldProgress).toFixed(2)}%`);
      root.style.setProperty('--process-light-y', `${mix(6, -4, fieldProgress).toFixed(2)}%`);
      root.style.setProperty('--process-light-scale', mix(0.72, 1.14, fieldProgress).toFixed(3));
      root.style.setProperty('--proposition-opacity', String(propositionProgress));
      root.style.setProperty('--proposition-clip', `${((1 - propositionProgress) * 100).toFixed(2)}%`);
      root.style.setProperty('--proposition-light-x', `${mix(-18, 116, propositionProgress).toFixed(2)}%`);
      root.style.setProperty('--proposition-blur', `${((1 - propositionProgress) * 2.4).toFixed(2)}px`);
      root.style.setProperty('--evidence-opacity', String(evidenceProgress));
      root.style.setProperty('--evidence-y', `${mix(7, 0, evidenceSettle).toFixed(2)}vh`);
      root.style.setProperty('--evidence-clip', `${((1 - evidenceProgress) * 100).toFixed(2)}%`);
      root.style.setProperty('--evidence-image-y', `${mix(4, -1.5, evidenceSettle).toFixed(2)}%`);
      root.style.setProperty('--evidence-image-scale', mix(1.075, 1.035, evidenceSettle).toFixed(4));
      root.style.setProperty('--evidence-caption-opacity', String(captionProgress));
      root.style.setProperty('--evidence-caption-y', `${((1 - captionProgress) * 12).toFixed(2)}px`);
      root.style.setProperty('--process-note-opacity', String(mix(0, 1, smooth((progress - 0.55) / 0.17))));

      const processIsVisible = mobile || reduced || progress >= 0.34;
      const evidenceIsVisible = mobile || reduced || progress >= 0.55;
      process.setAttribute('aria-hidden', processIsVisible ? 'false' : 'true');
      evidence.setAttribute('aria-hidden', evidenceIsVisible ? 'false' : 'true');
    };

    const readProgress = () => {
      if (mobileQuery.matches || reducedQuery.matches) return 1;
      const rect = stage.getBoundingClientRect();
      const scrollable = Math.max(stage.offsetHeight - window.innerHeight, 1);
      return clamp(-rect.top / scrollable);
    };

    const renderImmediately = () => {
      targetProgress = readProgress();
      renderedProgress = targetProgress;
      applyProgress(renderedProgress);
    };

    const tick = () => {
      const reduced = reducedQuery.matches || mobileQuery.matches;
      const distance = targetProgress - renderedProgress;
      renderedProgress = reduced ? targetProgress : renderedProgress + distance * 0.18;
      if (Math.abs(distance) < 0.00012) renderedProgress = targetProgress;
      applyProgress(renderedProgress);
      if (renderedProgress !== targetProgress) {
        frame = window.requestAnimationFrame(tick);
      } else {
        smoothing = false;
      }
    };

    const queueUpdate = () => {
      targetProgress = readProgress();
      if (smoothing) return;
      smoothing = true;
      frame = window.requestAnimationFrame(tick);
    };

    const handleResize = () => {
      renderImmediately();
      syncVideo();
    };

    const syncVideo = () => {
      const video = heroVideoRef.current;
      if (!video || reducedQuery.matches || document.visibilityState === 'hidden') {
        video?.pause();
        return;
      }
      void video.play().catch(() => undefined);
    };

    root.classList.add('is-enhanced');
    renderImmediately();
    syncVideo();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', syncVideo);

    const visibilityObserver = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) syncVideo();
        else heroVideoRef.current?.pause();
      }, { threshold: 0.01 });
    visibilityObserver?.observe(root);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', syncVideo);
      visibilityObserver?.disconnect();
      heroVideoRef.current?.pause();
      root.classList.remove('is-enhanced', 'is-reduced-motion', 'is-mobile');
      delete root.dataset.continuityState;
    };
  }, []);

  return (
    <section
      className="hero-process-continuity"
      ref={rootRef}
      aria-label="TTA Designs hero and process continuity study"
    >
      <div className="hero-process-continuity__stage" ref={stageRef}>
        <div className="hero-process-continuity__pin">
          <section className="hero-process-continuity__hero" aria-labelledby={heroTitleId}>
            <div className="hero-process-continuity__hero-media" aria-hidden="true">
              <video
                ref={heroVideoRef}
                src="/assets/tta-living-cinematic-camera-v1.mp4"
                poster="/assets/tta-living-cinematic-master-v1.png"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
              />
            </div>
            <div className="hero-process-continuity__hero-grade" aria-hidden="true" />
            <span className="hero-process-continuity__datum" aria-hidden="true" />

            <div className="hero-process-continuity__hero-copy">
              <div className="hero-process-continuity__hero-primary">
                <p>Refined in feeling · Considered in use</p>
                <h1 id={heroTitleId}>Designed around<br />the way life is lived.</h1>
              </div>
              <div className="hero-process-continuity__hero-secondary">
                <p>Refined interiors shaped by movement, comfort, and the decisions that make everything else work.</p>
                <span>Scroll to look closer<i aria-hidden="true" /></span>
              </div>
            </div>
          </section>

          <section
            className="hero-process-continuity__process"
            ref={processRef}
            aria-labelledby={processTitleId}
            aria-hidden="false"
          >
            <div className="hero-process-continuity__process-material" aria-hidden="true">
              <img src="/assets/tta-wall-macro-v1.jpeg" alt="" />
              <span className="hero-process-continuity__process-light" />
              <span className="hero-process-continuity__process-shade" />
            </div>

            <div className="hero-process-continuity__process-copy">
              <p className="hero-process-continuity__process-kicker">Before the finish</p>
              <h2 id={processTitleId} aria-label="Beautiful rooms are settled long before they look finished.">
                <span aria-hidden="true">Beautiful rooms are settled</span>
                <span aria-hidden="true">long before they look finished.</span>
              </h2>
              <p className="hero-process-continuity__process-note">
                Layout, light, movement and services are resolved while change is still possible.
              </p>
              <span className="hero-process-continuity__process-datum">The visible finish inherits the decisions made before it.</span>
            </div>

            <figure
              className="hero-process-continuity__evidence"
              ref={evidenceRef}
              aria-labelledby={evidenceTitleId}
              aria-hidden="false"
            >
              <div className="hero-process-continuity__evidence-media">
                <img src={FIRST_EVIDENCE.image} alt={FIRST_EVIDENCE.alt} loading="eager" decoding="async" />
              </div>
              <figcaption>
                <span className="hero-process-continuity__evidence-index">01 / 04 · Structure</span>
                <strong id={evidenceTitleId}>Read the room</strong>
                <span>{FIRST_EVIDENCE.caption}</span>
                <small>Observed site evidence · Project Akoka</small>
              </figcaption>
            </figure>
          </section>
        </div>
      </div>
    </section>
  );
}
