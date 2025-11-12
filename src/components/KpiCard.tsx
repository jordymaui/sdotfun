import React from 'react';
import { Sparkline } from './Sparkline';

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  sparklineData?: number[];
}

export function KpiCard({ label, value, delta, sparklineData = [] }: KpiCardProps) {
  const isPositive = delta !== undefined && delta >= 0;
  const deltaColor = isPositive ? 'text-green' : 'text-red';

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-card p-6 border border-stroke shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-dim uppercase tracking-wide">{label}</span>
          <span className="text-[28px] font-semibold text-text">{value}</span>
          {delta !== undefined && (
            <span className={`text-[14px] ${deltaColor}`}>
              {isPositive ? '+' : ''}
              {delta.toFixed(2)}%
            </span>
          )}
        </div>
        {sparklineData.length > 0 && (
          <div className="h-12 w-24">
            <Sparkline 
              data={sparklineData} 
              width={96} 
              height={48}
              color={isPositive ? '#27C07D' : '#FF5C5C'}
            />
          </div>
        )}
      </div>
    </div>
  );
}