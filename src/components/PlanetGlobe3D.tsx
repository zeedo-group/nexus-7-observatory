import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface PlanetGlobe3DProps {
  planetName?: string;
  planetColor?: string;
  width?: string;
  height?: string;
  className?: string;
  interactive?: boolean;
}

export const PlanetGlobe3D: React.FC<PlanetGlobe3DProps> = ({
  planetName = 'Nexus-7 Prime',
  planetColor = '#00f3ff',
  width = '100%',
  height = '420px',
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [telemetry, setTelemetry] = useState({
    rotation: '0°',
    status: 'Orbital Lock',
    atmosphere: 'Optimal (98.4%)',
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let widthPx = container.clientWidth || 400;
    let heightPx = container.clientHeight || 400;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, widthPx / heightPx, 0.1, 1000);
    camera.position.z = 5.5;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(widthPx, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a192f, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const auraLight = new THREE.PointLight(new THREE.Color(planetColor).getHex(), 3, 15);
    auraLight.position.set(-4, -2, -3);
    scene.add(auraLight);

    // 5. Planet Group
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Create Procedural Texture for Planet Surface
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark Base
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, 512, 256);

      // Continent & Energy Grid patterns
      ctx.fillStyle = planetColor;
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const radius = 10 + Math.random() * 40;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.globalAlpha = 0.25 + Math.random() * 0.4;
        ctx.fill();
      }

      // Cyber Lines
      ctx.strokeStyle = '#9d00ff';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.7;
      for (let y = 20; y < 256; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(128, y + 15, 384, y - 15, 512, y);
        ctx.stroke();
      }
    }

    const planetTexture = new THREE.CanvasTexture(canvas);

    // Geometry 1: Main Planet Sphere
    const planetGeo = new THREE.SphereGeometry(1.8, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.5,
      metalness: 0.4,
      bumpScale: 0.05,
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planetMesh);

    // Geometry 2: Atmosphere Glow Shell (Aura)
    const auraGeo = new THREE.SphereGeometry(1.95, 64, 64);
    const auraMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(planetColor),
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    planetGroup.add(auraMesh);

    // Geometry 3: Planetary Orbital Ring System
    const ringGeo = new THREE.RingGeometry(2.3, 3.4, 64);
    // Adjust UVs for ring
    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(pos, i);
      uv.setXY(i, vertex.length() < 2.8 ? 0 : 1, 1);
    }

    const ringMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(planetColor),
      emissive: new THREE.Color(planetColor),
      emissiveIntensity: 0.4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      wireframe: false,
    });

    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    planetGroup.add(ringMesh);

    // Geometry 4: Orbiting Satellites / Moons
    const satelliteGroup = new THREE.Group();
    planetGroup.add(satelliteGroup);

    const satGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x9d00ff,
      emissive: 0x9d00ff,
      emissiveIntensity: 0.8,
    });
    const satellite1 = new THREE.Mesh(satGeo, satMat);
    satellite1.position.set(2.9, 0, 0);
    satelliteGroup.add(satellite1);

    // Particle Background Stars
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = (Math.random() - 0.5) * 18;
      positions[i + 2] = (Math.random() - 0.5) * 18;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f3ff,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const starfield = new THREE.Points(particleGeo, particleMat);
    scene.add(starfield);

    // Control State
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive || !isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onPointerDown);
    domElem.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElem.addEventListener('touchstart', onPointerDown, { passive: true });
    domElem.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Satellite Orbiting
      satelliteGroup.rotation.y = elapsedTime * 0.8;
      satelliteGroup.rotation.z = Math.sin(elapsedTime * 0.4) * 0.2;

      // Ring Oscillation
      ringMesh.rotation.z = elapsedTime * 0.05;

      // Damping Mouse Controls
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      planetGroup.rotation.x = currentRotationX;
      planetGroup.rotation.y = currentRotationY + elapsedTime * 0.15;

      // Update telemetry display occasionally
      if (Math.floor(elapsedTime * 10) % 30 === 0) {
        const deg = Math.floor((planetGroup.rotation.y * (180 / Math.PI)) % 360);
        setTelemetry((prev) => ({
          ...prev,
          rotation: `${deg}°`,
        }));
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      widthPx = container.clientWidth;
      heightPx = container.clientHeight;
      camera.aspect = widthPx / heightPx;
      camera.updateProjectionMatrix();
      renderer.setSize(widthPx, heightPx);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      domElem.removeEventListener('mousedown', onPointerDown);
      domElem.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);

      domElem.removeEventListener('touchstart', onPointerDown);
      domElem.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      // Disposal
      planetGeo.dispose();
      planetMat.dispose();
      planetTexture.dispose();
      auraGeo.dispose();
      auraMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(domElem)) {
        container.removeChild(domElem);
      }
    };
  }, [planetColor, interactive]);

  return (
    <div
      className={`planet-3d-wrapper relative overflow-hidden rounded-2xl glass-panel ${className}`}
      style={{ width, height }}
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Planetary Telemetry HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 font-mono text-xs text-cyan-300 bg-slate-950/80 p-3 rounded-lg border border-cyan-500/30 backdrop-blur-md">
        <div className="font-bold text-cyan-400 text-sm mb-1">{planetName}</div>
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <span>Status:</span>
          <span className="text-emerald-400">{telemetry.status}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <span>Rotation:</span>
          <span className="text-cyan-400">{telemetry.rotation}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <span>Atmosphere:</span>
          <span className="text-purple-400">{telemetry.atmosphere}</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 text-[10px] font-mono text-cyan-400/80 bg-slate-950/80 px-2 py-1 rounded border border-cyan-800/40">
        [3D Planetary Globe • Interactive WebGL]
      </div>
    </div>
  );
};

export default PlanetGlobe3D;
