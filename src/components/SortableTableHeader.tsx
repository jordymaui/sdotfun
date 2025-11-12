import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface SortableTableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
  align?: 'left' | 'center' | 'right';
}

export function SortableTableHeader({ 
  label, 
  sortKey, 
  currentSort, 
  onSort, 
  align = 'left' 
}: SortableTableHeaderProps) {
  const isActive = currentSort?.key === sortKey;
  
  return (
    <th 
      className={`pb-3 text-${align} text-[12px] text-dim uppercase tracking-wide cursor-pointer hover:text-text transition-colors select-none`}
      onClick={() => onSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}>
        {label}
        <div className="flex flex-col">
          <FontAwesomeIcon 
            icon={faChevronUp} 
            className={`h-3 w-3 -mb-1 ${isActive && currentSort.direction === 'asc' ? 'text-green' : 'text-dim/30'}`} 
          />
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`h-3 w-3 ${isActive && currentSort.direction === 'desc' ? 'text-green' : 'text-dim/30'}`} 
          />
        </div>
      </div>
    </th>
  );
}