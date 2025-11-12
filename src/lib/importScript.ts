/**
 * Quick Import Script
 * 
 * Use this script to quickly import your existing data into Supabase.
 * You can run this from the browser console or create a button in your UI.
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Import this module or copy the functions
 * 3. Call the import functions with your data
 */

import { importPlayerPrice, importTrade, importCashTransaction } from './syncData';

/**
 * Example: Import your existing trades from the store
 * 
 * Copy your trades array from usePortfolioStore and format them like this:
 */
export async function importExistingTrades() {
  // Example trades - replace with your actual data
  const trades = [
    {
      player: 'P.Mahomes',
      action: 'Buy' as const,
      shares: 1270.35,
      price: 0.161,
      fees: 6.15,
      notes: 'Initial position',
      date: '2025-11-11',
    },
    {
      player: 'P.Mahomes',
      action: 'Buy' as const,
      shares: 30.11,
      price: 0.133,
      fees: 0.12,
      notes: 'Small add',
      date: '2025-11-11',
    },
    // Add more trades...
  ];

  for (const trade of trades) {
    try {
      await importTrade(
        trade.player,
        trade.action,
        trade.shares,
        trade.price,
        trade.fees,
        trade.notes,
        trade.date
      );
      console.log(`✅ Imported: ${trade.action} ${trade.shares} ${trade.player}`);
    } catch (error) {
      console.error(`❌ Failed to import trade:`, error);
    }
  }
}

/**
 * Example: Import current player prices
 * 
 * Update with current prices from Sport.Fun
 */
export async function importCurrentPrices() {
  const players = [
    { name: 'P.Mahomes', priceUSD: 0.0936, priceGOLD: 0.0936, gameType: 'NFL' as const, packBatch: 1, releaseBatch: 3 },
    { name: 'J.Jefferson', priceUSD: 0.0542, priceGOLD: 0.0542, gameType: 'NFL' as const, packBatch: 1, releaseBatch: 1 },
    { name: 'A.St. Brown', priceUSD: 0.0551, priceGOLD: 0.0551, gameType: 'NFL' as const, packBatch: 1, releaseBatch: 1 },
    // Add more players with current prices...
  ];

  for (const player of players) {
    try {
      await importPlayerPrice(
        player.name,
        player.priceUSD,
        player.priceGOLD,
        player.gameType,
        player.packBatch,
        player.releaseBatch
      );
      console.log(`✅ Imported price for ${player.name}: $${player.priceUSD}`);
    } catch (error) {
      console.error(`❌ Failed to import price for ${player.name}:`, error);
    }
  }
}

/**
 * Example: Import cash transactions
 */
export async function importCashTransactions() {
  const transactions = [
    { type: 'Deposit' as const, amount: 1000.00, notes: 'Initial deposit', date: '2025-11-11' },
    { type: 'Deposit' as const, amount: 163.00, notes: 'GOLD Transfer In', date: '2025-11-11' },
    // Add more transactions...
  ];

  for (const tx of transactions) {
    try {
      await importCashTransaction(tx.type, tx.amount, tx.notes, tx.date);
      console.log(`✅ Imported ${tx.type}: $${tx.amount}`);
    } catch (error) {
      console.error(`❌ Failed to import transaction:`, error);
    }
  }
}

/**
 * Full import: Run all import functions
 */
export async function fullImport() {
  console.log('🔄 Starting full import...');
  
  try {
    await importCurrentPrices();
    await importCashTransactions();
    await importExistingTrades();
    
    console.log('✅ Full import completed!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

