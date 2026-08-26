import { useEffect, useMemo, useRef, useState } from 'react';
import { FocusCanvas } from './FocusCanvas';
import { getHeroVerticalFocus } from './framing';
import { renderApprovedLogoFrame, type LogoLayers } from './logoTimeline';

const TOTAL = 7.9;
const HERO_IMAGE = '/assets/tta-living-cinematic-master-v1.png';
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

export function App() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const masterRef = useRef<HTMLImageElement>(null);
  const axisRef = useRef<HTMLDivElement>(null);
  const dStemRef = useRef<HTMLDivElement>(null);
  const dBowlRef = useRef<HTMLDivElement>(null);
  const ttaRef = useRef<HTMLDivElement>(null);
  const esignsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const focusCanvasRef = useRef<FocusCanvas | null>(null);
  const frameRef = useRef(0);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const debug = useMemo(() => new URLSearchParams(window.location.search).get('debug') === '1', []);
  const forceReduced = useMemo(() => new URLSearchParams(window.location.search).get('reduced') === '1', []);

  useEffect(() => {
    if (!canvasRef.current) return;
    focusCanvasRef.current = new FocusCanvas(canvasRef.current, HERO_IMAGE);
    return () => focusCanvasRef.current?.destroy();
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

    const reduced = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const params = new URLSearchParams(window.location.search);
    const audit = Number(params.get('auditTime'));
    const isAudit = Number.isFinite(audit) && params.has('auditTime');
    const start = performance.now() - time * 1000;

    const evaluate = (t: number) => {
      renderApprovedLogoFrame(Math.min(t, 3.05), layers, reduced);

      const focus = reduced ? (t >= 0.55 ? 1 : 0) : smooth((t - 3.18) / 2.18);
      focusCanvasRef.current?.setFocus(focus);

      const logoExit = reduced ? smooth((t - 0.55) / 0.28) : smooth((t - 3.22) / 0.88);
      if (logoRef.current) {
        logoRef.current.style.opacity = String(1 - logoExit);
        logoRef.current.style.transform = `translate(-50%, -50%) scale(${(1 - logoExit * 0.055).toFixed(4)})`;
        logoRef.current.style.filter = `blur(${(logoExit * 7).toFixed(2)}px)`;
      }

      const domHero = reduced ? smooth((t - 0.55) / 0.46) : smooth((t - 5.08) / 0.48);
      if (heroRef.current) {
        heroRef.current.style.opacity = String(domHero);
        heroRef.current.style.transform = `scale(${(1.008 - domHero * 0.008).toFixed(4)})`;
      }
      if (canvasRef.current) {
        const canvasExit = reduced ? smooth((t - 0.55) / 0.34) : smooth((t - 5.34) / 0.44);
        canvasRef.current.style.opacity = String(1 - canvasExit);
      }

      const interfaceIn = reduced ? smooth((t - 0.92) / 0.42) : smooth((t - 5.82) / 0.82);
      [navRef.current, heroCopyRef.current].forEach((element) => {
        if (!element) return;
        element.style.opacity = String(interfaceIn);
        element.style.transform = `translateY(${((1 - interfaceIn) * 18).toFixed(2)}px)`;
      });

      setTime(t);
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
  }, [paused, forceReduced]);

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
    const onPointer = (event: PointerEvent) => {
      if (time < 6.7 || !heroRef.current) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      heroRef.current.style.setProperty('--pointer-x', `${x * -8}px`);
      heroRef.current.style.setProperty('--pointer-y', `${y * -5}px`);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [time]);

  return (
    <main className="experience" ref={rootRef}>
      <div className="hero-image" ref={heroRef} aria-hidden="true" />
      <div className="hero-grade" aria-hidden="true" />
      <canvas className="focus-canvas" ref={canvasRef} aria-hidden="true" />

      <div className="logo-wrapper" ref={logoRef} aria-label="TTA Designs">
        <img src="/assets/tta-wordmark-white.png" className="logo-layer master-wordmark" ref={masterRef} alt="TTA Designs" />
        <div className="logo-layer" ref={axisRef}><img src="/assets/axis-line.png" alt="" /></div>
        <div className="logo-layer" ref={dStemRef}><img src="/assets/d-stem.png" alt="" /></div>
        <div className="logo-layer" ref={dBowlRef}><img src="/assets/d-bowl.png" alt="" /></div>
        <div className="logo-layer" ref={ttaRef}><img src="/assets/tta-unified-group.png" alt="" /></div>
        <div className="logo-layer" ref={esignsRef}><img src="/assets/esigns-unified-group.png" alt="" /></div>
      </div>

      <nav className="hero-nav" ref={navRef} aria-label="Primary">
        <img src="/assets/tta-wordmark-white.png" alt="TTA Designs" />
        <p>Residential interiors · Lagos</p>
        <button type="button">Begin a conversation <span aria-hidden="true">↗</span></button>
      </nav>

      <section className="editorial-rail" ref={heroCopyRef} aria-label="Introduction">
        <p className="chapter">01 — Spaces for living</p>
        <h1>Spaces shaped around<br />the way life is lived.</h1>
        <div className="rail-meta">
          <p>Refined in feeling.<br />Considered in use.</p>
          <span>Explore <i /></span>
        </div>
      </section>

      {debug && (
        <aside className="debug-hud">
          <span>SPATIAL FOCUS PULL</span>
          <output>{time.toFixed(2)} / {TOTAL.toFixed(2)}</output>
          <button onClick={() => window.location.reload()}>Replay</button>
          <span>R replay · Space pause</span>
        </aside>
      )}
    </main>
  );
}
