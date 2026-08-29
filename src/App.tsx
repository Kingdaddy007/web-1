import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { getHeroVerticalFocus } from './framing';
import { LivingMaterialCanvas } from './LivingMaterialCanvas';
import { InquiryMaterialCanvas } from './InquiryMaterialCanvas';
import { NarrativeMaterialCanvas } from './NarrativeMaterialCanvas';
import { renderApprovedLogoFrame, type LogoLayers } from './logoTimeline';

const TOTAL = 7.15;
const LOGO_AXIS = 855 / 2172;

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const PROCESS_STATEMENT_WORDS = ['A', 'room', 'feels', 'effortless', 'when', 'every', 'detail', 'has', 'been', 'considered.'] as const;

const PROCESS_STAGES = [
  {
    number: '01',
    phase: 'Begin with use',
    title: 'Begin with how you live',
    description: 'Movement, routines and the way people gather give the room its first direction.',
    image: '/assets/akoka-site-ceiling-open-wide-clean-v1.png',
    alt: 'TTA Designs supervising the exposed ceiling structure and services during work in progress at Project Akoka',
  },
  {
    number: '02',
    phase: 'Resolve the plan',
    title: 'Resolve the room together',
    description: 'Proportion, circulation and practical needs are settled while the space can still respond.',
    image: '/assets/akoka-site-conversation-wide-clean-v1.png',
    alt: 'TTA Designs reviewing spatial decisions with the site team at Project Akoka',
  },
  {
    number: '03',
    phase: 'Test the atmosphere',
    title: 'Let light test the finish',
    description: 'Colour, texture and finish are judged in the light they will actually live in.',
    image: '/assets/akoka-site-painting-wide-clean-v1.png',
    alt: 'Wall and surface finishes being refined under natural and architectural light at Project Akoka',
  },
  {
    number: '04',
    phase: 'Complete the intention',
    title: 'Carry the idea through',
    description: 'Furniture, lighting and art complete the same intention established from the start.',
    image: '/assets/akoka-site-installation-wide-clean-v1.png',
    alt: 'Resolved living room installation with integrated lighting and a deep green seating composition at Project Akoka',
  },
] as const;

const WORK_STUDIES = [
  {
    kicker: 'Ogba / Living & dining',
    title: 'One room, one rhythm.',
    titleLines: ['One room,', 'one rhythm.'],
    note: 'Continuity · Light · Flow',
    description: 'The living and dining areas read as one composition through mirrored depth, warm light and an uninterrupted path.',
    image: '/assets/ogba-living-overview-wide-v2.png',
    alt: 'Connected living and dining composition with a mirrored wall and warm layered lighting at the Ogba residence by TTA Designs',
  },
  {
    kicker: 'Ogba / Media wall',
    title: 'A quieter focal point.',
    titleLines: ['A quieter', 'focal point.'],
    note: 'Stone · Reflection · Restraint',
    description: 'Stone, reflection and a low dark console give the television wall presence without allowing it to dominate the room.',
    image: '/assets/ogba-living-wall-wide-v2.png',
    alt: 'Stone-clad television wall with a low dark console and reflected ceiling light at the Ogba residence by TTA Designs',
  },
  {
    kicker: 'Ogba / Dining detail',
    title: 'Light gathers here.',
    titleLines: ['Light gathers', 'here.'],
    note: 'Light · Reflection · Intimacy',
    description: 'A warm pool of light brings the table into focus while mirrored planes extend the intimacy of the setting.',
    image: '/assets/ogba-dining-detail-wide-v2.png',
    alt: 'Dining table set beneath a warm floor lamp with curtains and mirrored reflections at the Ogba residence by TTA Designs',
  },
] as const;

