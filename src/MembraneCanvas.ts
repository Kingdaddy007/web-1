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
    float opened = p * p * (3.0 - 2.0 * p);
    float startGate = smoothstep(0.015, 0.08, p);
    vec2 uv = vUv;

    float vertical = abs(uv.y - 0.5) * 2.0;
    float sculpt = pow(vertical, 1.7) * (0.018 * (1.0 - p)) * startGate;
    float distanceFromAxis = abs(uv.x - uAxis);
    float sideReach = uv.x < uAxis ? max(uAxis, 0.001) : max(1.0 - uAxis, 0.001);
    float normalizedDistance = distanceFromAxis / sideReach;
    float signedFront = opened - normalizedDistance + sculpt;
    float reveal = smoothstep(-0.018, 0.018, signedFront) * startGate;

    float edge = exp(-pow(signedFront / 0.022, 2.0));
    float direction = sign(uv.x - uAxis);
    float refraction = edge * (1.0 - p) * 0.012;
    vec2 warped = uv;
    warped.x += direction * refraction;
    warped.y += (1.0 - opened) * 0.032;

    vec2 imageUv = coverUv(warped, uResolution, uImageResolution);
    float channelShift = edge * (1.0 - p) * 0.0015;
    vec3 room;
    room.r = texture2D(uImage, imageUv + vec2(channelShift, 0.0)).r;
    room.g = texture2D(uImage, imageUv).g;
    room.b = texture2D(uImage, imageUv - vec2(channelShift, 0.0)).b;

    vec3 blackSurface = vec3(0.018, 0.017, 0.015);
    float seamGlow = edge * (1.0 - smoothstep(0.9, 1.0, p)) * 0.52 * startGate;
    vec3 glow = vec3(1.0, 0.76, 0.43) * seamGlow;
    vec3 color = mix(blackSurface, room, reveal) + glow;
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
