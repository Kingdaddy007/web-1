type MaterialCanvasOptions = {
  reducedMotion: boolean;
};

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

export class LivingMaterialCanvas {
  private context: CanvasRenderingContext2D;
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private animationFrame = 0;
  private visible = true;
  private progress = 0;
  private pointerX = 0.5;
  private pointerY = 0.5;
  private noiseTile: HTMLCanvasElement;
  private readonly reducedMotion: boolean;

  constructor(private canvas: HTMLCanvasElement, options: MaterialCanvasOptions) {
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('A 2D canvas context is required for the living material field.');

    this.context = context;
    this.reducedMotion = options.reducedMotion;
    this.noiseTile = this.createNoiseTile();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);

    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible && !this.reducedMotion) this.start();
      else this.stop();
    });
    this.intersectionObserver.observe(canvas);

    canvas.addEventListener('pointermove', this.handlePointer, { passive: true });
    canvas.addEventListener('pointerleave', this.resetPointer, { passive: true });
    this.resize();

    if (this.reducedMotion) this.draw(0);
    else this.start();
  }

  setProgress(progress: number) {
    this.progress = clamp(progress);
    if (this.reducedMotion) this.draw(0);
  }

  private createNoiseTile() {
    const tile = document.createElement('canvas');
    tile.width = 128;
    tile.height = 128;
    const context = tile.getContext('2d');
    if (!context) return tile;

    const image = context.createImageData(tile.width, tile.height);
    for (let index = 0; index < image.data.length; index += 4) {
      const value = 118 + Math.floor(Math.random() * 34);
      image.data[index] = value;
      image.data[index + 1] = value - 6;
      image.data[index + 2] = value - 12;
      image.data[index + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    return tile;
  }

  private handlePointer = (event: PointerEvent) => {
    const bounds = this.canvas.getBoundingClientRect();
    this.pointerX = clamp((event.clientX - bounds.left) / Math.max(bounds.width, 1));
    this.pointerY = clamp((event.clientY - bounds.top) / Math.max(bounds.height, 1));
  };

  private resetPointer = () => {
    this.pointerX = 0.5;
    this.pointerY = 0.5;
  };

  private resize() {
    const width = Math.max(this.canvas.clientWidth, 1);
    const height = Math.max(this.canvas.clientHeight, 1);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.round(width * pixelRatio);
    this.canvas.height = Math.round(height * pixelRatio);
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    this.draw(0);
  }

  private start() {
    if (this.animationFrame) return;
    const loop = (time: number) => {
      this.draw(time / 1000);
      this.animationFrame = requestAnimationFrame(loop);
    };
    this.animationFrame = requestAnimationFrame(loop);
  }

  private stop() {
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
  }

  private draw(time: number) {
    const width = Math.max(this.canvas.clientWidth, 1);
    const height = Math.max(this.canvas.clientHeight, 1);
    const context = this.context;
    const travel = this.reducedMotion ? 0 : Math.sin(time * 0.17) * 0.5 + 0.5;
    const scrollLight = this.progress * 0.42;
    const interludeIn = smooth((this.progress - 0.015) / 0.09);
    const interludeOut = smooth((this.progress - 0.22) / 0.1);
    const interludePresence = interludeIn * (1 - interludeOut);
    const grazingTravel = smooth((this.progress - 0.035) / 0.2);

    context.clearRect(0, 0, width, height);

    const base = context.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, '#d7c2aa');
    base.addColorStop(0.36, '#c9aa8d');
    base.addColorStop(0.72, '#b98f70');
    base.addColorStop(1, '#d5b99c');
    context.fillStyle = base;
    context.fillRect(0, 0, width, height);

    const glowX = width * (0.2 + travel * 0.55 + (this.pointerX - 0.5) * 0.04);
    const glowY = height * (0.18 + scrollLight + (this.pointerY - 0.5) * 0.03);
    const glow = context.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * 0.72);
    glow.addColorStop(0, 'rgba(255, 243, 220, .58)');
    glow.addColorStop(0.34, 'rgba(244, 217, 185, .24)');
    glow.addColorStop(1, 'rgba(110, 69, 43, 0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    context.save();
    context.globalCompositeOperation = 'screen';
    context.globalAlpha = 0.58 * interludePresence;
    const grazingX = width * (-0.08 + grazingTravel * 1.16 + (this.pointerX - 0.5) * 0.025);
    const grazing = context.createRadialGradient(grazingX, height * 0.52, 0, grazingX, height * 0.52, Math.max(width * 0.18, 150));
    grazing.addColorStop(0, 'rgba(255, 250, 235, .72)');
    grazing.addColorStop(0.22, 'rgba(255, 236, 205, .34)');
    grazing.addColorStop(0.62, 'rgba(240, 204, 166, .08)');
    grazing.addColorStop(1, 'rgba(255, 240, 214, 0)');
    context.fillStyle = grazing;
    context.fillRect(0, 0, width, height);
    context.restore();

    context.save();
    context.globalCompositeOperation = 'soft-light';
    context.globalAlpha = 0.22 + interludePresence * 0.16;
    const lacquer = context.createLinearGradient(0, 0, 0, height);
    lacquer.addColorStop(0, 'rgba(255, 250, 237, .56)');
    lacquer.addColorStop(0.11, 'rgba(255, 242, 220, .12)');
    lacquer.addColorStop(0.38, 'rgba(89, 54, 35, .06)');
    lacquer.addColorStop(0.72, 'rgba(255, 235, 207, .08)');
    lacquer.addColorStop(1, 'rgba(73, 43, 27, .18)');
    context.fillStyle = lacquer;
    context.fillRect(0, 0, width, height);
    context.restore();

    context.save();
    context.translate(width * (-0.22 + travel * 0.16), -height * 0.3);
    context.rotate(-0.18);
    const ribbon = context.createLinearGradient(0, 0, width * 0.44, 0);
    ribbon.addColorStop(0, 'rgba(255, 250, 237, 0)');
    ribbon.addColorStop(0.5, 'rgba(255, 241, 215, .22)');
    ribbon.addColorStop(1, 'rgba(255, 250, 237, 0)');
    context.fillStyle = ribbon;
    context.fillRect(0, 0, width * 0.48, height * 1.7);
    context.restore();

    context.save();
    context.globalAlpha = 0.1 + interludePresence * 0.05;
    context.strokeStyle = 'rgba(255, 244, 225, .72)';
    context.lineWidth = 1;
    for (let row = 1; row <= 2; row += 1) {
      const y = height * (0.08 + row * 0.055);
      const reflection = context.createLinearGradient(0, y, width, y);
      reflection.addColorStop(0, 'rgba(255, 245, 228, 0)');
      reflection.addColorStop(0.18, 'rgba(255, 245, 228, .24)');
      reflection.addColorStop(0.5, 'rgba(255, 249, 238, .62)');
      reflection.addColorStop(0.82, 'rgba(255, 245, 228, .24)');
      reflection.addColorStop(1, 'rgba(255, 245, 228, 0)');
      context.strokeStyle = reflection;
      context.beginPath();
      context.moveTo(width * 0.08, y);
      context.lineTo(width * 0.92, y);
      context.stroke();
    }
    context.restore();

    context.save();
    context.globalAlpha = 0.055;
    context.strokeStyle = '#6d4936';
    context.lineWidth = 1;
    const spacing = Math.max(width / 6, 180);
    const offset = (this.progress * spacing * 0.75) % spacing;
    for (let x = -spacing + offset; x < width + spacing; x += spacing) {
      context.beginPath();
      context.moveTo(Math.round(x) + 0.5, 0);
      context.lineTo(Math.round(x) + 0.5, height);
      context.stroke();
    }
    context.restore();

    const pattern = context.createPattern(this.noiseTile, 'repeat');
    if (pattern) {
      context.save();
      context.globalAlpha = 0.035;
      context.globalCompositeOperation = 'soft-light';
      context.fillStyle = pattern;
      context.fillRect(0, 0, width, height);
      context.restore();
    }

    const vignette = context.createRadialGradient(width * 0.5, height * 0.45, height * 0.12, width * 0.5, height * 0.5, Math.max(width, height) * 0.76);
    vignette.addColorStop(0, 'rgba(67, 40, 24, 0)');
    vignette.addColorStop(1, 'rgba(62, 37, 23, .22)');
    context.fillStyle = vignette;
    context.fillRect(0, 0, width, height);
  }

  destroy() {
    this.stop();
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.canvas.removeEventListener('pointermove', this.handlePointer);
    this.canvas.removeEventListener('pointerleave', this.resetPointer);
  }
}
