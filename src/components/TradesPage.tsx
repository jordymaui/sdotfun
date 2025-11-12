import React, { useState } from 'react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { formatCurrency, getPlayerInitials } from '../utils/calculations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';

export function TradesPage() {
  const { players, trades, addTrade, getTotalRealisedPnL } = usePortfolioStore();
  
  const [formData, setFormData] = useState({
    player: '',
    action: 'Buy' as 'Buy' | 'Sell',
    shares: '',
    price: '',
    fees: '0',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.player || !formData.shares || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    addTrade({
      date: new Date().toISOString().split('T')[0],
      player: formData.player,
      action: formData.action,
      shares: parseFloat(formData.shares),
      price: parseFloat(formData.price),
      fees: parseFloat(formData.fees) || 0,
      notes: formData.notes,
    });

    // Reset form
    setFormData({
      player: '',
      action: 'Buy',
      shares: '',
      price: '',
      fees: '0',
      notes: '',
    });

    toast.success(`Trade added: ${formData.action} ${formData.shares} shares of ${formData.player}`);
  };

  const totalRealisedPnL = getTotalRealisedPnL();
  let cumulativePnL = 0;

  // Recent trades (last 5)
  const recentTrades = [...trades].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Section: Add Trade Form + Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Trade Form */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5 text-green" />
            <h3 className="text-[18px] font-semibold text-text">Add Trade</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Player */}
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Player *
              </label>
              <select
                value={formData.player}
                onChange={(e) => setFormData({ ...formData, player: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-muted border border-stroke text-text text-[14px] focus:outline-none focus:border-green"
                required
              >
                <option value="">Select player...</option>
                {players.map(p => (
                  <option key={p.name} value={p.name}>
                    {p.name} {p.shares_owned > 0 ? `(${p.shares_owned} shares)` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Action */}
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Action *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, action: 'Buy' })}
                  className={`flex-1 px-4 py-2 rounded-lg text-[14px] font-semibold transition-colors ${
                    formData.action === 'Buy'
                      ? 'bg-green text-app-bg'
                      : 'bg-muted text-dim hover:text-text'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, action: 'Sell' })}
                  className={`flex-1 px-4 py-2 rounded-lg text-[14px] font-semibold transition-colors ${
                    formData.action === 'Sell'
                      ? 'bg-red text-app-bg'
                      : 'bg-muted text-dim hover:text-text'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Shares */}
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Shares *
              </label>
              <input
                type="number"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                placeholder="0"
                min="0"
                step="1"
                className="w-full px-4 py-2 rounded-lg bg-muted border border-stroke text-text placeholder:text-dim text-[14px] focus:outline-none focus:border-green"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Price per Share *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.0000"
                min="0"
                step="0.0001"
                className="w-full px-4 py-2 rounded-lg bg-muted border border-stroke text-text placeholder:text-dim text-[14px] focus:outline-none focus:border-green"
                required
              />
            </div>

            {/* Fees */}
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Fees
              </label>
              <input
                type="number"
                value={formData.fees}
                onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg bg-muted border border-stroke text-text placeholder:text-dim text-[14px] focus:outline-none focus:border-green"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Notes
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes..."
                className="w-full px-4 py-2 rounded-lg bg-muted border border-stroke text-text placeholder:text-dim text-[14px] focus:outline-none focus:border-green"
              />
            </div>

            {/* Calculation Preview */}
            {formData.shares && formData.price && (
              <div className="p-4 rounded-lg bg-muted/50 border border-stroke">
                <div className="flex justify-between text-[12px]">
                  <span className="text-dim">Net Amount:</span>
                  <span className="text-text font-semibold">
                    ${((parseFloat(formData.shares) * parseFloat(formData.price)) - parseFloat(formData.fees || '0')).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green text-app-bg font-semibold hover:opacity-90 transition-opacity"
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              Add Trade
            </button>
          </form>
        </div>

        {/* Recent Trades Overview */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <h3 className="text-[18px] font-semibold text-text mb-6">Recent Trades</h3>
          
          {/* Total Realised P&L */}
          <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-stroke">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-dim uppercase tracking-wide">Total Realised P&L</span>
              <span className={`text-[20px] font-semibold ${totalRealisedPnL >= 0 ? 'text-green' : 'text-red'}`}>
                {formatCurrency(totalRealisedPnL)}
              </span>
            </div>
          </div>

          {/* Recent Trades List */}
          <div className="space-y-3">
            {recentTrades.length === 0 ? (
              <div className="py-8 text-center text-dim text-[12px]">
                No trades yet. Add your first trade!
              </div>
            ) : (
              recentTrades.map((trade, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <span className="text-[10px] text-text font-semibold">
                        {getPlayerInitials(trade.player)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          trade.action === 'Buy' ? 'bg-green/20 text-green' : 'bg-red/20 text-red'
                        }`}>
                          {trade.action}
                        </span>
                        <span className="text-[13px] text-text font-semibold">{trade.player}</span>
                      </div>
                      <div className="text-[11px] text-dim mt-0.5">
                        {trade.shares.toLocaleString()} shares @ ${trade.price.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] text-text font-semibold">
                      ${trade.net?.toFixed(2)}
                    </div>
                    {trade.realised_pnl !== undefined && trade.realised_pnl !== 0 && (
                      <div className={`text-[11px] ${trade.realised_pnl >= 0 ? 'text-green' : 'text-red'}`}>
                        {formatCurrency(trade.realised_pnl)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full Trade History */}
      <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
        <h3 className="text-[18px] font-semibold text-text mb-6">
          Complete Trade History ({trades.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke">
                <th className="pb-3 text-left text-[12px] text-dim uppercase tracking-wide">Date</th>
                <th className="pb-3 text-left text-[12px] text-dim uppercase tracking-wide">Player</th>
                <th className="pb-3 text-center text-[12px] text-dim uppercase tracking-wide">Action</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Shares</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Price</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Gross</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Fees</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Net</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Realised P&L</th>
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Cumulative P&L</th>
                <th className="pb-3 text-left text-[12px] text-dim uppercase tracking-wide">Notes</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-dim">
                    No trades yet. Add your first trade above.
                  </td>
                </tr>
              ) : (
                [...trades].reverse().map((trade, idx) => {
                  cumulativePnL += trade.realised_pnl || 0;
                  const localCumulative = cumulativePnL;
                  
                  return (
                    <tr key={idx} className="border-b border-stroke/50 hover:bg-muted/20 transition-colors">
                      <td className="py-4 text-[14px] text-text">
                        {new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 text-[14px] text-text">{trade.player}</td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          trade.action === 'Buy' ? 'bg-green/20 text-green' : 'bg-red/20 text-red'
                        }`}>
                          {trade.action}
                        </span>
                      </td>
                      <td className="py-4 text-right text-[14px] text-text">{trade.shares.toLocaleString()}</td>
                      <td className="py-4 text-right text-[14px] text-text">${trade.price.toFixed(4)}</td>
                      <td className="py-4 text-right text-[14px] text-text">${trade.gross?.toFixed(2)}</td>
                      <td className="py-4 text-right text-[14px] text-red">${trade.fees.toFixed(2)}</td>
                      <td className="py-4 text-right text-[14px] text-text font-semibold">${trade.net?.toFixed(2)}</td>
                      <td className={`py-4 text-right text-[14px] ${(trade.realised_pnl || 0) >= 0 ? 'text-green' : 'text-red'}`}>
                        {trade.realised_pnl !== undefined && trade.realised_pnl !== 0 ? formatCurrency(trade.realised_pnl) : '-'}
                      </td>
                      <td className={`py-4 text-right text-[14px] font-semibold ${localCumulative >= 0 ? 'text-green' : 'text-red'}`}>
                        {formatCurrency(localCumulative)}
                      </td>
                      <td className="py-4 text-[12px] text-dim">{trade.notes || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}