/**
 * Simple Data Fetcher Component
 * 
 * Fetches portfolio data from BaseScan/Dune and syncs to Supabase
 */

import React, { useState, useEffect } from 'react';
import { fetchMyPortfolio, WALLET_ADDRESS } from '../lib/blockchainData';
import { syncDataToSupabase } from '../lib/syncData';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export function DataFetcher() {
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [walletAddress, setWalletAddress] = useState(WALLET_ADDRESS);

  const handleFetch = async () => {
    if (!walletAddress || walletAddress.length !== 42 || !walletAddress.startsWith('0x')) {
      toast.error('Invalid wallet address');
      return;
    }

    setIsFetching(true);
    toast.loading('Fetching portfolio data...');

    try {
      // Fetch from blockchain
      const portfolioData = await fetchMyPortfolio(walletAddress);
      
      // Sync to Supabase
      await syncDataToSupabase(portfolioData);
      
      setLastFetched(new Date());
      toast.success('Portfolio data updated!');
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setIsFetching(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[18px] font-semibold text-text mb-2">Portfolio Data</h3>
          <p className="text-[12px] text-dim">
            Wallet: <span className="font-mono text-text">{walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}</span>
          </p>
        </div>
        <button
          onClick={handleFetch}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green hover:bg-green/90 text-app-bg font-semibold transition-colors disabled:opacity-50"
        >
          {isFetching ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faRefresh} className="h-4 w-4" />
              <span>Refresh Data</span>
            </>
          )}
        </button>
      </div>

      {lastFetched && (
        <div className="flex items-center gap-2 text-[12px] text-dim">
          <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 text-green" />
          <span>Last updated: {lastFetched.toLocaleString()}</span>
        </div>
      )}

      {/* Wallet Address Input (optional - for testing different addresses) */}
      <div className="mt-4">
        <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
          Wallet Address (optional)
        </label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-2 rounded-lg bg-muted border border-stroke text-text placeholder:text-dim text-[14px] focus:outline-none focus:border-green font-mono"
        />
      </div>
    </div>
  );
}

