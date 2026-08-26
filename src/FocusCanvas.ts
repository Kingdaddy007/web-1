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
  uniform float uFocus;
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

  vec3 opticalBlur(vec2 uv, float radius) {
    vec2 aspect = vec2(1.0, uResolution.x / max(uResolution.y, 1.0));
    vec2 r = vec2(radius) / aspect;
    vec3 color = texture2D(uImage, uv).rgb * 2.0;
    color += texture2D(uImage, uv + vec2( 1.0,  0.0) * r).rgb;
    color += texture2D(uImage, uv + vec2(-1.0,  0.0) * r).rgb;
    color += texture2D(uImage, uv + vec2( 0.0,  1.0) * r).rgb;
    color += texture2D(uImage, uv + vec2( 0.0, -1.0) * r).rgb;
    color += texture2D(uImage, uv + vec2( .72,  .72) * r).rgb;
    color += texture2D(uImage, uv + vec2(-.72,  .72) * r).rgb;
    color += texture2D(uImage, uv + vec2( .72, -.72) * r).rgb;
    color += texture2D(uImage, uv + vec2(-.72, -.72) * r).rgb;
    return color / 10.0;
  }

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float p = clamp(uFocus, 0.0, 1.0);
    float eased = p * p * (3.0 - 2.0 * p);
    float defocus = 1.0 - eased;
    float scale = mix(1.075, 1.0, eased);
    vec2 settledUv = (vUv - 0.5) / scale + 0.5;
    settledUv.y += defocus * 0.012;
    vec2 imageUv = coverUv(settledUv, uResolution, uImageResolution);

    float blurRadius = defocus * defocus * 0.037;
    float chroma = defocus * defocus * 0.0032;
    vec3 room = opticalBlur(imageUv, blurRadius);
    room.r = opticalBlur(imageUv + vec2(chroma, 0.0), blurRadius).r;
    room.b = opticalBlur(imageUv - vec2(chroma, 0.0), blurRadius).b;

    float luma = dot(room, vec3(0.2126, 0.7152, 0.0722));
    room = mix(vec3(luma), room, mix(0.38, 1.0, eased));
    room *= mix(0.52, 1.0, eased);

    float field = smoothstep(0.0, 0.24, p);
    vec3 color = mix(vec3(0.018, 0.017, 0.015), room, field);
    color += (noise(gl_FragCoord.xy) - 0.5) * defocus * 0.018;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export class FocusCanvas {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.Camera();
  private material: THREE.ShaderMaterial;
  private texture: THREE.Texture;
  private resizeObserver: ResizeObserver;
  private raf = 0;
  private dirty = true;

  constructor(private canvas: HTMLCanvasElement, imageUrl: string) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
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
        uFocus: { value: 0 },
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

  setFocus(progress: number) {
    this.material.uniforms.uFocus.value = progress;
    this.dirty = true;
  }

  private resize() {
    const { clientWidth: width, clientHeight: height } = this.canvas;
    this.renderer.setPixelRatio(width < 760 ? 1 : Math.min(window.devicePixelRatio, 1.6));
    this.renderer.setSize(width, height, false);
    this.material.uniforms.uResolution.value.set(width, height);
    this.material.uniforms.uVerticalFocus.value = getHeroVerticalFocus(width / Math.max(height, 1));
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
