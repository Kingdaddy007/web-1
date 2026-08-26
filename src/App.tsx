import { useEffect, useMemo, useRef, useState } from 'react';
import { MembraneCanvas } from './MembraneCanvas';
import { getHeroVerticalFocus } from './framing';
import { renderApprovedLogoFrame, type LogoLayers } from './logoTimeline';

const TOTAL = 7.4;
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
  const seamRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const membraneRef = useRef<MembraneCanvas | null>(null);
  const frameRef = useRef(0);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const debug = useMemo(() => new URLSearchParams(window.location.search).get('debug') === '1', []);
  const forceReduced = useMemo(() => new URLSearchParams(window.location.search).get('reduced') === '1', []);

  useEffect(() => {
    if (!canvasRef.current) return;
    membraneRef.current = new MembraneCanvas(canvasRef.current, HERO_IMAGE);
    return () => membraneRef.current?.destroy();
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

    let start = performance.now() - time * 1000;
    const reduced = forceReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const audit = Number(new URLSearchParams(window.location.search).get('auditTime'));
    const isAudit = Number.isFinite(audit) && new URLSearchParams(window.location.search).has('auditTime');

    const evaluate = (t: number) => {
      renderApprovedLogoFrame(Math.min(t, 3.05), layers, reduced);

      const transition = reduced ? (t >= 0.55 ? 1 : 0) : smooth((t - 3.32) / 2.06);
      membraneRef.current?.setProgress(transition);

      const logoExit = reduced ? smooth((t - 0.55) / 0.3) : smooth((t - 3.28) / 0.72);
      if (logoRef.current) {
        logoRef.current.style.opacity = String(1 - logoExit);
        logoRef.current.style.transform = `translate(-50%, -50%) scale(${(1 - logoExit * 0.035).toFixed(4)})`;
        logoRef.current.style.filter = `blur(${(logoExit * 5).toFixed(2)}px)`;
      }

      const seam = reduced ? 0 : smooth((t - 3.08) / 0.38) * (1 - smooth((t - 3.78) / 0.68));
      if (seamRef.current) {
        seamRef.current.style.opacity = String(seam);
        seamRef.current.style.transform = `translateX(-50%) scaleY(${(0.08 + seam * 0.92).toFixed(3)})`;
      }

      const domHero = reduced ? smooth((t - 0.55) / 0.5) : smooth((t - 5.1) / 0.38);
      if (heroRef.current) {
        heroRef.current.style.opacity = String(domHero);
        heroRef.current.style.transform = `translateY(${((1 - domHero) * 8).toFixed(2)}px) scale(${(1.006 - domHero * 0.006).toFixed(4)})`;
      }
      if (canvasRef.current) {
        const canvasExit = reduced ? smooth((t - 0.55) / 0.35) : smooth((t - 5.28) / 0.4);
        canvasRef.current.style.opacity = String(1 - canvasExit);
      }

      const copyIn = reduced ? smooth((t - 0.9) / 0.45) : smooth((t - 5.72) / 0.76);
      if (heroCopyRef.current) {
        heroCopyRef.current.style.opacity = String(copyIn);
        heroCopyRef.current.style.transform = `translateY(${((1 - copyIn) * 26).toFixed(2)}px)`;
      }
      if (navRef.current) {
        navRef.current.style.opacity = String(copyIn);
        navRef.current.style.transform = `translateY(${((1 - copyIn) * -12).toFixed(2)}px)`;
      }

      rootRef.current?.style.setProperty('--time-progress', String(clamp(t / TOTAL)));
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
      if (time < 6.45 || !heroRef.current) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      heroRef.current.style.setProperty('--pointer-x', `${x * -10}px`);
      heroRef.current.style.setProperty('--pointer-y', `${y * -7}px`);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [time]);

  return (
    <main className="experience" ref={rootRef}>
      <div className="hero-image" ref={heroRef} aria-hidden="true" />
      <div className="hero-grade" aria-hidden="true" />
      <canvas className="membrane-canvas" ref={canvasRef} aria-hidden="true" />

      <div className="transition-seam" ref={seamRef} aria-hidden="true" />

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
        <button type="button">Begin a conversation <span aria-hidden="true">↗</span></button>
      </nav>

      <section className="hero-copy" ref={heroCopyRef} aria-label="Introduction">
        <p className="eyebrow">Residential interiors · Lagos</p>
        <h1>Spaces shaped around<br />the way life is lived.</h1>
        <div className="hero-meta">
          <p>Refined in feeling.<br />Considered in use.</p>
          <span className="scroll-cue">Explore<br /><i /></span>
        </div>
      </section>

      {debug && (
        <aside className="debug-hud">
          <span>AXIS LIGHT THRESHOLD</span>
          <output>{time.toFixed(2)} / {TOTAL.toFixed(2)}</output>
          <button onClick={() => window.location.reload()}>Replay</button>
          <span>R replay · Space pause</span>
        </aside>
      )}
    </main>
  );
}
