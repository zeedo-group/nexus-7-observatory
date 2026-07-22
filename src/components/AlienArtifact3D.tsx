import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AlienArtifact3DProps {
  width?: string;
  height?: string;
  className?: string;
  interactive?: boolean;
}

export const AlienArtifact3D: React.FC<AlienArtifact3DProps> = ({
  width = '100%',
  height = '400px',
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Hologram Online');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let widthPx = container.clientWidth || 400;
    let heightPx = container.clientHeight || 400;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, widthPx / heightPx, 0.1, 1000);
    camera.position.z = 6;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(widthPx, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0a192f, 1.5);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00f3ff, 3, 20);
    cyanPointLight.position.set(3, 3, 3);
    scene.add(cyanPointLight);

    const purplePointLight = new THREE.PointLight(0x9d00ff, 3, 20);
    purplePointLight.position.set(-3, -3, 2);
    scene.add(purplePointLight);

    const amberLight = new THREE.PointLight(0xffb700, 1.5, 15);
    amberLight.position.set(0, 4, -2);
    scene.add(amberLight);

    // 5. Artifact Group (Holds all geometry)
    const artifactGroup = new THREE.Group();
    scene.add(artifactGroup);

    // Geometry 1: Outer Icosahedron Wireframe
    const outerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      wireframe: true,
      emissive: 0x00a8ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.75,
      metalness: 0.8,
      roughness: 0.2,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    artifactGroup.add(outerMesh);

    // Geometry 2: Inner Core - Torus Knot Hologram
    const coreGeo = new THREE.TorusKnotGeometry(0.65, 0.18, 120, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x9d00ff,
      emissive: 0x6a00ff,
      emissiveIntensity: 0.9,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    artifactGroup.add(coreMesh);

    // Geometry 3: Orbital Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.8,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    artifactGroup.add(ring1Mesh);

    // Geometry 4: Orbital Ring 2
    const ring2Geo = new THREE.TorusGeometry(2.4, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xff00cc,
      transparent: true,
      opacity: 0.6,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    artifactGroup.add(ring2Mesh);

    // 6. Particle Starfield Background
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;

      // Color variation between cyan and purple
      const mixRatio = Math.random();
      particleColors[i] = mixRatio * 0.0; // R
      particleColors[i + 1] = 0.8 + mixRatio * 0.2; // G
      particleColors[i + 2] = 1.0; // B
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const starfield = new THREE.Points(particleGeo, particleMat);
    scene.add(starfield);

    // 7. Physics & Control Variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let baseRotationSpeed = 0.005;

    // Event Handlers for Drag Controls
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
      setStatusMessage('Direct Drag Control Active');
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive || !isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      if (!interactive) return;
      isDragging = false;
      setStatusMessage('Hologram Idle Matrix');
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onPointerDown);
    domElem.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElem.addEventListener('touchstart', onPointerDown, { passive: true });
    domElem.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Core pulsing effect
      const pulseScale = 1 + Math.sin(elapsedTime * 2) * 0.06;
      coreMesh.scale.set(pulseScale, pulseScale, pulseScale);
      coreMat.emissiveIntensity = 0.8 + Math.sin(elapsedTime * 3) * 0.3;

      // Outer wireframe floating animation
      outerMesh.rotation.y = elapsedTime * 0.2;
      outerMesh.rotation.z = Math.sin(elapsedTime * 0.5) * 0.2;

      // Rings rotation
      ring1Mesh.rotation.z = elapsedTime * 0.5;
      ring2Mesh.rotation.x = elapsedTime * -0.3;

      // Starfield slow drift
      starfield.rotation.y = elapsedTime * 0.02;

      // Inertia rotation damping for user mouse drag
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      artifactGroup.rotation.x = currentRotationX;
      artifactGroup.rotation.y = currentRotationY + elapsedTime * baseRotationSpeed;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
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

    // 10. Cleanup
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      domElem.removeEventListener('mousedown', onPointerDown);
      domElem.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);

      domElem.removeEventListener('touchstart', onPointerDown);
      domElem.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      // Memory Disposal
      outerGeo.dispose();
      outerMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(domElem)) {
        container.removeChild(domElem);
      }
    };
  }, [interactive]);

  return (
    <div
      className={`artifact-3d-wrapper relative overflow-hidden rounded-2xl glass-panel ${className}`}
      style={{ width, height }}
      onMouseEnter={() => {
        setIsHovered(true);
        setStatusMessage('Quantum Resonance Active');
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setStatusMessage('Hologram Standby');
      }}
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hologram Overlay HUD Controls */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-cyan-500/40 text-xs font-mono text-cyan-400 backdrop-blur-md">
        <span className={`w-2 h-2 rounded-full ${isHovered ? 'bg-cyan-400 animate-ping' : 'bg-purple-500'}`} />
        <span>{statusMessage}</span>
      </div>

      <div className="absolute bottom-3 right-3 z-10 text-[10px] font-mono text-cyan-500/70 bg-slate-950/80 px-2 py-1 rounded border border-cyan-900/50">
        [3D WebGL Core • Drag to Rotate]
      </div>
    </div>
  );
};

export default AlienArtifact3D;
