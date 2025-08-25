"use client";

import { useEffect, useRef } from 'react';
import { FaBus } from 'react-icons/fa';

interface Shuttle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  color: string;
  delay: number;
}

export function ShuttleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create shuttle objects
    const shuttles: Shuttle[] = [
      { id: 1, x: 100, y: 100, size: 30, speed: 0.5, direction: 1, color: '#3b82f6', delay: 0 },
      { id: 2, x: 300, y: 200, size: 25, speed: 0.3, direction: -1, color: '#8b5cf6', delay: 1000 },
      { id: 3, x: 500, y: 150, size: 35, speed: 0.7, direction: 1, color: '#06b6d4', delay: 2000 },
      { id: 4, x: 700, y: 300, size: 20, speed: 0.4, direction: -1, color: '#10b981', delay: 3000 },
      { id: 5, x: 200, y: 400, size: 28, speed: 0.6, direction: 1, color: '#f59e0b', delay: 4000 },
      { id: 6, x: 600, y: 100, size: 32, speed: 0.2, direction: -1, color: '#ef4444', delay: 5000 },
    ];

    // Animation variables
    let startTime = Date.now();

    // Draw bus icon
    const drawBus = (x: number, y: number, size: number, color: string, direction: number) => {
      ctx.save();
      ctx.translate(x, y);
      
      // Flip bus if moving left
      if (direction < 0) {
        ctx.scale(-1, 1);
      }

      // Bus body
      ctx.fillStyle = color;
      ctx.fillRect(-size/2, -size/3, size, size/1.5);
      
      // Bus front
      ctx.fillRect(size/2 - size/4, -size/3, size/4, size/1.5);
      
      // Windows
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(-size/2 + 5 + i * (size/4), -size/4, size/6, size/4);
      }
      
      // Wheels
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(-size/3, size/4, size/8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(size/3, size/4, size/8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      shuttles.forEach(shuttle => {
        // Check if delay has passed
        if (elapsed < shuttle.delay) return;

        // Update position
        shuttle.x += shuttle.speed * shuttle.direction;
        
        // Wrap around screen
        if (shuttle.x > canvas.width + 50) {
          shuttle.x = -50;
        } else if (shuttle.x < -50) {
          shuttle.x = canvas.width + 50;
        }

        // Add slight vertical movement
        const verticalOffset = Math.sin(elapsed * 0.001 + shuttle.id) * 10;
        
        // Draw shuttle with transparency
        ctx.globalAlpha = 0.1;
        drawBus(shuttle.x, shuttle.y + verticalOffset, shuttle.size, shuttle.color, shuttle.direction);
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// Enhanced CSS-based shuttle animation for more creative and attractive implementation
export function CSSShuttleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Left to Right Shuttles */}
      <div className="absolute top-16 left-0 animate-shuttle-1 opacity-30">
        <div className="w-10 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg relative shadow-lg">
          <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1 left-4 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1 left-7 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute -bottom-1 left-1 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="absolute -bottom-1 right-1 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="absolute -top-1 left-3 w-4 h-1 bg-red-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-32 left-0 animate-shuttle-3 opacity-25">
        <div className="w-8 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg relative shadow-lg">
          <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1 left-3 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1 left-5 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="absolute -top-1 left-2 w-3 h-1 bg-red-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-48 left-0 animate-shuttle-5 opacity-35">
        <div className="w-12 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg relative shadow-lg">
          <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-1.5 left-5 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-1.5 left-8.5 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute -bottom-1.5 left-2 w-3 h-3 bg-gray-800 rounded-full"></div>
          <div className="absolute -bottom-1.5 right-2 w-3 h-3 bg-gray-800 rounded-full"></div>
          <div className="absolute -top-1.5 left-4 w-5 h-1.5 bg-red-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-64 left-0 animate-shuttle-7 opacity-20">
        <div className="w-9 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg relative shadow-lg">
          <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1 left-4 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1 left-7 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute -bottom-1 left-1.5 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="absolute -bottom-1 right-1.5 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="absolute -top-1 left-3 w-4 h-1 bg-red-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-80 left-0 animate-shuttle-9 opacity-30">
        <div className="w-7 h-5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg relative shadow-lg">
          <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1 left-3 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1 left-5 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="absolute -top-1 left-2 w-3 h-1 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Right to Left Shuttles */}
      <div className="absolute top-24 right-0 animate-shuttle-2 opacity-25">
        <div className="w-11 h-7 bg-gradient-to-l from-red-500 to-red-600 rounded-lg relative shadow-lg">
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1 right-4 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1 right-7 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute -bottom-1 right-1 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="absolute -bottom-1 left-1 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="absolute -top-1 right-3 w-4 h-1 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-40 right-0 animate-shuttle-4 opacity-30">
        <div className="w-9 h-6 bg-gradient-to-l from-indigo-500 to-indigo-600 rounded-lg relative shadow-lg">
          <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1 right-3 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1 right-5 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="absolute -top-1 right-2 w-3 h-1 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-56 right-0 animate-shuttle-6 opacity-20">
        <div className="w-14 h-8 bg-gradient-to-l from-pink-500 to-pink-600 rounded-lg relative shadow-lg">
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-1.5 right-5 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-1.5 right-9 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute -bottom-1.5 right-2 w-3 h-3 bg-gray-800 rounded-full"></div>
          <div className="absolute -bottom-1.5 left-2 w-3 h-3 bg-gray-800 rounded-full"></div>
          <div className="absolute -top-1.5 right-4 w-5 h-1.5 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-72 right-0 animate-shuttle-8 opacity-35">
        <div className="w-8 h-6 bg-gradient-to-l from-teal-500 to-teal-600 rounded-lg relative shadow-lg">
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1 right-4 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1 right-7 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute -bottom-1 right-1.5 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="absolute -bottom-1 left-1.5 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="absolute -top-1 right-3 w-4 h-1 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-88 right-0 animate-shuttle-10 opacity-25">
        <div className="w-10 h-7 bg-gradient-to-l from-orange-500 to-orange-600 rounded-lg relative shadow-lg">
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1 right-4 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute top-1 right-7 w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="absolute -bottom-1 right-1 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="absolute -bottom-1 left-1 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="absolute -top-1 right-3 w-4 h-1 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      {/* Enhanced Floating Bus Icons with 3D effects */}
      <div className="absolute top-12 left-1/4 animate-float-1 opacity-15 transform-gpu hover:opacity-30 transition-opacity">
        <FaBus className="text-5xl text-blue-400 filter drop-shadow-lg" />
      </div>
      <div className="absolute top-28 right-1/4 animate-float-2 opacity-15 transform-gpu hover:opacity-30 transition-opacity">
        <FaBus className="text-4xl text-purple-400 filter drop-shadow-lg" />
      </div>
      <div className="absolute top-44 left-1/3 animate-float-3 opacity-15 transform-gpu hover:opacity-30 transition-opacity">
        <FaBus className="text-6xl text-cyan-400 filter drop-shadow-lg" />
      </div>
      <div className="absolute top-60 right-1/3 animate-float-4 opacity-15 transform-gpu hover:opacity-30 transition-opacity">
        <FaBus className="text-3xl text-green-400 filter drop-shadow-lg" />
      </div>
      <div className="absolute top-76 left-1/2 animate-float-5 opacity-15 transform-gpu hover:opacity-30 transition-opacity">
        <FaBus className="text-5xl text-yellow-400 filter drop-shadow-lg" />
      </div>
      <div className="absolute top-20 right-1/5 animate-float-6 opacity-15 transform-gpu hover:opacity-30 transition-opacity">
        <FaBus className="text-4xl text-red-400 filter drop-shadow-lg" />
      </div>
      <div className="absolute top-52 left-1/5 animate-float-7 opacity-15 transform-gpu hover:opacity-30 transition-opacity">
        <FaBus className="text-5xl text-indigo-400 filter drop-shadow-lg" />
      </div>
      <div className="absolute top-84 right-2/5 animate-float-8 opacity-15 transform-gpu hover:opacity-30 transition-opacity">
        <FaBus className="text-3xl text-pink-400 filter drop-shadow-lg" />
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-8 left-10 animate-pulse-slow opacity-10">
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
      </div>
      <div className="absolute top-20 right-16 animate-pulse-slow opacity-10 delay-300">
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
      </div>
      <div className="absolute top-36 left-24 animate-pulse-slow opacity-10 delay-500">
        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
      </div>
      <div className="absolute top-52 right-32 animate-pulse-slow opacity-10 delay-700">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      </div>
      <div className="absolute top-68 left-40 animate-pulse-slow opacity-10 delay-900">
        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
      </div>
    </div>
  );
}