"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const pathname = usePathname();

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div className="relative">
      {/* Transition Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm z-50 transition-all duration-300 pointer-events-none",
          isTransitioning ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Page Content */}
      <div 
        className={cn(
          "transition-all duration-300 ease-out",
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        {displayChildren}
      </div>

      {/* Loading Skeleton */}
      {isTransitioning && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-purple-900/5 to-pink-900/5">
            <div className="animate-pulse">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}