"use client";

import { useEffect, useState } from "react";
import { FaBus } from "react-icons/fa";

interface Loading3DBusProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  showProgress?: boolean;
  fullScreen?: boolean;
  className?: string;
}

export function Loading3DBus({ 
  size = "md", 
  text = "Loading Where is My Bus...", 
  showProgress = false,
  fullScreen = false,
  className = ""
}: Loading3DBusProps) {
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [showProgress]);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  const busSizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
    xl: "text-8xl"
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex flex-col items-center justify-center p-8";

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* 3D Bus Container */}
      <div className={`relative ${sizeClasses[size]} mb-6`}>
        {/* Main 3D Bus */}
        <div className="absolute inset-0 animate-3d-bus-rotate">
          <div className="relative w-full h-full transform-style-3d">
            {/* Front Face */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transform translate-z-8">
              <FaBus className={`${busSizeClasses[size]} text-white`} />
            </div>
            
            {/* Back Face */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center transform rotate-y-180 translate-z-8">
              <FaBus className={`${busSizeClasses[size]} text-white/80`} />
            </div>
            
            {/* Top Face */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg transform rotate-x-90 translate-z-4" />
            
            {/* Bottom Face */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-700 to-blue-800 rounded-lg transform -rotate-x-90 translate-z-4" />
            
            {/* Left Face */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg transform -rotate-y-90 translate-z-4" />
            
            {/* Right Face */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform rotate-y-90 translate-z-4" />
          </div>
        </div>

        {/* Orbiting Elements */}
        <div className="absolute inset-0 animate-orbit-1">
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2" />
        </div>
        
        <div className="absolute inset-0 animate-orbit-2">
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-red-400 rounded-full transform -translate-x-1/2" />
        </div>
        
        <div className="absolute inset-0 animate-orbit-3">
          <div className="absolute top-1/2 left-0 w-2 h-2 bg-green-400 rounded-full transform -translate-y-1/2" />
        </div>
        
        <div className="absolute inset-0 animate-orbit-4">
          <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2" />
        </div>

        {/* Pulsing Ring */}
        <div className="absolute inset-0 animate-ping-ring">
          <div className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-30" />
        </div>
      </div>

      {/* Loading Text */}
      <div className={`text-center ${textSizeClasses[size]} font-semibold text-primary mb-4 animate-pulse-slow`}>
        {text}
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-64 bg-muted rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}

      {/* Animated Dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce-dot-1" />
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce-dot-2" />
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce-dot-3" />
      </div>
    </div>
  );
}

// Simplified version for inline use
export function MiniLoadingBus({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 animate-3d-bus-spin">
          <div className="relative w-full h-full transform-style-3d">
            <div className="absolute inset-0 bg-blue-500 rounded flex items-center justify-center transform translate-z-4">
              <FaBus className="text-white text-sm" />
            </div>
            <div className="absolute inset-0 bg-blue-600 rounded flex items-center justify-center transform rotate-y-90 translate-z-4" />
            <div className="absolute inset-0 bg-blue-700 rounded flex items-center justify-center transform -rotate-y-90 translate-z-4" />
          </div>
        </div>
      </div>
      <span className="text-sm text-muted-foreground animate-pulse">Loading...</span>
    </div>
  );
}

// Page transition loader
export function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <Loading3DBus size="xl" text="Preparing your journey..." showProgress={true} />
    </div>
  );
}