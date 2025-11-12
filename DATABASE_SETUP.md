# Database Setup Guide

This guide will help you set up your Supabase database to store and display real-time Sport.Fun portfolio data.

## Prerequisites

1. A Supabase account and project (you already have this configured)
2. Access to your Supabase project dashboard
3. Your Supabase project URL and anon key (already in `src/lib/supabase.ts`)

## Step 1: Run the Database Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the schema

This will create:
- All necessary tables (players, player_prices, portfolio_holdings, trades, etc.)
- Database views (`v_portfolio_snapshot`, `v_portfolio_totals`)
- Helper functions for recording trades and creating snapshots
- Indexes for performance

## Step 2: Verify the Setup

After running the schema, verify the tables were created:

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `players`
   - `player_prices`
   - `portfolio_holdings`
   - `trades`
   - `portfolio_snapshots`
   - `cash_transactions`

3. Check the **Database** → **Views** section for:
   - `v_portfolio_snapshot`
   - `v_portfolio_totals`

## Step 3: Configure Data Source

You have three options for getting data from Sport.Fun:

### Option A: Sport.Fun API (If Available)

If Sport.Fun provides a REST API:

1. Create a `.env` file in your project root:
```env
VITE_SPORT_FUN_API_URL=https://api.sport.fun
VITE_SPORT_FUN_API_KEY=your_api_key_here
VITE_WALLET_ADDRESS=your_wallet_address
```

2. Update `src/lib/syncData.ts` with the actual API endpoints

### Option B: Blockchain/Web3 (If On-Chain)

If Sport.Fun data is on a blockchain:

1. Install web3 dependencies:
```bash
npm install ethers
# or
npm install web3
```

2. Update `src/lib/syncData.ts` to use web3 provider and contract calls

3. Add to `.env`:
```env
VITE_RPC_URL=your_blockchain_rpc_url
VITE_CONTRACT_ADDRESS=sport_fun_contract_address
VITE_WALLET_ADDRESS=your_wallet_address
```

### Option C: Manual Import (Recommended to Start)

If there's no API, you can manually import data:

1. Use the manual import functions in `src/lib/syncData.ts`
2. Or use the Supabase dashboard to insert data directly
3. Or create a simple import script (see below)

## Step 4: Populate Initial Data

### Manual Player Entry

You can add players manually via Supabase dashboard or using the sync functions:

```typescript
import { importPlayerPrice } from './lib/syncData';

// Add a player with current price
await importPlayerPrice(
  'P.Mahomes',
  0.0936,  // price in USD
  0.0936,  // price in GOLD (USDC)
  'NFL',
  1,       // pack batch
  3        // release batch
);
```

### Manual Trade Entry

```typescript
import { importTrade } from './lib/syncData';

// Record a buy trade
await importTrade(
  'P.Mahomes',
  'Buy',
  1270.35,
  0.161,
  6.15,
  'Initial position',
  '2025-11-11'
);
```

### Manual Cash Transaction

```typescript
import { importCashTransaction } from './lib/syncData';

// Record a deposit
await importCashTransaction(
  'Deposit',
  1000.00,
  'Initial deposit',
  '2025-11-11'
);
```

## Step 5: Set Up Automatic Sync (Optional)

If you have an API or blockchain access, you can set up automatic syncing:

1. Create a scheduled function in Supabase (Edge Functions)
2. Or add a sync button in your UI that calls `fullSync()`
3. Or set up a cron job to call the sync endpoint

Example UI sync button:

```typescript
import { fullSync } from './lib/syncData';

const handleSync = async () => {
  try {
    await fullSync();
    toast.success('Data synced successfully!');
  } catch (error) {
    toast.error('Sync failed: ' + error.message);
  }
};
```

## Step 6: Test the Connection

1. Add some test data (players, prices, trades)
2. Open your dashboard
3. The `refreshFromSupabase()` function should now fetch real data
4. Check that the portfolio overview displays correctly

## Troubleshooting

### Views Not Found

If you get errors about views not existing:
- Make sure you ran the entire `schema.sql` file
- Check that views were created in Supabase dashboard

### Permission Errors

- Ensure your Supabase anon key has the correct permissions
- Check Row Level Security (RLS) policies if enabled

### Data Not Showing

- Verify data exists in the tables
- Check that `v_portfolio_snapshot` view returns data:
  ```sql
  SELECT * FROM v_portfolio_snapshot;
  ```

## Next Steps

1. **Connect to Real Data Source**: Configure how to fetch data from Sport.Fun
2. **Set Up Real-Time Updates**: Use Supabase real-time subscriptions if needed
3. **Add More Features**: Extend the schema as needed for your use case

## Useful SQL Queries

### Check current holdings:
```sql
SELECT * FROM v_portfolio_snapshot ORDER BY value_usd DESC;
```

### Check portfolio totals:
```sql
SELECT * FROM v_portfolio_totals;
```

### View recent trades:
```sql
SELECT t.*, p.display_name 
FROM trades t
JOIN players p ON t.player_id = p.id
ORDER BY t.trade_date DESC, t.created_at DESC
LIMIT 20;
```

### Get latest prices for all players:
```sql
SELECT DISTINCT ON (p.id)
  p.display_name,
  pp.price_usd,
  pp.price_gold,
  pp.timestamp
FROM players p
LEFT JOIN player_prices pp ON p.id = pp.player_id
ORDER BY p.id, pp.timestamp DESC;
```

