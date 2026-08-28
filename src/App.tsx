import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { getHeroVerticalFocus } from './framing';
import { LivingMaterialCanvas } from './LivingMaterialCanvas';
import { InquiryMaterialCanvas } from './InquiryMaterialCanvas';
import { renderApprovedLogoFrame, type LogoLayers } from './logoTimeline';

const TOTAL = 7.15;
const LOGO_AXIS = 855 / 2172;
const INTERLUDE_TEXT = 'What feels effortless is decided long before the room is complete.';

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

const PROCESS_STAGES = [
  {
    number: '01',
    phase: 'Structure',
    title: 'Read the room',
    description: 'See what the space needs before the ceiling closes.',
    image: '/assets/akoka-site-ceiling-open-wide-clean-v1.png',
    alt: 'TTA Designs supervising the exposed ceiling structure and services during work in progress at Project Akoka',
  },
  {
    number: '02',
    phase: 'Alignment',
    title: 'Resolve it together',
    description: 'Make the decisions while they can still change the room.',
    image: '/assets/akoka-site-conversation-wide-clean-v1.png',
    alt: 'TTA Designs reviewing spatial decisions with the site team at Project Akoka',
  },
  {
    number: '03',
    phase: 'Refinement',
    title: 'Let light test the finish',
    description: 'Shape texture and tone where they will actually be lived with.',
    image: '/assets/akoka-site-painting-wide-clean-v1.png',
    alt: 'Wall and surface finishes being refined under natural and architectural light at Project Akoka',
  },
  {
    number: '04',
    phase: 'Resolution',
    title: 'Carry every decision through',
    description: 'The final atmosphere inherits everything decided before it.',
    image: '/assets/akoka-site-installation-wide-clean-v1.png',
    alt: 'Resolved living room installation with integrated lighting and a deep green seating composition at Project Akoka',
  },
] as const;

const WORK_STUDIES = [
  { title: 'A room for arriving', note: 'Warm architecture · Living', image: '/assets/residential-living-arrival.jpg', alt: 'A warm contemporary living room by TTA Designs' },
  { title: 'A softer enclosure', note: 'Light · Rest · Bedroom', image: '/assets/residential-bedroom-arrival.jpg', alt: 'A bright layered bedroom interior by TTA Designs' },
  { title: 'Comfort at close range', note: 'Texture · Curve · Detail', image: '/assets/residential-sofa-detail.jpg', alt: 'A curved sofa and material detail in a TTA Designs residence' },
  { title: 'Designed to be lived in', note: 'Conversation · Human scale', image: '/assets/residential-table-detail.jpg', alt: 'People inhabiting a completed TTA Designs living room' },
  { title: 'Atmosphere, resolved', note: 'Residence · Lagos', image: '/assets/residential-living-wide.jpg', alt: 'A completed residential living room in use' },
] as const;

