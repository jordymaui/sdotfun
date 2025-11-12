/**
 * Blockchain Data Synchronisation
 * 
 * This module syncs blockchain data from Sport.Fun to Supabase
 * It uses the wallet store to get portfolio data and updates Supabase
 */

import { useWalletStore } from '../store/useWalletStore';
import { supabase } from './supabase';
import { formatTokenAmount } from './web3';

/**
 * Sync wallet portfolio data to Supabase
 * 
 * This function:
 * 1. Gets data from the wallet store (which fetches from blockchain/API)
 * 2. Maps it to Supabase format
 * 3. Updates the database
 */
export async function syncWalletPortfolioToSupabase(): Promise<void> {
  const walletStore = useWalletStore.getState();
  
  if (!walletStore.isConnected || !walletStore.walletAddress) {
    throw new Error('Wallet not connected');
  }

  console.log('🔄 Syncing wallet portfolio to Supabase...');

  try {
    // 1. Sync player prices
    if (walletStore.playerPrices.length > 0) {
      await syncPlayerPrices(walletStore.playerPrices);
    }

    // 2. Sync portfolio holdings
    if (walletStore.playerShares.length > 0) {
      await syncPortfolioHoldings(walletStore.playerShares, walletStore.playerPrices);
    }

    // 3. Sync trades
    if (walletStore.trades.length > 0) {
      await syncTrades(walletStore.trades);
    }

    // 4. Create daily snapshot
    await supabase.rpc('create_daily_snapshot');

    console.log('✅ Portfolio synced to Supabase!');
  } catch (error) {
    console.error('❌ Error syncing portfolio:', error);
    throw error;
  }
}

/**
 * Sync player prices from blockchain data
 */
async function syncPlayerPrices(prices: any[]): Promise<void> {
  for (const price of prices) {
    try {
      // Get or create player
      let { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('id')
        .eq('display_name', price.playerName)
        .single();

      if (playerError && playerError.code === 'PGRST116') {
        // Player doesn't exist - we need more info
        // For now, skip or create with defaults
        console.warn(`Player ${price.playerName} not found in database. Add manually first.`);
        continue;
      } else if (playerError) {
        console.error(`Error fetching player ${price.playerName}:`, playerError);
        continue;
      }

      // Insert price record
      const { error: priceError } = await supabase
        .from('player_prices')
        .insert({
          player_id: playerData.id,
          price_usd: price.priceUSD,
          price_gold: price.priceGOLD || price.priceUSD, // GOLD = USDC
        });

      if (priceError) {
        console.error(`Error inserting price for ${price.playerName}:`, priceError);
      }
    } catch (error) {
      console.error(`Error syncing price for ${price.playerName}:`, error);
    }
  }
}

/**
 * Sync portfolio holdings from blockchain data
 */
async function syncPortfolioHoldings(shares: any[], prices: any[]): Promise<void> {
  // Create a price map for quick lookup
  const priceMap = new Map(prices.map(p => [p.playerId || p.playerName, p]));

  for (const share of shares) {
    try {
      // Find player name from price data or use playerId
      const priceData = priceMap.get(share.playerId);
      const playerName = share.playerName || priceData?.playerName || share.playerId;

      if (!playerName) {
        console.warn(`Cannot find player name for share:`, share);
        continue;
      }

      // Get player ID
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('id')
        .eq('display_name', playerName)
        .single();

      if (playerError) {
        console.error(`Player ${playerName} not found:`, playerError);
        continue;
      }

      // Convert bigint to number
      const sharesAmount = formatTokenAmount(share.shares, 18);
      const avgCost = formatTokenAmount(share.avgCost, 18);

      // Upsert holding
      const { error: holdingError } = await supabase
        .from('portfolio_holdings')
        .upsert({
          player_id: playerData.id,
          shares: sharesAmount,
          avg_cost: avgCost,
        }, {
          onConflict: 'player_id',
        });

      if (holdingError) {
        console.error(`Error syncing holding for ${playerName}:`, holdingError);
      }
    } catch (error) {
      console.error(`Error syncing holding:`, error);
    }
  }
}

/**
 * Sync trades from blockchain data
 */
async function syncTrades(trades: any[]): Promise<void> {
  for (const trade of trades) {
    try {
      const playerName = trade.playerName || trade.playerId;
      
      if (!playerName) {
        console.warn(`Cannot find player name for trade:`, trade);
        continue;
      }

      // Convert bigint to number
      const shares = formatTokenAmount(trade.shares, 18);
      const price = formatTokenAmount(trade.price, 18);
      const fees = formatTokenAmount(trade.fees || BigInt(0), 18);

      // Use the record_trade function
      const { error } = await supabase.rpc('record_trade', {
        p_player_name: playerName,
        p_action: trade.action,
        p_shares: shares,
        p_price: price,
        p_fees: fees,
        p_notes: trade.txHash ? `Tx: ${trade.txHash}` : null,
        p_trade_date: new Date(trade.timestamp * 1000).toISOString().split('T')[0],
      });

      if (error) {
        console.error(`Error syncing trade for ${playerName}:`, error);
      }
    } catch (error) {
      console.error(`Error syncing trade:`, error);
    }
  }
}

/**
 * Auto-sync: Set up automatic syncing when wallet is connected
 */
export function setupAutoSync(intervalMs: number = 60000): () => void {
  let intervalId: NodeJS.Timeout | null = null;

  const sync = async () => {
    const walletStore = useWalletStore.getState();
    if (walletStore.isConnected) {
      try {
        // Refresh data from blockchain
        await walletStore.refreshData();
        
        // Sync to Supabase
        await syncWalletPortfolioToSupabase();
      } catch (error) {
        console.error('Auto-sync error:', error);
      }
    }
  };

  // Initial sync
  sync();

  // Set up interval
  intervalId = setInterval(sync, intervalMs);

  // Return cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}

