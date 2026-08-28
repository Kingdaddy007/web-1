import { useEffect, useMemo, useRef, useState } from 'react';
import { getHeroVerticalFocus } from './framing';
import { LivingMaterialCanvas } from './LivingMaterialCanvas';
import { InquiryMaterialCanvas } from './InquiryMaterialCanvas';
import { RhythmMaterialCanvas } from './RhythmMaterialCanvas';
import { renderApprovedLogoFrame, type LogoLayers } from './logoTimeline';

const TOTAL = 7.15;
const LOGO_AXIS = 855 / 2172;

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
  {
    kicker: 'Living / Akoka',
    title: 'One room, held together.',
    titleLines: ['One room,', 'held together.'],
    note: 'Light · Proportion · Use',
    description: 'The ceiling, lacquer, movement path and furniture read as one quiet composition.',
    image: '/assets/tta-living-cinematic-master-v1.png',
    detail: '/assets/tta-wall-macro-v1.jpeg',
    alt: 'Completed warm lacquer living room by TTA Designs',
  },
  {
    kicker: 'Material / Living',
    title: 'Warmth without excess.',
    titleLines: ['Warmth', 'without excess.'],
    note: 'Lacquer · Reflection · Detail',
    description: 'Gloss is used as reflected light rather than decoration, giving the room depth without noise.',
    image: '/assets/residential-living-arrival.jpg',
    detail: '/assets/residential-sofa-detail.jpg',
    alt: 'Warm contemporary living room and material details by TTA Designs',
  },
  {
    kicker: 'Private / Rest',
    title: 'A softer enclosure.',
    titleLines: ['A softer', 'enclosure.'],
    note: 'Light · Rest · Bedroom',
    description: 'A restrained palette lets comfort, scale and morning light carry the atmosphere.',
    image: '/assets/residential-bedroom-arrival.jpg',
    detail: '/assets/residential-table-detail.jpg',
    alt: 'Bright layered bedroom interior by TTA Designs',
  },
] as const;

