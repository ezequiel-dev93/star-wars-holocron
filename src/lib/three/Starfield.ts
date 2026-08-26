import * as THREE from 'three';

interface StarLayer {
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  count: number;
  origPositions: Float32Array;
  currPositions: Float32Array;
  velX: Float32Array;
  velY: Float32Array;
  driftPhase: Float32Array;
  driftSpeed: Float32Array;
}

const INNER_RADIUS    = 1.5;
const OUTER_RADIUS    = 3.5;
const REPEL_STRENGTH  = 0.06;
const ATTRACT_STRENGTH = 0.02;
const SPRING_RETURN   = 0.03;
const DAMPING         = 0.80;

export class Starfield {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private layers: StarLayer[] = [];
  private clock: THREE.Clock;
  private animationId = 0;

  private mouseNx = -9999;
  private mouseNy = -9999;
  private targetCamX = 0;
  private targetCamY = 0;

  private raycaster = new THREE.Raycaster();
  private mouseVec = new THREE.Vector2(-9999, -9999);
  private waterPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private mouseWorld = new THREE.Vector3();

  private onMouseMove: (e: MouseEvent) => void;
  private onMouseLeave: () => void;
  private onResize: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.clock = new THREE.Clock();

    const starTexture = this.buildStarTexture();
    this.buildLayers(starTexture);

    this.onMouseMove = (e: MouseEvent) => {
      this.mouseNx = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNy = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouseVec.set(this.mouseNx, this.mouseNy);
      this.targetCamX = -this.mouseNx * 0.4;
      this.targetCamY = -this.mouseNy * 0.4;
    };

    this.onMouseLeave = () => {
      this.mouseVec.set(-9999, -9999);
      this.targetCamX = 0;
      this.targetCamY = 0;
    };

    this.onResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseleave', this.onMouseLeave);
    window.addEventListener('resize', this.onResize);

    this.animate();
  }

  private buildStarTexture(): THREE.CanvasTexture {
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 32;
    dotCanvas.height = 32;
    const ctx = dotCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0,   'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(dotCanvas);
  }

  private buildLayers(starTexture: THREE.CanvasTexture): void {
    const configs = [
      { count: 8000, size: 0.04, opacity: 0.60, spread: 120, driftAmp: 0.008 },
      { count: 3000, size: 0.04, opacity: 0.85, spread: 100, driftAmp: 0.012 },
      { count:  500, size: 0.04, opacity: 1.00, spread:  80, driftAmp: 0.018 },
    ];

    for (const { count, size, opacity, spread } of configs) {
      const origPositions = new Float32Array(count * 3);
      const currPositions = new Float32Array(count * 3);
      const velX = new Float32Array(count);
      const velY = new Float32Array(count);
      const driftPhase = new Float32Array(count);
      const driftSpeed = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * spread;
        const z = (Math.random() - 0.5) * 30;
        origPositions[i * 3]     = x; currPositions[i * 3]     = x;
        origPositions[i * 3 + 1] = y; currPositions[i * 3 + 1] = y;
        origPositions[i * 3 + 2] = z; currPositions[i * 3 + 2] = z;
        driftPhase[i] = Math.random() * Math.PI * 2;
        driftSpeed[i] = 0.2 + Math.random() * 0.4;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(currPositions, 3));

      const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size,
        map: starTexture,
        transparent: true,
        alphaTest: 0.01,
        opacity,
        sizeAttenuation: true,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      this.scene.add(points);
      this.layers.push({ points, geometry, material, count, origPositions, currPositions, velX, velY, driftPhase, driftSpeed });
    }
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    const elapsed = this.clock.getElapsedTime();

    this.camera.rotation.y += 0.04 * (this.targetCamX - this.camera.rotation.y);
    this.camera.rotation.x += 0.04 * (this.targetCamY - this.camera.rotation.x);

    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    this.raycaster.ray.intersectPlane(this.waterPlane, this.mouseWorld);
    const mx = this.mouseWorld.x;
    const my = this.mouseWorld.y;

    for (const { count, origPositions, currPositions, velX, velY, driftPhase, driftSpeed, geometry } of this.layers) {
      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const drift  = Math.sin(elapsed * driftSpeed[i] + driftPhase[i]);
        const driftX = drift * 0.008;
        const driftY = Math.cos(elapsed * driftSpeed[i] * 0.7 + driftPhase[i]) * 0.008;

        if (this.mouseVec.x > -999) {
          const dx   = currPositions[i3]     - mx;
          const dy   = currPositions[i3 + 1] - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < OUTER_RADIUS && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            if (dist < INNER_RADIUS) {
              const force = ((INNER_RADIUS - dist) / INNER_RADIUS) * REPEL_STRENGTH;
              velX[i] += nx * force;
              velY[i] += ny * force;
            } else {
              const t = (dist - INNER_RADIUS) / (OUTER_RADIUS - INNER_RADIUS);
              const force = (1 - t) * ATTRACT_STRENGTH;
              velX[i] -= nx * force;
              velY[i] -= ny * force;
            }
          }
        }

        velX[i] -= (currPositions[i3]     - origPositions[i3])     * SPRING_RETURN;
        velY[i] -= (currPositions[i3 + 1] - origPositions[i3 + 1]) * SPRING_RETURN;
        velX[i] *= DAMPING;
        velY[i] *= DAMPING;

        currPositions[i3]     += velX[i] + driftX;
        currPositions[i3 + 1] += velY[i] + driftY;
        posArr[i3]     = currPositions[i3];
        posArr[i3 + 1] = currPositions[i3 + 1];
        posArr[i3 + 2] = origPositions[i3 + 2];
      }
      posAttr.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  };

  destroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseleave', this.onMouseLeave);
    window.removeEventListener('resize', this.onResize);
    for (const { geometry, material } of this.layers) {
      geometry.dispose();
      material.dispose();
    }
    this.renderer.dispose();
  }
}