export function App() {
  const rootRef = useRef<HTMLElement>(null);
  const storyStageRef = useRef<HTMLElement>(null);
  const portfolioStageRef = useRef<HTMLElement>(null);
  const practiceChapterRef = useRef<HTMLElement>(null);
  const inquiryCanvasRef = useRef<HTMLCanvasElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const practiceVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const heroSceneRef = useRef<HTMLDivElement>(null);
  const processSceneRef = useRef<HTMLElement>(null);
  const interludeRef = useRef<HTMLDivElement>(null);
  const proofSceneRef = useRef<HTMLDivElement>(null);
  const materialCanvasRef = useRef<HTMLCanvasElement>(null);
  const materialCanvasControllerRef = useRef<LivingMaterialCanvas | null>(null);
  const processMediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const processImageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const processCopyRefs = useRef<(HTMLDivElement | null)[]>([]);

  const macroRef = useRef<HTMLDivElement>(null);
  const materialLightRef = useRef<HTMLDivElement>(null);
  const backgroundCameraRef = useRef<HTMLDivElement>(null);
  const foregroundCameraRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
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

  const frameRef = useRef(0);
  const elapsedRef = useRef(0);
  const activeStageRef = useRef(0);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [activeWork, setActiveWork] = useState(0);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const debug = params.get('debug') === '1';
  const forceReduced = params.get('reduced') === '1';

  useEffect(() => {
    PROCESS_STAGES.forEach((stage) => {
      const image = new Image();
      image.src = stage.image;
    });
  }, []);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>('.cinematic-heading:not(.portfolio-bridge .cinematic-heading)'));
    const reduced = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      headings.forEach((heading) => heading.classList.add('is-revealed'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.38 });
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [forceReduced]);

  useEffect(() => {
    const canvas = materialCanvasRef.current;
    if (!canvas) return;
    const reducedMotion = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const controller = new LivingMaterialCanvas(canvas, { reducedMotion });
    materialCanvasControllerRef.current = controller;
    return () => {
      controller.destroy();
      materialCanvasControllerRef.current = null;
    };
  }, [forceReduced]);

  useEffect(() => {
    const canvas = inquiryCanvasRef.current;
    if (!canvas) return;
    const reducedMotion = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const controller = new InquiryMaterialCanvas(canvas, reducedMotion);
    return () => controller.destroy();
  }, [forceReduced]);

  useEffect(() => {
    const videos = practiceVideoRefs.current.filter(Boolean) as HTMLVideoElement[];
    const section = practiceChapterRef.current;
    if (!section || videos.length === 0) return;
    const observer = new IntersectionObserver(([entry]) => {
      videos.forEach((video) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      });
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;
    const stage = storyStageRef.current;
    if (!video || !stage) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => undefined);
      else video.pause();
    }, { threshold: 0.01 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

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

      if (backgroundCameraRef.current) {
        backgroundCameraRef.current.style.opacity = String(roomIn);
        backgroundCameraRef.current.style.transform = `translate3d(0, ${cameraY.toFixed(2)}%, 0) scale(${cameraScale.toFixed(4)})`;
      }
      if (foregroundCameraRef.current) {
        const apertureOut = smooth((registration - 0.72) / 0.24);
        foregroundCameraRef.current.style.opacity = String(roomIn * (1 - apertureOut));
        foregroundCameraRef.current.style.transform = `translate3d(0, ${cameraY.toFixed(2)}%, 0) scale(${cameraScale.toFixed(4)})`;
      }

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
        const initialAxisCorrection = logoRef.current.offsetWidth * (0.5 - LOGO_AXIS);
        const logoRelease = reduced ? Number(registration >= 0.9) : smooth((registration - 0.7) / 0.26);
        logoRef.current.style.left = `calc(50% + ${(initialAxisCorrection * (1 - cameraEase)).toFixed(2)}px)`;
        logoRef.current.style.top = `${mix(48, 46.2, cameraEase).toFixed(2)}%`;
        logoRef.current.style.transform = `translate(-50%, -50%) scale(${mix(1, 0.265, cameraEase).toFixed(4)})`;
        logoRef.current.style.opacity = String(1 - logoRelease);
        logoRef.current.style.visibility = logoRelease >= 0.999 ? 'hidden' : 'visible';
      }

      if (heroGradeRef.current) heroGradeRef.current.style.opacity = String(smooth((registration - 0.56) / 0.34));

      const interfaceIn = reduced ? smooth((t - 1.08) / 0.42) : smooth((t - 5.44) / 0.72);
      if (heroCopyRef.current) {
        heroCopyRef.current.style.setProperty('--hero-arrival-opacity', String(interfaceIn));
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
    let targetProgress = 0;
    let renderedProgress = 0;
    let smoothing = false;

    const renderScroll = (rawProgress: number) => {
      const progress = clamp(rawProgress);
      const handoff = reduced ? (progress >= 0.14 ? 1 : 0) : smooth(progress / 0.18);
      const processProgress = clamp((progress - 0.12) / 0.88);
      const interludeIn = reduced ? Number(processProgress > 0.01) : smooth((processProgress - 0.015) / 0.09);
      const interludeOut = reduced ? Number(processProgress > 0.28) : smooth((processProgress - 0.22) / 0.1);
      const interludePresence = interludeIn * (1 - interludeOut);
      const proofIn = reduced ? Number(processProgress >= 0.3) : smooth((processProgress - 0.27) / 0.13);
      const proofProgress = clamp((processProgress - 0.34) / 0.66);
      materialCanvasControllerRef.current?.setProgress(processProgress);
      rootRef.current?.style.setProperty('--process-interface-opacity', String(proofIn));

      if (interludeRef.current) {
        interludeRef.current.style.opacity = String(interludePresence);
        interludeRef.current.style.transform = `translate3d(0, ${mix(28, -20, interludeOut).toFixed(2)}px, 0)`;
        interludeRef.current.style.visibility = interludePresence <= 0.001 ? 'hidden' : 'visible';
        interludeRef.current.style.setProperty('--type-progress', String(reduced ? 1 : processProgress));
      }
      if (proofSceneRef.current) {
        proofSceneRef.current.style.opacity = String(proofIn);
        proofSceneRef.current.style.transform = `translate3d(0, ${mix(12, 0, proofIn).toFixed(2)}vh, 0)`;
        proofSceneRef.current.style.visibility = proofIn <= 0.001 ? 'hidden' : 'visible';
      }

      if (processSceneRef.current) {
        const processY = reduced ? (handoff ? 0 : 100) : mix(100, 0, handoff);
        processSceneRef.current.style.transform = `translate3d(0, ${processY.toFixed(3)}%, 0)`;
      }
      if (heroSceneRef.current) {
        const heroScale = mix(1, 1.025, handoff);
        const heroY = reduced ? (handoff ? -100 : 0) : mix(0, -24, handoff);
        heroSceneRef.current.style.transform = `translate3d(0, ${heroY.toFixed(3)}vh, 0) scale(${heroScale.toFixed(4)})`;
      }
      if (heroCopyRef.current) {
        heroCopyRef.current.style.setProperty('--hero-copy-scroll-y', `${(-handoff * 8).toFixed(2)}vh`);
        heroCopyRef.current.style.setProperty('--hero-copy-scroll-opacity', String(1 - smooth(handoff / 0.72)));
      }

      const scaled = proofProgress * PROCESS_STAGES.length;
      const currentIndex = Math.min(PROCESS_STAGES.length - 1, Math.floor(scaled));
      processMediaRefs.current.forEach((media, index) => {
        if (!media) return;
        const start = index === 0 ? 0 : index / PROCESS_STAGES.length - 0.055;
        const reveal = index === 0 ? 1 : (reduced ? Number(proofProgress >= start) : smooth((proofProgress - start) / 0.105));
        const panelY = index === 0 ? 0 : mix(102, 0, reveal);
        media.style.transform = `translate3d(0, ${panelY.toFixed(3)}%, 0)`;
        media.style.opacity = String(index === 0 || reveal > 0.001 ? 1 : 0);
        media.style.zIndex = String(10 + index);

        const image = processImageRefs.current[index];
        if (image) {
          const life = clamp((proofProgress - index * 0.25) / 0.34);
          const translate = reduced ? 0 : mix(-3.8, 3.8, life);
          const scale = reduced ? 1.045 : mix(1.075, 1.035, life);
          image.style.transform = `translate3d(0, ${translate.toFixed(2)}%, 0) scale(${scale.toFixed(4)})`;
        }
      });

      const stageIndex = proofProgress < 0.245 ? 0 : proofProgress < 0.495 ? 1 : proofProgress < 0.745 ? 2 : 3;
      if (stageIndex !== activeStageRef.current) {
        activeStageRef.current = stageIndex;
        setActiveStage(stageIndex);
      }
      processCopyRefs.current.forEach((copy, index) => {
        if (!copy) return;
        const isActive = index === stageIndex;
        copy.style.opacity = isActive ? '1' : '0';
        copy.style.transform = `translate3d(0, ${isActive ? 0 : index < stageIndex ? -22 : 22}px, 0)`;
        copy.style.visibility = isActive ? 'visible' : 'hidden';
      });

      rootRef.current?.style.setProperty('--scroll-progress', String(progress));
      rootRef.current?.style.setProperty('--process-progress', String(processProgress));
    };

    const readProgress = () => {
      const rect = stage.getBoundingClientRect();
      const scrollable = Math.max(stage.offsetHeight - window.innerHeight, 1);
      return clamp(-rect.top / scrollable);
    };

    if (isAudit) {
      renderScroll(auditProgress);
      return;
    }

    const smoothToTarget = () => {
      const distance = targetProgress - renderedProgress;
      renderedProgress += distance * (reduced ? 1 : 0.115);
      if (Math.abs(distance) < 0.00012) renderedProgress = targetProgress;
      renderScroll(renderedProgress);
      if (renderedProgress !== targetProgress) {
        scrollFrame = requestAnimationFrame(smoothToTarget);
      } else {
        smoothing = false;
      }
    };

    const queueUpdate = () => {
      targetProgress = readProgress();
      if (smoothing) return;
      smoothing = true;
      scrollFrame = requestAnimationFrame(smoothToTarget);
    };

    targetProgress = readProgress();
    renderedProgress = targetProgress;
    renderScroll(renderedProgress);
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate, { passive: true });
    return () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
    };
  }, [forceReduced, params]);

  useEffect(() => {
    const resolved = portfolioStageRef.current;
    const practice = practiceChapterRef.current;
    const footer = footerRef.current;
    if (!resolved || !practice || !footer) return;

    const reduced = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = Math.max(window.innerHeight, 1);
      const resolvedRect = resolved.getBoundingClientRect();
      const practiceRect = practice.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const scrollable = Math.max(resolved.offsetHeight - viewport, 1);
      const resolvedProgress = reduced ? 1 : clamp(-resolvedRect.top / scrollable);
      const practiceProgress = reduced ? 1 : clamp((viewport - practiceRect.top) / (viewport + practiceRect.height));
      rootRef.current?.style.setProperty('--resolved-progress', String(resolvedProgress));
      rootRef.current?.style.setProperty('--practice-progress', String(practiceProgress));
      const footerProgress = reduced ? 1 : clamp((viewport - footerRect.top) / (viewport * .72));
      rootRef.current?.style.setProperty('--footer-progress', String(footerProgress));
      const workProgress = clamp((resolvedProgress - .18) / .82);
      const nextWork = Math.min(WORK_STUDIES.length - 1, Math.floor(workProgress * WORK_STUDIES.length));
      setActiveWork((current) => current === nextWork ? current : nextWork);
    };

    const queue = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, [forceReduced]);

  return (
    <main className={`site ${forceReduced ? 'is-reduced-motion' : ''}`} id="top" ref={rootRef}>
      <section className="story-stage" ref={storyStageRef} aria-label="TTA Designs introduction and process">
        <div className="experience">
          <div className="hero-scene" ref={heroSceneRef}>
            <div className="room-camera room-camera--background" ref={backgroundCameraRef} aria-hidden="true">
              <video ref={heroVideoRef} src="/assets/tta-living-cinematic-camera-v1.mp4" poster="/assets/tta-living-cinematic-master-v1.png" autoPlay muted loop playsInline preload="auto" disablePictureInPicture />
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
            <canvas className="material-canvas" ref={materialCanvasRef} aria-hidden="true" />
            <div className="material-fallback" aria-hidden="true" />
            <div className="process-atmosphere" aria-hidden="true" />

            <div className="process-interlude" ref={interludeRef}>
              <p>Before the finish</p>
              <h2 aria-label={INTERLUDE_TEXT}>
                {INTERLUDE_TEXT.split(' ').map((word, wordIndex, words) => {
                  const priorCharacters = words.slice(0, wordIndex).reduce((total, item) => total + item.length, 0);
                  return (
                    <span className="interlude-word" aria-hidden="true" key={`${word}-${wordIndex}`}>
                      {Array.from(word).map((character, characterIndex) => {
                        const letterIndex = priorCharacters + characterIndex;
                        const sequence = letterIndex / Math.max(INTERLUDE_TEXT.replaceAll(' ', '').length - 1, 1);
                        return (
                          <span
                            className="interlude-letter"
                            style={{ '--letter-delay': 0.035 + sequence * 0.105 } as CSSProperties}
                            key={`${character}-${characterIndex}`}
                          >
                            {character}
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </h2>
              <span>Structure · Movement · Light · Use</span>
            </div>

            <div className="proof-scene" ref={proofSceneRef}>
              <header className="process-header">
                <img src="/assets/tta-wordmark-white.png" alt="TTA Designs" />
                <p id="process-title">From the first decision</p>
                <span>Project Akoka · Process study</span>
              </header>

              <div className="decision-stage" aria-live="polite">
                {PROCESS_STAGES.map((stage, index) => (
                  <div className="decision-media" key={stage.number} ref={(element) => { processMediaRefs.current[index] = element; }} aria-hidden={activeStage !== index}>
                    <img src={stage.image} alt={stage.alt} ref={(element) => { processImageRefs.current[index] = element; }} />
                    <span className="decision-grade" aria-hidden="true" />
                  </div>
                ))}
              </div>

              <div className="decision-copy-stack">
                {PROCESS_STAGES.map((stage, index) => (
                  <div className={`decision-copy ${index === 0 ? 'is-active' : ''}`} key={stage.number} ref={(element) => { processCopyRefs.current[index] = element; }}>
                    <p>{stage.phase}</p>
                    <h2>{stage.title}</h2>
                    <span>{stage.description}</span>
                  </div>
                ))}
              </div>

            </div>
          </section>
        </div>
      </section>

      <section className="portfolio-stage" id="work" ref={portfolioStageRef} aria-labelledby="portfolio-title">
        <div className="portfolio-experience">
          <div className="portfolio-bridge">
            <p>From decision to atmosphere</p>
            <h2 id="portfolio-title" className="cinematic-heading">
              <span><i>What was decided</i></span>
              <span><i>becomes what is felt.</i></span>
            </h2>
            <small>Selected residential work</small>
          </div>

          <div className="work-procession" aria-live="polite">
            <div className="work-copy">
              <p>Selected atmosphere</p>
              <h3>{WORK_STUDIES[activeWork].title}</h3>
              <span>{WORK_STUDIES[activeWork].note}</span>
            </div>
            <div className="work-frames">
              {WORK_STUDIES.map((work, index) => (
                <figure className={`work-frame ${index === activeWork ? 'is-active' : ''} ${index < activeWork ? 'is-before' : ''}`} key={work.image}>
                  <img src={work.image} alt={work.alt} loading={index < 2 ? 'eager' : 'lazy'} />
                </figure>
              ))}
            </div>
            <div className="work-progress" aria-hidden="true"><i style={{ transform: `scaleX(${(activeWork + 1) / WORK_STUDIES.length})` }} /></div>
          </div>
        </div>
      </section>

      <section className="practice-chapter" id="practice" ref={practiceChapterRef} aria-labelledby="practice-title">
        <div className="practice-copy">
          <p>The practice</p>
          <h2 id="practice-title" className="cinematic-heading"><span><i>The eye stays</i></span><span><i>close to the work.</i></span></h2>
          <span>From early site decisions to the final placement of light, furniture and art, the atmosphere is resolved through attention at every scale.</span>
          <div className="practice-values"><span>Function</span><span>Flow</span><span>Feeling</span></div>
        </div>
        <div className="practice-films">
          <figure className="practice-film practice-film--site">
            <video ref={(element) => { practiceVideoRefs.current[0] = element; }} src="/assets/project-akoka-process-portrait.mp4" poster="/assets/akoka-site-conversation.jpg" muted loop playsInline preload="metadata" />
            <figcaption>On site</figcaption>
          </figure>
          <figure className="practice-film practice-film--room">
            <video ref={(element) => { practiceVideoRefs.current[1] = element; }} src="/assets/residential-lagos-portrait.mp4" poster="/assets/residential-living-arrival.jpg" muted loop playsInline preload="metadata" />
            <figcaption>In the room</figcaption>
          </figure>
        </div>
      </section>

      <div className="closing-stage">
        <canvas className="inquiry-material" ref={inquiryCanvasRef} aria-hidden="true" />
        <section className="inquiry-chapter" id="inquiry" aria-labelledby="inquiry-title">
          <div className="inquiry-copy">
            <p>For a considered residence</p>
            <h2 id="inquiry-title" className="cinematic-heading"><span><i>Let’s begin with the way</i></span><span><i>you want to live.</i></span></h2>
            <a className="inquiry-link" href="#inquiry-note">
              <span className="moving-label"><i>Begin a conversation</i><i aria-hidden="true">Begin a conversation</i></span>
              <b aria-hidden="true">↗</b>
            </a>
            <small id="inquiry-note">A calm, direct project inquiry will live here in the commissioned experience.</small>
          </div>
        </section>

        <footer className="site-footer" ref={footerRef}>
          <div className="footer-topline">
            <div><p>TTA Designs</p><span>Residential and commercial interiors<br />Lagos, Nigeria</span></div>
            <nav aria-label="Footer"><a href="#work">Work</a><a href="#practice">Practice</a><a href="#inquiry">Inquiry</a></nav>
            <a className="footer-social" href="https://www.instagram.com/ttadesigns/" target="_blank" rel="noreferrer">Instagram ↗</a>
          </div>
          <a className="footer-wordmark" href="#top" aria-label="TTA Designs — back to top"><img src="/assets/tta-wordmark-white.png" alt="TTA Designs" /></a>
          <div className="footer-meta"><span>Private cinematic concept</span><span>Spaces shaped around the way life is lived.</span><a href="#top">Back to top ↑</a></div>
        </footer>
      </div>

      {debug && (
        <aside className="debug-hud">
          <span>AXIS OF DECISIONS</span>
          <output>{time.toFixed(2)} / {TOTAL.toFixed(2)}</output>
          <button onClick={() => window.location.reload()}>Replay</button>
          <span>R replay · Space pause</span>
        </aside>
      )}
    </main>
  );
}
