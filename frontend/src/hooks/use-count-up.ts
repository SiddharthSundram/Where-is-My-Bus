"use client";

import { useState, useEffect } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function useCountUp({ end, duration = 2000, suffix = '', prefix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(`[data-count-end="${end}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [end]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationId: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const currentValue = Math.floor(progress * end);
      setCount(currentValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animateCount);
      }
    };

    animationId = requestAnimationFrame(animateCount);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isVisible, end, duration]);

  return `${prefix}${count.toLocaleString()}${suffix}`;
}