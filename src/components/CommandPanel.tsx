import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useStore, Position } from '../store/useStore';
import { toast } from 'sonner';

const EXAMPLE_JSON = `{
  "settings": {
    "initialDepositsUSD": 560,
    "sideLiquidityUSD": 200,
    "withdrawTargetUSD": 500
  },
  "positions": [
    { "player": "J. Jefferson", "tag": "Keep", "batch": "Batch 1", "shares": 2500, "avgCost": 0.0125, "price": 0.0125 },
    { "player": "J. Chase", "tag": "Keep", "batch": "Batch 1", "shares": 2000, "avgCost": 0.0125, "price": 0.0125 }
  ],
  "trades": [],
  "snapshots": [
    { "date": "2025-11-10", "portfolioValueUSD": 700.06, "cashUSD": 0, "realisedUSD": 0, "unrealisedUSD": 700.06, "depositsUSD": 560, "withdrawalsUSD": 0 }
  ]
}`;

const PARTIAL_EXAMPLE = `{
  "positions": [
    { "player": "A. St. Brown", "batch": "Batch 1" },
    { "player": "P. Mahomes", "price": 0.0145 }
  ]
}`;

export function CommandPanel() {
  const [jsonInput, setJsonInput] = useState(EXAMPLE_JSON);
  const { positions, updateFromJSON } = useStore();

  const handleRun = () => {
    try {
      const data = JSON.parse(jsonInput);
      
      // Check if this is a partial update (positions array with partial data)
      if (data.positions && Array.isArray(data.positions)) {
        const isPartialUpdate = data.positions.some(pos => 
          !pos.hasOwnProperty('shares') || 
          !pos.hasOwnProperty('avgCost') ||
          !pos.hasOwnProperty('price')
        );

        if (isPartialUpdate) {
          // Merge partial position updates by player name
          const mergedPositions = positions.map(existingPos => {
            const update = data.positions.find((p: Partial<Position>) => p.player === existingPos.player);
            return update ? { ...existingPos, ...update } : existingPos;
          });

          // Add new positions that don't exist yet (with all required fields)
          const newPositions = data.positions.filter((newPos: Partial<Position>) => 
            !positions.find(p => p.player === newPos.player) &&
            newPos.hasOwnProperty('shares') &&
            newPos.hasOwnProperty('avgCost') &&
            newPos.hasOwnProperty('price')
          );

          updateFromJSON({
            ...data,
            positions: [...mergedPositions, ...newPositions],
          });
          toast.success('Partial data merged successfully!');
          return;
        }
      }

      // Full update
      updateFromJSON(data);
      toast.success('Data updated successfully!');
    } catch (error) {
      toast.error('Invalid JSON. Please check your input.');
      console.error('JSON Parse Error:', error);
    }
  };

  return (
    <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <FontAwesomeIcon icon={faTerminal} className="h-5 w-5 text-green" />
        <h3 className="text-[18px] font-semibold text-text">Command Panel</h3>
      </div>
      <p className="text-[12px] text-dim mb-4">
        Paste JSON data to update all positions, trades, and snapshots live. Supports partial updates by player name.
      </p>
      <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-stroke">
        <p className="text-[11px] text-dim mb-2">Partial update example:</p>
        <pre className="text-[11px] text-text font-mono">{PARTIAL_EXAMPLE}</pre>
      </div>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder={EXAMPLE_JSON}
        className="w-full h-64 px-4 py-3 rounded-lg bg-muted border border-stroke text-text placeholder:text-dim font-mono text-[12px] focus:outline-none focus:border-green resize-none"
      />
      <button
        onClick={handleRun}
        className="mt-4 flex items-center gap-2 px-6 py-3 rounded-lg bg-green text-app-bg font-semibold hover:opacity-90 transition-opacity"
      >
        <FontAwesomeIcon icon={faPlay} className="h-4 w-4" />
        Run
      </button>
    </div>
  );
}