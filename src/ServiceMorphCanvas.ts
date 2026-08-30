type Vec3 = readonly [number, number, number];
type Segment = readonly [Vec3, Vec3];
type ProjectionState = {
  rotationX: number;
  rotationY: number;
  scale: number;
  centerX: number;
  centerY: number;
};

const TAU = Math.PI * 2;
const POINT_COUNT = 720;
const SERVICE_COLORS = [
  [249, 222, 188],
  [219, 230, 211],
  [201, 224, 221],
  [249, 207, 165],
  [235, 181, 139],
] as const;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const smooth = (value: number) => {
  const x = clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
};
const hash = (value: number) => {
  const x = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const addLine = (segments: Segment[], from: Vec3, to: Vec3) => segments.push([from, to]);

const addPolyline = (segments: Segment[], points: Vec3[]) => {
  for (let index = 1; index < points.length; index += 1) {
    addLine(segments, points[index - 1], points[index]);
  }
};

const addArc = (
  segments: Segment[],
  center: Vec3,
  radiusX: number,
  radiusY: number,
  start = 0,
  end = TAU,
  steps = 28,
) => {
  const points: Vec3[] = [];
  for (let index = 0; index <= steps; index += 1) {
    const angle = mix(start, end, index / steps);
    points.push([
      center[0] + Math.cos(angle) * radiusX,
      center[1] + Math.sin(angle) * radiusY,
      center[2],
    ]);
  }
  addPolyline(segments, points);
};

const addBox = (segments: Segment[], center: Vec3, width: number, height: number, depth: number) => {
  const x = width / 2;
  const y = height / 2;
  const z = depth / 2;
  const corners: Vec3[] = [
    [center[0] - x, center[1] - y, center[2] - z],
    [center[0] + x, center[1] - y, center[2] - z],
    [center[0] + x, center[1] + y, center[2] - z],
    [center[0] - x, center[1] + y, center[2] - z],
    [center[0] - x, center[1] - y, center[2] + z],
    [center[0] + x, center[1] - y, center[2] + z],
    [center[0] + x, center[1] + y, center[2] + z],
    [center[0] - x, center[1] + y, center[2] + z],
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ] as const;
  edges.forEach(([from, to]) => addLine(segments, corners[from], corners[to]));
};

const roomEnvelope = () => {
  const segments: Segment[] = [];
  addBox(segments, [0, 0, 0], 2.65, 1.75, 1.45);
  addBox(segments, [-.28, -.55, .18], 1.48, .42, .64);
  addBox(segments, [-.28, -.27, .45], 1.48, .22, .16);
  addArc(segments, [.63, -.62, -.38], .48, .2, 0, TAU, 22);
  addLine(segments, [-1.32, -.875, -.72], [1.32, -.875, .72]);
  addLine(segments, [-1.32, -.875, .72], [1.32, -.875, -.72]);
  return segments;
};

const consultationTable = () => {
  const segments: Segment[] = [];
  // A shared table and plan make the service read as a conversation, not an instrument panel.
  addBox(segments, [0, -.46, 0], 1.62, .14, .78);
  const tableLegs: Vec3[] = [[-.66, -.84, -.29], [.66, -.84, -.29], [-.66, -.84, .29], [.66, -.84, .29]];
  tableLegs.forEach((point) => {
    addLine(segments, point, [point[0], -.52, point[2]]);
  });
  addPolyline(segments, [
    [-.5, -.37, -.25], [.5, -.37, -.25], [.5, -.37, .25], [-.5, -.37, .25], [-.5, -.37, -.25],
  ]);
  addPolyline(segments, [
    [-.38, -.365, -.15], [-.08, -.365, -.15], [-.08, -.365, .05], [.28, -.365, .05],
    [.28, -.365, .18], [.44, -.365, .18],
  ]);

  // Two people face the same decision surface.
  [-.93, .93].forEach((x, index) => {
    const z = index === 0 ? -.06 : .06;
    addArc(segments, [x, .36, z], .17, .19, 0, TAU, 18);
    addArc(segments, [x, -.02, z], .34, .2, 0, Math.PI, 18);
    addLine(segments, [x - .22, -.02, z], [x - .17, -.48, z]);
    addLine(segments, [x + .22, -.02, z], [x + .17, -.48, z]);
  });
  addLine(segments, [-.78, -.02, -.02], [-.22, -.34, -.06]);
  addLine(segments, [.78, -.02, .02], [.22, -.34, .06]);
  addArc(segments, [0, -.35, 0], .11, .11, 0, TAU, 14);
  return segments;
};

const conceptWorkbench = () => {
  const segments: Segment[] = [];
  // The horizontal drawing carries the plan; one corner lifts into the future room.
  addBox(segments, [-.12, -.42, 0], 2.42, .12, 1.36);
  addPolyline(segments, [
    [-1.08, -.35, -.56], [.82, -.35, -.56], [.82, -.35, .5], [.22, -.35, .5],
    [.22, -.35, .15], [-.36, -.35, .15], [-.36, -.35, .5], [-1.08, -.35, .5], [-1.08, -.35, -.56],
  ]);
  addLine(segments, [-.36, -.35, -.56], [-.36, -.35, .15]);
  addLine(segments, [.22, -.35, -.56], [.22, -.35, .15]);
  addLine(segments, [.82, -.35, -.04], [.22, -.35, -.04]);
  addLine(segments, [.22, -.35, .15], [.22, .62, .15]);
  addLine(segments, [.22, .62, .15], [.82, .62, .5]);
  addLine(segments, [.82, .62, .5], [.82, -.35, .5]);
  addLine(segments, [.22, .62, .15], [.22, .62, -.38]);
  addLine(segments, [.22, .62, -.38], [.82, .62, -.04]);
  addLine(segments, [.82, .62, -.04], [.82, -.35, -.04]);

  // Material samples sit beside the drawing rather than becoming abstract orbit controls.
  const swatches: Array<[Vec3, number]> = [
    [[-1.04, .36, .08], .2], [[-.57, .5, .18], .16], [[-.85, .72, .3], .13], [[-.36, .25, .36], .12],
  ];
  swatches.forEach(([center, radius]) => addArc(segments, center, radius, radius, 0, TAU, 18));
  addLine(segments, [-1.18, .08, .06], [-.18, .08, .38]);
  return segments;
};

const stylingStillLife = () => {
  const segments: Segment[] = [];
  // A plinth, sculptural vessel, lamp and textile folds form a recognisable styling vignette.
  addBox(segments, [0, -.67, 0], 1.86, .32, .96);
  addPolyline(segments, [
    [-.23, -.5, .12], [-.32, -.12, .12], [-.19, .18, .12], [-.28, .56, .12],
    [-.12, .72, .12], [.12, .72, .12], [.28, .56, .12], [.19, .18, .12],
    [.32, -.12, .12], [.23, -.5, .12], [-.23, -.5, .12],
  ]);
  addArc(segments, [0, .72, .12], .12, .045, 0, TAU, 14);
  addPolyline(segments, [[0, .72, .12], [.24, 1.02, .08], [.46, 1.18, .02]]);
  addPolyline(segments, [[0, .72, .12], [-.2, 1, .18], [-.42, 1.12, .24]]);

  addLine(segments, [.68, -.48, -.14], [.68, .46, -.14]);
  addPolyline(segments, [[.46, .46, -.14], [.9, .46, -.14], [.78, .72, -.14], [.58, .72, -.14], [.46, .46, -.14]]);
  addArc(segments, [.68, -.5, -.14], .28, .1, 0, TAU, 16);

  for (let fold = 0; fold < 5; fold += 1) {
    const x = -.98 + fold * .16;
    const points: Vec3[] = [];
    for (let step = 0; step <= 12; step += 1) {
      const y = mix(-.46, 1.02, step / 12);
      points.push([x + Math.sin(step * .75 + fold) * .055, y, -.34]);
    }
    addPolyline(segments, points);
  }
  addArc(segments, [-.58, -.48, .2], .19, .11, 0, TAU, 16);
  addArc(segments, [-.82, -.47, .1], .12, .075, 0, TAU, 14);
  return segments;
};

const renovationAperture = () => {
  const segments: Segment[] = [];
  // Existing walls visibly part to reveal a new, daylit opening.
  addPolyline(segments, [[-1.38, -.82, .02], [-.52, -.82, .02], [-.52, .76, .02], [-1.38, .76, .02], [-1.38, -.82, .02]]);
  addPolyline(segments, [[.52, -.82, .02], [1.38, -.82, .02], [1.38, .76, .02], [.52, .76, .02], [.52, -.82, .02]]);
  addPolyline(segments, [[-1.38, .76, .02], [1.38, .76, .02], [1.18, 1.02, -.18], [-1.18, 1.02, -.18], [-1.38, .76, .02]]);
  addPolyline(segments, [[-.52, -.82, .02], [.52, -.82, .02], [.9, -.98, -.72], [-.9, -.98, -.72], [-.52, -.82, .02]]);
  addPolyline(segments, [[-.52, -.82, .02], [-.52, .76, .02], [-.32, .66, .42], [-.32, -.66, .42], [-.52, -.82, .02]]);
  addPolyline(segments, [[.52, -.82, .02], [.52, .76, .02], [.32, .66, .42], [.32, -.66, .42], [.52, -.82, .02]]);
  addLine(segments, [-1.22, -.56, .04], [-.68, -.56, .04]);
  addLine(segments, [-1.22, -.16, .04], [-.68, -.16, .04]);
  addLine(segments, [.68, -.56, .04], [1.22, -.56, .04]);
  addLine(segments, [.68, -.16, .04], [1.22, -.16, .04]);
  addLine(segments, [-.34, -.66, .42], [0, .58, .68]);
  addLine(segments, [.34, -.66, .42], [0, .58, .68]);
  addArc(segments, [0, .58, .68], .09, .09, 0, TAU, 12);
  return segments;
};

const sampleShape = (segments: Segment[], seed: number) => {
  const lengths = segments.map(([from, to]) => Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const result = new Float32Array(POINT_COUNT * 3);
  let segmentIndex = 0;
  let segmentStart = 0;

  for (let index = 0; index < POINT_COUNT; index += 1) {
    const distance = ((index + .5) / POINT_COUNT) * total;
    while (segmentIndex < segments.length - 1 && distance > segmentStart + lengths[segmentIndex]) {
      segmentStart += lengths[segmentIndex];
      segmentIndex += 1;
    }
    const [from, to] = segments[segmentIndex];
    const progress = clamp((distance - segmentStart) / Math.max(lengths[segmentIndex], .0001), 0, 1);
    const jitter = .018;
    result[index * 3] = mix(from[0], to[0], progress) + (hash(index * 3 + seed) - .5) * jitter;
    result[index * 3 + 1] = mix(from[1], to[1], progress) + (hash(index * 3 + seed + 1) - .5) * jitter;
    result[index * 3 + 2] = mix(from[2], to[2], progress) + (hash(index * 3 + seed + 2) - .5) * jitter;
  }
  return result;
};

const SHAPES = [roomEnvelope(), consultationTable(), conceptWorkbench(), stylingStillLife(), renovationAperture()]
  .map((segments, index) => sampleShape(segments, 17 + index * 41));

export class ServiceMorphCanvas {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly reducedMotion: boolean;
  private readonly projectedX = new Float32Array(POINT_COUNT);
  private readonly projectedY = new Float32Array(POINT_COUNT);
  private readonly projectedDepth = new Float32Array(POINT_COUNT);
  private readonly resizeObserver: ResizeObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private readonly mobileQuery = window.matchMedia('(max-width: 960px)');
  private animationFrame = 0;
  private width = 0;
  private height = 0;
  private visible = false;
  private destroyed = false;
  private currentService = 0;
  private targetService = 0;
  private previousTime = 0;

  constructor(canvas: HTMLCanvasElement, reducedMotion = false) {
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('Canvas 2D is unavailable');
    this.canvas = canvas;
    this.context = context;
    this.reducedMotion = reducedMotion;
    this.resizeObserver = new ResizeObserver(this.resize);
    this.intersectionObserver = new IntersectionObserver(this.onIntersection, { threshold: .01 });
    this.resizeObserver.observe(canvas);
    this.intersectionObserver.observe(canvas);
    this.mobileQuery.addEventListener('change', this.onModeChange);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.resize();
  }

  setService(value: number) {
    this.targetService = clamp(value, 0, SHAPES.length - 1);
    if (this.reducedMotion || this.mobileQuery.matches) {
      this.currentService = this.mobileQuery.matches ? 2 : Math.round(this.targetService);
      this.draw(0);
      return;
    }
    this.start();
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.mobileQuery.removeEventListener('change', this.onModeChange);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.context.clearRect(0, 0, this.width, this.height);
  }

  private readonly resize = () => {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, this.mobileQuery.matches ? 1 : 1.25);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
    this.canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    this.draw(performance.now());
  };

  private readonly onIntersection = ([entry]: IntersectionObserverEntry[]) => {
    this.visible = Boolean(entry?.isIntersecting);
    if (this.visible) this.start();
    else {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }
  };

  private readonly onModeChange = () => {
    this.currentService = this.mobileQuery.matches ? 2 : this.targetService;
    this.resize();
    this.start();
  };

  private readonly onVisibilityChange = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    } else {
      this.start();
    }
  };

  private start() {
    if (this.destroyed || this.animationFrame || !this.visible || document.hidden) return;
    if (this.reducedMotion || this.mobileQuery.matches) {
      this.draw(performance.now());
      return;
    }
    this.previousTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.tick);
  }

  private readonly tick = (time: number) => {
    this.animationFrame = 0;
    if (this.destroyed || !this.visible || document.hidden) return;
    const delta = clamp(time - this.previousTime, 0, 40);
    this.previousTime = time;
    const response = 1 - Math.exp(-delta * .014);
    this.currentService += (this.targetService - this.currentService) * response;
    if (Math.abs(this.targetService - this.currentService) < .0005) this.currentService = this.targetService;
    this.draw(time);
    this.animationFrame = requestAnimationFrame(this.tick);
  };

  private projectPoint(point: Vec3, projection: ProjectionState) {
    const cosY = Math.cos(projection.rotationY);
    const sinY = Math.sin(projection.rotationY);
    const cosX = Math.cos(projection.rotationX);
    const sinX = Math.sin(projection.rotationX);
    const rotatedX = point[0] * cosY - point[2] * sinY;
    const rotatedZ = point[0] * sinY + point[2] * cosY;
    const rotatedY = point[1] * cosX - rotatedZ * sinX;
    const depth = point[1] * sinX + rotatedZ * cosX;
    const perspective = 3.7 / (3.7 + depth);
    return {
      x: projection.centerX + rotatedX * projection.scale * perspective,
      y: projection.centerY - rotatedY * projection.scale * perspective,
      depth: perspective,
    };
  }

  private drawWorldPolygon(
    context: CanvasRenderingContext2D,
    points: Vec3[],
    projection: ProjectionState,
    fill: string | CanvasGradient,
    stroke = 'rgba(247, 225, 197, .18)',
    lineWidth = .8,
  ) {
    const projected = points.map((point) => this.projectPoint(point, projection));
    context.beginPath();
    projected.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.closePath();
    context.fillStyle = fill;
    context.fill();
    context.strokeStyle = stroke;
    context.lineWidth = lineWidth;
    context.stroke();
  }

  private drawWorldEllipse(
    context: CanvasRenderingContext2D,
    center: Vec3,
    radiusX: number,
    radiusY: number,
    projection: ProjectionState,
    fill: string,
    stroke: string,
  ) {
    const points: Vec3[] = [];
    for (let index = 0; index < 44; index += 1) {
      const angle = (index / 44) * TAU;
      points.push([
        center[0] + Math.cos(angle) * radiusX,
        center[1] + Math.sin(angle) * radiusY,
        center[2],
      ]);
    }
    this.drawWorldPolygon(context, points, projection, fill, stroke);
  }

  private drawLightPool(
    context: CanvasRenderingContext2D,
    point: Vec3,
    radius: number,
    projection: ProjectionState,
    inner: string,
  ) {
    const center = this.projectPoint(point, projection);
    const gradient = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius * projection.scale);
    gradient.addColorStop(0, inner);
    gradient.addColorStop(.46, inner.replace(/,\s*[^,]+\)$/, ', .08)'));
    gradient.addColorStop(1, 'rgba(255, 225, 187, 0)');
    context.save();
    context.globalCompositeOperation = 'screen';
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(center.x, center.y, radius * projection.scale, 0, TAU);
    context.fill();
    context.restore();
  }

  private drawResolvedSurface(
    context: CanvasRenderingContext2D,
    serviceIndex: number,
    alpha: number,
    time: number,
    projection: ProjectionState,
  ) {
    if (alpha < .002) return;
    context.save();
    context.globalAlpha = alpha;

    if (serviceIndex === 0) {
      const floorStart = this.projectPoint([-1.3, -.86, -.72], projection);
      const floorEnd = this.projectPoint([1.3, -.86, .72], projection);
      const floor = context.createLinearGradient(floorStart.x, floorStart.y, floorEnd.x, floorEnd.y);
      floor.addColorStop(0, 'rgba(79, 49, 31, .26)');
      floor.addColorStop(.54, 'rgba(181, 126, 79, .18)');
      floor.addColorStop(1, 'rgba(245, 215, 179, .1)');
      this.drawWorldPolygon(context, [
        [-1.3, -.86, -.72], [1.3, -.86, -.72], [1.3, -.86, .72], [-1.3, -.86, .72],
      ], projection, floor, 'rgba(247, 225, 197, .24)');
      this.drawWorldPolygon(context, [
        [-1.3, -.86, .72], [1.3, -.86, .72], [1.3, .86, .72], [-1.3, .86, .72],
      ], projection, 'rgba(177, 124, 85, .07)', 'rgba(247, 225, 197, .12)');
      this.drawWorldPolygon(context, [
        [-1.3, -.86, -.72], [-1.3, -.86, .72], [-1.3, .86, .72], [-1.3, .86, -.72],
      ], projection, 'rgba(112, 76, 52, .08)', 'rgba(247, 225, 197, .1)');
      this.drawWorldPolygon(context, [
        [-1.02, -.35, -.12], [.45, -.35, -.12], [.45, -.35, .48], [-1.02, -.35, .48],
      ], projection, 'rgba(239, 220, 198, .16)', 'rgba(255, 239, 216, .24)');
      this.drawLightPool(context, [0, .48, .05], .5, projection, 'rgba(255, 222, 172, .2)');
    }

    if (serviceIndex === 1) {
      const tableStart = this.projectPoint([-.81, -.37, -.39], projection);
      const tableEnd = this.projectPoint([.81, -.37, .39], projection);
      const table = context.createLinearGradient(tableStart.x, tableStart.y, tableEnd.x, tableEnd.y);
      table.addColorStop(0, 'rgba(75, 99, 82, .18)');
      table.addColorStop(.52, 'rgba(203, 218, 194, .13)');
      table.addColorStop(1, 'rgba(241, 224, 194, .08)');
      this.drawWorldPolygon(context, [
        [-.81, -.37, -.39], [.81, -.37, -.39], [.81, -.37, .39], [-.81, -.37, .39],
      ], projection, table, 'rgba(226, 236, 215, .28)');
      this.drawWorldPolygon(context, [
        [-.5, -.355, -.25], [.5, -.355, -.25], [.5, -.355, .25], [-.5, -.355, .25],
      ], projection, 'rgba(238, 232, 214, .16)', 'rgba(249, 239, 219, .32)');
      this.drawWorldEllipse(context, [-.93, .36, -.06], .17, .19, projection, 'rgba(207, 226, 204, .08)', 'rgba(223, 235, 216, .26)');
      this.drawWorldEllipse(context, [.93, .36, .06], .17, .19, projection, 'rgba(207, 226, 204, .08)', 'rgba(223, 235, 216, .26)');
      const focus = this.projectPoint([0, -.35, 0], projection);
      const target = this.projectPoint([
        Math.cos(time * .00028) * .28,
        -.35,
        Math.sin(time * .00028) * .18,
      ], projection);
      const ray = context.createLinearGradient(focus.x, focus.y, target.x, target.y);
      ray.addColorStop(0, 'rgba(255, 240, 216, .56)');
      ray.addColorStop(1, 'rgba(210, 229, 210, .03)');
      context.strokeStyle = ray;
      context.lineWidth = 1.2;
      context.beginPath();
      context.moveTo(focus.x, focus.y);
      context.lineTo(target.x, target.y);
      context.stroke();
      this.drawLightPool(context, [0, -.35, 0], .28, projection, 'rgba(224, 239, 221, .2)');
    }

    if (serviceIndex === 2) {
      const boardStart = this.projectPoint([-1.21, -.35, -.68], projection);
      const boardEnd = this.projectPoint([1.09, -.35, .68], projection);
      const board = context.createLinearGradient(boardStart.x, boardStart.y, boardEnd.x, boardEnd.y);
      board.addColorStop(0, 'rgba(72, 112, 111, .18)');
      board.addColorStop(.58, 'rgba(133, 176, 171, .1)');
      board.addColorStop(1, 'rgba(224, 229, 211, .06)');
      this.drawWorldPolygon(context, [
        [-1.21, -.35, -.68], [1.09, -.35, -.68], [1.09, -.35, .68], [-1.21, -.35, .68],
      ], projection, board, 'rgba(209, 231, 227, .28)');
      this.drawWorldPolygon(context, [
        [.22, -.35, .15], [.82, -.35, .5], [.82, .62, .5], [.22, .62, .15],
      ], projection, 'rgba(113, 163, 157, .1)', 'rgba(216, 236, 230, .3)');
      this.drawWorldPolygon(context, [
        [.22, -.35, -.38], [.82, -.35, -.04], [.82, .62, -.04], [.22, .62, -.38],
      ], projection, 'rgba(95, 137, 134, .08)', 'rgba(216, 236, 230, .24)');
      const swatches = [
        { center: [-1.04, .36, .08] as Vec3, radius: .2, color: 'rgba(230, 210, 181, .24)' },
        { center: [-.57, .5, .18] as Vec3, radius: .16, color: 'rgba(112, 82, 59, .28)' },
        { center: [-.85, .72, .3] as Vec3, radius: .13, color: 'rgba(208, 171, 111, .25)' },
        { center: [-.36, .25, .36] as Vec3, radius: .12, color: 'rgba(224, 226, 215, .22)' },
      ];
      swatches.forEach(({ center, radius, color }) => {
        this.drawWorldEllipse(context, center, radius, radius, projection, color, 'rgba(238, 231, 214, .3)');
      });
      this.drawLightPool(context, [.5, .32, .18], .42, projection, 'rgba(201, 230, 226, .18)');
    }

    if (serviceIndex === 3) {
      const plinthStart = this.projectPoint([-.93, -.51, -.48], projection);
      const plinthEnd = this.projectPoint([.93, -.51, .48], projection);
      const plinth = context.createLinearGradient(plinthStart.x, plinthStart.y, plinthEnd.x, plinthEnd.y);
      plinth.addColorStop(0, 'rgba(96, 57, 34, .22)');
      plinth.addColorStop(.55, 'rgba(195, 130, 79, .16)');
      plinth.addColorStop(1, 'rgba(250, 221, 188, .08)');
      this.drawWorldPolygon(context, [
        [-.93, -.51, -.48], [.93, -.51, -.48], [.93, -.51, .48], [-.93, -.51, .48],
      ], projection, plinth, 'rgba(255, 226, 193, .3)');
      this.drawWorldPolygon(context, [
        [-.23, -.5, .12], [-.32, -.12, .12], [-.19, .18, .12], [-.28, .56, .12],
        [-.12, .72, .12], [.12, .72, .12], [.28, .56, .12], [.19, .18, .12],
        [.32, -.12, .12], [.23, -.5, .12],
      ], projection, 'rgba(242, 225, 204, .2)', 'rgba(255, 239, 216, .42)');
      this.drawWorldPolygon(context, [
        [.46, .46, -.14], [.9, .46, -.14], [.78, .72, -.14], [.58, .72, -.14],
      ], projection, 'rgba(247, 204, 154, .18)', 'rgba(255, 228, 193, .4)');
      this.drawWorldEllipse(context, [-.58, -.48, .2], .19, .11, projection, 'rgba(194, 123, 77, .22)', 'rgba(255, 221, 183, .34)');
      this.drawWorldEllipse(context, [-.82, -.47, .1], .12, .075, projection, 'rgba(236, 211, 180, .18)', 'rgba(255, 235, 210, .3)');
      this.drawLightPool(context, [.5, .18, -.08], .62, projection, 'rgba(255, 191, 126, .2)');
    }

    if (serviceIndex === 4) {
      const pulse = this.reducedMotion ? 0 : (Math.sin(time * .00062) + 1) * .035;
      const leftEdge = -.52 - pulse;
      const rightEdge = .52 + pulse;
      this.drawWorldPolygon(context, [
        [-1.38 - pulse, -.82, .02], [leftEdge, -.82, .02], [leftEdge, .76, .02], [-1.38 - pulse, .76, .02],
      ], projection, 'rgba(122, 72, 43, .2)', 'rgba(244, 203, 165, .38)');
      this.drawWorldPolygon(context, [
        [rightEdge, -.82, .02], [1.38 + pulse, -.82, .02], [1.38 + pulse, .76, .02], [rightEdge, .76, .02],
      ], projection, 'rgba(122, 72, 43, .2)', 'rgba(244, 203, 165, .38)');
      this.drawWorldPolygon(context, [
        [-1.38 - pulse, .76, .02], [1.38 + pulse, .76, .02], [1.18, 1.02, -.18], [-1.18, 1.02, -.18],
      ], projection, 'rgba(177, 111, 68, .16)', 'rgba(248, 216, 184, .38)');
      this.drawWorldPolygon(context, [
        [leftEdge, -.82, .02], [rightEdge, -.82, .02], [.9, -.98, -.72], [-.9, -.98, -.72],
      ], projection, 'rgba(230, 173, 117, .1)', 'rgba(255, 223, 186, .3)');
      const apertureTop = this.projectPoint([0, .7, .18], projection);
      const apertureBottom = this.projectPoint([0, -.75, .38], projection);
      const daylight = context.createLinearGradient(apertureTop.x, apertureTop.y, apertureBottom.x, apertureBottom.y);
      daylight.addColorStop(0, 'rgba(255, 242, 214, .34)');
      daylight.addColorStop(.58, 'rgba(255, 196, 137, .15)');
      daylight.addColorStop(1, 'rgba(255, 196, 137, 0)');
      this.drawWorldPolygon(context, [
        [-.32, -.66, .42], [.32, -.66, .42], [.32, .66, .42], [-.32, .66, .42],
      ], projection, daylight, 'rgba(255, 232, 205, .5)');
      this.drawLightPool(context, [0, -.18, .45], .78, projection, 'rgba(255, 207, 159, .3)');
    }

    context.restore();
  }

  private draw(time: number) {
    if (!this.width || !this.height) return;
    const context = this.context;
    const mobile = this.mobileQuery.matches;
    const value = clamp(this.currentService, 0, SHAPES.length - 1);
    const fromIndex = Math.min(SHAPES.length - 2, Math.floor(value));
    const toIndex = Math.min(SHAPES.length - 1, fromIndex + 1);
    const local = value >= SHAPES.length - 1 ? 1 : smooth(value - fromIndex);
    const from = SHAPES[fromIndex];
    const to = SHAPES[toIndex];
    const ambient = this.reducedMotion || mobile ? 0 : time * .00018;
    const rotationY = -.42 + Math.sin(ambient) * .09 + value * .045;
    const rotationX = -.12 + Math.cos(ambient * .74) * .035;
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const scale = Math.min(this.width, this.height) * (mobile ? .32 : .36);
    const centerX = this.width * .52;
    const centerY = this.height * .51;
    const projection: ProjectionState = { rotationX, rotationY, scale, centerX, centerY };

    context.clearRect(0, 0, this.width, this.height);

    // The points remain one continuous material body. Solid accents release before
    // the transformation and resolve only after the next form has nearly arrived.
    const fromSurface = 1 - smooth(local / .4);
    const toSurface = smooth((local - .6) / .4);
    this.drawResolvedSurface(context, fromIndex, fromSurface, time, projection);
    this.drawResolvedSurface(context, toIndex, toSurface, time, projection);

    for (let index = 0; index < POINT_COUNT; index += 1) {
      const offset = index * 3;
      const drift = this.reducedMotion || mobile ? 0 : Math.sin(time * .00042 + index * .71) * .008;
      const x = mix(from[offset], to[offset], local) + drift;
      const y = mix(from[offset + 1], to[offset + 1], local) + drift * .45;
      const z = mix(from[offset + 2], to[offset + 2], local);
      const rotatedX = x * cosY - z * sinY;
      const rotatedZ = x * sinY + z * cosY;
      const rotatedY = y * cosX - rotatedZ * sinX;
      const depth = y * sinX + rotatedZ * cosX;
      const perspective = 3.7 / (3.7 + depth);
      this.projectedX[index] = centerX + rotatedX * scale * perspective;
      this.projectedY[index] = centerY - rotatedY * scale * perspective;
      this.projectedDepth[index] = perspective;
    }

    const distanceToRest = Math.abs(value - Math.round(value));
    const structureOpacity = mix(.075, .25, 1 - clamp(distanceToRest * 2.8, 0, 1));
    const transitionEnergy = Math.sin(local * Math.PI);
    const fromColor = SERVICE_COLORS[fromIndex];
    const toColor = SERVICE_COLORS[toIndex];
    const color = fromColor.map((channel, index) => Math.round(mix(channel, toColor[index], local)));
    context.save();
    context.globalCompositeOperation = 'lighter';
    context.lineCap = 'round';
    context.lineWidth = .72;
    context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${structureOpacity})`;
    context.beginPath();
    for (let index = 2; index < POINT_COUNT; index += 2) {
      const previous = index - 2;
      const dx = this.projectedX[index] - this.projectedX[previous];
      const dy = this.projectedY[index] - this.projectedY[previous];
      if (dx * dx + dy * dy > 900) continue;
      context.moveTo(this.projectedX[previous], this.projectedY[previous]);
      context.lineTo(this.projectedX[index], this.projectedY[index]);
    }
    context.stroke();

    context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, .58)`;
    context.beginPath();
    for (let index = 0; index < POINT_COUNT; index += 1) {
      const radius = clamp(this.projectedDepth[index] * (.9 + transitionEnergy * .34), .55, 1.7);
      context.moveTo(this.projectedX[index] + radius, this.projectedY[index]);
      context.arc(this.projectedX[index], this.projectedY[index], radius, 0, TAU);
    }
    context.fill();

    context.fillStyle = `rgba(${Math.min(255, color[0] + 12)}, ${Math.min(255, color[1] + 12)}, ${Math.min(255, color[2] + 12)}, .9)`;
    context.beginPath();
    for (let index = 19; index < POINT_COUNT; index += 53) {
      const radius = clamp(this.projectedDepth[index] * 2.1, 1.4, 2.8);
      context.moveTo(this.projectedX[index] + radius, this.projectedY[index]);
      context.arc(this.projectedX[index], this.projectedY[index], radius, 0, TAU);
    }
    context.fill();
    context.restore();
  }
}
