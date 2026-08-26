import { useEffect, useMemo, useRef, useState } from 'react';
import { getHeroVerticalFocus } from './framing';
import { renderApprovedLogoFrame, type LogoLayers } from './logoTimeline';

const TOTAL = 7.15;
const AXIS_POSITION = 855 / 2172;
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

export function App() {
  const rootRef = useRef<HTMLElement>(null);
  const macroRef = useRef<HTMLDivElement>(null);
  const materialLightRef = useRef<HTMLDivElement>(null);
  const backgroundCameraRef = useRef<HTMLDivElement>(null);
  const foregroundCameraRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const masterRef = useRef<HTMLImageElement>(null);
  const axisRef = useRef<HTMLDivElement>(null);
  const dStemRef = useRef<HTMLDivElement>(null);
  const dBowlRef = useRef<HTMLDivElement>(null);
  const ttaRef = useRef<HTMLDivElement>(null);
  const esignsRef = useRef<HTMLDivElement>(null);
  const heroGradeRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const storyStageRef = useRef<HTMLElement>(null);
  const heroSceneRef = useRef<HTMLDivElement>(null);
  const processSceneRef = useRef<HTMLElement>(null);
  const processTrackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const elapsedRef = useRef(0);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const debug = params.get('debug') === '1';
  const forceReduced = params.get('reduced') === '1';

  useEffect(() => {
    const updateFraming = () => {
      const focus = getHeroVerticalFocus(window.innerWidth / Math.max(window.innerHeight, 1));
      rootRef.current?.style.setProperty('--hero-focus-y', `${focus * 100}%`);
    };
    updateFraming();
    window.addEventListener('resize', updateFraming, { passive: true });
    return () => window.removeEventListener('resize', updateFraming);
  }, []);

  useEffect(() => {
    const layers: LogoLayers | null = masterRef.current && axisRef.current && dStemRef.current && dBowlRef.current && ttaRef.current && esignsRef.current
      ? { master: masterRef.current, axis: axisRef.current, dStem: dStemRef.current, dBowl: dBowlRef.current, tta: ttaRef.current, esigns: esignsRef.current }
      : null;
    if (!layers) return;

    let start = performance.now() - elapsedRef.current * 1000;
    const reduced = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const audit = Number(params.get('auditTime'));
    const isAudit = Number.isFinite(audit) && params.has('auditTime');

    const evaluate = (t: number) => {
      renderApprovedLogoFrame(Math.min(t, 3.05), layers, reduced);

      const registration = reduced ? (t >= 0.72 ? 1 : 0) : smooth((t - 3.32) / 1.84);
      const cameraEase = smooth(registration);
      const roomIn = reduced ? smooth((t - 0.68) / 0.36) : smooth(registration / 0.22);
      const macroOut = reduced ? smooth((t - 0.68) / 0.36) : smooth((registration - 0.035) / 0.24);
      const cameraScale = reduced ? 1 : Math.exp(mix(Math.log(6.15), 0, cameraEase));
      const cameraY = reduced ? 0 : mix(2.2, 0, cameraEase);

      const applyCamera = (element: HTMLDivElement | null) => {
        if (!element) return;
        element.style.opacity = String(roomIn);
        element.style.transform = `translate3d(0, ${cameraY.toFixed(2)}%, 0) scale(${cameraScale.toFixed(4)})`;
      };
      applyCamera(backgroundCameraRef.current);
      applyCamera(foregroundCameraRef.current);

      if (macroRef.current) {
        macroRef.current.style.opacity = String(1 - macroOut);
        macroRef.current.style.transform = `scale(${(1.018 - registration * 0.018).toFixed(4)})`;
      }
      if (materialLightRef.current) {
        const lightTravel = reduced ? 0 : smooth(clamp(t / 3.05));
        materialLightRef.current.style.opacity = String((1 - macroOut) * 0.34);
        materialLightRef.current.style.transform = `translate3d(${mix(-34, 34, lightTravel).toFixed(2)}%, 0, 0)`;
      }

      if (logoRef.current) {
        const initialAxisCorrection = logoRef.current.offsetWidth * (0.5 - AXIS_POSITION);
        logoRef.current.style.left = `calc(50% + ${(initialAxisCorrection * (1 - cameraEase)).toFixed(2)}px)`;
        logoRef.current.style.top = `${mix(48, 46.2, cameraEase).toFixed(2)}%`;
        logoRef.current.style.transform = `translate(-50%, -50%) scale(${mix(1, 0.265, cameraEase).toFixed(4)})`;
        logoRef.current.style.visibility = registration >= 0.995 ? 'hidden' : 'visible';
      }

      if (heroGradeRef.current) {
        heroGradeRef.current.style.opacity = String(smooth((registration - 0.56) / 0.34));
      }

      const interfaceIn = reduced ? smooth((t - 1.08) / 0.42) : smooth((t - 5.44) / 0.72);
      if (heroCopyRef.current) {
        heroCopyRef.current.style.opacity = String(interfaceIn);
        heroCopyRef.current.style.setProperty('--hero-copy-y', `${mix(24, 0, interfaceIn).toFixed(2)}px`);
      }
      if (navRef.current) {
        navRef.current.style.opacity = String(interfaceIn);
        navRef.current.style.transform = `translateY(${mix(-10, 0, interfaceIn).toFixed(2)}px)`;
      }

      rootRef.current?.style.setProperty('--time-progress', String(clamp(t / TOTAL)));
      elapsedRef.current = t;
      if (debug) setTime(t);
    };

    if (isAudit) {
      setPaused(true);
      evaluate(clamp(audit, 0, TOTAL));
      return;
    }

    const loop = (now: number) => {
      if (!paused) {
        const next = Math.min((now - start) / 1000, TOTAL);
        evaluate(next);
        if (next < TOTAL) frameRef.current = requestAnimationFrame(loop);
      }
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [paused, forceReduced, params, debug]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'r') window.location.reload();
      if (event.code === 'Space') {
        event.preventDefault();
        setPaused((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const stage = storyStageRef.current;
    if (!stage) return;

    const reduced = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const auditProgress = Number(params.get('scrollProgress'));
    const isAudit = Number.isFinite(auditProgress) && params.has('scrollProgress');
    let scrollFrame = 0;
    let scrollQueued = false;

    const renderScroll = (rawProgress: number) => {
      const progress = clamp(rawProgress);
      const handoff = smooth((progress - 0.06) / 0.24);
      const processProgress = clamp((progress - 0.27) / 0.73);

      if (heroSceneRef.current) {
        heroSceneRef.current.style.visibility = reduced && progress >= 0.18 ? 'hidden' : 'visible';
        heroSceneRef.current.style.transform = reduced
          ? 'none'
          : `translate3d(0, ${(-handoff * 100).toFixed(2)}svh, 0)`;
      }

      if (processSceneRef.current) {
        processSceneRef.current.style.visibility = reduced && progress < 0.18 ? 'hidden' : 'visible';
        processSceneRef.current.style.transform = reduced
          ? 'none'
          : `translate3d(0, ${((1 - handoff) * 100).toFixed(2)}svh, 0)`;
      }

      if (processTrackRef.current) {
        const reducedStep = Math.min(3, Math.floor(processProgress * 4));
        const reducedOffsets = window.innerWidth <= 760
          ? [0, -69, -138, -207]
          : [0, -80, -146, -219];
        const trackTravel = reduced ? reducedOffsets[reducedStep] : mix(22, -208, processProgress);
        processTrackRef.current.style.transform = `translate3d(0, ${trackTravel.toFixed(2)}vh, 0)`;
        processTrackRef.current.querySelectorAll<HTMLImageElement>('.process-card img').forEach((image, index) => {
          const localProgress = smooth((processProgress - index * 0.21) / 0.34);
          const cropTravel = reduced ? 0 : mix(-2.5, 4.5, localProgress);
          image.style.transform = `translate3d(0, ${cropTravel.toFixed(2)}%, 0) scale(1.06)`;
        });
      }

      rootRef.current?.style.setProperty('--scroll-progress', String(progress));
      rootRef.current?.style.setProperty('--process-progress', String(processProgress));
    };

    const update = () => {
      const rect = stage.getBoundingClientRect();
      const scrollable = Math.max(stage.offsetHeight - window.innerHeight, 1);
      renderScroll(-rect.top / scrollable);
    };

    if (isAudit) {
      renderScroll(auditProgress);
      return;
    }

    const queueUpdate = () => {
      if (!scrollQueued) {
        scrollQueued = true;
        scrollFrame = requestAnimationFrame(() => {
          scrollQueued = false;
          update();
        });
      }
    };

    update();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate, { passive: true });
    return () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
    };
  }, [forceReduced, params]);

  return (
    <main className="site" ref={rootRef}>
      <section className="story-stage" ref={storyStageRef} aria-label="TTA Designs introduction and process">
        <div className="experience">
          <div className="hero-scene" ref={heroSceneRef}>
            <div className="room-camera room-camera--background" ref={backgroundCameraRef} aria-hidden="true">
              <img src="/assets/tta-living-cinematic-master-v1.png" alt="" />
            </div>

            <div className="material-field" ref={macroRef} aria-hidden="true">
              <img src="/assets/tta-wall-macro-v1.jpeg" alt="" />
              <span className="material-shade" />
            </div>
            <div className="material-light" ref={materialLightRef} aria-hidden="true" />

            <div className="logo-wrapper" ref={logoRef} aria-label="TTA Designs">
              <img src="/assets/tta-wordmark-white.png" className="logo-layer master-wordmark" ref={masterRef} alt="TTA Designs" />
              <div className="logo-layer" ref={axisRef}><img src="/assets/axis-line.png" alt="" /></div>
              <div className="logo-layer" ref={dStemRef}><img src="/assets/d-stem.png" alt="" /></div>
              <div className="logo-layer" ref={dBowlRef}><img src="/assets/d-bowl.png" alt="" /></div>
              <div className="logo-layer" ref={ttaRef}><img src="/assets/tta-unified-group.png" alt="" /></div>
              <div className="logo-layer" ref={esignsRef}><img src="/assets/esigns-unified-group.png" alt="" /></div>
            </div>

            <div className="room-camera room-camera--foreground" ref={foregroundCameraRef} aria-hidden="true">
              <img src="/assets/tta-living-cinematic-master-v1.png" alt="" />
            </div>

            <div className="hero-grade" ref={heroGradeRef} aria-hidden="true" />

            <nav className="hero-nav" ref={navRef} aria-label="Primary">
              <img src="/assets/tta-wordmark-white.png" alt="TTA Designs" />
              <span>Residential interiors · Lagos</span>
            </nav>

            <section className="hero-copy" ref={heroCopyRef} aria-label="Introduction">
              <p className="eyebrow">Refined in feeling · Considered in use</p>
              <h1>Designed around<br />the way life is lived.</h1>
              <p className="hero-support">Refined interiors shaped by movement, comfort, and the decisions that make everything else work.</p>
              <span className="scroll-cue">Scroll to enter<i /></span>
            </section>
          </div>

          <section className="process-scene" ref={processSceneRef} aria-labelledby="process-title">
            <div className="process-texture" aria-hidden="true" />

            <div className="process-copy">
              <p className="process-kicker">02 / How the room comes together</p>
              <h2 id="process-title">The finish is what you see.<br />The thinking starts much earlier.</h2>
              <p>TTA works through the room on site—reading the space, aligning the team, refining the surfaces, and carrying those decisions into the final atmosphere.</p>
            </div>

            <div className="process-reel" ref={processTrackRef}>
              <figure className="process-card process-card--wide">
                <div className="process-media"><img src="/assets/akoka-site-ceiling-open.jpg" alt="TTA Designs supervising an open ceiling structure during work in progress" /></div>
                <figcaption><b>01 / Read the room</b><span>The structure and services are considered before they disappear.</span></figcaption>
              </figure>
              <figure className="process-card process-card--narrow">
                <div className="process-media"><img src="/assets/akoka-site-conversation.jpg" alt="TTA Designs discussing work with the project team on site" /></div>
                <figcaption><b>02 / Align the work</b><span>Decisions are clarified with the people bringing the room to life.</span></figcaption>
              </figure>
              <figure className="process-card process-card--mid">
                <div className="process-media"><img src="/assets/akoka-site-painting.jpg" alt="A surface finish being refined on site under TTA Designs supervision" /></div>
                <figcaption><b>03 / Refine the surface</b><span>Light, texture and finish are tested where they will actually live.</span></figcaption>
              </figure>
              <figure className="process-card process-card--final">
                <div className="process-media"><img src="/assets/akoka-site-installation.jpg" alt="The finished Akoka interior with a resolved ceiling, lighting and seating composition" /></div>
                <figcaption><b>04 / Carry it through</b><span>The final atmosphere inherits every decision made before it.</span></figcaption>
              </figure>
            </div>

            <p className="process-project">Project Akoka · Process study</p>
          </section>
        </div>
      </section>

      {debug && (
        <aside className="debug-hud">
          <span>MATERIAL REGISTRATION</span>
          <output>{time.toFixed(2)} / {TOTAL.toFixed(2)}</output>
          <button onClick={() => window.location.reload()}>Replay</button>
          <span>R replay · Space pause</span>
        </aside>
      )}
    </main>
  );
}
