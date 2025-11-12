import React from 'react';

interface BatchPillProps {
  batch: 'Batch 1' | 'Batch 2';
}

export function BatchPill({ batch }: BatchPillProps) {
  const colorClass = batch === 'Batch 1' ? 'border-green text-green' : 'border-amber text-amber';
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${colorClass}`}>
      {batch}
    </span>
  );
}
