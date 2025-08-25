"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Smooth3DScrollProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeInDown' | 'scaleIn' | 'rotateIn' | 'slideInLeft' | 'slideInRight' | 'bounceIn';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  distance?: number;
  intensity?: number;
}

export const Smooth3DScroll: React.FC<Smooth3DScrollProps> = ({
  children,
  className,
  animationType = 'fadeInUp',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  triggerOnce = true,
  distance = 50,
  intensity = 1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          setIsVisible(true);
          setHasAnimated(true);
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!entry.isIntersecting && !triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, triggerOnce, hasAnimated]);

  const getAnimationStyles = () => {
    if (!isVisible) {
      switch (animationType) {
        case 'fadeInUp':
          return {
            opacity: 0,
            transform: `translateY(${distance * intensity}px) rotateX(10deg)`,
          };
        case 'fadeInDown':
          return {
            opacity: 0,
            transform: `translateY(-${distance * intensity}px) rotateX(-10deg)`,
          };
        case 'fadeInLeft':
          return {
            opacity: 0,
            transform: `translateX(${distance * intensity}px) rotateY(-10deg)`,
          };
        case 'fadeInRight':
          return {
            opacity: 0,
            transform: `translateX(-${distance * intensity}px) rotateY(10deg)`,
          };
        case 'scaleIn':
          return {
            opacity: 0,
            transform: `scale(0.8) rotateY(5deg)`,
          };
        case 'rotateIn':
          return {
            opacity: 0,
            transform: 'rotateY(-90deg) scale(0.8)',
          };
        case 'slideInLeft':
          return {
            opacity: 0,
            transform: `translateX(${distance * intensity}px) rotateY(-15deg)`,
          };
        case 'slideInRight':
          return {
            opacity: 0,
            transform: `translateX(-${distance * intensity}px) rotateY(15deg)`,
          };
        case 'bounceIn':
          return {
            opacity: 0,
            transform: `translateY(${distance * intensity}px) scale(0.5) rotateX(15deg)`,
          };
        default:
          return {
            opacity: 0,
            transform: `translateY(${distance * intensity}px)`,
          };
      }
    }

    return {
      opacity: 1,
      transform: 'translateY(0) translateX(0) rotateX(0) rotateY(0) scale(1)',
    };
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transform-gpu transition-all ease-out',
        className
      )}
      style={{
        ...getAnimationStyles(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

// Specialized components for different animation types
export const FadeInUp: React.FC<Omit<Smooth3DScrollProps, 'animationType'>> = (props) => (
  <Smooth3DScroll animationType="fadeInUp" {...props} />
);

export const FadeInLeft: React.FC<Omit<Smooth3DScrollProps, 'animationType'>> = (props) => (
  <Smooth3DScroll animationType="fadeInLeft" {...props} />
);

export const FadeInRight: React.FC<Omit<Smooth3DScrollProps, 'animationType'>> = (props) => (
  <Smooth3DScroll animationType="fadeInRight" {...props} />
);

export const FadeInDown: React.FC<Omit<Smooth3DScrollProps, 'animationType'>> = (props) => (
  <Smooth3DScroll animationType="fadeInDown" {...props} />
);

export const ScaleIn: React.FC<Omit<Smooth3DScrollProps, 'animationType'>> = (props) => (
  <Smooth3DScroll animationType="scaleIn" {...props} />
);

export const RotateIn: React.FC<Omit<Smooth3DScrollProps, 'animationType'>> = (props) => (
  <Smooth3DScroll animationType="rotateIn" {...props} />
);

export const SlideInLeft: React.FC<Omit<Smooth3DScrollProps, 'animationType'>> = (props) => (
  <Smooth3DScroll animationType="slideInLeft" {...props} />
);

export const SlideInRight: React.FC<Omit<Smooth3DScrollProps, 'animationType'>> = (props) => (
  <Smooth3DScroll animationType="slideInRight" {...props} />
);

export const BounceIn: React.FC<Omit<Smooth3DScrollProps, 'animationType'>> = (props) => (
  <Smooth3DScroll animationType="bounceIn" {...props} />
);

// Staggered animation container
interface StaggeredContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  animationType?: Smooth3DScrollProps['animationType'];
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  className,
  staggerDelay = 100,
  animationType = 'fadeInUp',
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={cn('staggered-container', className)}>
      {childrenArray.map((child, index) => (
        <Smooth3DScroll
          key={index}
          animationType={animationType}
          delay={index * staggerDelay}
          className="staggered-item"
        >
          {child}
        </Smooth3DScroll>
      ))}
    </div>
  );
};