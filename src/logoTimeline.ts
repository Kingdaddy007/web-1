export type LogoLayers = {
  master: HTMLElement;
  axis: HTMLElement;
  dStem: HTMLElement;
  dBowl: HTMLElement;
  tta: HTMLElement;
  esigns: HTMLElement;
};

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  return (t: number) => {
    let u = t;
    for (let i = 0; i < 5; i += 1) {
      const currentX = 3 * (1 - u) ** 2 * u * p1x + 3 * (1 - u) * u ** 2 * p2x + u ** 3;
      const slope = 3 * (1 - u) ** 2 * p1x + 6 * (1 - u) * u * (p2x - p1x) + 3 * u ** 2 * (1 - p2x);
      if (Math.abs(slope) < 1e-6) break;
      u = clamp(u - (currentX - t) / slope);
    }
    return 3 * (1 - u) ** 2 * u * p1y + 3 * (1 - u) * u ** 2 * p2y + u ** 3;
  };
}

const easeArchitectural = cubicBezier(0.16, 1, 0.3, 1);
const easeSettle = cubicBezier(0.215, 0.61, 0.355, 1);

export function renderApprovedLogoFrame(t: number, layers: LogoLayers, reduced = false) {
  const allParts = [layers.axis, layers.dStem, layers.dBowl, layers.tta, layers.esigns];

  if (reduced) {
    layers.master.style.opacity = String(clamp((t - 0.25) / 0.25));
    layers.master.style.transform = 'none';
    allParts.forEach((layer) => { layer.style.opacity = '0'; });
    return;
  }

  const pAxis = clamp((t - 0.3) / 0.75);
  if (pAxis > 0) {
    const e = easeArchitectural(pAxis);
    const top = 5.39 + (49.31 - 5.39) * (1 - e);
    const bottom = 6.77 + (93.23 - 49.31) * (1 - e);
    layers.axis.style.opacity = String(clamp(pAxis / 0.15));
    layers.axis.style.clipPath = `inset(${top.toFixed(2)}% 0 ${bottom.toFixed(2)}% 0)`;
  } else {
    layers.axis.style.opacity = '0';
    layers.axis.style.clipPath = 'inset(49.31% 0 50.69% 0)';
  }

  const pD = clamp((t - 0.8) / 0.75);
  if (pD > 0) {
    const e = easeArchitectural(pD);
    layers.dStem.style.opacity = String(clamp(pD / 0.2));
    layers.dStem.style.clipPath = `inset(0 ${(60.5 * (1 - e)).toFixed(2)}% 0 0)`;
    layers.dStem.style.transform = `translateX(${((1 - e) * 10).toFixed(2)}px)`;
    layers.dBowl.style.opacity = String(clamp(pD / 0.2));
    layers.dBowl.style.clipPath = `inset(0 0 0 ${(39.36 * (1 - e)).toFixed(2)}%)`;
    layers.dBowl.style.transform = `translateX(${(-(1 - e) * 10).toFixed(2)}px)`;
  } else {
    layers.dStem.style.opacity = '0';
    layers.dBowl.style.opacity = '0';
  }

  const pEsigns = clamp((t - 1.25) / 0.85);
  if (pEsigns > 0) {
    const e = easeArchitectural(pEsigns);
    layers.esigns.style.opacity = String(clamp(pEsigns / 0.22));
    layers.esigns.style.transform = `translateX(${(-(1 - e) * 14).toFixed(2)}px)`;
  } else {
    layers.esigns.style.opacity = '0';
    layers.esigns.style.transform = 'translateX(-14px)';
  }

  const pTta = clamp((t - 2.1) / 0.55);
  if (pTta > 0) {
    const e = easeArchitectural(pTta);
    layers.tta.style.opacity = String(clamp(pTta / 0.18));
    layers.tta.style.transform = `translateX(${((1 - e) * 12).toFixed(2)}px)`;
  } else {
    layers.tta.style.opacity = '0';
    layers.tta.style.transform = 'translateX(12px)';
  }

  const pSettle = clamp((t - 2.65) / 0.4);
  layers.master.style.opacity = String(easeSettle(pSettle));
  if (pSettle > 0) {
    const fade = 1 - easeSettle(pSettle);
    allParts.forEach((layer) => { layer.style.opacity = String(fade); });
  }
}
