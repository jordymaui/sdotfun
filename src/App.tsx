import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MainNav } from './components/MainNav';
import { DashboardNav } from './components/DashboardNav';
import { PortfolioTable } from './components/PortfolioTable';
import { TradesFeed } from './components/TradesFeed';
import { CommandPanel } from './components/CommandPanel';
import { Ticker } from './components/Ticker';
import { KpiCard } from './components/KpiCard';
import { ListCard } from './components/ListCard';
import { AreaChartCard } from './components/AreaChartCard';
import { useStore } from './store/useStore';
import { Toaster } from './components/ui/sonner';
import { PortfolioOverview } from './components/PortfolioOverview';
import { PlayersPage } from './components/PlayersPage';
import { TradesPage } from './components/TradesPage';
import { SettingsPage } from './components/SettingsPage';
import { PerformancePage } from './components/PerformancePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

const INITIAL_DATA = {
  settings: {
    initialDepositsUSD: 560,
    sideLiquidityUSD: 200,
    withdrawTargetUSD: 500,
  },
  positions: [
    { player: "J. Jefferson", tag: "Keep" as const, batch: "Batch 1" as const, shares: 2500, avgCost: 0.0125, price: 0.0125 },
    { player: "A. Brown", tag: "Keep" as const, batch: "Batch 1" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "C. Olave", tag: "Keep" as const, batch: "Batch 1" as const, shares: 1500, avgCost: 0.0125, price: 0.0125 },
    { player: "L. McConkey", tag: "Keep" as const, batch: "Batch 1" as const, shares: 1500, avgCost: 0.0125, price: 0.0125 },
    { player: "T. Kelce", tag: "Keep" as const, batch: "Batch 1" as const, shares: 1500, avgCost: 0.0125, price: 0.0125 },
    { player: "H. Henry", tag: "Watch" as const, batch: "Batch 1" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "J. Jacobs", tag: "Watch" as const, batch: "Batch 1" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "K. Walker", tag: "Watch" as const, batch: "Batch 1" as const, shares: 1500, avgCost: 0.0125, price: 0.0125 },
    { player: "J. Cook", tag: "Watch" as const, batch: "Batch 1" as const, shares: 1500, avgCost: 0.0125, price: 0.0125 },
    { player: "B. Mayfield", tag: "Watch" as const, batch: "Batch 1" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "D. Metcalf", tag: "Watch" as const, batch: "Batch 1" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "B. Bowers", tag: "Keep" as const, batch: "Batch 1" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "P. Mahomes", tag: "Watch" as const, batch: "Batch 1" as const, shares: 0, avgCost: 0, price: 0 },
    
    { player: "P. Nacua", tag: "Keep" as const, batch: "Batch 2" as const, shares: 2000, avgCost: 0.0125, price: 0.0125 },
    { player: "C. Brown", tag: "Watch" as const, batch: "Batch 2" as const, shares: 2000, avgCost: 0.0125, price: 0.0125 },
    { player: "K. Shakir", tag: "Watch" as const, batch: "Batch 2" as const, shares: 2000, avgCost: 0.0125, price: 0.0125 },
    { player: "J. Dobbins", tag: "Watch" as const, batch: "Batch 2" as const, shares: 1500, avgCost: 0.0125, price: 0.0125 },
    { player: "T. Henderson", tag: "Watch" as const, batch: "Batch 2" as const, shares: 1500, avgCost: 0.0125, price: 0.0125 },
    { player: "D. Henry", tag: "Watch" as const, batch: "Batch 2" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "T. Warren", tag: "Watch" as const, batch: "Batch 2" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "E. Egbuka", tag: "Watch" as const, batch: "Batch 2" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "J. Smith-Njigba", tag: "Watch" as const, batch: "Batch 2" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "D. Maye", tag: "Watch" as const, batch: "Batch 2" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "A. Kamara", tag: "Watch" as const, batch: "Batch 2" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
    { player: "G. Kittle", tag: "Watch" as const, batch: "Batch 2" as const, shares: 1000, avgCost: 0.0125, price: 0.0125 },
  ],
  trades: [],
  snapshots: [
    { date: "2025-11-01", portfolioValueUSD: 650.00, cashUSD: 0, realisedUSD: 0, unrealisedUSD: 650.00, depositsUSD: 560, withdrawalsUSD: 0 },
    { date: "2025-11-03", portfolioValueUSD: 680.50, cashUSD: 0, realisedUSD: 0, unrealisedUSD: 680.50, depositsUSD: 560, withdrawalsUSD: 0 },
    { date: "2025-11-05", portfolioValueUSD: 665.25, cashUSD: 0, realisedUSD: 0, unrealisedUSD: 665.25, depositsUSD: 560, withdrawalsUSD: 0 },
    { date: "2025-11-07", portfolioValueUSD: 690.75, cashUSD: 0, realisedUSD: 0, unrealisedUSD: 690.75, depositsUSD: 560, withdrawalsUSD: 0 },
    { date: "2025-11-09", portfolioValueUSD: 695.00, cashUSD: 0, realisedUSD: 0, unrealisedUSD: 695.00, depositsUSD: 560, withdrawalsUSD: 0 },
    { date: "2025-11-10", portfolioValueUSD: 700.06, cashUSD: 0, realisedUSD: 0, unrealisedUSD: 700.06, depositsUSD: 560, withdrawalsUSD: 0 },
  ],
};

export default function App() {
  const [currentMainPage, setCurrentMainPage] = useState<'overview' | 'nfl' | 'football'>('overview');
  const [currentNFLPage, setCurrentNFLPage] = useState<'overview' | 'players' | 'trades' | 'settings' | 'performance'>('overview');
  
  const {
    positions,
    getFilteredPositions,
    trades,
    snapshots,
    totalPortfolioValue,
    totalUnrealisedPnL,
    totalRealisedPnL,
    totalROI,
    settings,
    updateFromJSON,
  } = useStore();

  // Initialize with seed data
  useEffect(() => {
    updateFromJSON(INITIAL_DATA);
  }, []);

  // Get filtered positions for the table
  const filteredPositions = getFilteredPositions();

  // Prepare chart data
  const chartData = snapshots.map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: s.portfolioValueUSD,
  }));

  const sparklineData = snapshots.map(s => s.portfolioValueUSD);

  // Top Sales and Top Shares
  const topSales = positions
    .filter(p => p.shares > 0)
    .sort((a, b) => (b.shares * b.price) - (a.shares * a.price))
    .slice(0, 5)
    .map(p => ({
      player: p.player,
      price: p.price,
      change: ((Math.random() - 0.5) * 6), // Mock change
      team: p.tag,
    }));

  const topShares = positions
    .filter(p => p.shares > 0)
    .sort((a, b) => b.shares - a.shares)
    .slice(0, 5)
    .map(p => ({
      player: p.player,
      price: p.price,
      change: Math.random() * 8, // Mock positive change
    }));

  const totalPnLDelta = totalROI;

  return (
    <div className="min-h-screen bg-app-bg">
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: '#141820',
            border: '1px solid #2A3140',
            color: '#E9EEF7',
          },
        }}
      />
      <Header walletBalance={totalPortfolioValue} />
      <Ticker positions={positions} />
      
      {/* Main Navigation */}
      <MainNav currentPage={currentMainPage} onPageChange={setCurrentMainPage} />

      {/* Overview Page - Legacy Dashboard */}
      {currentMainPage === 'overview' && (
        <main className="px-8 py-8">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <KpiCard
              label="Portfolio Value"
              value={`$${totalPortfolioValue.toFixed(2)}`}
              delta={totalPnLDelta}
              sparklineData={sparklineData}
            />
            <KpiCard
              label="Unrealised P&L"
              value={`$${totalUnrealisedPnL.toFixed(2)}`}
              delta={totalUnrealisedPnL > 0 ? 5.2 : -2.3}
              sparklineData={sparklineData}
            />
            <KpiCard
              label="Realised P&L"
              value={`$${totalRealisedPnL.toFixed(2)}`}
              delta={totalRealisedPnL > 0 ? 3.1 : -1.5}
              sparklineData={sparklineData}
            />
            <KpiCard
              label="Total ROI"
              value={`${totalROI.toFixed(2)}%`}
              delta={totalROI}
              sparklineData={sparklineData}
            />
          </div>

          {/* Transfers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <AreaChartCard
              title="Portfolio Value"
              subtitle="Last 7 days"
              data={chartData}
              dataKey="value"
              xAxisKey="date"
            />
            <ListCard title="Top Sales" items={topSales} />
            <ListCard title="Top Shares" items={topShares} />
          </div>

          {/* Portfolio Table */}
          <div className="mb-8">
            <PortfolioTable positions={filteredPositions} />
          </div>

          {/* Trades Feed & Command Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TradesFeed trades={trades} />
            <CommandPanel />
          </div>
        </main>
      )}

      {/* NFL Portfolio Page */}
      {currentMainPage === 'nfl' && (
        <>
          <DashboardNav 
            currentPage={currentNFLPage}
            onPageChange={setCurrentNFLPage}
          />
          <main className="px-8 py-8">
            {currentNFLPage === 'overview' && <PortfolioOverview />}
            {currentNFLPage === 'performance' && <PerformancePage />}
            {currentNFLPage === 'players' && <PlayersPage />}
            {currentNFLPage === 'trades' && <TradesPage />}
            {currentNFLPage === 'settings' && <SettingsPage />}
          </main>
        </>
      )}

      {/* Football Page - Coming Soon */}
      {currentMainPage === 'football' && (
        <main className="px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <FontAwesomeIcon icon={faTrophy} className="h-16 w-16 text-green mx-auto mb-4" />
              <h2 className="text-[32px] font-bold text-text mb-2">Football Portfolio</h2>
              <p className="text-[16px] text-dim">Coming soon...</p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}