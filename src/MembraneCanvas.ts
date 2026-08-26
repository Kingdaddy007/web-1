import * as THREE from 'three';
import { getHeroVerticalFocus } from './framing';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uImage;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uProgress;
  uniform float uCommissioning;
  uniform float uAxis;
  uniform float uVerticalFocus;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 screenSize, vec2 imageSize) {
    float screenRatio = screenSize.x / screenSize.y;
    float imageRatio = imageSize.x / imageSize.y;
    vec2 scale = vec2(1.0);
    if (screenRatio > imageRatio) scale.y = imageRatio / screenRatio;
    else scale.x = screenRatio / imageRatio;
    vec2 covered = (uv - 0.5) * scale + 0.5;
    if (scale.y < 1.0) {
      covered.y = uv.y * scale.y + (1.0 - scale.y) * (1.0 - uVerticalFocus);
    }
    return covered;
  }

  void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    float commissioning = clamp(uCommissioning, 0.0, 1.0);
    float opened = p * p * (3.0 - 2.0 * p);
    float startGate = smoothstep(0.015, 0.08, p);
    vec2 uv = vUv;

    float vertical = abs(uv.y - 0.5) * 2.0;
    float sculpt = pow(vertical, 1.55) * (0.11 * (1.0 - p)) * startGate;
    float radius = mix(0.003, 0.82, opened);
    float distanceFromAxis = abs(uv.x - uAxis);
    float signedFront = radius - distanceFromAxis + sculpt;
    float reveal = smoothstep(-0.018, 0.018, signedFront) * startGate;

    float edge = exp(-pow(signedFront / 0.026, 2.0));
    float direction = sign(uv.x - uAxis);
    float refraction = edge * (1.0 - p) * 0.047;
    vec2 warped = uv;
    warped.x += direction * refraction;
    warped.y += sin((uv.y * 3.1415926) + p * 1.4) * edge * 0.012 * (1.0 - p);
    warped.x = uAxis + (warped.x - uAxis) * mix(0.82, 1.0, opened);

    vec2 imageUv = coverUv(warped, uResolution, uImageResolution);
    float channelShift = edge * (1.0 - p) * 0.004;
    vec3 room;
    room.r = texture2D(uImage, imageUv + vec2(channelShift, 0.0)).r;
    room.g = texture2D(uImage, imageUv).g;
    room.b = texture2D(uImage, imageUv - vec2(channelShift, 0.0)).b;

    float exposure = mix(0.72, 1.0, smoothstep(0.18, 0.82, p));
    room *= exposure;
    float opticalGrade = 1.0 - smoothstep(0.62, 0.96, p);
    room = mix(room, room * vec3(1.035, 0.995, 0.93), 0.18 * opticalGrade);

    vec3 blackSurface = vec3(0.018, 0.017, 0.015);
    float seamGlow = edge * (1.0 - p) * 0.46 * startGate;
    vec3 glow = vec3(1.0, 0.79, 0.48) * seamGlow;
    vec3 color = mix(blackSurface, room, reveal) + glow;

    float axisDistance = abs(uv.x - uAxis);
    float commissioningReach = mix(0.0, 0.78, commissioning * commissioning * (3.0 - 2.0 * commissioning));
    float commissioningActive = smoothstep(0.015, 0.08, commissioning);
    float commissioned = (1.0 - smoothstep(commissioningReach - 0.035, commissioningReach + 0.018, axisDistance)) * commissioningActive;
    float commissioningBand = exp(-pow((axisDistance - commissioningReach) / 0.018, 2.0)) * (1.0 - smoothstep(0.92, 1.0, commissioning)) * commissioningActive;
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    vec3 waitingRoom = mix(vec3(luma), color, 0.74) * vec3(0.86, 0.88, 0.9);
    color = mix(waitingRoom, color, commissioned);
    color += vec3(1.0, 0.71, 0.36) * commissioningBand * 0.32;

    float vignette = 1.0 - 0.20 * smoothstep(0.38, 0.88, distance(vUv, vec2(0.5)));
    color *= mix(1.0, vignette, opticalGrade);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export class MembraneCanvas {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.Camera();
  private material: THREE.ShaderMaterial;
  private texture: THREE.Texture;
  private resizeObserver: ResizeObserver;
  private raf = 0;
  private dirty = true;

  constructor(private canvas: HTMLCanvasElement, imageUrl: string) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.texture = new THREE.TextureLoader().load(imageUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const source = texture.image as HTMLImageElement;
      this.material.uniforms.uImageResolution.value.set(source.naturalWidth, source.naturalHeight);
      this.dirty = true;
    });
    this.texture.colorSpace = THREE.SRGBColorSpace;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uImage: { value: this.texture },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uImageResolution: { value: new THREE.Vector2(1586, 992) },
        uProgress: { value: 0 },
        uCommissioning: { value: 0 },
        uAxis: { value: 0.44 },
        uVerticalFocus: { value: 0.5 },
      },
      depthTest: false,
      depthWrite: false,
    });
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
    this.renderLoop();
  }

  setProgress(progress: number) {
    this.material.uniforms.uProgress.value = progress;
    this.dirty = true;
  }

  setCommissioning(progress: number) {
    this.material.uniforms.uCommissioning.value = progress;
    this.dirty = true;
  }

  private resize() {
    const { clientWidth: width, clientHeight: height } = this.canvas;
    this.renderer.setSize(width, height, false);
    this.material.uniforms.uResolution.value.set(width, height);
    const logoWidth = Math.min(800, width * 0.82);
    const axisOffset = logoWidth * (855 / 2172 - 0.5);
    this.material.uniforms.uAxis.value = 0.5 + axisOffset / Math.max(width, 1);
    const aspect = width / Math.max(height, 1);
    this.material.uniforms.uVerticalFocus.value = getHeroVerticalFocus(aspect);
    this.dirty = true;
  }

  private renderLoop = () => {
    if (this.dirty) {
      this.renderer.render(this.scene, this.camera);
      this.dirty = false;
    }
    this.raf = requestAnimationFrame(this.renderLoop);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.texture.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
