"use client";

import { useCountUp } from "@/hooks/use-count-up";

interface StatCardProps {
  number: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  suffix?: string;
}

export function StatCard({ number, label, icon: Icon, suffix = "" }: StatCardProps) {
  const countValue = useCountUp({ end: number, duration: 2000, suffix });

  return (
    <div className="text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-3 border-2 border-transparent hover:border-primary/20 rounded-xl p-6 bg-card">
      <Icon className="w-16 h-16 mx-auto mb-4 text-primary" />
      <div 
        data-count-end={number}
        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3 transform transition-all duration-300 hover:scale-105"
      >
        {countValue}
      </div>
      <p className="text-muted-foreground text-lg font-medium">{label}</p>
    </div>
  );
}