import React from 'react';
import { getPlayerInitials } from '../utils/calculations';

interface ListItem {
  player: string;
  price: number;
  change?: number;
  team?: string;
}

interface ListCardProps {
  title: string;
  items: ListItem[];
}

export function ListCard({ title, items }: ListCardProps) {
  return (
    <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
      <h3 className="text-[18px] font-semibold text-text mb-4">{title}</h3>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => {
          const initials = getPlayerInitials(item.player);
          const isPositive = (item.change || 0) >= 0;
          
          return (
            <div key={idx} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-[12px] text-text font-semibold">
                  {initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] text-text">{item.player}</span>
                  {item.team && (
                    <span className="text-[12px] text-dim">{item.team}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gold"></div>
                  <span className="text-[14px] text-text font-semibold">
                    ${item.price.toFixed(4)}
                  </span>
                </div>
                {item.change !== undefined && (
                  <span className={`text-[12px] ${isPositive ? 'text-green' : 'text-red'}`}>
                    {isPositive ? '+' : ''}
                    {item.change.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
