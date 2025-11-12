import React from 'react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { formatCurrency, getPlayerInitials } from '../utils/calculations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse, faChartLine, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';

export function LiveTracker() {
  const { getOwnedPlayers, updatePlayer, getTotalUnrealisedValue, getTotalUnrealisedPnL, getTotalPortfolioValue, settings } = usePortfolioStore();
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  const ownedPlayers = getOwnedPlayers();
  const totalUnrealisedValue = getTotalUnrealisedValue();
  const totalUnrealisedPnL = getTotalUnrealisedPnL();
  const totalPortfolioValue = getTotalPortfolioValue();

  const handlePriceEdit = (playerName: string, currentPrice: number) => {
    setEditingPlayer(playerName);
    setTempPrice(currentPrice.toFixed(4));
  };

  const handlePriceUpdate = (playerName: string) => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice >= 0) {
      updatePlayer(playerName, { latest_price: newPrice });
    }
    setEditingPlayer(null);
    setTempPrice('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, playerName: string) => {
    if (e.key === 'Enter') {
      handlePriceUpdate(playerName);
    } else if (e.key === 'Escape') {
      setEditingPlayer(null);
      setTempPrice('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-text">Live Price Tracker</h2>
          <p className="text-[14px] text-dim mt-1">Click any price to edit and update portfolio values in real-time</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green/10 border border-green/20">
          <FontAwesomeIcon icon={faHeartPulse} className="h-5 w-5 text-green animate-pulse" />
          <span className="text-[14px] font-semibold text-green">Live Updates</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <div className="text-[12px] text-dim uppercase tracking-wide mb-2">Holdings Value</div>
          <div className="text-[28px] font-bold text-text">${totalUnrealisedValue.toFixed(2)}</div>
          <div className={`text-[12px] mt-1 flex items-center gap-1 ${totalUnrealisedPnL >= 0 ? 'text-green' : 'text-red'}`}>
            {totalUnrealisedPnL >= 0 ? <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-green" /> : <FontAwesomeIcon icon={faArrowTrendDown} className="h-4 w-4 text-red" />}
            {formatCurrency(totalUnrealisedPnL)} ({((totalUnrealisedPnL / (totalUnrealisedValue - totalUnrealisedPnL)) * 100).toFixed(2)}%)
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <div className="text-[12px] text-dim uppercase tracking-wide mb-2">Total Account Value</div>
          <div className="text-[28px] font-bold text-text">${totalPortfolioValue.toFixed(2)}</div>
          <div className="text-[12px] text-dim mt-1">Holdings + Cash</div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <div className="text-[12px] text-dim uppercase tracking-wide mb-2">Cash Balance</div>
          <div className="text-[28px] font-bold text-text">${settings.cash_balance.toFixed(2)}</div>
          <div className="text-[12px] text-dim mt-1">Available to trade</div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <div className="text-[12px] text-dim uppercase tracking-wide mb-2">Unrealised P&L</div>
          <div className={`text-[28px] font-bold ${totalUnrealisedPnL >= 0 ? 'text-green' : 'text-red'}`}>
            {formatCurrency(totalUnrealisedPnL)}
          </div>
          <div className="text-[12px] text-dim mt-1">
            {((totalUnrealisedPnL / (totalUnrealisedValue - totalUnrealisedPnL)) * 100).toFixed(2)}% ROI
          </div>
        </div>
      </div>

      {/* Live Price Table */}
      <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
        <h3 className="text-[18px] font-semibold text-text mb-4">Live Positions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke">
                <th className="pb-3 text-left text-[12px] text-dim uppercase tracking-wide">Player</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Shares</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Avg Cost</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">
                  Live Price
                  <span className="ml-1 text-[10px] text-green">(Click to edit)</span>
                </th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Market Value</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Position P&L</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {ownedPlayers.map((player, idx) => {
                const isPositivePnL = player.unrealised_pnl >= 0;
                const pnlPercentage = ((player.latest_price - player.avg_cost) / player.avg_cost) * 100;
                
                return (
                  <tr key={idx} className="border-b border-stroke/50 hover:bg-muted/20 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] text-text font-semibold">
                          {getPlayerInitials(player.name)}
                        </div>
                        <span className="text-[14px] text-text font-semibold">{player.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right text-[14px] text-text">
                      {player.shares_owned.toLocaleString()}
                    </td>
                    <td className="py-4 text-right text-[14px] text-dim">
                      ${player.avg_cost.toFixed(4)}
                    </td>
                    <td className="py-4 text-right">
                      {editingPlayer === player.name ? (
                        <input
                          type="number"
                          step="0.0001"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(e.target.value)}
                          onBlur={() => handlePriceUpdate(player.name)}
                          onKeyDown={(e) => handleKeyPress(e, player.name)}
                          autoFocus
                          className="w-24 px-2 py-1 text-right text-[14px] bg-muted border border-green rounded text-text focus:outline-none focus:border-green"
                        />
                      ) : (
                        <button
                          onClick={() => handlePriceEdit(player.name, player.latest_price)}
                          className="text-[14px] text-text hover:text-green transition-colors font-mono px-2 py-1 rounded hover:bg-muted"
                        >
                          ${player.latest_price.toFixed(4)}
                        </button>
                      )}
                    </td>
                    <td className="py-4 text-right text-[14px] text-text font-semibold">
                      ${player.unrealised_value.toFixed(2)}
                    </td>
                    <td className={`py-4 text-right text-[14px] font-semibold ${isPositivePnL ? 'text-green' : 'text-red'}`}>
                      {formatCurrency(player.unrealised_pnl)}
                    </td>
                    <td className={`py-4 text-right text-[14px] font-semibold ${isPositivePnL ? 'text-green' : 'text-red'}`}>
                      {isPositivePnL ? '+' : ''}{pnlPercentage.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl bg-blue/5 border border-blue/20 p-4">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-blue mt-0.5" />
          <div>
            <h4 className="text-[14px] font-semibold text-text mb-1">How to use Live Tracker</h4>
            <ul className="text-[13px] text-dim space-y-1">
              <li>• Click any price in the "Live Price" column to edit</li>
              <li>• Press Enter to save or Escape to cancel</li>
              <li>• All portfolio values update automatically when you change a price</li>
              <li>• Market Value = Current Price × Shares Owned</li>
              <li>• Position P&L = (Current Price - Avg Cost) × Shares</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}