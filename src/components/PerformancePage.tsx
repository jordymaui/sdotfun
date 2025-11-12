import React from 'react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faChartLine, faArrowTrendDown, faWallet, faChartPie, faArrowUp, faArrowDown, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

export function PerformancePage() {
  const { getOwnedPlayers, settings, trades } = usePortfolioStore();
  const ownedPlayers = getOwnedPlayers();

  // Calculate metrics
  const totalHoldingsValue = ownedPlayers.reduce((sum, p) => sum + p.unrealised_value, 0);
  const totalCostBasis = ownedPlayers.reduce((sum, p) => sum + p.avg_cost_value, 0);
  const unrealisedPnL = totalHoldingsValue - totalCostBasis;
  const realisedPnL = trades.reduce((sum, t) => sum + (t.realised_pnl || 0), 0);
  const totalPnL = unrealisedPnL + realisedPnL;
  const totalFees = settings.fees_paid;
  
  const totalAccountValue = totalHoldingsValue + settings.cash_balance;
  const totalDeposited = settings.deposit_total;
  const netReturn = totalAccountValue - totalDeposited;
  const returnPercentage = totalDeposited > 0 ? (netReturn / totalDeposited) * 100 : 0;

  // Portfolio composition data
  const compositionData = [
    { name: 'Player Holdings', value: totalHoldingsValue, color: '#10B981' },
    { name: 'Cash', value: settings.cash_balance, color: '#3B82F6' },
  ];

  // P&L breakdown data
  const pnlBreakdownData = [
    { name: 'Deposits', value: totalDeposited, color: '#6366F1' },
    { name: 'Unrealised P&L', value: Math.abs(unrealisedPnL), color: unrealisedPnL >= 0 ? '#10B981' : '#EF4444' },
    { name: 'Realised P&L', value: Math.abs(realisedPnL), color: realisedPnL >= 0 ? '#10B981' : '#EF4444' },
    { name: 'Fees Paid', value: totalFees, color: '#F59E0B' },
  ];

  // Top performers by unrealised P&L
  const topPerformers = [...ownedPlayers]
    .sort((a, b) => b.unrealised_pnl - a.unrealised_pnl)
    .slice(0, 5);

  const bottomPerformers = [...ownedPlayers]
    .sort((a, b) => a.unrealised_pnl - b.unrealised_pnl)
    .slice(0, 5);

  // Portfolio allocation by player
  const allocationData = [...ownedPlayers]
    .sort((a, b) => b.unrealised_value - a.unrealised_value)
    .slice(0, 10)
    .map(p => ({
      name: p.name,
      value: p.unrealised_value,
      percentage: ((p.unrealised_value / totalHoldingsValue) * 100).toFixed(1),
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-semibold text-text mb-1">Performance Analytics</h2>
          <p className="text-[14px] text-dim">Comprehensive overview of your portfolio strategy and financial performance</p>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-card p-5 border border-stroke shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-dim uppercase tracking-wide">Total Account Value</span>
            <FontAwesomeIcon icon={faWallet} className="h-4 w-4 text-green" />
          </div>
          <div className="text-[28px] font-bold text-text">${totalAccountValue.toFixed(2)}</div>
          <div className={`flex items-center gap-1 mt-2 text-[12px] ${returnPercentage >= 0 ? 'text-green' : 'text-red'}`}>
            {returnPercentage >= 0 ? <FontAwesomeIcon icon={faArrowUp} className="h-3 w-3" /> : <FontAwesomeIcon icon={faArrowDown} className="h-3 w-3" />}
            <span>{returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}% return</span>
          </div>
        </div>

        <div className="rounded-xl bg-card p-5 border border-stroke shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-dim uppercase tracking-wide">Total Deposited</span>
            <FontAwesomeIcon icon={faDollarSign} className="h-4 w-4 text-blue" />
          </div>
          <div className="text-[28px] font-bold text-text">${totalDeposited.toFixed(2)}</div>
          <div className="text-[12px] text-dim mt-2">
            Cash: ${settings.cash_balance.toFixed(2)}
          </div>
        </div>

        <div className="rounded-xl bg-card p-5 border border-stroke shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-dim uppercase tracking-wide">Unrealised P&L</span>
            {unrealisedPnL >= 0 ? <FontAwesomeIcon icon={faArrowTrendUp} className="h-4 w-4 text-green" /> : <FontAwesomeIcon icon={faArrowTrendDown} className="h-4 w-4 text-red" />}
          </div>
          <div className={`text-[28px] font-bold ${unrealisedPnL >= 0 ? 'text-green' : 'text-red'}`}>
            ${unrealisedPnL >= 0 ? '+' : ''}{unrealisedPnL.toFixed(2)}
          </div>
          <div className="text-[12px] text-dim mt-2">
            From {ownedPlayers.length} positions
          </div>
        </div>

        <div className="rounded-xl bg-card p-5 border border-stroke shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-dim uppercase tracking-wide">Realised P&L</span>
            {realisedPnL >= 0 ? <FontAwesomeIcon icon={faArrowTrendUp} className="h-4 w-4 text-green" /> : <FontAwesomeIcon icon={faArrowTrendDown} className="h-4 w-4 text-red" />}
          </div>
          <div className={`text-[28px] font-bold ${realisedPnL >= 0 ? 'text-green' : 'text-red'}`}>
            ${realisedPnL >= 0 ? '+' : ''}{realisedPnL.toFixed(2)}
          </div>
          <div className="text-[12px] text-dim mt-2">
            Fees: ${totalFees.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Composition Pie Chart */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <h3 className="text-[18px] font-semibold text-text mb-4">Portfolio Composition</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141820',
                    border: '1px solid #2A3140',
                    borderRadius: '8px',
                    color: '#E9EEF7',
                  }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green"></div>
              <div>
                <div className="text-[12px] text-dim">Holdings</div>
                <div className="text-[14px] font-semibold text-text">${totalHoldingsValue.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue"></div>
              <div>
                <div className="text-[12px] text-dim">Cash</div>
                <div className="text-[14px] font-semibold text-text">${settings.cash_balance.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* P&L Breakdown Bar Chart */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <h3 className="text-[18px] font-semibold text-text mb-4">Financial Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnlBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3140" />
                <XAxis dataKey="name" stroke="#7B8CA3" style={{ fontSize: '12px' }} />
                <YAxis stroke="#7B8CA3" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141820',
                    border: '1px solid #2A3140',
                    borderRadius: '8px',
                    color: '#E9EEF7',
                  }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Bar dataKey="value" fill="#8884d8">
                  {pnlBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 text-[12px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6366F1]"></div>
              <span className="text-dim">Deposits: ${totalDeposited.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
              <span className="text-dim">Fees: ${totalFees.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Holdings Table */}
      <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
        <h3 className="text-[18px] font-semibold text-text mb-4">Top 10 Holdings by Value</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke">
                <th className="text-left py-3 px-4 text-[12px] text-dim uppercase tracking-wide">Player</th>
                <th className="text-right py-3 px-4 text-[12px] text-dim uppercase tracking-wide">Value</th>
                <th className="text-right py-3 px-4 text-[12px] text-dim uppercase tracking-wide">% of Portfolio</th>
                <th className="text-right py-3 px-4 text-[12px] text-dim uppercase tracking-wide">Shares</th>
                <th className="text-right py-3 px-4 text-[12px] text-dim uppercase tracking-wide">Avg Cost</th>
                <th className="text-right py-3 px-4 text-[12px] text-dim uppercase tracking-wide">Current Price</th>
              </tr>
            </thead>
            <tbody>
              {allocationData.map((item, idx) => {
                const player = ownedPlayers.find(p => p.name === item.name);
                return (
                  <tr key={idx} className="border-b border-stroke/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 text-[14px] font-semibold text-text">{item.name}</td>
                    <td className="py-3 px-4 text-[14px] text-text text-right">${item.value.toFixed(2)}</td>
                    <td className="py-3 px-4 text-[14px] text-green text-right">{item.percentage}%</td>
                    <td className="py-3 px-4 text-[14px] text-dim text-right">{player?.shares_owned.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[14px] text-dim text-right">${player?.avg_cost.toFixed(4)}</td>
                    <td className="py-3 px-4 text-[14px] text-text text-right">${player?.latest_price.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Leaders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faArrowTrendUp} className="h-5 w-5 text-green" />
            <h3 className="text-[18px] font-semibold text-text">Top 5 Performers</h3>
          </div>
          <div className="space-y-3">
            {topPerformers.map((player, idx) => {
              const pnlPercent = player.avg_cost_value > 0 ? ((player.unrealised_pnl / player.avg_cost_value) * 100) : 0;
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                      idx === 0 ? 'bg-green text-app-bg' : 'bg-muted text-dim'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-text">{player.name}</div>
                      <div className="text-[12px] text-dim">{player.shares_owned.toLocaleString()} shares</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-semibold text-green">+${player.unrealised_pnl.toFixed(2)}</div>
                    <div className="text-[12px] text-green">+{pnlPercent.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Performers */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faArrowTrendDown} className="h-5 w-5 text-red" />
            <h3 className="text-[18px] font-semibold text-text">Bottom 5 Performers</h3>
          </div>
          <div className="space-y-3">
            {bottomPerformers.map((player, idx) => {
              const pnlPercent = player.avg_cost_value > 0 ? ((player.unrealised_pnl / player.avg_cost_value) * 100) : 0;
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[12px] font-bold text-dim">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-text">{player.name}</div>
                      <div className="text-[12px] text-dim">{player.shares_owned.toLocaleString()} shares</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-semibold text-red">${player.unrealised_pnl.toFixed(2)}</div>
                    <div className="text-[12px] text-red">{pnlPercent.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-card p-5 border border-stroke shadow-card">
          <div className="text-[12px] text-dim uppercase tracking-wide mb-2">Total P&L</div>
          <div className={`text-[24px] font-bold ${totalPnL >= 0 ? 'text-green' : 'text-red'}`}>
            ${totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)}
          </div>
          <div className="text-[12px] text-dim mt-1">
            Unrealised: ${unrealisedPnL.toFixed(2)} | Realised: ${realisedPnL.toFixed(2)}
          </div>
        </div>

        <div className="rounded-xl bg-card p-5 border border-stroke shadow-card">
          <div className="text-[12px] text-dim uppercase tracking-wide mb-2">Net Return</div>
          <div className={`text-[24px] font-bold ${netReturn >= 0 ? 'text-green' : 'text-red'}`}>
            ${netReturn >= 0 ? '+' : ''}{netReturn.toFixed(2)}
          </div>
          <div className="text-[12px] text-dim mt-1">
            After ${totalFees.toFixed(2)} in fees
          </div>
        </div>

        <div className="rounded-xl bg-card p-5 border border-stroke shadow-card">
          <div className="text-[12px] text-dim uppercase tracking-wide mb-2">Cost Basis</div>
          <div className="text-[24px] font-bold text-text">${totalCostBasis.toFixed(2)}</div>
          <div className="text-[12px] text-dim mt-1">
            Across {ownedPlayers.length} positions
          </div>
        </div>
      </div>
    </div>
  );
}