"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading3DBus } from "./loading-3d-bus";

interface LoadingCardProps {
  title?: string;
  lines?: number;
  className?: string;
  showAvatar?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LoadingCard({ 
  title, 
  lines = 3, 
  className = "", 
  showAvatar = false,
  size = "md"
}: LoadingCardProps) {
  const sizeClasses = {
    sm: "h-4",
    md: "h-6", 
    lg: "h-8"
  };

  return (
    <Card className={`animate-pulse ${className}`}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          {showAvatar && (
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Loading3DBus size="sm" showProgress={false} />
            </div>
          )}
          <div className="flex-1">
            {title && (
              <div className={`${sizeClasses[size]} bg-muted rounded w-1/3 mb-2`} />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`${sizeClasses[size]} bg-muted rounded ${
                i === lines - 1 ? "w-3/4" : "w-full"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface LoadingGridProps {
  count?: number;
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export function LoadingGrid({ 
  count = 6, 
  className = "", 
  showAvatar = false,
  lines = 3
}: LoadingGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard
          key={i}
          showAvatar={showAvatar}
          lines={lines}
          className="animate-pulse"
        />
      ))}
    </div>
  );
}

interface LoadingListProps {
  count?: number;
  className?: string;
  showAvatar?: boolean;
}

export function LoadingList({ 
  count = 5, 
  className = "", 
  showAvatar = false
}: LoadingListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
          {showAvatar && (
            <div className="w-10 h-10 bg-muted-foreground/20 rounded-full flex items-center justify-center">
              <Loading3DBus size="sm" showProgress={false} />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
            <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
          </div>
          <div className="w-8 h-8 bg-muted-foreground/20 rounded flex items-center justify-center">
            <Loading3DBus size="sm" showProgress={false} />
          </div>
        </div>
      ))}
    </div>
  );
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function LoadingTable({ 
  rows = 5, 
  columns = 4, 
  className = "" 
}: LoadingTableProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-6 bg-muted rounded font-semibold" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-8 bg-muted rounded"
              style={{
                width: colIndex === columns - 1 ? "60%" : "100%"
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}