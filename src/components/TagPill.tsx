import React from 'react';

interface TagPillProps {
  tag: 'Keep' | 'Watch' | 'Sell';
  className?: string;
}

export function TagPill({ tag, className = '' }: TagPillProps) {
  const baseClass = 'pill text-[12px] font-semibold';
  const tagClass = tag === 'Keep' ? 'pill-keep' : tag === 'Watch' ? 'pill-watch' : 'pill-sell';
  
  return (
    <span className={`${baseClass} ${tagClass} ${className}`}>
      {tag}
    </span>
  );
}
