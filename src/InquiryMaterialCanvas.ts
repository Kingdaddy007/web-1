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
  varying vec2 vUv;

  float wave(vec2 p, float frequency, float speed, float phase) {
    return sin((p.x * .82 + p.y * 1.18) * frequency + uTime * speed + phase);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - .5;
    p.x *= uResolution.x / max(uResolution.y, 1.0);

    float n = wave(p, 3.4, .075, 0.0) * .5;
    n += wave(p.yx, 5.2, -.052, 1.7) * .28;
    n += sin(length(p + vec2(.28, -.12)) * 9.0 - uTime * .065) * .22;

    float basin = 1.0 - smoothstep(.06, .92, length(p * vec2(.72, 1.0)));
    float seam = exp(-abs(p.x + n * .035) * 11.0) * .12;
    float light = basin * (.48 + n * .09) + seam;

    vec3 clay = vec3(.57, .39, .27);
    vec3 plaster = vec3(.86, .76, .64);
    vec3 glow = vec3(.97, .84, .66);
    vec3 color = mix(clay, plaster, light);
    color += glow * seam * .22;
    color *= .94 + .06 * (1.0 - smoothstep(.15, 1.05, length(p)));
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
    if (reducedMotion) this.renderer.render(this.scene, this.camera);
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
    if (!this.reducedMotion) this.material.uniforms.uTime.value = (performance.now() - this.start) / 1000;
    this.renderer.render(this.scene, this.camera);
    if (!this.reducedMotion) this.raf = requestAnimationFrame(this.render);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.material.dispose();
    this.renderer.dispose();
  }
}
