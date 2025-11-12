import React, { useState, useEffect } from 'react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { KpiCard } from './KpiCard';
import { PortfolioTable } from './PortfolioTable';
import { formatCurrency, getPlayerInitials } from '../utils/calculations';
import { TagPill } from './TagPill';
import { SortableTableHeader } from './SortableTableHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faPlus, faRotate, faBullseye, faHeartPulse, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner@2.0.3';
import { AreaChartCard } from './AreaChartCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataFetcher } from './DataFetcher';

export function PortfolioOverview() {
  const {
    settings,
    getTotalUnrealisedValue,
    getTotalUnrealisedPnL,
    getTotalRealisedPnL,
    getTotalPortfolioValue,
    getOwnedPlayers,
    addTrade,
    releaseBatchFilter,
    setReleaseBatchFilter,
    trades,
    refreshFromSupabase,
    isLoading,
    lastRefreshed,
  } = usePortfolioStore();

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [lastAction, setLastAction] = useState<{ player: string; action: 'Buy' | 'Sell'; shares: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh from Supabase every 30 seconds
  useEffect(() => {
    // Initial fetch
    refreshFromSupabase();
    
    // Set up interval for auto-refresh
    const interval = setInterval(() => {
      refreshFromSupabase();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    toast.loading('Refreshing portfolio data...');
    await refreshFromSupabase();
    toast.success('Portfolio data refreshed!');
    setIsRefreshing(false);
  };

  const totalUnrealisedValue = getTotalUnrealisedValue();
  const totalUnrealisedPnL = getTotalUnrealisedPnL();
  const totalRealisedPnL = getTotalRealisedPnL();
  const totalPortfolioValue = getTotalPortfolioValue();
  const totalROI = totalUnrealisedValue > 0 ? (totalUnrealisedPnL / (totalUnrealisedValue - totalUnrealisedPnL)) * 100 : 0;

  let ownedPlayers = getOwnedPlayers();
  
  // Apply batch filter for table
  if (releaseBatchFilter !== 'All') {
    ownedPlayers = ownedPlayers.filter(p => p.release_batch === releaseBatchFilter);
  }

  // Apply sorting
  if (sortConfig) {
    ownedPlayers.sort((a, b) => {
      let aVal: any = a[sortConfig.key as keyof typeof a];
      let bVal: any = b[sortConfig.key as keyof typeof b];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  // Mock sparkline data
  const sparklineData = [650, 680, 665, 690, 695, totalUnrealisedValue];

  // Mock portfolio value chart data
  const portfolioChartData = [
    { date: 'Nov 1', value: 650 },
    { date: 'Nov 3', value: 680 },
    { date: 'Nov 5', value: 665 },
    { date: 'Nov 7', value: 690 },
    { date: 'Nov 9', value: 695 },
    { date: 'Nov 10', value: totalUnrealisedValue },
  ];

  // P&L Tracker data
  const pnlTrackerData = [
    { date: 'Nov 1', deposits: 560, profit: 90, total: 650 },
    { date: 'Nov 3', deposits: 560, profit: 120.5, total: 680.5 },
    { date: 'Nov 5', deposits: 560, profit: 105.25, total: 665.25 },
    { date: 'Nov 7', deposits: 560, profit: 130.75, total: 690.75 },
    { date: 'Nov 9', deposits: 560, profit: 135, total: 695 },
    { date: 'Nov 10', deposits: 560, profit: totalUnrealisedPnL, total: totalUnrealisedValue },
  ];

  const handleQuickAction = (playerName: string, action: 'Buy' | 'Sell', shares: number) => {
    const player = ownedPlayers.find(p => p.name === playerName);
    if (!player) return;

    if (action === 'Sell' && shares > player.shares_owned) {
      toast.error(`Cannot sell ${shares} shares. Only ${player.shares_owned} available.`);
      return;
    }

    addTrade({
      date: new Date().toISOString().split('T')[0],
      player: playerName,
      action,
      shares,
      price: player.latest_price,
      fees: 0,
      notes: `Quick ${action} ${shares} shares`,
    });

    setLastAction({ player: playerName, action, shares });
    toast.success(`${action} ${shares} shares of ${playerName}`);
  };

  const handleUndo = () => {
    if (!lastAction) return;
    
    // Reverse the last action
    const reverseAction = lastAction.action === 'Buy' ? 'Sell' : 'Buy';
    const player = ownedPlayers.find(p => p.name === lastAction.player);
    
    if (player) {
      addTrade({
        date: new Date().toISOString().split('T')[0],
        player: lastAction.player,
        action: reverseAction as 'Buy' | 'Sell',
        shares: lastAction.shares,
        price: player.latest_price,
        fees: 0,
        notes: `Undo: ${lastAction.action} ${lastAction.shares} shares`,
      });
      
      toast.success('Action undone');
      setLastAction(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Data Fetcher */}
      <DataFetcher />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <KpiCard
          label="Total Portfolio"
          value={`$${totalPortfolioValue.toFixed(2)}`}
          delta={((totalPortfolioValue - settings.deposit_total) / settings.deposit_total) * 100}
          sparklineData={sparklineData}
        />
        <KpiCard
          label="Player Value"
          value={`$${totalUnrealisedValue.toFixed(2)}`}
          delta={totalROI}
          sparklineData={sparklineData}
        />
        <KpiCard
          label="Cash Balance"
          value={`$${settings.cash_balance.toFixed(2)}`}
          delta={0}
          sparklineData={[settings.cash_balance, settings.cash_balance, settings.cash_balance, settings.cash_balance, settings.cash_balance, settings.cash_balance]}
        />
        <KpiCard
          label="Unrealised P&L"
          value={`$${totalUnrealisedPnL.toFixed(2)}`}
          delta={(totalUnrealisedPnL / settings.deposit_total) * 100}
          sparklineData={sparklineData}
        />
        <KpiCard
          label="Realised P&L"
          value={`$${totalRealisedPnL.toFixed(2)}`}
          delta={totalRealisedPnL > 0 ? (totalRealisedPnL / settings.deposit_total) * 100 : 0}
          sparklineData={sparklineData}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AreaChartCard
          title="Portfolio Value"
          subtitle="Last 7 days"
          data={portfolioChartData}
          dataKey="value"
          xAxisKey="date"
        />
        
        {/* Top Holdings - Smaller */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <h3 className="text-[16px] font-semibold text-text mb-4">Top Holdings</h3>
          <div className="space-y-2">
            {ownedPlayers.slice(0, 4).map((player, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] text-text font-semibold">
                    {getPlayerInitials(player.name)}
                  </div>
                  <span className="text-[12px] text-text">{player.name}</span>
                </div>
                <span className={`text-[12px] font-semibold ${player.unrealised_pnl >= 0 ? 'text-green' : 'text-red'}`}>
                  {formatCurrency(player.unrealised_pnl)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* P&L Tracker */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <h3 className="text-[16px] font-semibold text-text mb-4">P&L Tracker</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={pnlTrackerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3140" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7A99"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#6B7A99' }}
              />
              <YAxis 
                stroke="#6B7A99"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#6B7A99' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#141820', 
                  border: '1px solid #2A3140',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line type="monotone" dataKey="deposits" stroke="#6B7A99" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="profit" stroke="#00D95F" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="total" stroke="#4A9EFF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faHeartPulse} className="h-5 w-5 text-green" />
          <h3 className="text-[18px] font-semibold text-text">Recent Activity</h3>
          <span className="text-[12px] text-dim ml-auto">Portfolio Update – 12 Nov Morning (Robinson + St.Brown + Kelce Adds)</span>
        </div>
        
        <div className="space-y-3">
          {/* Deposit Entry */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-green/10 border border-green/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5 text-green" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-text">Deposit Added</div>
                <div className="text-[12px] text-dim">11/11/2025 Evening • Total deposits now $1,000.00</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[16px] font-bold text-green">+$163.00</div>
              <div className="text-[11px] text-dim">GOLD Transfer In</div>
            </div>
          </div>

          {/* Latest Trade Entries */}
          {trades.slice().reverse().slice(0, 4).map((trade, idx) => {
            const isProfit = (trade.realised_pnl || 0) > 0;
            const isBuy = trade.action === 'Buy';
            
            return (
              <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${
                isBuy ? 'bg-blue/5 border border-blue/10' : 'bg-red/5 border border-red/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${
                    isBuy ? 'bg-blue/20' : 'bg-red/20'
                  } flex items-center justify-center`}>
                    <FontAwesomeIcon icon={faChartLine} className={`h-5 w-5 ${isBuy ? 'text-blue' : 'text-red'}`} />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-text">
                      {trade.action} {trade.shares.toLocaleString()} shares of {trade.player}
                    </div>
                    <div className="text-[12px] text-dim">
                      {trade.date} • @ ${trade.price.toFixed(4)} • Fees: ${trade.fees.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[16px] font-bold ${isBuy ? 'text-red' : 'text-green'}`}>
                    {isBuy ? '-' : '+'}${(trade.gross || 0).toFixed(2)}
                  </div>
                  <div className="text-[11px] text-dim">{trade.notes}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Holdings Table */}
      <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-semibold text-text">Holdings</h3>
          
          {/* Batch Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-dim uppercase tracking-wide">Batch:</span>
            <div className="flex gap-2">
              {(['All', 1, 2, 3] as const).map((batch) => (
                <button
                  key={batch}
                  onClick={() => setReleaseBatchFilter(batch)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                    releaseBatchFilter === batch
                      ? 'bg-green text-app-bg'
                      : 'bg-muted text-dim hover:text-text'
                  }`}
                >
                  {batch === 'All' ? 'All' : `Batch ${batch}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke">
                <SortableTableHeader label="Player" sortKey="name" currentSort={sortConfig} onSort={handleSort} align="left" />
                <SortableTableHeader label="Release Batch" sortKey="release_batch" currentSort={sortConfig} onSort={handleSort} align="center" />
                <SortableTableHeader label="Shares" sortKey="shares_owned" currentSort={sortConfig} onSort={handleSort} align="right" />
                <SortableTableHeader label="Avg Cost" sortKey="avg_cost" currentSort={sortConfig} onSort={handleSort} align="right" />
                <SortableTableHeader label="Last Price" sortKey="latest_price" currentSort={sortConfig} onSort={handleSort} align="right" />
                <SortableTableHeader label="Unrealised P&L" sortKey="unrealised_pnl" currentSort={sortConfig} onSort={handleSort} align="right" />
                <SortableTableHeader label="Tag" sortKey="status_tag" currentSort={sortConfig} onSort={handleSort} align="center" />
                <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">
                  <div className="flex items-center justify-end gap-2">
                    Quick Actions
                    {lastAction && (
                      <button
                        onClick={handleUndo}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        title="Undo last action"
                      >
                        <FontAwesomeIcon icon={faRotate} className="h-3 w-3 text-green" />
                      </button>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {ownedPlayers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-dim">
                    No holdings match the current filter. <button onClick={() => setReleaseBatchFilter('All')} className="text-green underline">Clear filters</button>
                  </td>
                </tr>
              ) : (
                ownedPlayers.map((player, idx) => {
                  const isPositivePnL = player.unrealised_pnl >= 0;
                  
                  return (
                    <tr key={idx} className="border-b border-stroke/50 hover:bg-muted/20 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] text-text font-semibold">
                            {getPlayerInitials(player.name)}
                          </div>
                          <span className="text-[14px] text-text">{player.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-stroke text-[11px] font-semibold text-text">
                          Batch {player.release_batch}
                        </span>
                      </td>
                      <td className="py-4 text-right text-[14px] text-text">
                        {player.shares_owned.toLocaleString()}
                      </td>
                      <td className="py-4 text-right text-[14px] text-text">
                        ${player.avg_cost.toFixed(4)}
                      </td>
                      <td className="py-4 text-right text-[14px] text-text">
                        ${player.latest_price.toFixed(4)}
                      </td>
                      <td className={`py-4 text-right text-[14px] ${isPositivePnL ? 'text-green' : 'text-red'}`}>
                        {formatCurrency(player.unrealised_pnl)}
                      </td>
                      <td className="py-4 text-center">
                        <TagPill tag={player.status_tag} />
                      </td>
                      <td className="py-4">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleQuickAction(player.name, 'Buy', 500)}
                            className="px-2 py-1 rounded text-[11px] font-semibold bg-green/20 text-green hover:bg-green/30 transition-colors"
                          >
                            Buy 500
                          </button>
                          <button
                            onClick={() => handleQuickAction(player.name, 'Buy', 1000)}
                            className="px-2 py-1 rounded text-[11px] font-semibold bg-green/20 text-green hover:bg-green/30 transition-colors"
                          >
                            Buy 1K
                          </button>
                          <button
                            onClick={() => handleQuickAction(player.name, 'Sell', Math.floor(player.shares_owned * 0.5))}
                            className="px-2 py-1 rounded text-[11px] font-semibold bg-red/20 text-red hover:bg-red/30 transition-colors"
                          >
                            Sell 50%
                          </button>
                          <button
                            onClick={() => handleQuickAction(player.name, 'Sell', Math.floor(player.shares_owned * 0.35))}
                            className="px-2 py-1 rounded text-[11px] font-semibold bg-red/20 text-red hover:bg-red/30 transition-colors"
                          >
                            Sell 35%
                          </button>
                        </div>
                      </td>
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