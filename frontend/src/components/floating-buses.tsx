"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface FloatingBusesProps {
  className?: string;
  busCount?: number;
  colors?: [number, number]; // [primaryColor, secondaryColor]
}

export default function FloatingBuses({ 
  className, 
  busCount = 8,
  colors = [0x1e3a8a, 0x6366f1]
}: FloatingBusesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const busesRef = useRef<THREE.Group[]>([]);
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
    camera.position.z = 25;
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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Create floating cars
    createFloatingCars(scene, busCount, colors);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Animate cars
      busesRef.current.forEach((car, index) => {
        car.position.x += car.userData.vx;
        car.position.y += car.userData.vy;
        car.position.z += car.userData.vz;
        car.rotation.y += 0.015;
        car.rotation.x += 0.005;

        // Floating motion
        car.position.y += Math.sin(Date.now() * 0.001 + index) * 0.02;

        // Bounce off boundaries
        const boundary = 20;
        if (Math.abs(car.position.x) > boundary) car.userData.vx *= -1;
        if (Math.abs(car.position.y) > boundary) car.userData.vy *= -1;
        if (Math.abs(car.position.z) > boundary) car.userData.vz *= -1;
      });

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
  }, [busCount, colors]);

  const createCarModel = (primaryColor: number, secondaryColor: number): THREE.Group => {
    const carGroup = new THREE.Group();

    // Car body (main part)
    const bodyGeometry = new THREE.BoxGeometry(2.5, 1, 1.2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 0.1,
      shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    carGroup.add(body);

    // Car roof
    const roofGeometry = new THREE.BoxGeometry(1.5, 0.6, 1);
    const roofMaterial = new THREE.MeshPhongMaterial({ 
      color: secondaryColor,
      emissive: secondaryColor,
      emissiveIntensity: 0.05
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 0.5;
    carGroup.add(roof);

    // Windshield
    const windshieldGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.9);
    const windshieldMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x6366f1,
      transparent: true,
      opacity: 0.7,
      emissive: 0x6366f1,
      emissiveIntensity: 0.2
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(0.75, 0.2, 0);
    carGroup.add(windshield);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 12);
    const wheelMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x111827,
      shininess: 50
    });
    
    const wheelPositions = [
      [-0.8, -0.5, 0.5],
      [0.8, -0.5, 0.5],
      [-0.8, -0.5, -0.5],
      [0.8, -0.5, -0.5]
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.z = Math.PI / 2;
      carGroup.add(wheel);
    });

    // Headlights
    const headlightGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const headlightMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xfffacd,
      emissive: 0xfffacd,
      emissiveIntensity: 0.3
    });
    
    const headlightPositions = [
      [1.25, 0.1, 0.3],
      [1.25, 0.1, -0.3]
    ];

    headlightPositions.forEach(pos => {
      const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      headlight.position.set(pos[0], pos[1], pos[2]);
      carGroup.add(headlight);
    });

    return carGroup;
  };

  const createFloatingCars = (scene: THREE.Scene, count: number, colors: [number, number]) => {
    busesRef.current = [];

    for (let i = 0; i < count; i++) {
      const car = createCarModel(colors[0], colors[1]);
      
      // Random starting position
      car.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );

      // Random rotation
      car.rotation.y = Math.random() * Math.PI * 2;

      // Random velocity
      car.userData = {
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        vz: (Math.random() - 0.5) * 0.15
      };

      scene.add(car);
      busesRef.current.push(car);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 pointer-events-none ${className || ''}`}
      style={{ zIndex: -1 }}
    />
  );
}