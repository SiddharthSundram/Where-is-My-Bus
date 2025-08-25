"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  lines?: number;
  animate?: boolean;
}

export function Skeleton({ className, lines = 1, animate = true }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-muted rounded-md",
            animate && "animate-pulse",
            i > 0 && "mt-2",
            className
          )}
          style={{
            height: lines === 1 ? "1rem" : "1rem",
            width: i === lines - 1 ? "80%" : "100%"
          }}
        />
      ))}
    </>
  );
}

interface AvatarSkeletonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AvatarSkeleton({ className, size = "md" }: AvatarSkeletonProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div className={cn("bg-muted rounded-full animate-pulse", sizeClasses[size], className)} />
  );
}

interface TextSkeletonProps {
  className?: string;
  lines?: number;
  width?: string | number;
}

export function TextSkeleton({ className, lines = 1, width }: TextSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="bg-muted rounded animate-pulse"
          style={{
            height: "1rem",
            width: width || (i === lines - 1 ? "80%" : "100%")
          }}
        />
      ))}
    </div>
  );
}

interface ButtonSkeletonProps {
  className?: string;
  width?: string | number;
}

export function ButtonSkeleton({ className, width = "120px" }: ButtonSkeletonProps) {
  return (
    <div
      className={cn("bg-muted rounded animate-pulse", className)}
      style={{
        height: "2.5rem",
        width: typeof width === 'number' ? `${width}px` : width
      }}
    />
  );
}

interface CardSkeletonProps {
  className?: string;
  header?: boolean;
  lines?: number;
}

export function CardSkeleton({ className, header = true, lines = 3 }: CardSkeletonProps) {
  return (
    <div className={cn("bg-card border rounded-lg p-6 space-y-4", className)}>
      {header && (
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-muted rounded animate-pulse"
            style={{
              width: i === lines - 1 ? "80%" : "100%"
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface ListSkeletonProps {
  className?: string;
  count?: number;
  avatar?: boolean;
}

export function ListSkeleton({ className, count = 5, avatar = false }: ListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          {avatar && <AvatarSkeleton />}
          <div className="flex-1">
            <TextSkeleton lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}

interface TableSkeletonProps {
  className?: string;
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ className, rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`header-${i}`} className="h-6 bg-muted rounded animate-pulse font-semibold" />
        ))}
      </div>
      
      {/* Body */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-8 bg-muted rounded animate-pulse"
              style={{
                width: colIndex === columns - 1 ? "80%" : "100%"
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
      <div className="h-64 bg-muted rounded animate-pulse" />
      <div className="flex justify-between">
        <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
      </div>
    </div>
  );
}

// Stats skeleton
export function StatsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-muted rounded animate-pulse w-16 mb-2" />
              <div className="h-8 bg-muted rounded animate-pulse w-24" />
            </div>
            <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}