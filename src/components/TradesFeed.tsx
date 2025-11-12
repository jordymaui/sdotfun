import React from 'react';
import { Trade } from '../store/useStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { getPlayerInitials } from '../utils/calculations';

interface TradesFeedProps {
  trades: Trade[];
}

export function TradesFeed({ trades }: TradesFeedProps) {
  const recentTrades = [...trades].reverse().slice(0, 20);

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
      <h3 className="text-[18px] font-semibold text-text mb-4">Trades Feed</h3>
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {recentTrades.length === 0 ? (
          <p className="text-[14px] text-dim text-center py-8">No trades yet</p>
        ) : (
          recentTrades.map((trade, idx) => {
            const initials = getPlayerInitials(trade.player);
            const isBuy = trade.side === 'buy';

            return (
              <div
                key={idx}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] text-text font-semibold">
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] text-text">{trade.player}</span>
                    <span className="text-[12px] text-dim">{formatTime(trade.ts)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold ${
                      isBuy ? 'bg-green/20 text-green' : 'bg-red/20 text-red'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={trade.side === 'buy' ? faArrowDown : faArrowUp} 
                      className="h-4 w-4"
                    />
                    {isBuy ? 'Buy' : 'Sell'}
                  </span>
                  <span className="text-[14px] text-text min-w-[60px] text-right">
                    {trade.shares.toLocaleString()}
                  </span>
                  <span className="text-[14px] text-dim min-w-[80px] text-right">
                    ${trade.price.toFixed(4)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}