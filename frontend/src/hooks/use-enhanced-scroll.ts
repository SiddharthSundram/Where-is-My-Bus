"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  animationType?: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'glow' | 'wave';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  easing?: string;
}

interface AnimationState {
  isVisible: boolean;
  hasAnimated: boolean;
  progress: number;
}

export function useEnhancedScroll(options: ScrollAnimationOptions = {}): [
  React.RefObject<HTMLDivElement>,
  AnimationState,
  (element: HTMLElement) => void
] {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    animationType = 'fade',
    direction = 'up',
    duration = 800,
    delay = 0,
    easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<AnimationState>({
    isVisible: false,
    hasAnimated: false,
    progress: 0
  });

  const animateElement = useCallback((element: HTMLElement) => {
    const animationClass = `scroll-animate-${animationType}-${direction}`;
    const style = document.createElement('style');
    
    // Generate unique animation keyframes
    const animationName = `scroll-${animationType}-${direction}-${Date.now()}`;
    
    let keyframes = '';
    switch (animationType) {
      case 'fade':
        keyframes = `
          @keyframes ${animationName} {
            0% {
              opacity: 0;
              transform: ${getTransformByDirection(direction, 50)};
            }
            100% {
              opacity: 1;
              transform: ${getTransformByDirection(direction, 0)};
            }
          }
        `;
        break;
      case 'slide':
        keyframes = `
          @keyframes ${animationName} {
            0% {
              opacity: 0;
              transform: ${getTransformByDirection(direction, 100)};
            }
            100% {
              opacity: 1;
              transform: ${getTransformByDirection(direction, 0)};
            }
          }
        `;
        break;
      case 'scale':
        keyframes = `
          @keyframes ${animationName} {
            0% {
              opacity: 0;
              transform: scale(0.8) ${getTransformByDirection(direction, 30)};
            }
            100% {
              opacity: 1;
              transform: scale(1) ${getTransformByDirection(direction, 0)};
            }
          }
        `;
        break;
      case 'rotate':
        keyframes = `
          @keyframes ${animationName} {
            0% {
              opacity: 0;
              transform: ${getRotateByDirection(direction)} scale(0.8);
            }
            100% {
              opacity: 1;
              transform: rotate(0deg) scale(1);
            }
          }
        `;
        break;
      case 'bounce':
        keyframes = `
          @keyframes ${animationName} {
            0% {
              opacity: 0;
              transform: ${getTransformByDirection(direction, 100)} scale(0.3);
            }
            50% {
              opacity: 0.8;
              transform: ${getTransformByDirection(direction, -30)} scale(1.1);
            }
            100% {
              opacity: 1;
              transform: ${getTransformByDirection(direction, 0)} scale(1);
            }
          }
        `;
        break;
      case 'glow':
        keyframes = `
          @keyframes ${animationName} {
            0% {
              opacity: 0;
              transform: ${getTransformByDirection(direction, 50)};
              filter: blur(10px);
            }
            100% {
              opacity: 1;
              transform: ${getTransformByDirection(direction, 0)};
              filter: blur(0px);
            }
          }
        `;
        break;
      case 'wave':
        keyframes = `
          @keyframes ${animationName} {
            0% {
              opacity: 0;
              transform: ${getTransformByDirection(direction, 50)} rotateY(-90deg);
            }
            50% {
              opacity: 0.7;
              transform: ${getTransformByDirection(direction, 25)} rotateY(-45deg);
            }
            100% {
              opacity: 1;
              transform: ${getTransformByDirection(direction, 0)} rotateY(0deg);
            }
          }
        `;
        break;
    }

    style.textContent = keyframes;
    document.head.appendChild(style);

    // Apply animation
    element.style.animation = `${animationName} ${duration}ms ${easing} ${delay}ms forwards`;
    element.style.transformStyle = 'preserve-3d';
    element.style.backfaceVisibility = 'hidden';

    // Cleanup after animation
    setTimeout(() => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, duration + delay + 100);
  }, [animationType, direction, duration, delay, easing]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const progress = entry.intersectionRatio;
        setState(prev => ({
          isVisible: entry.isIntersecting,
          hasAnimated: prev.hasAnimated || (entry.isIntersecting && !triggerOnce),
          progress
        }));

        if (entry.isIntersecting && (!triggerOnce || !state.hasAnimated)) {
          animateElement(element);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, animateElement, state.hasAnimated]);

  return [ref, state, animateElement];
}

function getTransformByDirection(direction: string, distance: number): string {
  switch (direction) {
    case 'up':
      return `translateY(${distance}px)`;
    case 'down':
      return `translateY(-${distance}px)`;
    case 'left':
      return `translateX(${distance}px)`;
    case 'right':
      return `translateX(-${distance}px)`;
    default:
      return `translateY(${distance}px)`;
  }
}

function getRotateByDirection(direction: string): string {
  switch (direction) {
    case 'left':
      return 'rotateY(-45deg)';
    case 'right':
      return 'rotateY(45deg)';
    case 'up':
      return 'rotateX(-45deg)';
    case 'down':
      return 'rotateX(45deg)';
    default:
      return 'rotateY(-45deg)';
  }
}

// Hook for parallax scrolling effects
export function useParallax(speed: number = 0.5): [
  React.RefObject<HTMLDivElement>,
  (scrollY: number) => void
] {
  const ref = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((scrollY: number) => {
    const element = ref.current;
    if (!element) return;

    const yPos = -(scrollY * speed);
    element.style.transform = `translateY(${yPos}px)`;
  }, [speed]);

  useEffect(() => {
    const handleScroll = () => {
      updatePosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updatePosition]);

  return [ref, updatePosition];
}

// Hook for scroll-triggered staggered animations
export function useStaggeredAnimation(
  itemCount: number,
  options: ScrollAnimationOptions = {}
): [
  React.RefObject<HTMLDivElement>,
  (index: number) => React.RefObject<HTMLDivElement>
] {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  // Initialize item refs
  if (itemRefs.current.length !== itemCount) {
    itemRefs.current = Array(itemCount).fill(null).map((_, i) => {
      return itemRefs.current[i] || React.createRef<HTMLDivElement>();
    });
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          itemRefs.current.forEach((itemRef, index) => {
            if (itemRef.current) {
              const delay = index * 100; // 100ms stagger
              setTimeout(() => {
                itemRef.current?.classList.add('animate-in');
              }, delay);
            }
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    observer.observe(container);

    return () => {
      observer.unobserve(container);
    };
  }, [itemCount]);

  const getItemRef = (index: number) => {
    return itemRefs.current[index] || React.createRef<HTMLDivElement>();
  };

  return [containerRef, getItemRef];
}