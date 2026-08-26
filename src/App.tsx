import { useEffect, useMemo, useRef, useState } from 'react';
import { renderApprovedLogoFrame, type LogoLayers } from './logoTimeline';

const TOTAL = 8.8;
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

export function App() {
  const rootRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const masterRef = useRef<HTMLImageElement>(null);
  const axisRef = useRef<HTMLDivElement>(null);
  const dStemRef = useRef<HTMLDivElement>(null);
  const dBowlRef = useRef<HTMLDivElement>(null);
  const ttaRef = useRef<HTMLDivElement>(null);
  const esignsRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const hingeRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<Array<HTMLDivElement | null>>([]);
  const finalPhotoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const debug = useMemo(() => new URLSearchParams(window.location.search).get('debug') === '1', []);

  useEffect(() => {
    const layers: LogoLayers | null = masterRef.current && axisRef.current && dStemRef.current && dBowlRef.current && ttaRef.current && esignsRef.current
      ? { master: masterRef.current, axis: axisRef.current, dStem: dStemRef.current, dBowl: dBowlRef.current, tta: ttaRef.current, esigns: esignsRef.current }
      : null;
    if (!layers) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const params = new URLSearchParams(window.location.search);
    const audit = Number(params.get('auditTime'));
    const isAudit = Number.isFinite(audit) && params.has('auditTime');
    let start = performance.now() - time * 1000;

    const evaluate = (t: number) => {
      renderApprovedLogoFrame(Math.min(t, 3.05), layers, reduced);

      const logoExit = reduced ? smooth((t - 0.52) / 0.3) : smooth((t - 3.22) / 0.72);
      if (logoRef.current) {
        logoRef.current.style.opacity = String(1 - logoExit);
        logoRef.current.style.transform = `translate(-50%, -50%) scale(${(1 - logoExit * 0.025).toFixed(4)})`;
      }

      const opening = reduced ? 1 : smooth((t - 3.2) / 1.45);
      const curtainOpacity = reduced ? 0 : 1 - smooth((t - 4.0) / 0.62);
      if (curtainLeftRef.current) {
        curtainLeftRef.current.style.opacity = String(curtainOpacity);
        curtainLeftRef.current.style.transform = `rotateY(${(-104 * opening).toFixed(2)}deg)`;
      }
      if (curtainRightRef.current) {
        curtainRightRef.current.style.opacity = String(curtainOpacity);
        curtainRightRef.current.style.transform = `rotateY(${(104 * opening).toFixed(2)}deg)`;
      }

      const hinge = reduced ? 0 : smooth((t - 3.08) / 0.34) * (1 - smooth((t - 5.42) / 0.72));
      if (hingeRef.current) {
        hingeRef.current.style.opacity = String(hinge);
        hingeRef.current.style.transform = `translateX(-50%) scaleY(${(0.06 + hinge * 0.94).toFixed(3)})`;
      }

      leafRefs.current.forEach((leaf, index) => {
        if (!leaf) return;
        const progress = reduced ? 1 : smooth((t - (3.68 + index * 0.09)) / 1.52);
        const offset = (2 - index) * 100 * (1 - progress);
        const angle = index < 2 ? -78 : index > 2 ? 78 : 0;
        const leafExit = reduced ? 1 : smooth((t - 5.62) / 0.42);
        leaf.style.opacity = String(progress * (1 - leafExit));
        leaf.style.transform = `translateX(${offset.toFixed(2)}%) translateZ(${(-430 * (1 - progress)).toFixed(2)}px) rotateY(${(angle * (1 - progress)).toFixed(2)}deg)`;
      });

      const photoIn = reduced ? smooth((t - 0.58) / 0.45) : smooth((t - 5.35) / 0.55);
      if (finalPhotoRef.current) finalPhotoRef.current.style.opacity = String(photoIn);

      const interfaceIn = reduced ? smooth((t - 0.92) / 0.48) : smooth((t - 6.08) / 0.82);
      [navRef.current, copyRef.current].forEach((element) => {
        if (!element) return;
        element.style.opacity = String(interfaceIn);
        element.style.transform = `translateY(${((1 - interfaceIn) * 22).toFixed(2)}px)`;
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
        if (next < TOTAL) frame.current = requestAnimationFrame(loop);
      }
    };
    frame.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame.current);
  }, [paused]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'r') window.location.reload();
      if (event.code === 'Space') {
        event.preventDefault();
        setPaused((value) => !value);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (time < 6.7 || !finalPhotoRef.current) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      finalPhotoRef.current.style.setProperty('--drift-x', `${x * -7}px`);
      finalPhotoRef.current.style.setProperty('--drift-y', `${y * -5}px`);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [time]);

  return (
    <main className="experience" ref={rootRef}>
      <section className="editorial-stage" aria-label="TTA Designs introduction">
        <div className="room-frame">
          <div className="final-photo" ref={finalPhotoRef} aria-hidden="true" />
          <div className="leaf-set" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                className={`room-leaf leaf-${index + 1}`}
                key={index}
                ref={(element) => { leafRefs.current[index] = element; }}
                style={{ backgroundPosition: `${index * 25}% 50%` }}
              />
            ))}
          </div>
        </div>

        <nav className="hero-nav" ref={navRef} aria-label="Primary">
          <img src="/assets/tta-wordmark-white.png" alt="TTA Designs" />
          <p>Residential interiors · Lagos</p>
          <button type="button">Begin a conversation <span aria-hidden="true">↗</span></button>
        </nav>

        <div className="hero-copy" ref={copyRef}>
          <p className="chapter">01 — Spaces for living</p>
          <h1>Spaces shaped<br />around the way<br />life is lived.</h1>
          <p className="support">Refined in feeling.<br />Considered in use.</p>
        </div>
      </section>

      <div className="opening-perspective" aria-hidden="true">
        <div className="curtain curtain-left" ref={curtainLeftRef} />
        <div className="curtain curtain-right" ref={curtainRightRef} />
      </div>
      <div className="hinge-axis" ref={hingeRef} aria-hidden="true" />

      <div className="logo-wrapper" ref={logoRef} aria-label="TTA Designs">
        <img src="/assets/tta-wordmark-white.png" className="logo-layer master-wordmark" ref={masterRef} alt="TTA Designs" />
        <div className="logo-layer" ref={axisRef}><img src="/assets/axis-line.png" alt="" /></div>
        <div className="logo-layer" ref={dStemRef}><img src="/assets/d-stem.png" alt="" /></div>
        <div className="logo-layer" ref={dBowlRef}><img src="/assets/d-bowl.png" alt="" /></div>
        <div className="logo-layer" ref={ttaRef}><img src="/assets/tta-unified-group.png" alt="" /></div>
        <div className="logo-layer" ref={esignsRef}><img src="/assets/esigns-unified-group.png" alt="" /></div>
      </div>

      {debug && (
        <aside className="debug-hud">
          <span>HINGED ELEVATION</span>
          <output>{time.toFixed(2)} / {TOTAL.toFixed(2)}</output>
          <button onClick={() => window.location.reload()}>Replay</button>
        </aside>
      )}
    </main>
  );
}
