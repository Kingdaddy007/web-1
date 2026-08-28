type RhythmMaterialOptions = {
  reducedMotion: boolean;
};

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

export class RhythmMaterialCanvas {
  private context: CanvasRenderingContext2D;
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private animationFrame = 0;
  private visible = true;
  private progress = 0;
  private lastDraw = 0;
  private readonly reducedMotion: boolean;

  constructor(private canvas: HTMLCanvasElement, options: RhythmMaterialOptions) {
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('A 2D canvas context is required for the rhythm material field.');

    this.context = context;
    this.reducedMotion = options.reducedMotion;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible && !this.reducedMotion) this.start();
      else this.stop();
    }, { rootMargin: '18% 0px' });
    this.intersectionObserver.observe(canvas);
    this.resize();
    if (this.reducedMotion) this.draw(0);
    else this.start();
  }

  setProgress(progress: number) {
    this.progress = clamp(progress);
    if (this.reducedMotion) this.draw(0);
  }

  private resize() {
    const width = Math.max(this.canvas.clientWidth, 1);
    const height = Math.max(this.canvas.clientHeight, 1);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
    this.canvas.width = Math.round(width * pixelRatio);
    this.canvas.height = Math.round(height * pixelRatio);
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    this.draw(0);
  }

  private start() {
    if (this.animationFrame) return;
    const loop = (time: number) => {
      if (time - this.lastDraw >= 32) {
        this.draw(time / 1000);
        this.lastDraw = time;
      }
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
    const scroll = this.progress * this.progress * (3 - 2 * this.progress);
    const drift = this.reducedMotion ? 0 : time * 0.055;

    const base = context.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, '#160e0b');
    base.addColorStop(0.46, '#24140f');
    base.addColorStop(1, '#120b09');
    context.fillStyle = base;
    context.fillRect(0, 0, width, height);

    context.save();
    context.globalCompositeOperation = 'screen';
    for (let index = 0; index < 4; index += 1) {
      const phase = drift + index * 1.43;
      const centerX = width * (0.14 + index * 0.235 + Math.sin(phase) * 0.055 + (scroll - 0.5) * 0.05);
      const centerY = height * (0.44 + Math.cos(phase * 0.72) * 0.15);
      const radius = Math.max(width * (0.22 + index * 0.025), height * 0.7);
      const light = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      light.addColorStop(0, `rgba(244, 190, 143, ${0.105 + index * 0.018})`);
      light.addColorStop(0.32, 'rgba(171, 101, 65, .065)');
      light.addColorStop(1, 'rgba(63, 27, 17, 0)');
      context.fillStyle = light;
      context.fillRect(0, 0, width, height);
    }
    context.restore();

    context.save();
    context.globalCompositeOperation = 'screen';
    context.globalAlpha = 0.46;
    for (let index = 0; index < 3; index += 1) {
      const phase = drift * (1 + index * 0.11) + index * 1.8;
      const x = width * (-0.18 + index * 0.42 + Math.sin(phase) * 0.075 + scroll * 0.055);
      const band = context.createLinearGradient(x, 0, x + width * 0.34, height);
      band.addColorStop(0, 'rgba(255, 226, 190, 0)');
      band.addColorStop(0.43, 'rgba(255, 215, 171, .075)');
      band.addColorStop(0.5, 'rgba(255, 234, 204, .18)');
      band.addColorStop(0.57, 'rgba(192, 119, 77, .06)');
      band.addColorStop(1, 'rgba(126, 67, 43, 0)');
      context.fillStyle = band;
      context.fillRect(x - width * 0.16, -height * 0.22, width * 0.56, height * 1.44);
    }
    context.restore();

    const focusX = width * (0.5 + Math.sin(drift * 0.66) * 0.06);
    const focus = context.createRadialGradient(focusX, height * 0.52, 0, focusX, height * 0.52, Math.max(width, height) * 0.62);
    focus.addColorStop(0, `rgba(255, 223, 187, ${0.035 + scroll * 0.035})`);
    focus.addColorStop(0.48, 'rgba(114, 57, 35, .02)');
    focus.addColorStop(1, 'rgba(5, 3, 2, .5)');
    context.fillStyle = focus;
    context.fillRect(0, 0, width, height);
  }

  destroy() {
    this.stop();
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
  }
}
