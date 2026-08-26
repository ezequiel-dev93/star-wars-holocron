import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- Tipos internos ---
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

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Renderer & Scene ---
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // Fondo completamente transparente

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // --- Crear capas de estrellas ---
    // Capa 1: Lejanas — muchas, pequeñas, tenues
    // Capa 2: Medias — intermedias
    // Capa 3: Cercanas — pocas, grandes, brillantes
    const layerConfigs = [
      { count: 8000, size: 0.04, opacity: 0.60, spread: 120, driftAmp: 0.008 },
      { count: 3000, size: 0.04, opacity: 0.85, spread: 100, driftAmp: 0.012 },
      { count:  500, size: 0.04, opacity: 1.00, spread:  80, driftAmp: 0.018 },
    ];

    // --- Textura circular (evita que los puntos sean cuadrados) ---
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
    const starTexture = new THREE.CanvasTexture(dotCanvas);


    const layers: StarLayer[] = layerConfigs.map(({ count, size, opacity, spread, driftAmp }) => {
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

        origPositions[i * 3] = x;
        origPositions[i * 3 + 1] = y;
        origPositions[i * 3 + 2] = z;
        currPositions[i * 3] = x;
        currPositions[i * 3 + 1] = y;
        currPositions[i * 3 + 2] = z;

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
      scene.add(points);

      return { points, geometry, material, count, origPositions, currPositions, velX, velY, driftPhase, driftSpeed };
    });

    // --- Estado del ratón ---
    let mouseNx = -9999; // Fuera de pantalla al inicio (sin efecto)
    let mouseNy = -9999;
    let targetCamX = 0;
    let targetCamY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2(-9999, -9999);
    const waterPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouseWorld = new THREE.Vector3();

    const onMouseMove = (e: MouseEvent) => {
      mouseNx = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNy = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseVec.set(mouseNx, mouseNy);
      targetCamX = -mouseNx * 0.4;
      targetCamY = -mouseNy * 0.4;
    };

    const onMouseLeave = () => {
      mouseVec.set(-9999, -9999);
      targetCamX = 0;
      targetCamY = 0;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    // --- Parámetros del efecto agua ---
    const INNER_RADIUS = 1.5;    // Zona de repulsión — muy localizada
    const OUTER_RADIUS = 3.5;    // Zona de atracción — borde exterior
    const REPEL_STRENGTH   = 0.06;
    const ATTRACT_STRENGTH = 0.02;
    const SPRING_RETURN    = 0.03;
    const DAMPING          = 0.80;

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // 1. Parallax suave de cámara
      camera.rotation.y += 0.04 * (targetCamX - camera.rotation.y);
      camera.rotation.x += 0.04 * (targetCamY - camera.rotation.x);

      // 2. Posición del ratón en el mundo 3D (plano Z=0)
      raycaster.setFromCamera(mouseVec, camera);
      raycaster.ray.intersectPlane(waterPlane, mouseWorld);
      const mx = mouseWorld.x;
      const my = mouseWorld.y;

      // 3. Animar cada capa
      layers.forEach(({ count, origPositions, currPositions, velX, velY, driftPhase, driftSpeed, geometry }) => {
        const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;

          // --- Drift orgánico (flotación sutil) ---
          const drift = Math.sin(elapsed * driftSpeed[i] + driftPhase[i]);
          const driftX = drift * 0.008;
          const driftY = Math.cos(elapsed * driftSpeed[i] * 0.7 + driftPhase[i]) * 0.008;

          // --- Efecto agua (solo si el ratón está en pantalla) ---
          if (mouseVec.x > -999) {
            const dx = currPositions[i3] - mx;
            const dy = currPositions[i3 + 1] - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < OUTER_RADIUS && dist > 0.001) {
              const nx = dx / dist;
              const ny = dy / dist;

              if (dist < INNER_RADIUS) {
                // Zona interior: repulsión fuerte
                const force = ((INNER_RADIUS - dist) / INNER_RADIUS) * REPEL_STRENGTH;
                velX[i] += nx * force;
                velY[i] += ny * force;
              } else {
                // Zona exterior (borde): atracción suave hacia el ratón
                const t = (dist - INNER_RADIUS) / (OUTER_RADIUS - INNER_RADIUS);
                const force = (1 - t) * ATTRACT_STRENGTH;
                velX[i] -= nx * force;
                velY[i] -= ny * force;
              }
            }
          }

          // --- Resorte: volver a la posición original ---
          const dispX = currPositions[i3] - origPositions[i3];
          const dispY = currPositions[i3 + 1] - origPositions[i3 + 1];
          velX[i] -= dispX * SPRING_RETURN;
          velY[i] -= dispY * SPRING_RETURN;

          // --- Amortiguación ---
          velX[i] *= DAMPING;
          velY[i] *= DAMPING;

          // --- Actualizar posición ---
          currPositions[i3] += velX[i] + driftX;
          currPositions[i3 + 1] += velY[i] + driftY;

          posArr[i3] = currPositions[i3];
          posArr[i3 + 1] = currPositions[i3 + 1];
          posArr[i3 + 2] = origPositions[i3 + 2]; // Z fija
        }

        posAttr.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      layers.forEach(({ geometry, material }) => {
        geometry.dispose();
        material.dispose();
      });
      starTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};