export function App() {
  const rootRef = useRef<HTMLElement>(null);
  const storyStageRef = useRef<HTMLElement>(null);
  const portfolioStageRef = useRef<HTMLElement>(null);
  const lifeStoryRef = useRef<HTMLElement>(null);
  const founderChapterRef = useRef<HTMLElement>(null);
  const practiceChapterRef = useRef<HTMLElement>(null);
  const inquiryChapterRef = useRef<HTMLElement>(null);
  const narrativeCanvasRef = useRef<HTMLCanvasElement>(null);
  const narrativeCanvasControllerRef = useRef<NarrativeMaterialCanvas | null>(null);
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
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState('');
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
    const canvas = narrativeCanvasRef.current;
    if (!canvas) return;
    const reducedMotion = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const controller = new NarrativeMaterialCanvas(canvas, { reducedMotion });
      narrativeCanvasControllerRef.current = controller;
      return () => {
        controller.destroy();
        narrativeCanvasControllerRef.current = null;
      };
    } catch {
      canvas.hidden = true;
      narrativeCanvasControllerRef.current = null;
    }
  }, [forceReduced]);

  useEffect(() => {
    const entries = [
      { section: lifeStoryRef.current, video: livedUseVideoRef.current },
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
    if (!inquiryOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setInquiryOpen(false);
    };
    document.body.classList.add('has-inquiry-open');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('has-inquiry-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [inquiryOpen]);

  const handleInquirySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const brief = [
      'TTA Designs project inquiry',
      '',
      `Name: ${String(data.get('name') ?? '')}`,
      `Email: ${String(data.get('email') ?? '')}`,
      `Phone: ${String(data.get('phone') ?? '') || 'Not provided'}`,
      `Project location: ${String(data.get('location') ?? '')}`,
      `Space: ${String(data.get('space') ?? '')}`,
      `Project stage: ${String(data.get('stage') ?? '')}`,
      `Desired start: ${String(data.get('start') ?? '') || 'Not specified'}`,
      `Budget range: ${String(data.get('budget') ?? '') || 'Not specified'}`,
      '',
      'What the room needs to support:',
      String(data.get('message') ?? ''),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(brief);
      setInquiryStatus('Your project brief is copied. Continue to Instagram and paste it into a message.');
    } catch {
      setInquiryStatus('Your brief is ready. Select the details and copy them before continuing to Instagram.');
    }
  };

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
        const rawAxisCorrection = logoRef.current.offsetWidth * (0.5 - LOGO_AXIS);
        const maxCorrection = Math.max(0, (window.innerWidth - logoRef.current.offsetWidth) * 0.44);
        const initialAxisCorrection = Math.min(rawAxisCorrection, maxCorrection);
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
      const statementReveal = reduced ? 1 : smooth(processProgress / 0.18);
      const statementShift = reduced ? 1 : smooth((processProgress - 0.2) / 0.16);
      const introOut = reduced ? Number(processProgress > 0.42) : smooth((processProgress - 0.34) / 0.08);
      const statementSupport = reduced ? 1 : smooth((processProgress - 0.12) / 0.08) * (1 - introOut);
      const stageCopyIn = reduced ? 1 : smooth((processProgress - 0.43) / 0.08);
      const proofProgress = clamp((processProgress - 0.44) / 0.56);
      const evidenceArrival = reduced ? 1 : smooth((processProgress - 0.24) / 0.16);
      materialCanvasControllerRef.current?.setProgress(processProgress);
      rootRef.current?.style.setProperty('--process-interface-opacity', '1');
      rootRef.current?.style.setProperty('--process-intro-presence', String(1 - introOut));
      rootRef.current?.style.setProperty('--process-statement-reveal', String(statementReveal));
      rootRef.current?.style.setProperty('--process-statement-shift', String(statementShift));
      rootRef.current?.style.setProperty('--process-statement-support', String(statementSupport));
      rootRef.current?.style.setProperty('--process-statement-left', `${mix(50, 5.5, statementShift).toFixed(3)}%`);
      rootRef.current?.style.setProperty('--process-statement-x', `${mix(-50, 0, statementShift).toFixed(3)}%`);
      rootRef.current?.style.setProperty('--process-statement-scale', String(mix(1, .62, statementShift)));
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
        const evidenceX = mix(18, 0, evidenceArrival);
        const evidenceScale = mix(.975, 1, evidenceArrival);
        decisionStageRef.current.style.opacity = String(evidenceArrival);
        decisionStageRef.current.style.clipPath = `inset(0 0 0 ${((1 - evidenceArrival) * 100).toFixed(3)}%)`;
        decisionStageRef.current.style.transform = `translate3d(${evidenceX.toFixed(3)}vw, 0, 0) scale(${evidenceScale.toFixed(4)})`;
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
    const portfolioStage = portfolioStageRef.current;
    const lifeStory = lifeStoryRef.current;
    const founder = founderChapterRef.current;
    const practice = practiceChapterRef.current;
    const inquiry = inquiryChapterRef.current;
    const footer = footerRef.current;
    if (!portfolioStage || !lifeStory || !founder || !practice || !inquiry || !footer) return;

    const reduced = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const founderCopy = founder.querySelector<HTMLElement>('.founder-copy') ?? founder;
    const practiceCopy = practice.querySelector<HTMLElement>('.practice-copy') ?? practice;
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = Math.max(window.innerHeight, 1);
      const visibleEntry = (element: HTMLElement, start = .92, end = .3) => {
        if (reduced) return 1;
        const top = element.getBoundingClientRect().top;
        return clamp((viewport * start - top) / Math.max(viewport * (start - end), 1));
      };
      const lifeStoryRect = lifeStory.getBoundingClientRect();
      const founderRect = founder.getBoundingClientRect();
      const practiceRect = practice.getBoundingClientRect();
      const inquiryRect = inquiry.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const portfolioRect = portfolioStage.getBoundingClientRect();
      const portfolioDistance = Math.max(portfolioStage.offsetHeight - viewport, 1);
      const portfolioProgress = clamp(-portfolioRect.top / portfolioDistance);
      const desktopProcession = !reduced && window.innerWidth > 960;
      const desktopLifeStory = !reduced && window.innerWidth > 960;
      const lifeStoryDistance = Math.max(lifeStory.offsetHeight - viewport, 1);
      const lifeStoryProgress = desktopLifeStory ? clamp(-lifeStoryRect.top / lifeStoryDistance) : 1;
      const practiceProgress = reduced ? 1 : clamp((viewport - practiceRect.top) / (viewport + practiceRect.height));
      const inquiryProgress = reduced ? 1 : clamp((viewport - inquiryRect.top) / (viewport + inquiryRect.height));
      const lifeIntroIn = desktopLifeStory ? smooth(clamp(lifeStoryProgress / 0.16)) : 1;
      const lifeIntroOut = desktopLifeStory ? smooth((lifeStoryProgress - 0.26) / 0.10) : 0;
      const lifeVideoIn = desktopLifeStory ? smooth((lifeStoryProgress - 0.22) / 0.14) : 1;
      const lifeProofIn = desktopLifeStory ? smooth((lifeStoryProgress - 0.30) / 0.14) : 1;
      const lifeProofOut = desktopLifeStory ? smooth((lifeStoryProgress - 0.58) / 0.10) : 0;
      const lifeVideoOut = desktopLifeStory ? smooth((lifeStoryProgress - 0.60) / 0.12) : 0;
      const lifeCodaIn = desktopLifeStory ? smooth((lifeStoryProgress - 0.68) / 0.14) : 1;
      const lifeCodaOut = desktopLifeStory ? smooth((lifeStoryProgress - 0.90) / 0.10) : 0;
      rootRef.current?.style.setProperty('--life-story-progress', String(lifeStoryProgress));
      rootRef.current?.style.setProperty('--life-intro-in', String(lifeIntroIn));
      rootRef.current?.style.setProperty('--life-intro-out', String(lifeIntroOut));
      rootRef.current?.style.setProperty('--life-video-in', String(lifeVideoIn));
      rootRef.current?.style.setProperty('--life-video-out', String(lifeVideoOut));
      rootRef.current?.style.setProperty('--life-proof-in', String(lifeProofIn));
      rootRef.current?.style.setProperty('--life-proof-out', String(lifeProofOut));
      rootRef.current?.style.setProperty('--life-coda-in', String(lifeCodaIn));
      rootRef.current?.style.setProperty('--life-coda-out', String(lifeCodaOut));
      const sectionPresence = (rect: DOMRect) => {
        const enter = smooth((viewport - rect.top) / Math.max(viewport * .45, 1));
        const leave = smooth((viewport * .15 - rect.bottom) / Math.max(viewport * .45, 1));
        return enter * (1 - leave);
      };
      const portfolioField = sectionPresence(portfolioRect);
      const lifeField = sectionPresence(lifeStoryRect);
      const inquiryField = sectionPresence(inquiryRect);
      const footerField = sectionPresence(footerRect);
      const narrativeIntensity = reduced ? 1 : Math.max(portfolioField, lifeField, inquiryField, footerField);
      const closingField = Math.max(inquiryField, footerField);
      const narrativePhase = closingField > .12 ? .42 : lifeField > .12 ? 1.35 : 0;
      const narrativeProgress = closingField > .12
        ? clamp((viewport - inquiryRect.top) / Math.max(inquiryRect.height + footerRect.height, 1))
        : lifeField > .12 ? lifeStoryProgress : portfolioProgress;
      rootRef.current?.style.setProperty('--narrative-field-opacity', String(narrativeIntensity));
      narrativeCanvasControllerRef.current?.setState(narrativeProgress, narrativePhase, narrativeIntensity);
      const founderJourney = reduced ? 1 : clamp((viewport - founderRect.top) / (viewport + founderRect.height));
      const founderEntry = reduced ? 1 : smooth(visibleEntry(founder, .82, .16));
      const founderCopyEntry = reduced ? 1 : smooth((visibleEntry(founderCopy, .78, .14) - .05) / .95);
      const founderTitleEntry = reduced ? 1 : smooth((founderCopyEntry - .12) / .76);
      const founderSecondLineEntry = reduced ? 1 : smooth((founderCopyEntry - .32) / .64);
      const founderSupportEntry = reduced ? 1 : smooth((founderCopyEntry - .64) / .36);
      const founderValuesEntry = reduced ? 1 : smooth((founderCopyEntry - .78) / .22);
      const founderExit = reduced ? 0 : smooth((founderJourney - .72) / .24);
      rootRef.current?.style.setProperty('--founder-entry', String(founderEntry));
      rootRef.current?.style.setProperty('--founder-copy-entry', String(founderCopyEntry));
      rootRef.current?.style.setProperty('--founder-title-entry', String(founderTitleEntry));
      rootRef.current?.style.setProperty('--founder-title-second-entry', String(founderSecondLineEntry));
      rootRef.current?.style.setProperty('--founder-support-entry', String(founderSupportEntry));
      rootRef.current?.style.setProperty('--founder-values-entry', String(founderValuesEntry));
      rootRef.current?.style.setProperty('--founder-exit', String(founderExit));
      rootRef.current?.style.setProperty('--practice-progress', String(practiceProgress));
      const practiceAperture = reduced ? 1 : smooth(visibleEntry(practice, 1, .34));
      rootRef.current?.style.setProperty('--practice-aperture', String(practiceAperture));
      const practiceEntry = visibleEntry(practiceCopy, .94, .28);
      const practiceTitleProgress = reduced ? 1 : smooth((practiceEntry - .16) / .7);
      const practiceSecondLineProgress = reduced ? 1 : smooth((practiceEntry - .3) / .66);
      const practiceSupportProgress = reduced ? 1 : smooth((practiceEntry - .64) / .36);
      rootRef.current?.style.setProperty('--practice-title-progress', String(practiceTitleProgress));
      rootRef.current?.style.setProperty('--practice-title-second-progress', String(practiceSecondLineProgress));
      rootRef.current?.style.setProperty('--practice-support-progress', String(practiceSupportProgress));
      rootRef.current?.style.setProperty('--inquiry-progress', String(inquiryProgress));
      inquiryCanvasControllerRef.current?.setProgress(inquiryProgress);
      const footerProgress = reduced ? 1 : clamp((viewport - footerRect.top) / (viewport * .72));
      rootRef.current?.style.setProperty('--footer-progress', String(footerProgress));
      rootRef.current?.style.setProperty('--footer-reveal', `${((1 - footerProgress) * 100).toFixed(2)}%`);

      if (desktopProcession) {
        const entryProgress = smooth(clamp((viewport * .9 - portfolioRect.top) / (viewport * .62)));
        const exitProgress = smooth((portfolioProgress - .9) / .1);
        const prologueLeave = smooth((portfolioProgress - .055) / .085);
        const prologueOpacity = entryProgress * (1 - prologueLeave);
        const panelReveals = [
          smooth((portfolioProgress - .08) / .15),
          smooth((portfolioProgress - .38) / .15),
          smooth((portfolioProgress - .67) / .15),
        ];
        const copyStarts = [.16, .46, .75];
        const copyEnds = [.39, .69, .97];

        portfolioStage.style.setProperty('--residence-progress', String(portfolioProgress));
        portfolioStage.style.setProperty('--residence-entry', String(entryProgress));
        portfolioStage.style.setProperty('--residence-exit', String(exitProgress));
        portfolioStage.style.setProperty('--residence-line-opacity', String(1 - exitProgress));
        portfolioStage.style.setProperty('--residence-prologue-opacity', String(prologueOpacity));
        portfolioStage.style.setProperty('--residence-prologue-type', String(entryProgress));
        portfolioStage.style.setProperty('--residence-prologue-leave', String(prologueLeave));

        projectRefs.current.forEach((project, index) => {
          if (!project) return;
          const panelReveal = panelReveals[index] ?? 0;
          const nextPanelReveal = panelReveals[index + 1] ?? 0;
          const incomingCopy = smooth((portfolioProgress - copyStarts[index]) / .14);
          const outgoingCopy = index === WORK_STUDIES.length - 1
            ? smooth((portfolioProgress - .95) / .05)
            : smooth((portfolioProgress - copyEnds[index]) / .08);
          const copyOpacity = incomingCopy * (1 - outgoingCopy);
          const supportReveal = smooth((incomingCopy - .48) / .48) * (1 - outgoingCopy);

          const isFullyCovered = nextPanelReveal >= 0.998;
          const isStarted = index === 0 ? true : panelReveal > 0.001;
          const badgeOpacity = index === 0
            ? (1 - (panelReveals[1] ?? 0))
            : index === 1
            ? ((panelReveals[1] ?? 0) * (1 - (panelReveals[2] ?? 0)))
            : (panelReveals[2] ?? 0);

          const exitLift = index === WORK_STUDIES.length - 1 ? exitProgress : 0;

          project.style.opacity = isFullyCovered ? '0' : String(1 - exitLift * 0.45);
          project.style.visibility = isFullyCovered || !isStarted ? 'hidden' : 'visible';
          project.style.pointerEvents = isFullyCovered || !isStarted ? 'none' : 'auto';
          project.style.setProperty('--project-badge-opacity', String(clamp(badgeOpacity)));
          project.style.setProperty('--project-exit-lift', String(exitLift));
          project.style.setProperty('--residence-panel-reveal', String(panelReveal));
          project.style.setProperty('--project-light-cut', `${(panelReveal * 100).toFixed(3)}%`);
          project.style.setProperty('--project-light-reveal', String(panelReveal));
          project.style.setProperty('--project-light-intensity', String(Math.sin(panelReveal * Math.PI)));
          project.style.setProperty('--project-exit-shadow', '0');
          project.style.setProperty('--residence-image-opacity', '1');
          project.style.setProperty('--project-media-x', '0vw');
          project.style.setProperty('--project-media-y', '0vh');
          project.style.setProperty('--project-image-x', '0%');
          project.style.setProperty('--project-copy-x', '0vw');
          project.style.setProperty('--project-background-x', '0vw');
          project.style.setProperty('--project-clip-block', '0%');
          project.style.setProperty('--project-clip-inline', '0%');
          project.style.setProperty('--project-image-scale', '1');
          project.style.setProperty('--project-copy-y', `${(mix(28, 0, incomingCopy) - outgoingCopy * 20).toFixed(2)}px`);
          project.style.setProperty('--project-copy-opacity', String(copyOpacity));
          project.style.setProperty('--project-type-progress', String(incomingCopy));
          project.style.setProperty('--project-support-progress', String(supportReveal));
        });
      } else {
        portfolioStage.style.removeProperty('background-color');
        portfolioStage.style.setProperty('--residence-prologue-opacity', '1');
        portfolioStage.style.setProperty('--residence-prologue-type', '1');
        portfolioStage.style.setProperty('--residence-prologue-leave', '0');
        portfolioStage.style.setProperty('--residence-entry', '1');
        portfolioStage.style.setProperty('--residence-exit', '0');
        portfolioStage.style.setProperty('--residence-line-opacity', '0');
        projectRefs.current.forEach((project) => {
          if (!project) return;
          project.style.setProperty('--project-light-cut', '100%');
          project.style.setProperty('--project-light-reveal', '1');
          project.style.setProperty('--project-light-intensity', '0');
          project.style.setProperty('--project-exit-shadow', '0');
          project.style.setProperty('--residence-image-opacity', '1');
        });
      }

      projectRefs.current.forEach((project, index) => {
        if (!project) return;
        if (desktopProcession) return;
        const rect = project.getBoundingClientRect();
        const copy = project.querySelector<HTMLElement>('.project-copy') ?? project;
        const journey = clamp((viewport - rect.top) / (viewport + rect.height));
        const entry = visibleEntry(copy, .94, .28);
        const typeReveal = reduced ? 1 : smooth(entry);
        const copyReveal = reduced ? 1 : smooth(entry / .48);
        const reveal = reduced ? 1 : smooth((entry - .18) / .82);
        const detailReveal = reduced ? 1 : smooth((entry - .52) / .48);
        const exit = reduced ? 0 : smooth((journey - .7) / .22);
        const direction = index % 2 === 0 ? 1 : -1;
        project.style.setProperty('--project-media-x', `${(direction * (mix(18, 0, reveal) - exit * 8)).toFixed(3)}vw`);
        project.style.setProperty('--project-media-y', `${(mix(3.5, 0, reveal) - exit * 3).toFixed(3)}vh`);
        project.style.setProperty('--project-image-x', `${(-direction * mix(5.8, 0, reveal) + direction * exit * 2.2).toFixed(3)}%`);
        project.style.setProperty('--project-copy-x', `${(-direction * mix(4.8, 0, typeReveal)).toFixed(3)}vw`);
        project.style.setProperty('--project-detail-x', `${(-direction * mix(7.5, 0, detailReveal) + direction * exit * 3).toFixed(3)}vw`);
        project.style.setProperty('--project-background-x', `${(direction * (mix(12, 0, reveal) - exit * 5)).toFixed(3)}vw`);
        project.style.setProperty('--project-clip-block', `${(mix(8, 0, reveal) + exit * 3).toFixed(3)}%`);
        project.style.setProperty('--project-clip-inline', `${(mix(34, 0, reveal) + exit * 5).toFixed(3)}%`);
        project.style.setProperty('--project-image-scale', String(mix(1.07, 1.015, reveal) + exit * .02));
        project.style.setProperty('--project-copy-y', `${(mix(32, 0, copyReveal) - exit * 16).toFixed(2)}px`);
        project.style.setProperty('--project-copy-opacity', String(copyReveal * (1 - exit * .34)));
        project.style.setProperty('--project-type-progress', String(typeReveal));
        project.style.setProperty('--project-support-progress', String(reduced ? 1 : smooth((entry - .48) / .46)));
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
      <span className="narrative-field-fallback" aria-hidden="true" />
      <canvas className="narrative-field-canvas" ref={narrativeCanvasRef} aria-hidden="true" />
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
              <div className="decision-stage" ref={decisionStageRef} aria-live="polite">
                {PROCESS_STAGES.map((stage, index) => (
                  <div className="decision-media" key={stage.number} ref={(element) => { processMediaRefs.current[index] = element; }} aria-hidden={activeStage !== index}>
                    <img src={stage.image} alt={stage.alt} ref={(element) => { processImageRefs.current[index] = element; }} />
                    <span className="decision-grade" aria-hidden="true" />
                  </div>
                ))}
              </div>

              <div className="process-proposition">
                <h2 id="process-title" aria-label="A room feels effortless when every detail has been considered.">
                  {PROCESS_STATEMENT_WORDS.map((word, index) => (
                    <span className="process-word" style={{ '--word-order': index } as CSSProperties} aria-hidden="true" key={word}>{word}</span>
                  ))}
                </h2>
                <span>How you move, gather and rest gives every decision its direction.</span>
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

      <section className="portfolio-stage" ref={portfolioStageRef} id="work" aria-labelledby="portfolio-title">
        <div className="residence-procession">
          <div className="residence-prologue portfolio-thesis">
            <p>From decision to atmosphere</p>
            <h2 id="portfolio-title" aria-label="Every decision leaves an atmosphere.">
              <span className="type-line" aria-hidden="true"><i>Every decision</i></span>
              <span className="type-line" aria-hidden="true"><i>leaves an atmosphere.</i></span>
            </h2>
            <span className="residence-prologue-note">One residence, seen through three connected moments.</span>
          </div>

          <div className="project-constellations">
            {WORK_STUDIES.map((work, index) => (
              <article className={`project-constellation project-constellation--${index + 1}`} key={work.image} ref={(element) => { projectRefs.current[index] = element; }}>
                <div className="project-copy">
                  <p>{work.kicker}</p>
                  <h3 aria-label={work.title}>
                    {work.titleLines.map((line) => <span className="type-line" aria-hidden="true" key={line}><i>{line}</i></span>)}
                  </h3>
                  <small>{work.description}</small>
                  <span>{work.note}</span>
                </div>
                <figure className="project-main">
                  <span className="project-ambient" style={{ backgroundImage: `url(${work.image})` }} aria-hidden="true" />
                  <img src={work.image} alt={work.alt} loading={index === 0 ? 'eager' : 'lazy'} />
                  <span className="project-light" aria-hidden="true" />
                  <figcaption>{String(index + 1).padStart(2, '0')} / {String(WORK_STUDIES.length).padStart(2, '0')}</figcaption>
                </figure>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="life-story" ref={lifeStoryRef} aria-label="A room tested by life">
        <div className="life-story-frame">
          <div className="life-story-intro">
            <h2><span>A room is only complete</span><span>when life begins.</span></h2>
            <p>The final image records the design. Living reveals whether it works.</p>
          </div>

          <figure className="life-story-film">
            <video ref={livedUseVideoRef} src="/assets/residential-lagos-portrait.mp4" poster="/assets/residential-living-wide.jpg" muted loop playsInline preload="metadata" />
            <span aria-hidden="true" />
          </figure>

          <div className="life-story-proof">
            <h2 id="lived-use-title" aria-label="The photograph is not the final test.">
              <span className="type-line" aria-hidden="true"><i>The photograph</i></span>
              <span className="type-line" aria-hidden="true"><i>is not the</i></span>
              <span className="type-line" aria-hidden="true"><i>final test.</i></span>
            </h2>
            <p>A room proves itself in movement, conversation, rest and the ordinary moments it was designed to hold.</p>
          </div>

          <div className="life-story-coda">
            <h2 aria-label="A room holds together when every choice is seen as one.">
              <span className="type-line" aria-hidden="true"><i>A room holds together</i></span>
              <span className="type-line" aria-hidden="true"><i>when every choice is seen as one.</i></span>
            </h2>
          </div>
        </div>
      </section>

      <section className="founder-chapter" ref={founderChapterRef} aria-labelledby="founder-title">
        <div className="founder-copy">
          <p className="founder-credit"><strong>Tolu Ajayi</strong><span>Founder &amp; Creative Director</span></p>
          <h2 id="founder-title" aria-label="A considered room begins with a considered eye."><span aria-hidden="true"><i>A considered room</i></span><span aria-hidden="true"><i>begins with a considered eye.</i></span></h2>
          <span>Her practice starts with how a space will move, feel and hold everyday life. That attention remains present from the first site conversation to the final placement of light, furniture and art.</span>
          <div className="founder-values" aria-label="Function, flow and feeling">
            {['Function', 'Flow', 'Feeling'].map((value, index) => <span style={{ '--value-order': index } as CSSProperties} key={value}>{value}</span>)}
          </div>
        </div>
        <figure className="founder-portrait">
          <img src="/assets/tolu-ajayi-founder-portrait.jpg" alt="Tolu Ajayi, founder and creative director of TTA Designs, standing in a completed interior" loading="lazy" />
          <span aria-hidden="true" />
          <figcaption>The designer stays close to the decisions that shape the room.</figcaption>
        </figure>
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
            <button className="inquiry-link" type="button" onClick={() => { setInquiryStatus(''); setInquiryOpen(true); }}>
              <span className="moving-label"><i>Begin a conversation</i><i aria-hidden="true">Begin a conversation</i></span>
              <b aria-hidden="true">↗</b>
            </button>
            <small id="inquiry-note">Share the room, location and life the project needs to support.</small>
          </div>
        </section>

        <footer className="site-footer" ref={footerRef}>
          <div className="footer-topline">
            <div className="footer-column"><p>Studio</p><span>Residential and commercial interiors<br />Lagos, Nigeria</span></div>
            <div className="footer-column"><p>Connect</p><a href="https://www.instagram.com/ttadesigns/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="#inquiry">Project inquiry ↗</a></div>
          </div>
          <a className="footer-wordmark" href="#top" aria-label="TTA Designs — back to top"><img src="/assets/tta-wordmark-white.png" alt="TTA Designs" /></a>
          <div className="footer-meta"><span>Spaces shaped around the way life is lived.</span><span>Private cinematic concept · © TTA Designs</span><span>Made by Bevamped</span></div>
        </footer>
      </div>

      <section className={`inquiry-panel ${inquiryOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="project-inquiry-title" aria-hidden={!inquiryOpen}>
        <button className="inquiry-panel-backdrop" type="button" onClick={() => setInquiryOpen(false)} aria-label="Close project inquiry" />
        <div className="inquiry-panel-sheet">
          <div className="inquiry-panel-head">
            <div><p>Project inquiry</p><h2 id="project-inquiry-title">Begin with the way you want to live.</h2></div>
            <button type="button" onClick={() => setInquiryOpen(false)} aria-label="Close project inquiry">Close</button>
          </div>
          <form onSubmit={handleInquirySubmit}>
            <label><span>Name</span><input name="name" autoComplete="name" required /></label>
            <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
            <label><span>Phone <i>optional</i></span><input name="phone" type="tel" autoComplete="tel" /></label>
            <label><span>Project location</span><input name="location" required /></label>
            <label><span>Space</span><select name="space" required defaultValue=""><option value="" disabled>Select the space</option><option>Full residence</option><option>Living and dining</option><option>Bedroom</option><option>Commercial interior</option><option>Other</option></select></label>
            <label><span>Project stage</span><select name="stage" required defaultValue=""><option value="" disabled>Select the stage</option><option>Exploring possibilities</option><option>Planning or drawings</option><option>Construction in progress</option><option>Furnishing and finishing</option></select></label>
            <label><span>Desired start <i>optional</i></span><input name="start" placeholder="Month or timeframe" /></label>
            <label><span>Budget range <i>optional</i></span><input name="budget" placeholder="A range is enough" /></label>
            <label className="inquiry-panel-message"><span>What should this space make possible?</span><textarea name="message" rows={5} required /></label>
            <div className="inquiry-panel-actions">
              <button type="submit">Copy project brief</button>
              <a href="https://www.instagram.com/ttadesigns/" target="_blank" rel="noreferrer">Continue on Instagram ↗</a>
            </div>
            <p className="inquiry-panel-status" role="status">{inquiryStatus || 'Your information stays in this browser until you choose to copy it.'}</p>
          </form>
        </div>
      </section>

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
