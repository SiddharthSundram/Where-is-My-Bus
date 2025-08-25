"use client";

import { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface City {
  name: string;
  x: number;
  y: number;
  population: string;
}

export function IndiaMap() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  
  const cities: City[] = [
    { name: 'Mumbai', x: 45, y: 65, population: '20M' },
    { name: 'Delhi', x: 65, y: 25, population: '30M' },
    { name: 'Bangalore', x: 50, y: 75, population: '12M' },
    { name: 'Chennai', x: 65, y: 85, population: '11M' },
    { name: 'Kolkata', x: 80, y: 45, population: '15M' },
    { name: 'Hyderabad', x: 55, y: 70, population: '9M' },
    { name: 'Pune', x: 48, y: 68, population: '6M' },
    { name: 'Ahmedabad', x: 35, y: 40, population: '8M' }
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl overflow-hidden">
      {/* Simplified India Map SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* India outline (simplified) */}
        <path 
          d="M 30 20 L 35 15 L 45 12 L 55 15 L 65 18 L 75 22 L 85 30 L 88 40 L 90 50 L 88 60 L 85 70 L 80 80 L 75 85 L 70 88 L 65 90 L 60 92 L 55 90 L 50 88 L 45 85 L 40 80 L 35 75 L 30 70 L 25 65 L 20 60 L 18 50 L 20 40 L 25 30 L 30 20 Z"
          fill="url(#mapGradient)" 
          stroke="#6366f1" 
          strokeWidth="0.5"
          className="transition-all duration-300 hover:opacity-80"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#dbeafe', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#e9d5ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#fce7f3', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* City markers */}
        {cities.map((city, index) => (
          <g key={city.name}>
            <circle
              cx={city.x}
              cy={city.y}
              r="2"
              fill="#ef4444"
              className="cursor-pointer transition-all duration-300 hover:r-3"
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
            />
            <text
              x={city.x + 3}
              y={city.y - 3}
              fontSize="2"
              fill="#1f2937"
              fontWeight="bold"
              className="pointer-events-none"
            >
              {city.name}
            </text>
          </g>
        ))}
      </svg>
      
      {/* City info overlay */}
      {hoveredCity && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-xs">
          <div className="flex items-center space-x-2 mb-2">
            <FaMapMarkerAlt className="text-red-500" />
            <h3 className="font-bold text-lg">{hoveredCity}</h3>
          </div>
          <p className="text-sm text-gray-600">
            {cities.find(c => c.name === hoveredCity)?.population}+ users served
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Real-time bus tracking available
          </p>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-md">
        <h4 className="font-bold text-sm mb-2">Service Coverage</h4>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Major Cities (50+)</span>
        </div>
        <div className="flex items-center space-x-2 text-xs mt-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Real-time Tracking</span>
        </div>
      </div>
      
      {/* Kolkata marker (headquarters) */}
      <div 
        className="absolute w-4 h-4 bg-red-600 rounded-full animate-pulse cursor-pointer"
        style={{ left: '80%', top: '45%' }}
        onMouseEnter={() => setHoveredCity('Kolkata')}
        onMouseLeave={() => setHoveredCity(null)}
      >
        <div className="absolute -top-8 -left-8 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Headquarters
        </div>
      </div>
    </div>
  );
}