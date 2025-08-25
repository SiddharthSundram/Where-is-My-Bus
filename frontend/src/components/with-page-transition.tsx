"use client";

import { useState, useEffect } from "react";
import { PageTransitionLoader } from "./loading-3d-bus";
import { usePathname } from "next/navigation";

interface WithPageTransitionProps {
  children: React.ReactNode;
  minLoadingTime?: number;
}

export function WithPageTransition({ children, minLoadingTime = 800 }: WithPageTransitionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  useEffect(() => {
    // Handle page transitions
    if (!isLoading) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [pathname, isLoading, minLoadingTime]);

  if (isLoading) {
    return <PageTransitionLoader />;
  }

  return (
    <>
      {isTransitioning && <PageTransitionLoader />}
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
}

// Higher-order component for pages
export function withPageTransition<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  minLoadingTime?: number
) {
  return function WithPageTransitionComponent(props: P) {
    return (
      <WithPageTransition minLoadingTime={minLoadingTime}>
        <WrappedComponent {...props} />
      </WithPageTransition>
    );
  };
}