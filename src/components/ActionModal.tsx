import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useStore } from '../store/useStore';

interface ActionModalProps {
  player: string;
  action: 'buy' | 'sell';
  onClose: () => void;
}

export function ActionModal({ player, action, onClose }: ActionModalProps) {
  const [shares, setShares] = useState('');
  const [price, setPrice] = useState('');
  const addTrade = useStore(state => state.addTrade);

  const handleConfirm = () => {
    if (!shares || !price) return;

    const trade = {
      ts: new Date().toISOString(),
      player,
      side: action,
      shares: parseFloat(shares),
      price: parseFloat(price),
    };

    addTrade(trade);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-bg/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-card p-6 border border-stroke shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-semibold text-text">
            {action === 'buy' ? 'Buy' : 'Sell'} {player}
          </h3>
          <button
            onClick={onClose}
            className="text-dim hover:text-text transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
              Shares
            </label>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-stroke text-text placeholder:text-dim focus:outline-none focus:border-green"
            />
          </div>

          <div>
            <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
              Price
            </label>
            <input
              type="number"
              step="0.0001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.0000"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-stroke text-text placeholder:text-dim focus:outline-none focus:border-green"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg bg-muted text-text font-semibold hover:opacity-90 transition-opacity"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!shares || !price}
            className="flex-1 px-4 py-3 rounded-lg bg-green text-app-bg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}