# Quick Start Guide

## What's Been Set Up

I've created a complete database schema and data sync system for your Sport.Fun portfolio dashboard. Here's what you have:

### ✅ Database Schema (`supabase/schema.sql`)
- **Tables**: players, player_prices, portfolio_holdings, trades, portfolio_snapshots, cash_transactions
- **Views**: `v_portfolio_snapshot` and `v_portfolio_totals` (matching your existing code)
- **Functions**: Helper functions for recording trades, updating prices, creating snapshots
- **Indexes**: Optimised for fast queries

### ✅ Data Sync Utilities (`src/lib/syncData.ts`)
- Functions to fetch data from Sport.Fun (API or blockchain)
- Functions to sync data to Supabase
- Manual import functions for CSV/manual entry

### ✅ Import Script (`src/lib/importScript.ts`)
- Quick functions to import your existing data
- Can be run from browser console or UI

## Next Steps

### 1. Set Up the Database (5 minutes)

1. **Open Supabase Dashboard**
   - Go to your project: https://supabase.com/dashboard
   - Navigate to **SQL Editor**

2. **Run the Schema**
   - Open `supabase/schema.sql`
   - Copy the entire file
   - Paste into SQL Editor
   - Click **Run**

3. **Verify Tables Created**
   - Go to **Table Editor**
   - You should see 6 new tables

### 2. Import Your Existing Data (10-15 minutes)

You have three options:

#### Option A: Use the Import Script (Easiest)

1. Open your browser console (F12) while on your dashboard
2. Import the functions:
```javascript
// You'll need to expose these functions or use them in your code
import { importTrade, importPlayerPrice, importCashTransaction } from './lib/importScript';
```

3. Or create a temporary admin page/button that calls:
```typescript
import { fullImport } from './lib/importScript';
await fullImport();
```

#### Option B: Use Supabase Dashboard

1. Go to **Table Editor** → **players**
2. Click **Insert** → **Insert row**
3. Add your players manually
4. Repeat for prices, trades, etc.

#### Option C: Use SQL Directly

```sql
-- Add a player
INSERT INTO players (display_name, game_type, pack_batch, release_batch)
VALUES ('P.Mahomes', 'NFL', 1, 3);

-- Add a price
INSERT INTO player_prices (player_id, price_usd, price_gold)
SELECT id, 0.0936, 0.0936 FROM players WHERE display_name = 'P.Mahomes';

-- Record a trade
SELECT record_trade('P.Mahomes', 'Buy', 1270.35, 0.161, 6.15, 'Initial position', '2025-11-11');
```

### 3. Connect to Real Sport.Fun Data

**This is the key question**: How do you access Sport.Fun data?

#### If Sport.Fun has an API:
1. Find the API documentation
2. Update `src/lib/syncData.ts` with the actual endpoints
3. Add API keys to environment variables

#### If it's on a blockchain:
1. Find the contract address
2. Install web3 library: `npm install ethers`
3. Update `src/lib/syncData.ts` to query the blockchain

#### If you need to manually update:
- Use the manual import functions
- Or create a simple form in your UI to add trades/prices
- Or export data from Sport.Fun and import via CSV

**Can you tell me:**
- Does Sport.Fun have an API?
- Is the data on a blockchain? (Which chain?)
- How do you currently access your portfolio data?

### 4. Test the Connection

1. Add some test data (at least one player, one price, one trade)
2. Refresh your dashboard
3. The `refreshFromSupabase()` function should now show real data
4. Check the Portfolio Overview page

## Current Status

Your code is already set up to use Supabase! The `refreshFromSupabase()` function in `usePortfolioStore.ts` will automatically fetch from the views once you have data.

## What You Need From Me

To complete the setup, I need to know:

1. **How to access Sport.Fun data?**
   - API endpoint?
   - Blockchain contract?
   - Manual export?

2. **What data format?**
   - JSON API response?
   - CSV export?
   - On-chain events?

3. **Authentication?**
   - API keys?
   - Wallet connection?
   - None needed?

Once I know this, I can:
- Update the sync functions with the correct data source
- Create automated sync scripts
- Set up real-time updates if possible

## Files Created

- `supabase/schema.sql` - Database schema (run this first!)
- `src/lib/syncData.ts` - Data sync utilities
- `src/lib/importScript.ts` - Quick import functions
- `DATABASE_SETUP.md` - Detailed setup guide
- `QUICK_START.md` - This file

## Need Help?

1. Check `DATABASE_SETUP.md` for detailed instructions
2. Look at the example functions in `importScript.ts`
3. Test with small amounts of data first
4. Check browser console for errors

Let me know what you find about accessing Sport.Fun data, and I'll help you connect it!

