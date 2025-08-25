"use client";

import React, { forwardRef } from 'react';
import { useEnhancedScroll, useParallax } from '@/hooks/use-enhanced-scroll';
import { cn } from '@/lib/utils';

export interface EnhancedScrollAnimationProps {
  children: React.ReactNode;
  animationType?: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'glow' | 'wave';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  parallax?: boolean;
  parallaxSpeed?: number;
  glowEffect?: boolean;
  shimmer?: boolean;
  hover3D?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

export const EnhancedScrollAnimation = forwardRef<
  HTMLDivElement,
  EnhancedScrollAnimationProps
>(({
  children,
  animationType = 'fade',
  direction = 'up',
  duration = 800,
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  className,
  as: Component = 'div',
  parallax = false,
  parallaxSpeed = 0.5,
  glowEffect = false,
  shimmer = false,
  hover3D = false,
  staggerChildren = false,
  staggerDelay = 100,
  ...props
}, forwardedRef) => {
  const [ref, state] = useEnhancedScroll({
    threshold,
    rootMargin: '0px',
    triggerOnce,
    animationType,
    direction,
    duration,
    delay
  });

  const [parallaxRef] = useParallax(parallaxSpeed);

  const combinedRef = (node: HTMLDivElement) => {
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
    
    if (parallax) {
      parallaxRef.current = node;
    } else {
      ref.current = node;
    }
  };

  const baseClasses = cn(
    'relative',
    'transform-gpu', // GPU acceleration for better performance
    'transition-all duration-300',
    {
      'opacity-0': !state.isVisible && !parallax,
      'animate-in': state.isVisible,
      'hover-lift-3d': hover3D,
      'glow-on-hover': glowEffect,
      'shimmer-effect': shimmer,
      'stagger-container': staggerChildren
    },
    className
  );

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child) && staggerChildren) {
      return React.cloneElement(child as React.ReactElement<any>, {
        className: cn(
          (child as React.ReactElement<any>).props.className,
          'stagger-item',
          `stagger-delay-${index * staggerDelay}`
        ),
        style: {
          ...(child as React.ReactElement<any>).props.style,
          animationDelay: `${index * staggerDelay}ms`
        }
      });
    }
    return child;
  });

  return (
    <Component
      ref={combinedRef}
      className={baseClasses}
      data-animation-type={animationType}
      data-animation-direction={direction}
      data-animation-duration={duration}
      data-animation-delay={delay}
      {...props}
    >
      {enhancedChildren}
      {glowEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      {shimmer && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </div>
      )}
    </Component>
  );
});

EnhancedScrollAnimation.displayName = 'EnhancedScrollAnimation';

// Specialized components for common use cases
export const ScrollFadeIn = ({ children, ...props }: Omit<EnhancedScrollAnimationProps, 'animationType'>) => (
  <EnhancedScrollAnimation animationType="fade" {...props}>
    {children}
  </EnhancedScrollAnimation>
);

export const ScrollSlideIn = ({ 
  children, 
  direction = 'up', 
  ...props 
}: Omit<EnhancedScrollAnimationProps, 'animationType'>) => (
  <EnhancedScrollAnimation animationType="slide" direction={direction} {...props}>
    {children}
  </EnhancedScrollAnimation>
);

export const ScrollScaleIn = ({ children, ...props }: Omit<EnhancedScrollAnimationProps, 'animationType'>) => (
  <EnhancedScrollAnimation animationType="scale" {...props}>
    {children}
  </EnhancedScrollAnimation>
);

export const ScrollRotateIn = ({ 
  children, 
  direction = 'left', 
  ...props 
}: Omit<EnhancedScrollAnimationProps, 'animationType'>) => (
  <EnhancedScrollAnimation animationType="rotate" direction={direction} {...props}>
    {children}
  </EnhancedScrollAnimation>
);

export const ScrollBounceIn = ({ children, ...props }: Omit<EnhancedScrollAnimationProps, 'animationType'>) => (
  <EnhancedScrollAnimation animationType="bounce" {...props}>
    {children}
  </EnhancedScrollAnimation>
);

export const ScrollGlowIn = ({ children, ...props }: Omit<EnhancedScrollAnimationProps, 'animationType'>) => (
  <EnhancedScrollAnimation animationType="glow" {...props}>
    {children}
  </EnhancedScrollAnimation>
);

export const ScrollWaveIn = ({ children, ...props }: Omit<EnhancedScrollAnimationProps, 'animationType'>) => (
  <EnhancedScrollAnimation animationType="wave" {...props}>
    {children}
  </EnhancedScrollAnimation>
);

// Parallax scrolling component
export const ParallaxContainer = ({ 
  children, 
  speed = 0.5, 
  ...props 
}: { 
  children: React.ReactNode; 
  speed?: number;
  className?: string;
}) => (
  <EnhancedScrollAnimation parallax parallaxSpeed={speed} {...props}>
    {children}
  </EnhancedScrollAnimation>
);

// Staggered animation container
export const StaggeredAnimation = ({ 
  children, 
  staggerDelay = 100,
  ...props 
}: { 
  children: React.ReactNode; 
  staggerDelay?: number;
  className?: string;
}) => (
  <EnhancedScrollAnimation staggerChildren staggerDelay={staggerDelay} {...props}>
    {children}
  </EnhancedScrollAnimation>
);

// 3D hover effect component
export const Hover3D = ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
  <EnhancedScrollAnimation hover3D {...props}>
    {children}
  </EnhancedScrollAnimation>
);

// Glow effect component
export const GlowEffect = ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
  <EnhancedScrollAnimation glowEffect {...props}>
    {children}
  </EnhancedScrollAnimation>
);

// Shimmer effect component
export const ShimmerEffect = ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
  <EnhancedScrollAnimation shimmer {...props}>
    {children}
  </EnhancedScrollAnimation>
);