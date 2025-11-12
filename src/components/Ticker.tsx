import React from 'react';
import { Position } from '../store/useStore';

interface TickerProps {
  positions: Position[];
}

export function Ticker({ positions }: TickerProps) {
  // Get top 8 movers with mock price changes
  const movers = positions.slice(0, 8).map((pos, idx) => ({
    ...pos,
    priceChange: ((idx % 3) - 1) * (Math.random() * 3 + 0.5), // Random -3 to +3%
  }));

  return (
    <div className="border-b border-stroke bg-card/50 overflow-hidden">
      <div className="flex animate-marquee gap-8 px-8 py-3">
        {movers.concat(movers).map((mover, idx) => (
          <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[14px] text-text">{mover.player}</span>
            <span className="text-[14px] text-dim">${mover.price.toFixed(4)}</span>
            <span
              className={`text-[12px] ${
                mover.priceChange >= 0 ? 'text-green' : 'text-red'
              }`}
            >
              {mover.priceChange >= 0 ? '+' : ''}
              {mover.priceChange.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
