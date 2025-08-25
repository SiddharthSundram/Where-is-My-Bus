"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("relative", className)}>
      {/* Outer spinning ring */}
      <div 
        className={cn(
          "absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin",
          sizeClasses[size]
        )}
      />
      
      {/* Inner spinning ring */}
      <div 
        className={cn(
          "absolute inset-2 border-4 border-transparent border-b-pink-500 border-l-blue-400 rounded-full animate-spin",
          size === "sm" ? "w-2 h-2" : size === "md" ? "w-4 h-4" : "w-6 h-6"
        )}
        style={{ animationDirection: "reverse" }}
      />
      
      {/* Center dot */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse",
          size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : "w-3 h-3"
        )}
      />
    </div>
  );
}

// Loading skeleton component
interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export function LoadingSkeleton({ lines = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded animate-pulse"
          style={{
            animationDelay: `${index * 0.1}s`,
            width: `${Math.random() * 40 + 60}%`
          }}
        />
      ))}
    </div>
  );
}

// Page loading component
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10">
      <div className="text-center">
        <div className="relative mb-8">
          <LoadingSpinner size="lg" className="mx-auto" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Loading Your Journey
        </h2>
        <p className="text-muted-foreground">
          Preparing your bus tracking experience...
        </p>
      </div>
    </div>
  );
}