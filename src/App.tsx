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

interface ProcessStage {
  number: string;
  phase: string;
  stageCode: string;
  title: string;
  desc: string;
  image: string;
  alt: string;
}

const PROCESS_STAGES: ProcessStage[] = [
  {
    number: '01',
    phase: 'Structure',
    stageCode: '01 / Structure · Read the room',
    title: 'Read the room',
    desc: 'See what the space needs before the ceiling closes.',
    image: '/assets/akoka-site-ceiling-open-wide-clean-v1.png',
    alt: 'TTA Designs supervising the exposed ceiling structure and mechanical routing during work in progress at Project Akoka'
  },
  {
    number: '02',
    phase: 'Alignment',
    stageCode: '02 / Alignment · Align the work',
    title: 'Align the work',
    desc: 'Resolve decisions with the people building them.',
    image: '/assets/akoka-site-conversation-wide-clean-v1.png',
    alt: 'TTA Designs reviewing spatial alignment and construction detailing with the site team at Project Akoka'
  },
  {
    number: '03',
    phase: 'Refinement',
    stageCode: '03 / Refinement · Refine the surface',
    title: 'Refine the surface',
    desc: 'Test light and texture in the room itself.',
    image: '/assets/akoka-site-painting-wide-clean-v1.png',
    alt: 'Surface finish, wall plaster, and natural light calibration on site under TTA Designs supervision'
  },
  {
    number: '04',
    phase: 'Resolution',
    stageCode: '04 / Resolution · Carry it through',
    title: 'Carry it through',
    desc: 'Let every early decision support the final atmosphere.',
    image: '/assets/akoka-site-installation-wide-clean-v1.png',
    alt: 'The resolved Akoka living space with finished ceiling architecture, integrated lighting, and warm material palette'
  }
];

