import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uProgress;
  varying vec2 vUv;

  float wave(vec2 p, float frequency, float speed, float phase) {
    return sin((p.x * .82 + p.y * 1.18) * frequency + uTime * speed + phase);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - .5;
    p.x *= uResolution.x / max(uResolution.y, 1.0);

    vec2 drift = (uPointer - .5) * vec2(.11, -.07);
    p += drift;

    float n = wave(p, 2.2, .045, 0.0) * .5;
    n += wave(p.yx, 3.6, -.032, 1.7) * .3;
    n += sin(length(p + vec2(.34, -.18)) * 5.6 - uTime * .04) * .2;

    float travel = mix(-.72, .38, smoothstep(0.0, 1.0, uProgress));
    float body = exp(-abs(p.x * .64 + p.y * .22 - travel + n * .09) * 2.9);
    float basin = 1.0 - smoothstep(.08, 1.14, length(p * vec2(.62, 1.0)));
    float lensA = 1.0 - smoothstep(.12, .82, length((p - vec2(-.34 + uProgress * .22, .08)) * vec2(.72, 1.32)));
    float lensB = 1.0 - smoothstep(.08, .66, length((p - vec2(.46, -.22 + uProgress * .12)) * vec2(.92, 1.44)));
    float seamA = exp(-abs(p.x + n * .11 - travel * .34) * 6.3);
    float sheen = pow(max(0.0, sin((p.x - p.y * .36 + n * .1) * 4.6 + uTime * .028)), 12.0);
    float quiet = smoothstep(.06, .52, length(p * vec2(.86, 1.0)));
    float light = clamp(basin * .34 + body * .54 + lensA * .2 + lensB * .12 + seamA * .13 + sheen * .11 * quiet, 0.0, 1.0);

    vec3 umber = vec3(.27, .15, .10);
    vec3 clay = vec3(.58, .37, .25);
    vec3 plaster = vec3(.86, .72, .57);
    vec3 glow = vec3(1.0, .82, .55);
    vec3 color = mix(umber, clay, smoothstep(.02, .58, light));
    color = mix(color, plaster, smoothstep(.36, .92, light));
    color += glow * (body * .08 + seamA * .07 + sheen * .08);
    color *= .88 + .12 * (1.0 - smoothstep(.18, 1.16, length(p)));
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export class InquiryMaterialCanvas {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.Camera();
  private material: THREE.ShaderMaterial;
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private raf = 0;
  private visible = false;
  private start = performance.now();
  private pointer = new THREE.Vector2(.5, .5);
  private pointerTarget = new THREE.Vector2(.5, .5);
  private progress = 0;

  constructor(private canvas: HTMLCanvasElement, private reducedMotion: boolean) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uPointer: { value: this.pointer },
        uProgress: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    });
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.render();
    }, { threshold: 0.01 });
    this.intersectionObserver.observe(canvas);
    this.resize();
    canvas.addEventListener('pointermove', this.onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    if (reducedMotion) this.renderer.render(this.scene, this.camera);
  }

  private onPointerMove = (event: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerTarget.set(
      THREE.MathUtils.clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1),
      THREE.MathUtils.clamp(1 - (event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1),
    );
  };

  private onPointerLeave = () => this.pointerTarget.set(.5, .5);

  setProgress(progress: number) {
    this.progress = THREE.MathUtils.clamp(progress, 0, 1);
    this.material.uniforms.uProgress.value = this.progress;
    if (this.reducedMotion) this.renderer.render(this.scene, this.camera);
  }

  private resize() {
    const width = Math.max(this.canvas.clientWidth, 1);
    const height = Math.max(this.canvas.clientHeight, 1);
    this.renderer.setSize(width, height, false);
    this.material.uniforms.uResolution.value.set(width, height);
    this.renderer.render(this.scene, this.camera);
  }

  private render = () => {
    cancelAnimationFrame(this.raf);
    if (!this.visible) return;
    this.pointer.lerp(this.pointerTarget, .045);
    if (!this.reducedMotion) this.material.uniforms.uTime.value = (performance.now() - this.start) / 1000;
    this.material.uniforms.uProgress.value = this.progress;
    this.renderer.render(this.scene, this.camera);
    if (!this.reducedMotion) this.raf = requestAnimationFrame(this.render);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    this.material.dispose();
    this.renderer.dispose();
  }
}
