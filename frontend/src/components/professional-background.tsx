"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ProfessionalBackgroundProps {
  className?: string;
}

export default function ProfessionalBackground({ className }: ProfessionalBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create professional particle system
    createParticleSystem(scene);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Sophisticated rotation animation with multiple layers
      if (particlesRef.current) {
        const time = Date.now() * 0.0001;
        
        // Gentle, multi-layered rotation
        particlesRef.current.rotation.y = Math.sin(time) * 0.1;
        particlesRef.current.rotation.x = Math.cos(time * 0.7) * 0.05;
        particlesRef.current.rotation.z = Math.sin(time * 0.3) * 0.03;
        
        // Subtle pulsing effect
        const scale = 1 + Math.sin(time * 2) * 0.02;
        particlesRef.current.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (containerRef.current && rendererRef.current?.domElement) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  const createParticleSystem = (scene: THREE.Scene) => {
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Professional color palette - sophisticated and modern
    const colorPalette = [
      new THREE.Color(0x1e3a8a), // Deep navy blue
      new THREE.Color(0x374151), // Cool gray
      new THREE.Color(0x6366f1), // Professional indigo
      new THREE.Color(0x7c3aed), // Royal purple
      new THREE.Color(0x059669), // Emerald green
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Create a sophisticated particle field with layered depth
      const layer = Math.random();
      let radius;
      if (layer < 0.3) {
        radius = 15 + Math.random() * 10; // Inner layer
      } else if (layer < 0.7) {
        radius = 25 + Math.random() * 15; // Middle layer
      } else {
        radius = 40 + Math.random() * 20; // Outer layer
      }
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Assign colors based on layer for depth effect
      let color;
      if (layer < 0.3) {
        color = colorPalette[0]; // Deep blue for inner layer
      } else if (layer < 0.7) {
        color = colorPalette[2]; // Indigo for middle layer
      } else {
        color = colorPalette[Math.floor(Math.random() * 3) + 1]; // Mixed for outer layer
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;
  };

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 pointer-events-none ${className || ''}`}
      style={{ zIndex: -1 }}
    />
  );
}