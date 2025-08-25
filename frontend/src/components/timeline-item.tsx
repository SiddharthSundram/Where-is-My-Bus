"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  index: number;
  isEven: boolean;
}

export function TimelineItem({ year, title, description, index, isEven }: TimelineItemProps) {
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

    const element = document.getElementById(`timeline-item-${index}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [index]);

  const delay = index * 200;

  return (
    <div 
      id={`timeline-item-${index}`}
      className={`relative flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'} transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-1/2 pr-8">
        <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-primary/20">
          <CardContent className="pt-6">
            <Badge variant="outline" className="mb-3 text-sm font-medium px-3 py-1">
              {year}
            </Badge>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </CardContent>
        </Card>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-background shadow-lg hover:scale-125 transition-all duration-300"></div>
      <div className="w-1/2 pl-8"></div>
    </div>
  );
}