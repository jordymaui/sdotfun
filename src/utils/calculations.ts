import { Position, Trade, Snapshot } from '../store/useStore';

/**
 * Calculate weighted average cost for a position
 */
export function calculateWeightedAvgCost(
  existingShares: number,
  existingAvgCost: number,
  newShares: number,
  newPrice: number
): number {
  const totalShares = existingShares + newShares;
  if (totalShares === 0) return 0;
  
  const totalCost = (existingShares * existingAvgCost) + (newShares * newPrice);
  return totalCost / totalShares;
}

/**
 * Calculate current value of a position
 */
export function calculateCurrentValue(shares: number, price: number): number {
  return shares * price;
}

/**
 * Calculate unrealised P&L for a position
 */
export function calculateUnrealisedPnL(
  shares: number,
  avgCost: number,
  currentPrice: number
): number {
  const currentValue = calculateCurrentValue(shares, currentPrice);
  const costBasis = shares * avgCost;
  return currentValue - costBasis;
}

/**
 * Calculate realised P&L from a sell trade
 */
export function calculateRealisedPnL(
  sharesSold: number,
  avgCost: number,
  sellPrice: number
): number {
  return (sellPrice - avgCost) * sharesSold;
}

/**
 * Calculate ROI percentage
 */
export function calculateROI(pnl: number, costBasis: number): number {
  if (costBasis === 0) return 0;
  return (pnl / costBasis) * 100;
}

/**
 * Calculate cost basis for a position
 */
export function calculateCostBasis(shares: number, avgCost: number): number {
  return shares * avgCost;
}

/**
 * Calculate total portfolio metrics
 */
export function calculatePortfolioTotals(positions: Position[]) {
  let totalCostBasis = 0;
  let totalCurrentValue = 0;
  let totalUnrealisedPnL = 0;
  let totalRealisedPnL = 0;

  positions.forEach(pos => {
    const costBasis = calculateCostBasis(pos.shares, pos.avgCost);
    const currentValue = calculateCurrentValue(pos.shares, pos.price);
    const unrealisedPnL = calculateUnrealisedPnL(pos.shares, pos.avgCost, pos.price);
    const realisedPnL = pos.realisedPnL || 0;

    totalCostBasis += costBasis;
    totalCurrentValue += currentValue;
    totalUnrealisedPnL += unrealisedPnL;
    totalRealisedPnL += realisedPnL;
  });

  const totalPnL = totalUnrealisedPnL + totalRealisedPnL;
  const totalROI = calculateROI(totalPnL, totalCostBasis);

  return {
    totalCostBasis,
    totalCurrentValue,
    totalUnrealisedPnL,
    totalRealisedPnL,
    totalPnL,
    totalROI,
  };
}

/**
 * Generate a new snapshot from current state
 */
export function generateSnapshot(
  date: string,
  positions: Position[],
  cashUSD: number,
  depositsUSD: number,
  withdrawalsUSD: number
): Snapshot {
  const { totalCurrentValue, totalUnrealisedPnL, totalRealisedPnL } = calculatePortfolioTotals(positions);

  return {
    date,
    portfolioValueUSD: totalCurrentValue,
    cashUSD,
    realisedUSD: totalRealisedPnL,
    unrealisedUSD: totalUnrealisedPnL,
    depositsUSD,
    withdrawalsUSD,
  };
}

/**
 * Format currency
 */
export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Get player initials for avatar
 */
export function getPlayerInitials(playerName: string): string {
  const parts = playerName.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return playerName.substring(0, 2).toUpperCase();
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Generate mock price changes for ticker
 */
export function generateMockPriceChanges(positions: Position[]): Position[] {
  return positions.slice(0, 8).map(pos => ({
    ...pos,
    priceChange1h: (Math.random() - 0.5) * 10, // -5% to +5%
  }));
}