export function App() {
  const rootRef = useRef<HTMLElement>(null);
  const storyStageRef = useRef<HTMLElement>(null);
  const livedUseChapterRef = useRef<HTMLElement>(null);
  const practiceChapterRef = useRef<HTMLElement>(null);
  const inquiryChapterRef = useRef<HTMLElement>(null);
  const rhythmBridgeRef = useRef<HTMLElement>(null);
  const rhythmCanvasRef = useRef<HTMLCanvasElement>(null);
  const rhythmCanvasControllerRef = useRef<RhythmMaterialCanvas | null>(null);
  const inquiryCanvasRef = useRef<HTMLCanvasElement>(null);
  const inquiryCanvasControllerRef = useRef<InquiryMaterialCanvas | null>(null);
  const footerRef = useRef<HTMLElement>(null);
  const livedUseVideoRef = useRef<HTMLVideoElement>(null);
  const practiceVideoRef = useRef<HTMLVideoElement>(null);
  const heroSceneRef = useRef<HTMLDivElement>(null);
  const processSceneRef = useRef<HTMLElement>(null);
  const proofSceneRef = useRef<HTMLDivElement>(null);
  const decisionStageRef = useRef<HTMLDivElement>(null);
  const materialCanvasRef = useRef<HTMLCanvasElement>(null);
  const materialCanvasControllerRef = useRef<LivingMaterialCanvas | null>(null);
  const processMediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const processImageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const processCopyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectRefs = useRef<(HTMLElement | null)[]>([]);

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
    try {
      const controller = new LivingMaterialCanvas(canvas, { reducedMotion });
      materialCanvasControllerRef.current = controller;
      return () => {
        controller.destroy();
        materialCanvasControllerRef.current = null;
      };
    } catch {
      canvas.hidden = true;
      materialCanvasControllerRef.current = null;
    }
  }, [forceReduced]);

  useEffect(() => {
    const canvas = inquiryCanvasRef.current;
    if (!canvas) return;
    const reducedMotion = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const controller = new InquiryMaterialCanvas(canvas, reducedMotion);
      inquiryCanvasControllerRef.current = controller;
      return () => {
        controller.destroy();
        inquiryCanvasControllerRef.current = null;
      };
    } catch {
      canvas.hidden = true;
      inquiryCanvasControllerRef.current = null;
    }
  }, [forceReduced]);

  useEffect(() => {
    const canvas = rhythmCanvasRef.current;
    if (!canvas) return;
    const reducedMotion = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const controller = new RhythmMaterialCanvas(canvas, { reducedMotion });
      rhythmCanvasControllerRef.current = controller;
      return () => {
        controller.destroy();
        rhythmCanvasControllerRef.current = null;
      };
    } catch {
      canvas.hidden = true;
      rhythmCanvasControllerRef.current = null;
    }
  }, [forceReduced]);

  useEffect(() => {
    const entries = [
      { section: livedUseChapterRef.current, video: livedUseVideoRef.current },
      { section: practiceChapterRef.current, video: practiceVideoRef.current },
    ].filter((entry): entry is { section: HTMLElement; video: HTMLVideoElement } => Boolean(entry.section && entry.video));
    if (entries.length === 0) return;
    const observers = entries.map(({ section, video }) => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      }, { threshold: 0.12 });
      observer.observe(section);
      return observer;
    });
    return () => observers.forEach((observer) => observer.disconnect());
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
      const handoff = reduced ? (progress >= 0.13 ? 1 : 0) : smooth(progress / 0.16);
      const processProgress = clamp((progress - 0.12) / 0.88);
      const processY = reduced ? (handoff ? 0 : 100) : mix(100, 0, handoff);
      const introOut = reduced ? Number(processProgress > 0.18) : smooth((processProgress - 0.12) / 0.1);
      const stageCopyIn = reduced ? 1 : smooth((processProgress - 0.14) / 0.1);
      const proofProgress = clamp((processProgress - 0.14) / 0.86);
      const evidenceArrival = reduced ? 1 : smooth((processProgress - 0.015) / 0.16);
      materialCanvasControllerRef.current?.setProgress(processProgress);
      rootRef.current?.style.setProperty('--process-interface-opacity', '1');
      rootRef.current?.style.setProperty('--process-intro-presence', String(1 - introOut));
      rootRef.current?.style.setProperty('--process-stage-copy-in', String(stageCopyIn));
      if (proofSceneRef.current) {
        proofSceneRef.current.style.opacity = '1';
        proofSceneRef.current.style.transform = 'none';
        proofSceneRef.current.style.visibility = 'visible';
      }

      if (processSceneRef.current) {
        processSceneRef.current.style.transform = `translate3d(0, ${processY.toFixed(3)}%, 0)`;
      }
      if (decisionStageRef.current) {
        const evidenceY = mix(26, 0, evidenceArrival);
        const evidenceScale = mix(.955, 1, evidenceArrival);
        decisionStageRef.current.style.transform = `translate3d(0, ${evidenceY.toFixed(3)}vh, 0) scale(${evidenceScale.toFixed(4)})`;
      }
      if (heroSceneRef.current) {
        const heroY = reduced ? (handoff ? -100 : 0) : mix(0, -100, handoff);
        heroSceneRef.current.style.transform = `translate3d(0, ${heroY.toFixed(3)}vh, 0)`;
        heroSceneRef.current.style.visibility = handoff > 0.998 ? 'hidden' : 'visible';
      }
      if (heroCopyRef.current) {
        const copyLeave = reduced ? handoff : smooth(progress / 0.07);
        heroCopyRef.current.style.setProperty('--hero-copy-scroll-y', `${(-copyLeave * 6).toFixed(2)}vh`);
        heroCopyRef.current.style.setProperty('--hero-copy-scroll-opacity', String(1 - copyLeave));
      }

      const scaled = proofProgress * PROCESS_STAGES.length;
      const currentIndex = Math.min(PROCESS_STAGES.length - 1, Math.floor(scaled));
      processMediaRefs.current.forEach((media, index) => {
        if (!media) return;
        const start = index === 0 ? 0 : index / PROCESS_STAGES.length - 0.035;
        const reveal = index === 0 ? 1 : (reduced ? Number(proofProgress >= start) : smooth((proofProgress - start) / 0.095));
        media.style.clipPath = index === 0 ? 'inset(0 0 0 0)' : `inset(0 ${(100 - reveal * 100).toFixed(3)}% 0 0)`;
        media.style.setProperty('--register-progress', String(reveal));
        media.style.transform = 'none';
        media.style.opacity = String(index === 0 || reveal > 0.001 ? 1 : 0);
        media.style.zIndex = String(10 + index);

        const image = processImageRefs.current[index];
        if (image) {
          const life = clamp((proofProgress - index * 0.25) / 0.34);
          const translate = reduced ? 0 : mix(-2.8, 1.2, life);
          const registrationOffset = index === 0 ? 0 : mix(-3.2, 0, reveal);
          const scale = reduced ? 1.035 : mix(1.055, 1.025, life);
          image.style.transform = `translate3d(${registrationOffset.toFixed(2)}%, ${translate.toFixed(2)}%, 0) scale(${scale.toFixed(4)})`;
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
        const visibleOpacity = isActive ? (index === 0 ? stageCopyIn : 1) : 0;
        copy.style.opacity = String(visibleOpacity);
        copy.style.transform = `translate3d(${isActive ? 0 : index < stageIndex ? -18 : 18}px, 0, 0)`;
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
    const livedUse = livedUseChapterRef.current;
    const rhythmBridge = rhythmBridgeRef.current;
    const practice = practiceChapterRef.current;
    const inquiry = inquiryChapterRef.current;
    const footer = footerRef.current;
    if (!livedUse || !rhythmBridge || !practice || !inquiry || !footer) return;

    const reduced = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = Math.max(window.innerHeight, 1);
      const livedUseRect = livedUse.getBoundingClientRect();
      const rhythmBridgeRect = rhythmBridge.getBoundingClientRect();
      const practiceRect = practice.getBoundingClientRect();
      const inquiryRect = inquiry.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const livedUseProgress = reduced ? 1 : clamp((viewport - livedUseRect.top) / (viewport + livedUseRect.height));
      const rhythmBridgeProgress = reduced ? 1 : clamp((viewport - rhythmBridgeRect.top) / (viewport + rhythmBridgeRect.height));
      const practiceProgress = reduced ? 1 : clamp((viewport - practiceRect.top) / (viewport + practiceRect.height));
      const inquiryProgress = reduced ? 1 : clamp((viewport - inquiryRect.top) / (viewport + inquiryRect.height));
      rootRef.current?.style.setProperty('--lived-use-progress', String(livedUseProgress));
      const livedTitleProgress = reduced ? 1 : smooth((livedUseProgress - .04) / .3);
      const livedSupportProgress = reduced ? 1 : smooth((livedUseProgress - .18) / .28);
      rootRef.current?.style.setProperty('--lived-title-progress', String(livedTitleProgress));
      rootRef.current?.style.setProperty('--lived-support-progress', String(livedSupportProgress));
      const bridgeFocus = reduced ? 1 : smooth((rhythmBridgeProgress - .08) / .46);
      rootRef.current?.style.setProperty('--bridge-focus', String(bridgeFocus));
      rootRef.current?.style.setProperty('--bridge-blur', `${mix(6, 0, bridgeFocus).toFixed(2)}px`);
      rootRef.current?.style.setProperty('--bridge-tracking', `${mix(.035, 0, bridgeFocus).toFixed(4)}em`);
      rhythmCanvasControllerRef.current?.setProgress(rhythmBridgeProgress);
      rootRef.current?.style.setProperty('--practice-progress', String(practiceProgress));
      const practiceTitleProgress = reduced ? 1 : smooth((practiceProgress - .03) / .3);
      const practiceSecondLineProgress = reduced ? 1 : smooth((practiceProgress - .11) / .3);
      const practiceSupportProgress = reduced ? 1 : smooth((practiceProgress - .22) / .28);
      rootRef.current?.style.setProperty('--practice-title-progress', String(practiceTitleProgress));
      rootRef.current?.style.setProperty('--practice-title-second-progress', String(practiceSecondLineProgress));
      rootRef.current?.style.setProperty('--practice-support-progress', String(practiceSupportProgress));
      rootRef.current?.style.setProperty('--inquiry-progress', String(inquiryProgress));
      inquiryCanvasControllerRef.current?.setProgress(inquiryProgress);
      const footerProgress = reduced ? 1 : clamp((viewport - footerRect.top) / (viewport * .72));
      rootRef.current?.style.setProperty('--footer-progress', String(footerProgress));
      rootRef.current?.style.setProperty('--footer-reveal', `${((1 - footerProgress) * 100).toFixed(2)}%`);

      projectRefs.current.forEach((project, index) => {
        if (!project) return;
        const rect = project.getBoundingClientRect();
        const journey = clamp((viewport - rect.top) / (viewport + rect.height));
        const typeReveal = reduced ? 1 : smooth((journey - .015) / .22);
        const copyReveal = reduced ? 1 : smooth((journey - .025) / .24);
        const reveal = reduced ? 1 : smooth((journey - .1) / .36);
        const detailReveal = reduced ? 1 : smooth((journey - .26) / .24);
        const exit = reduced ? 0 : smooth((journey - .7) / .22);
        const direction = index % 2 === 0 ? 1 : -1;
        project.style.setProperty('--project-media-x', `${(direction * (mix(11, 0, reveal) - exit * 4)).toFixed(3)}vw`);
        project.style.setProperty('--project-media-y', `${(mix(7, 0, reveal) - exit * 5).toFixed(3)}vh`);
        project.style.setProperty('--project-clip-block', `${(mix(12, 0, reveal) + exit * 4).toFixed(3)}%`);
        project.style.setProperty('--project-clip-inline', `${(mix(22, 0, reveal) + exit * 3).toFixed(3)}%`);
        project.style.setProperty('--project-image-scale', String(mix(1.12, 1.015, reveal) + exit * .025));
        project.style.setProperty('--project-copy-y', `${(mix(32, 0, copyReveal) - exit * 16).toFixed(2)}px`);
        project.style.setProperty('--project-copy-opacity', String(copyReveal * (1 - exit * .34)));
        project.style.setProperty('--project-type-progress', String(typeReveal));
        project.style.setProperty('--project-support-progress', String(reduced ? 1 : smooth((journey - .13) / .24)));
        project.style.setProperty('--project-detail-y', `${mix(54, 0, detailReveal).toFixed(2)}px`);
        project.style.setProperty('--project-detail-rotation', `${(direction * mix(2.6, 0, detailReveal)).toFixed(3)}deg`);
      });
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

            <div className="proof-scene" ref={proofSceneRef}>
              <header className="process-header">
                <p id="process-title">From the first decision</p>
                <span>Project Akoka · Process study</span>
              </header>

              <div className="decision-stage" ref={decisionStageRef} aria-live="polite">
                {PROCESS_STAGES.map((stage, index) => (
                  <div className="decision-media" key={stage.number} ref={(element) => { processMediaRefs.current[index] = element; }} aria-hidden={activeStage !== index}>
                    <img src={stage.image} alt={stage.alt} ref={(element) => { processImageRefs.current[index] = element; }} />
                    <span className="decision-grade" aria-hidden="true" />
                  </div>
                ))}
              </div>

              <div className="process-proposition">
                <p>Before the finish</p>
                <h2>The room is decided while change is still possible.</h2>
                <span>Layout, light, movement and services are resolved before the finish conceals them.</span>
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

      <section className="portfolio-stage" id="work" aria-labelledby="portfolio-title">
        <div className="project-constellations">
          {WORK_STUDIES.map((work, index) => (
            <article className={`project-constellation project-constellation--${index + 1}`} key={work.image} ref={(element) => { projectRefs.current[index] = element; }}>
              <div className="project-copy">
                {index === 0 && (
                  <div className="portfolio-thesis">
                    <p>Selected residences</p>
                    <h2 id="portfolio-title" aria-label="What was decided becomes what is felt.">
                      <span className="type-line" aria-hidden="true"><i>What was decided</i></span>
                      <span className="type-line" aria-hidden="true"><i>becomes what is felt.</i></span>
                    </h2>
                  </div>
                )}
                <p>{work.kicker}</p>
                <h3 aria-label={work.title}>
                  {work.titleLines.map((line) => <span className="type-line" aria-hidden="true" key={line}><i>{line}</i></span>)}
                </h3>
                <small>{work.description}</small>
                <span>{work.note}</span>
              </div>
              <figure className="project-main">
                <img src={work.image} alt={work.alt} loading={index === 0 ? 'eager' : 'lazy'} />
                <figcaption>{String(index + 1).padStart(2, '0')} / {String(WORK_STUDIES.length).padStart(2, '0')}</figcaption>
              </figure>
              <figure className="project-detail" aria-hidden="true">
                <img src={work.detail} alt="" loading="lazy" />
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section className="lived-use-chapter" ref={livedUseChapterRef} aria-labelledby="lived-use-title">
        <figure className="lived-use-film">
          <video ref={livedUseVideoRef} src="/assets/residential-lagos-portrait.mp4" poster="/assets/residential-living-wide.jpg" muted loop playsInline preload="metadata" />
          <span aria-hidden="true" />
        </figure>
        <div className="lived-use-copy">
          <p>A room in use</p>
          <h2 id="lived-use-title" aria-label="The photograph is not the final test.">
            <span className="type-line" aria-hidden="true"><i>The photograph</i></span>
            <span className="type-line" aria-hidden="true"><i>is not the</i></span>
            <span className="type-line" aria-hidden="true"><i>final test.</i></span>
          </h2>
          <span>A room becomes complete in movement, conversation, rest and the ordinary life it was designed to hold.</span>
        </div>
      </section>

      <section className="rhythm-bridge" ref={rhythmBridgeRef} aria-labelledby="rhythm-bridge-title">
        <canvas className="rhythm-material-canvas" ref={rhythmCanvasRef} aria-hidden="true" />
        <span className="rhythm-material-fallback" aria-hidden="true" />
        <div className="rhythm-bridge-copy">
          <p>Behind the calm</p>
          <h2 id="rhythm-bridge-title" aria-label="What feels effortless is carried through every decision."><span aria-hidden="true">What feels effortless</span><span aria-hidden="true">is carried through every decision.</span></h2>
        </div>
      </section>

      <section className="practice-chapter" id="practice" ref={practiceChapterRef} aria-labelledby="practice-title">
        <figure className="practice-film practice-film--full">
          <video ref={practiceVideoRef} src="/assets/project-akoka-process-portrait.mp4" poster="/assets/akoka-site-conversation-wide-clean-v1.png" muted loop playsInline preload="metadata" />
          <span aria-hidden="true" />
        </figure>
        <div className="practice-copy">
          <p>Present through the process</p>
          <h2 id="practice-title" className="cinematic-heading practice-title" aria-label="The eye stays close to the work."><span aria-hidden="true"><i>The eye stays</i></span><span aria-hidden="true"><i>close to the work.</i></span></h2>
          <span>From early site decisions to the final placement of light, furniture and art, the atmosphere is resolved through attention at every scale.</span>
          <div className="practice-values"><span>Function</span><span>Flow</span><span>Feeling</span></div>
        </div>
      </section>

      <div className="closing-stage">
        <canvas className="inquiry-material" ref={inquiryCanvasRef} aria-hidden="true" />
        <section className="inquiry-chapter" id="inquiry" ref={inquiryChapterRef} aria-labelledby="inquiry-title">
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
            <div className="footer-column"><p>Studio</p><span>Residential and commercial interiors<br />Lagos, Nigeria</span></div>
            <div className="footer-column"><p>Connect</p><a href="https://www.instagram.com/ttadesigns/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="#inquiry">Project inquiry ↗</a></div>
            <div className="footer-column"><p>Utility</p><a href="#top">Back to top ↑</a><span>Private cinematic concept</span></div>
          </div>
          <a className="footer-wordmark" href="#top" aria-label="TTA Designs — back to top"><img src="/assets/tta-wordmark-white.png" alt="TTA Designs" /></a>
          <div className="footer-meta"><span>Spaces shaped around the way life is lived.</span><span>© TTA Designs</span></div>
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