export function App() {
  const rootRef = useRef<HTMLElement>(null);
  const macroRef = useRef<HTMLDivElement>(null);
  const materialLightRef = useRef<HTMLDivElement>(null);
  const backgroundCameraRef = useRef<HTMLDivElement>(null);
  const foregroundCameraRef = useRef<HTMLDivElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
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
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const frameRef = useRef(0);
  const elapsedRef = useRef(0);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const debug = params.get('debug') === '1';
  const forceReduced = params.get('reduced') === '1';

  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeStage, setActiveStage] = useState(() => {
    const p = Number(params.get('scrollProgress'));
    if (Number.isFinite(p) && params.has('scrollProgress')) {
      const pp = clamp((p - 0.20) / 0.80);
      if (pp < 0.28) return 0;
      if (pp < 0.54) return 1;
      if (pp < 0.80) return 2;
      return 3;
    }
    return 0;
  });
  const [scrollPct, setScrollPct] = useState(() => {
    const p = Number(params.get('scrollProgress'));
    if (Number.isFinite(p) && params.has('scrollProgress')) {
      const pp = clamp((p - 0.20) / 0.80);
      return Math.round(pp * 100);
    }
    return 0;
  });

  // Preload all 4 clean 16:9 images for zero flicker
  useEffect(() => {
    PROCESS_STAGES.forEach((stage) => {
      const img = new Image();
      img.src = stage.image;
    });
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

  // Hero arrival & logo timeline (0.00s - 7.15s)
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

  // Dimensional Parallax Underpass & Pinned Process Window Scroll Choreography
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
      // Underpass handoff spans progress [0.00, 0.20]
      const handoff = smooth(clamp(progress / 0.20));
      // Process section progression spans progress [0.20, 1.00]
      const processProgress = clamp((progress - 0.20) / 0.80);

      // 1. Hero-to-Process Dimensional Parallax Underpass
      if (heroSceneRef.current) {
        if (reduced) {
          heroSceneRef.current.style.visibility = progress < 0.20 ? 'visible' : 'hidden';
          heroSceneRef.current.style.transform = 'none';
        } else {
          heroSceneRef.current.style.visibility = progress >= 0.24 ? 'hidden' : 'visible';
          heroSceneRef.current.style.transform = `translate3d(0, ${(-handoff * 100).toFixed(2)}svh, 0)`;
        }
      }

      if (heroCopyRef.current) {
        if (reduced) {
          heroCopyRef.current.style.removeProperty('--hero-copy-scroll-y');
        } else {
          // Foreground hero copy lifts slightly faster (1.12x)
          heroCopyRef.current.style.setProperty('--hero-copy-scroll-y', `${(-handoff * 112).toFixed(2)}svh`);
        }
      }

      if (navRef.current && !reduced) {
        navRef.current.style.transform = `translateY(${(-handoff * 80).toFixed(2)}px)`;
      }

      // Process scene emerges from underneath with subtle slower depth rate and gentle perspective scale
      if (processSceneRef.current) {
        if (reduced) {
          processSceneRef.current.style.visibility = progress >= 0.20 ? 'visible' : 'hidden';
          processSceneRef.current.style.transform = 'none';
        } else {
          processSceneRef.current.style.visibility = 'visible';
          const underpassY = (1 - handoff) * 36;
          const underpassScale = 0.96 + handoff * 0.04;
          processSceneRef.current.style.transform = `translate3d(0, ${underpassY.toFixed(2)}svh, 0) scale(${underpassScale.toFixed(4)})`;
        }
      }

      // Headline baseline line reveal as process scene registers
      if (!reduced) {
        const l1 = smooth(clamp((handoff - 0.25) / 0.65));
        const l2 = smooth(clamp((handoff - 0.38) / 0.62));
        if (headlineLine1Ref.current) {
          headlineLine1Ref.current.style.transform = `translate3d(0, ${((1 - l1) * 105).toFixed(2)}%, 0)`;
        }
        if (headlineLine2Ref.current) {
          headlineLine2Ref.current.style.transform = `translate3d(0, ${((1 - l2) * 105).toFixed(2)}%, 0)`;
        }
      } else {
        if (headlineLine1Ref.current) headlineLine1Ref.current.style.transform = 'none';
        if (headlineLine2Ref.current) headlineLine2Ref.current.style.transform = 'none';
      }

      // 2. Single-Window Process Image Progression with Counter-Parallax
      let activeIndex = 0;
      if (processProgress < 0.28) {
        activeIndex = 0;
      } else if (processProgress < 0.54) {
        activeIndex = 1;
      } else if (processProgress < 0.80) {
        activeIndex = 2;
      } else {
        activeIndex = 3;
      }

      setActiveStage(activeIndex);
      setScrollPct(Math.round(processProgress * 100));

      const s0 = slideRefs.current[0];
      const s1 = slideRefs.current[1];
      const s2 = slideRefs.current[2];
      const s3 = slideRefs.current[3];

      const img0 = imageRefs.current[0];
      const img1 = imageRefs.current[1];
      const img2 = imageRefs.current[2];
      const img3 = imageRefs.current[3];

      if (reduced) {
        // Clean discrete fallback for prefers-reduced-motion
        const discreteStep = Math.min(3, Math.floor(processProgress * 4));
        [s0, s1, s2, s3].forEach((slide, idx) => {
          if (!slide) return;
          slide.style.transform = 'none';
          slide.style.opacity = idx === discreteStep ? '1' : '0';
          slide.style.visibility = idx === discreteStep ? 'visible' : 'hidden';
        });
        [img0, img1, img2, img3].forEach((img) => {
          if (!img) return;
          img.style.transform = 'none';
        });
      } else {
        // Continuous transitions between the 4 stages
        const t1 = smooth(clamp((processProgress - 0.18) / 0.16));
        const t2 = smooth(clamp((processProgress - 0.44) / 0.16));
        const t3 = smooth(clamp((processProgress - 0.70) / 0.16));

        // Slide 0 (Base Layer)
        if (s0) {
          s0.style.transform = 'translate3d(0, 0, 0)';
          s0.style.opacity = '1';
          s0.style.visibility = 'visible';
        }
        if (img0) {
          const img0Offset = t1 > 0 ? mix(2.5, 10, t1) : mix(0, 2.5, clamp(processProgress / 0.18));
          img0.style.transform = `translate3d(0, ${img0Offset.toFixed(2)}%, 0) scale(1.12)`;
        }

        // Slide 1 (Transition 0 -> 1)
        if (s1) {
          s1.style.transform = `translate3d(0, ${((1 - t1) * 100).toFixed(2)}%, 0)`;
          s1.style.opacity = t1 > 0 ? '1' : '0';
          s1.style.visibility = t1 > 0 ? 'visible' : 'hidden';
        }
        if (img1) {
          let img1Offset = 0;
          if (t1 < 1) {
            img1Offset = mix(-18, 0, t1); // Counter-parallax on enter
          } else if (t2 > 0) {
            img1Offset = mix(2.5, 10, t2); // Outgoing parallax
          } else {
            const holdP = clamp((processProgress - 0.34) / 0.10);
            img1Offset = mix(0, 2.5, holdP); // Continuous living rest glide (0% -> 2.5%)
          }
          img1.style.transform = `translate3d(0, ${img1Offset.toFixed(2)}%, 0) scale(1.12)`;
        }

        // Slide 2 (Transition 1 -> 2)
        if (s2) {
          s2.style.transform = `translate3d(0, ${((1 - t2) * 100).toFixed(2)}%, 0)`;
          s2.style.opacity = t2 > 0 ? '1' : '0';
          s2.style.visibility = t2 > 0 ? 'visible' : 'hidden';
        }
        if (img2) {
          let img2Offset = 0;
          if (t2 < 1) {
            img2Offset = mix(-18, 0, t2); // Counter-parallax on enter
          } else if (t3 > 0) {
            img2Offset = mix(2.5, 10, t3); // Outgoing parallax
          } else {
            const holdP = clamp((processProgress - 0.60) / 0.10);
            img2Offset = mix(0, 2.5, holdP); // Continuous living rest glide (0% -> 2.5%)
          }
          img2.style.transform = `translate3d(0, ${img2Offset.toFixed(2)}%, 0) scale(1.12)`;
        }

        // Slide 3 (Transition 2 -> 3)
        if (s3) {
          s3.style.transform = `translate3d(0, ${((1 - t3) * 100).toFixed(2)}%, 0)`;
          s3.style.opacity = t3 > 0 ? '1' : '0';
          s3.style.visibility = t3 > 0 ? 'visible' : 'hidden';
        }
        if (img3) {
          let img3Offset = 0;
          if (t3 < 1) {
            img3Offset = mix(-18, 0, t3); // Counter-parallax on enter
          } else {
            const holdP = clamp((processProgress - 0.86) / 0.14);
            img3Offset = mix(0, 3.5, holdP); // Continuous living rest glide (0% -> 3.5%)
          }
          img3.style.transform = `translate3d(0, ${img3Offset.toFixed(2)}%, 0) scale(1.12)`;
        }
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
    <main className="site" ref={rootRef} data-reduced-motion={forceReduced ? 'true' : undefined}>
      <section className="story-stage" ref={storyStageRef} aria-label="TTA Designs introduction and process">
        <div className="experience">
          {/* Hero Scene (Near plane during underpass handoff) */}
          <div className="hero-scene" ref={heroSceneRef}>
            <div className="room-camera room-camera--background" ref={backgroundCameraRef} aria-hidden="true">
              <video
                ref={backgroundVideoRef}
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

          {/* Process Chapter (Underneath plane discovered through dimensional underpass) */}
          <section className="process-scene" ref={processSceneRef} aria-labelledby="process-title">
            <div className="process-texture" aria-hidden="true" />

            <div className="process-container">
              {/* Left Column: Narrative Bridge & Stage Typographic Choreography */}
              <div className="process-narrative">
                <div className="process-bridge">
                  <p className="process-kicker">02 / From the first site decision</p>
                  <h2 id="process-title" className="process-heading">
                    <span className="line-wrap">
                      <span className="line" ref={headlineLine1Ref}>Before it looks complete,</span>
                    </span>
                    <span className="line-wrap">
                      <span className="line" ref={headlineLine2Ref}>it has to work beautifully.</span>
                    </span>
                  </h2>
                  <p className="process-support">
                    On site, TTA shapes how light lands, how people move, and how every finish meets—so the final room feels effortless.
                  </p>
                </div>

                {/* Stage Progression Track & Indicators */}
                <div className="process-stage-meta">
                  <div className="process-stage-progress" aria-hidden="true">
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${scrollPct}%` }} />
                    </div>
                    <div className="stage-pills">
                      {PROCESS_STAGES.map((s, idx) => (
                        <span
                          key={s.number}
                          className={`stage-pill ${activeStage === idx ? 'active' : ''} ${activeStage > idx ? 'passed' : ''}`}
                        >
                          {s.number}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Active Stage Captions */}
                  <div className="process-stage-captions" aria-live="polite">
                    {PROCESS_STAGES.map((stage, idx) => {
                      let statusClass = 'is-upcoming';
                      if (activeStage === idx) statusClass = 'is-active';
                      else if (activeStage > idx) statusClass = 'is-passed';

                      return (
                        <div key={stage.number} className={`stage-caption-card ${statusClass}`}>
                          <div className="stage-number-title">
                            <span className="stage-num">{stage.number}</span>
                            <span className="stage-divider">/</span>
                            <span className="stage-phase">{stage.phase}</span>
                            <span className="stage-divider">·</span>
                            <span className="stage-title">{stage.title}</span>
                          </div>
                          <p className="stage-desc">{stage.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="process-project">Project Akoka · Process study</p>
              </div>

              {/* Right Column: Pinned Single Architectural 16:9 Window */}
              <div className="process-window-container">
                <div className="process-window-frame">
                  <div className="process-window-aspect">
                    {PROCESS_STAGES.map((stage, idx) => (
                      <div
                        key={stage.number}
                        className={`process-window-slide slide-${idx}`}
                        ref={(el) => { slideRefs.current[idx] = el; }}
                      >
                        <div className="slide-media-wrap">
                          <img
                            src={stage.image}
                            alt={stage.alt}
                            ref={(el) => { imageRefs.current[idx] = el; }}
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="process-window-lens" aria-hidden="true" />
                  </div>
                  <div className="process-window-footer">
                    <span className="window-coord">16:9 ARCHITECTURAL PROJECTION · AKOKA ARCHIVE</span>
                    <span className="window-index">{`0${activeStage + 1} // 04`}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {debug && (
        <aside className="debug-hud">
          <span>PROCESS PARALLAX</span>
          <output>{time.toFixed(2)} / {TOTAL.toFixed(2)}</output>
          <button onClick={() => window.location.reload()}>Replay</button>
          <span>R replay · Space pause</span>
        </aside>
      )}
    </main>
  );
}
