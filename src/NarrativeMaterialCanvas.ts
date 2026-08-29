import * as THREE from 'three';

type NarrativeMaterialOptions = {
  reducedMotion: boolean;
};

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPhase;
  uniform float uIntensity;

  float hash(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), local.x),
      local.y
    );
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.52;
    mat2 turn = mat2(0.84, 0.54, -0.54, 0.84);
    for (int octave = 0; octave < 5; octave++) {
      value += amplitude * noise(point);
      point = turn * point * 2.03 + 11.7;
      amplitude *= 0.48;
    }
    return value;
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 point = (vUv - 0.5) * aspect;
    float time = uTime * 0.12;
    float scroll = uProgress * 0.62;

    // Two independently drifting noise fields bend the light without making
    // the material read as smoke. Scroll changes the composition; time keeps
    // it breathing after the visitor stops.
    float broadFlow = fbm(point * 1.18 + vec2(time * 0.34 + scroll * 0.26, -time * 0.21));
    float crossFlow = fbm(point.yx * 1.64 + vec2(-time * 0.24, time * 0.18 + scroll * 0.42));
    vec2 refractedPoint = point + vec2(broadFlow - 0.5, crossFlow - 0.5) * vec2(0.21, 0.14);
    float fineFlow = fbm(refractedPoint * 3.0 + vec2(-time * 0.38, time * 0.31));

    // A pair of large moving arcs behaves like daylight refracted through
    // curved glass. Their paths continue autonomously, while scroll only
    // nudges their registration through the page.
    vec2 arcOriginOne = vec2(-0.38 + 0.18 * sin(time * 0.74), -0.18 + 0.1 * cos(time * 0.53));
    float arcRadiusOne = length(refractedPoint - arcOriginOne);
    float arcOne = exp(-pow((arcRadiusOne - 0.48 - 0.04 * sin(time * 0.91 + scroll * 2.1)) * 16.0, 2.0));
    vec2 arcOriginTwo = vec2(0.46 + 0.14 * cos(time * 0.61), 0.2 + 0.09 * sin(time * 0.46));
    float arcRadiusTwo = length(refractedPoint - arcOriginTwo);
    float arcTwo = exp(-pow((arcRadiusTwo - 0.64 - 0.035 * cos(time * 0.77 - scroll * 1.7)) * 13.5, 2.0));

    // One sinuous ribbon crosses the arcs, preventing the field from settling
    // into a repeated vertical-fold pattern.
    float ribbonCoordinate = refractedPoint.x + 0.24 * sin(refractedPoint.y * 3.1 + time * 0.86);
    float ribbonPosition = 0.34 * sin(time * 0.57 + scroll * 1.9);
    float lightRibbon = exp(-pow((ribbonCoordinate - ribbonPosition) * 9.5, 2.0));

    float phaseOne = clamp(uPhase, 0.0, 1.0);
    float phaseTwo = clamp(uPhase - 1.0, 0.0, 1.0);
    vec3 base = mix(vec3(0.18, 0.16, 0.14), vec3(0.19, 0.22, 0.21), phaseOne);
    base = mix(base, vec3(0.25, 0.20, 0.17), phaseTwo);
    vec3 veil = mix(vec3(0.62, 0.48, 0.34), vec3(0.43, 0.50, 0.45), phaseOne);
    veil = mix(veil, vec3(0.64, 0.40, 0.28), phaseTwo);
    vec3 light = mix(vec3(1.0, 0.89, 0.72), vec3(0.88, 0.93, 0.81), phaseOne);
    light = mix(light, vec3(1.0, 0.74, 0.55), phaseTwo);

    vec3 color = mix(base, veil, 0.15 + smoothstep(0.18, 0.88, broadFlow) * 0.35);
    color += light * arcOne * (0.055 + uIntensity * 0.105);
    color += light * arcTwo * (0.035 + fineFlow * 0.065);
    color += light * lightRibbon * (0.035 + uIntensity * 0.075);

    float movingLight = point.x * 0.62 + point.y * 0.2 + (crossFlow - 0.5) * 0.3;
    float lightPosition = mix(-0.74, 0.74, 0.5 + 0.5 * sin(time * 0.68 + scroll * 1.35));
    float architecturalBand = exp(-pow((movingLight - lightPosition) * 10.0, 2.0));
    color += light * architecturalBand * (0.065 + uIntensity * 0.105);

    float vignette = smoothstep(1.05, 0.18, length(point * vec2(0.74, 1.0)));
    color *= mix(0.82, 1.07, vignette);
    color += (hash(gl_FragCoord.xy + floor(uTime * 7.0)) - 0.5) * 0.012;
    color *= mix(0.91, 1.0, uIntensity);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export class NarrativeMaterialCanvas {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private geometry = new THREE.PlaneGeometry(2, 2);
  private uniforms = {
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPhase: { value: 0 },
    uIntensity: { value: 0 },
  };
  private material = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader,
    fragmentShader,
    depthTest: false,
    depthWrite: false,
  });
  private mesh = new THREE.Mesh(this.geometry, this.material);
  private resizeObserver: ResizeObserver;
  private animationFrame = 0;
  private targetProgress = 0;
  private targetPhase = 0;
  private targetIntensity = 0;
  private startedAt = performance.now();
  private readonly reducedMotion: boolean;

  constructor(private canvas: HTMLCanvasElement, options: NarrativeMaterialOptions) {
    this.reducedMotion = options.reducedMotion;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene.add(this.mesh);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    document.addEventListener('visibilitychange', this.handleVisibility);
    this.resize();
    this.renderFrame(this.reducedMotion ? 0.85 : 0);
  }

  setState(progress: number, phase: number, intensity: number) {
    this.targetProgress = clamp(progress);
    this.targetPhase = clamp(phase, 0, 2);
    this.targetIntensity = clamp(intensity);

    if (this.reducedMotion) {
      this.uniforms.uProgress.value = this.targetProgress;
      this.uniforms.uPhase.value = this.targetPhase;
      this.uniforms.uIntensity.value = this.targetIntensity;
      this.renderFrame(0.85);
      return;
    }

    if (this.targetIntensity > 0.015 && !document.hidden) this.start();
    else this.stop();
  }

  private resize() {
    const width = Math.max(this.canvas.clientWidth, 1);
    const height = Math.max(this.canvas.clientHeight, 1);
    this.renderer.setSize(width, height, false);
    this.uniforms.uResolution.value.set(width, height);
    this.renderFrame(this.uniforms.uTime.value);
  }

  private handleVisibility = () => {
    if (document.hidden) this.stop();
    else if (!this.reducedMotion && this.targetIntensity > 0.015) this.start();
  };

  private start() {
    if (this.animationFrame) return;
    const loop = (now: number) => {
      this.uniforms.uProgress.value += (this.targetProgress - this.uniforms.uProgress.value) * 0.07;
      this.uniforms.uPhase.value += (this.targetPhase - this.uniforms.uPhase.value) * 0.045;
      this.uniforms.uIntensity.value += (this.targetIntensity - this.uniforms.uIntensity.value) * 0.08;
      this.renderFrame((now - this.startedAt) / 1000);
      this.animationFrame = requestAnimationFrame(loop);
    };
    this.animationFrame = requestAnimationFrame(loop);
  }

  private stop() {
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
  }

  private renderFrame(time: number) {
    this.uniforms.uTime.value = time;
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.stop();
    document.removeEventListener('visibilitychange', this.handleVisibility);
    this.resizeObserver.disconnect();
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
