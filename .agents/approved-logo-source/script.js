/**
 * TTA Designs — Concept A Refinement: The Constructed Axis
 * Architectural Motion Engine & Deterministic Evaluator
 * 
 * Choreography Law:
 * 1. Stillness (0.00-0.30s)
 * 2. Axis establishes order (0.30-1.05s)
 * 3. D confirms ownership (0.80-1.55s)
 * 4. DESIGNS resolves as one fine structure (1.25-2.10s)
 * 5. TTA locks as one grounded mass (2.10-2.65s)
 * 6. Master settlement & still hold (2.65-4.50s)
 */

(function () {
  'use strict';

  const TOTAL_DURATION = 4.50;

  // Architectural cubic-bezier(0.16, 1, 0.3, 1) evaluator
  function cubicBezier(p1x, p1y, p2x, p2y) {
    return function (t) {
      let u = t;
      for (let i = 0; i < 5; i++) {
        const currentX = 3 * (1 - u) * (1 - u) * u * p1x + 3 * (1 - u) * u * u * p2x + u * u * u;
        const currentSlope = 3 * (1 - u) * (1 - u) * p1x + 6 * (1 - u) * u * (p2x - p1x) + 3 * u * u * (1 - p2x);
        if (Math.abs(currentSlope) < 1e-6) break;
        u -= (currentX - t) / currentSlope;
        u = Math.max(0, Math.min(1, u));
      }
      return 3 * (1 - u) * (1 - u) * u * p1y + 3 * (1 - u) * u * u * p2y + u * u * u;
    };
  }

  const easeOutQuart = cubicBezier(0.16, 1, 0.3, 1);
  const easeOutCubic = cubicBezier(0.215, 0.61, 0.355, 1);

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  // DOM Elements
  const layerMaster = document.getElementById('layerMaster');
  const layerAxis = document.getElementById('layerAxis');
  const layerDStem = document.getElementById('layerDStem');
  const layerDBowl = document.getElementById('layerDBowl');
  const layerTTA = document.getElementById('layerTTA');
  const layerESIGNS = document.getElementById('layerESIGNS');

  const hudTime = document.getElementById('hudTime');
  const hudBeat = document.getElementById('hudBeat');
  const timelineScrubber = document.getElementById('timelineScrubber');
  const btnTogglePlay = document.getElementById('btnTogglePlay');
  const btnReplay = document.getElementById('btnReplay');
  const btnReducedMotion = document.getElementById('btnReducedMotion');
  const btnGuide = document.getElementById('btnGuide');
  const axisGuideLine = document.getElementById('axisGuideLine');
  const baselineGuideLine = document.getElementById('baselineGuideLine');

  // State Management
  let isPlaying = true;
  let systemReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let manualReducedMotionOverride = null; // null = use system, true/false = manual override
  let isGuideVisible = false;
  let currentTime = 0.0;
  let lastTimestamp = null;
  const auditTimeParam = new URLSearchParams(window.location.search).get('auditTime');

  function isReducedMotionActive() {
    if (manualReducedMotionOverride !== null) {
      return manualReducedMotionOverride;
    }
    return systemReducedMotion;
  }

  function updateReducedMotionButtonUI() {
    if (!btnReducedMotion) return;
    const active = isReducedMotionActive();
    const source = manualReducedMotionOverride === null ? 'SYSTEM' : 'MANUAL';
    btnReducedMotion.textContent = 'REDUCED: ' + (active ? 'ON' : 'OFF') + ' · ' + source;
    btnReducedMotion.style.color = active ? '#f5a623' : '#d0d0d0';
  }

  updateReducedMotionButtonUI();

  // Listen for system media query changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    systemReducedMotion = e.matches;
    updateReducedMotionButtonUI();
    evaluateFrame(currentTime);
  });

  function updateHUD(t, beatText) {
    if (hudTime) hudTime.textContent = t.toFixed(2) + 's / ' + TOTAL_DURATION.toFixed(2) + 's';
    if (hudBeat) hudBeat.textContent = beatText;
    if (timelineScrubber && document.activeElement !== timelineScrubber) {
      timelineScrubber.value = t.toFixed(2);
    }
  }

  /**
   * Deterministic Frame Evaluator
   */
  function evaluateFrame(t) {
    currentTime = clamp(t, 0, TOTAL_DURATION);

    if (isReducedMotionActive()) {
      // Reduced motion spec: black hold <= 300ms, then clean 250ms crossfade to full resting mark
      const holdTime = 0.25;
      const fadeDuration = 0.25;
      let alpha = 0.0;
      if (t >= holdTime) {
        alpha = clamp((t - holdTime) / fadeDuration, 0, 1);
      }
      if (layerMaster) {
        layerMaster.style.opacity = alpha;
        layerMaster.style.clipPath = 'none';
        layerMaster.style.transform = 'none';
      }
      [layerAxis, layerDStem, layerDBowl, layerTTA, layerESIGNS].forEach(l => {
        if (l) l.style.opacity = 0;
      });
      updateHUD(currentTime, 'REDUCED MOTION: DIRECT MASTER CROSSFADE');
      return;
    }

    let beatDescription = 'BEAT 0: STILLNESS';

    // -------------------------------------------------------------
    // BEAT 0: Black Stillness (0.00s – 0.30s)
    // -------------------------------------------------------------
    if (t < 0.30) {
      beatDescription = 'BEAT 0: BLACK STILLNESS (0.00s – 0.30s)';
    }

    // -------------------------------------------------------------
    // BEAT 1: Axis establishes order (0.30s – 1.05s)
    // Centerline grows outward symmetrically from center
    // -------------------------------------------------------------
    if (t >= 0.30 && t < 0.80) {
      beatDescription = 'BEAT 1: AXIS ESTABLISHES ORDER (0.30s – 1.05s)';
    }

    const pAxis = clamp((t - 0.30) / 0.75, 0, 1);
    if (layerAxis) {
      if (pAxis > 0) {
        const eAxis = easeOutQuart(pAxis);
        const topInset = 5.39 + (49.31 - 5.39) * (1 - eAxis);
        const bottomInset = (100 - 93.23) + (93.23 - 49.31) * (1 - eAxis);
        layerAxis.style.opacity = clamp(pAxis / 0.15, 0, 1);
        layerAxis.style.clipPath = 'inset(' + topInset.toFixed(2) + '% 0% ' + bottomInset.toFixed(2) + '% 0%)';
        layerAxis.style.transform = 'none';
      } else {
        layerAxis.style.opacity = 0;
        layerAxis.style.clipPath = 'inset(49.31% 0% 50.69% 0%)';
      }
    }

    // -------------------------------------------------------------
    // BEAT 2: D confirms ownership (0.80s – 1.55s)
    // D forms around the axis; axis visibly occupies D counter
    // -------------------------------------------------------------
    if (t >= 0.80 && t < 1.25) {
      beatDescription = 'BEAT 2: D CONFIRMS OWNERSHIP (0.80s – 1.55s)';
    }

    const pD = clamp((t - 0.80) / 0.75, 0, 1);
    if (pD > 0) {
      const eD = easeOutQuart(pD);
      const rightStemClip = (100 - 39.5) * (1 - eD);
      if (layerDStem) {
        layerDStem.style.opacity = clamp(pD / 0.20, 0, 1);
        layerDStem.style.clipPath = 'inset(0% ' + rightStemClip.toFixed(2) + '% 0% 0%)';
        layerDStem.style.transform = 'translateX(' + ((1 - eD) * 10).toFixed(2) + 'px)';
      }
      const leftBowlClip = 39.36 * (1 - eD);
      if (layerDBowl) {
        layerDBowl.style.opacity = clamp(pD / 0.20, 0, 1);
        layerDBowl.style.clipPath = 'inset(0% 0% 0% ' + leftBowlClip.toFixed(2) + '%)';
        layerDBowl.style.transform = 'translateX(' + (-(1 - eD) * 10).toFixed(2) + 'px)';
      }
    } else {
      if (layerDStem) layerDStem.style.opacity = 0;
      if (layerDBowl) layerDBowl.style.opacity = 0;
    }

    // -------------------------------------------------------------
    // BEAT 3: DESIGNS resolves as one coherent fine structure (1.25s – 2.10s)
    // The full raster group shares one opacity/travel envelope: no letter crop.
    // -------------------------------------------------------------
    if (t >= 1.25 && t < 2.10) {
      beatDescription = 'BEAT 3: DESIGNS RESOLVES AS ONE STRUCTURE (1.25s – 2.10s)';
    }

    const pEsigns = clamp((t - 1.25) / 0.85, 0, 1);
    if (layerESIGNS) {
      if (pEsigns > 0) {
        const eEsigns = easeOutQuart(pEsigns);
        layerESIGNS.style.opacity = clamp(pEsigns / 0.22, 0, 1);
        layerESIGNS.style.clipPath = 'none';
        layerESIGNS.style.transform = 'translateX(' + (-(1 - eEsigns) * 14).toFixed(2) + 'px)';
      } else {
        layerESIGNS.style.opacity = 0;
        layerESIGNS.style.clipPath = 'none';
        layerESIGNS.style.transform = 'translateX(-14px)';
      }
    }

    // -------------------------------------------------------------
    // BEAT 4: TTA locks as one grounded mass (2.10s – 2.65s)
    // The exact full TTA crop has one shared opacity/travel envelope.
    // It is never clipped, so no individual T, T, or A can appear first.
    // -------------------------------------------------------------
    if (t >= 2.10 && t < 2.65) {
      beatDescription = 'BEAT 4: TTA LOCKS AS GROUNDED MASS (2.10s – 2.65s)';
    }

    const pTta = clamp((t - 2.10) / 0.55, 0, 1);
    if (layerTTA) {
      if (pTta > 0) {
        const eTta = easeOutQuart(pTta);
        layerTTA.style.opacity = clamp(pTta / 0.18, 0, 1);
        layerTTA.style.clipPath = 'none';
        layerTTA.style.transform = 'translateX(' + ((1 - eTta) * 12).toFixed(2) + 'px)';
      } else {
        layerTTA.style.opacity = 0;
        layerTTA.style.clipPath = 'none';
        layerTTA.style.transform = 'translateX(12px)';
      }
    }

    // -------------------------------------------------------------
    // BEAT 5 & 6: Authoritative settlement & still hold (2.65s – 4.50s)
    // Exact master PNG crossfades after the full grouped TTA has arrived.
    // -------------------------------------------------------------
    if (t >= 2.65 && t < 3.05) {
      beatDescription = 'BEAT 5: AUTHORITATIVE SETTLEMENT (2.65s – 3.05s)';
    } else if (t >= 3.05) {
      beatDescription = 'BEAT 6: COMPLETE IDENTITY STILL HOLD (3.05s – 4.50s)';
    }

    const pSettle = clamp((t - 2.65) / 0.40, 0, 1);
    if (layerMaster) {
      if (pSettle > 0) {
        const eSettle = easeOutCubic(pSettle);
        layerMaster.style.opacity = eSettle;
        layerMaster.style.clipPath = 'none';
        layerMaster.style.transform = 'none';

        const fadeOut = 1 - eSettle;
        [layerAxis, layerDStem, layerDBowl, layerTTA, layerESIGNS].forEach(l => {
          if (l) l.style.opacity = fadeOut;
        });
      } else {
        layerMaster.style.opacity = 0;
      }
    }

    updateHUD(currentTime, beatDescription);
  }

  // Animation Loop
  function tick(timestamp) {
    if (!isPlaying) {
      lastTimestamp = null;
      return;
    }

    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
    }

    const delta = (timestamp - lastTimestamp) / 1000.0;
    lastTimestamp = timestamp;

    currentTime += delta;

    if (currentTime >= TOTAL_DURATION) {
      currentTime = TOTAL_DURATION;
      evaluateFrame(currentTime);
      isPlaying = false;
      if (btnTogglePlay) btnTogglePlay.textContent = 'PLAY';
      return;
    }

    evaluateFrame(currentTime);
    requestAnimationFrame(tick);
  }

  function play() {
    if (currentTime >= TOTAL_DURATION) {
      currentTime = 0.0;
    }
    isPlaying = true;
    lastTimestamp = null;
    if (btnTogglePlay) btnTogglePlay.textContent = 'PAUSE';
    requestAnimationFrame(tick);
  }

  function pause() {
    isPlaying = false;
    lastTimestamp = null;
    if (btnTogglePlay) btnTogglePlay.textContent = 'PLAY';
  }

  function replay() {
    currentTime = 0.0;
    evaluateFrame(0.0);
    play();
  }

  // Event Handlers
  if (btnTogglePlay) {
    btnTogglePlay.addEventListener('click', () => {
      if (isPlaying) pause();
      else play();
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener('click', replay);
  }

  if (btnReducedMotion) {
    btnReducedMotion.addEventListener('click', () => {
      if (manualReducedMotionOverride === null) {
        manualReducedMotionOverride = !systemReducedMotion;
      } else if (manualReducedMotionOverride !== systemReducedMotion) {
        manualReducedMotionOverride = systemReducedMotion;
      } else {
        manualReducedMotionOverride = null;
      }
      updateReducedMotionButtonUI();
      evaluateFrame(currentTime);
    });
  }

  if (btnGuide) {
    btnGuide.addEventListener('click', () => {
      isGuideVisible = !isGuideVisible;
      btnGuide.textContent = 'GUIDES: ' + (isGuideVisible ? 'ON' : 'OFF');
      btnGuide.style.color = isGuideVisible ? '#f5a623' : '#d0d0d0';
      if (axisGuideLine) axisGuideLine.style.display = isGuideVisible ? 'block' : 'none';
      if (baselineGuideLine) baselineGuideLine.style.display = isGuideVisible ? 'block' : 'none';
    });
  }

  if (timelineScrubber) {
    timelineScrubber.addEventListener('input', (e) => {
      pause();
      evaluateFrame(parseFloat(e.target.value));
    });
  }

  // Expose for verification and test suites
  window.evaluateFrame = evaluateFrame;

  // Auto-start. ?auditTime= is a deterministic, paused inspection mode used
  // only for proof capture; normal playback has no query parameter.
  const auditTime = auditTimeParam === null ? null : Number(auditTimeParam);
  if (Number.isFinite(auditTime)) {
    currentTime = clamp(auditTime, 0, TOTAL_DURATION);
    isPlaying = false;
    evaluateFrame(currentTime);
    if (btnTogglePlay) btnTogglePlay.textContent = 'PLAY';
  } else {
    evaluateFrame(0.0);
    requestAnimationFrame(tick);
  }

})();
