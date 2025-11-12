# Blockchain Integration Setup Guide

This guide will help you connect your dashboard to Sport.Fun's blockchain data automatically.

## 🎯 Overview

Your dashboard can now:
- ✅ Connect to Web3 wallets (MetaMask, etc.)
- ✅ Automatically read your portfolio from the blockchain
- ✅ Sync data to Supabase for fast queries
- ✅ Display real-time prices and holdings
- ✅ Track all trades and fees automatically

## 📋 Prerequisites

1. **MetaMask or Web3 Wallet** installed in your browser
2. **Supabase Database** set up (run `supabase/schema.sql` first)
3. **Node.js** installed (for dependencies)

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This will install `ethers` for blockchain interaction.

### Step 2: Find Sport.Fun Contract Addresses

**This is the most important step!** We need the contract addresses to read blockchain data.

#### Option A: Browser DevTools (Recommended)

1. Go to https://pro.football.fun/nfl
2. Open DevTools (F12) → **Network** tab
3. Filter by "XHR" or "Fetch"
4. Look for API calls - contract addresses usually appear in responses
5. Search for addresses starting with `0x`

#### Option B: Check Dune Analytics

1. Visit https://dune.com/fookin_no_wan/footballdotfun
2. Look at the SQL queries
3. Contract addresses are in the queries (look for `FROM polygon.contracts` or similar)

#### Option C: Transaction Inspection

1. Connect your wallet to Sport.Fun
2. Make a test transaction (buy/sell)
3. Check the transaction on PolygonScan/Etherscan
4. The contract address is in the transaction details

#### Option D: Check Documentation

- https://docs.sport.fun
- Sport.Fun Discord/Telegram
- GitHub repositories

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
# Contract Addresses (update with actual addresses)
VITE_NFL_MARKETPLACE_CONTRACT=0x...
VITE_NFL_SHARES_CONTRACT=0x...
VITE_FOOTBALL_MARKETPLACE_CONTRACT=0x...
VITE_FOOTBALL_SHARES_CONTRACT=0x...
VITE_GOLD_CONTRACT=0x...  # USDC/GOLD token

# Network Configuration (Base blockchain)
VITE_RPC_URL=https://mainnet.base.org
VITE_CHAIN_ID=8453  # Base Mainnet = 8453, Base Sepolia Testnet = 84532

# Sport.Fun API (if available)
VITE_SPORT_FUN_API_URL=https://api.sport.fun

# Dune Analytics (optional)
VITE_DUNE_API_KEY=your_dune_api_key
```

**Note**: If you can't find contract addresses, the system will fall back to API calls (if available).

### Step 4: Get Contract ABIs

After finding contract addresses, you need the ABIs:

1. **Check Block Explorers**
   - Go to PolygonScan/Etherscan
   - Search for the contract address
   - If verified, ABI is in the "Contract" tab

2. **Check Network Requests**
   - Inspect Sport.Fun's network calls
   - ABIs might be in API responses

3. **Update `src/lib/web3.ts`**
   - Add the actual ABI arrays
   - Replace placeholder ABIs

### Step 5: Run the Application

```bash
npm run dev
```

### Step 6: Connect Your Wallet

1. Click **"Connect Wallet"** button in the header
2. Approve the connection in MetaMask
3. Your portfolio will automatically load!

## 🔧 How It Works

### Data Flow

```
Blockchain/API → Wallet Store → Supabase → Dashboard
```

1. **Wallet Connection**: User connects MetaMask
2. **Data Fetching**: System queries blockchain/API for:
   - Player shares owned
   - Current prices
   - Trade history
3. **Supabase Sync**: Data is synced to Supabase for fast queries
4. **Dashboard Display**: Your existing dashboard shows real data!

### Automatic Updates

The system can auto-refresh:
- Every 60 seconds (configurable)
- When wallet is connected
- On page load

## 📊 What Data Gets Synced

### From Blockchain/API:
- ✅ All player shares you own
- ✅ Current prices for all players
- ✅ Your complete trade history
- ✅ Fees paid
- ✅ Average cost basis
- ✅ Real-time P&L

### To Supabase:
- ✅ Player prices (historical)
- ✅ Portfolio holdings
- ✅ All trades
- ✅ Daily snapshots
- ✅ Cash transactions

## 🎨 UI Components

### WalletConnect Component
- Shows in header
- "Connect Wallet" button when disconnected
- Shows wallet address when connected
- Auto-refreshes data

### Portfolio Overview
- Automatically uses wallet data when connected
- Falls back to Supabase data if wallet disconnected
- Real-time updates

## 🔍 Troubleshooting

### "No wallet found"
- Install MetaMask: https://metamask.io
- Or use another Web3 wallet

### "Wrong network"
- Switch to Base network in MetaMask
- Base Mainnet (chain ID 8453)
- If you need to add Base to MetaMask, use: https://chainlist.org/chain/8453

### "Contract address not configured"
- System will try API fallback
- Add contract addresses to `.env`

### "Data not loading"
- Check browser console for errors
- Verify contract addresses are correct
- Check RPC URL is accessible
- Try API fallback

### "ABI errors"
- Update ABIs in `src/lib/web3.ts`
- Get correct ABIs from block explorer

## 🚀 Advanced: API Integration

If Sport.Fun has a public API:

1. **Find API Endpoints**
   - Check https://docs.sport.fun
   - Inspect network requests on their site
   - Look for REST/GraphQL endpoints

2. **Update API URLs**
   - In `src/lib/web3.ts`
   - Update `SPORT_FUN_API_BASE`
   - Add authentication if needed

3. **Test Endpoints**
   ```bash
   curl https://api.sport.fun/players/prices?game=NFL
   ```

## 🔐 Security Notes

- **Never commit `.env` file** to git
- Contract addresses are public (safe to share)
- Wallet connection is read-only (no signing required for viewing)
- Private keys never leave your wallet

## 📝 Next Steps

1. ✅ Find contract addresses
2. ✅ Update `.env` file
3. ✅ Get contract ABIs
4. ✅ Test wallet connection
5. ✅ Verify data loads correctly
6. ✅ Set up auto-sync (optional)

## 🆘 Need Help?

1. Check `FIND_CONTRACTS.md` for detailed contract finding guide
2. Check browser console for errors
3. Verify Supabase schema is set up
4. Test with small amounts first

## 🎉 Once Working

Your dashboard will:
- ✅ Automatically show your real portfolio
- ✅ Update prices in real-time
- ✅ Track all your trades
- ✅ Calculate P&L accurately
- ✅ Display everything beautifully!

Let me know what contract addresses you find and I'll help integrate them!

