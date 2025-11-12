# Simple Data Fetching Setup

No login, no Web3 complexity - just fetch your portfolio data from BaseScan/Dune using your wallet address.

## Your Wallet Address

```
0xFc1A8921eA05bEC9ceb536f8aEE02AF881D72F6B
```

This is already configured in `src/lib/blockchainData.ts`.

## How It Works

1. **BaseScan API** - Fetches token balances and transactions
2. **Dune Analytics** (optional) - Fetches aggregated Sport.Fun data
3. **Sync to Supabase** - Stores data in your database
4. **Display in Dashboard** - Shows your portfolio

## Setup

### Step 1: BaseScan API (Free)

BaseScan API is free but rate-limited. For better results, get a free API key:

1. Go to https://basescan.org/apis
2. Sign up for free account
3. Get your API key
4. Add to `.env`:

```env
VITE_BASESCAN_API_KEY=your_api_key_here
```

### Step 2: Dune Analytics (Optional)

If you want to use Dune queries:

1. Go to https://dune.com
2. Sign up / Log in
3. Create API key
4. Add to `.env`:

```env
VITE_DUNE_API_KEY=your_dune_api_key
VITE_DUNE_QUERY_ID=your_query_id
```

### Step 3: Run

```bash
npm install
npm run dev
```

## Using the Data Fetcher

Add the `DataFetcher` component to your dashboard:

```tsx
import { DataFetcher } from './components/DataFetcher';

// In your component:
<DataFetcher />
```

It will:
- Auto-fetch on page load
- Show refresh button
- Display last fetched time
- Allow changing wallet address (for testing)

## What Gets Fetched

### From BaseScan:
- ✅ All token balances (player shares)
- ✅ All transactions (trades)
- ✅ Token metadata (names, symbols)

### From Dune (if configured):
- ✅ Aggregated portfolio data
- ✅ Player holdings
- ✅ Trade history
- ✅ P&L calculations

## Customization Needed

You'll need to customize these functions in `src/lib/syncData.ts`:

1. **`extractPlayerName()`** - Map tokens to player names
   - Add Sport.Fun contract addresses → player names mapping

2. **`extractTradeData()`** - Parse transaction data
   - Parse Sport.Fun transaction structure
   - Extract player, shares, price from transaction

3. **`determineTradeAction()`** - Identify buy vs sell
   - Already implemented, but may need tweaking

## Finding Sport.Fun Contract Addresses

1. **Check BaseScan** for your transactions:
   - Go to https://basescan.org/address/0xFc1A8921eA05bEC9ceb536f8aEE02AF881D72F6B
   - Look at token transfers
   - Find Sport.Fun contract addresses

2. **Check Dune**:
   - Look at https://dune.com/fookin_no_wan/footballdotfun
   - Check queries for contract addresses

3. **Add to mapping** in `extractPlayerName()`:
```typescript
const contractToPlayer: Record<string, string> = {
  '0x...SportFunContract...': 'P.Mahomes',
  '0x...AnotherContract...': 'J.Jefferson',
  // etc.
};
```

## Next Steps

1. ✅ Wallet address is configured
2. ⏳ Get BaseScan API key (optional but recommended)
3. ⏳ Find Sport.Fun contract addresses
4. ⏳ Map contracts to player names
5. ⏳ Parse transaction structure
6. ⏳ Test data fetching

## Testing

1. Run `npm run dev`
2. Add `<DataFetcher />` to a page
3. Click "Refresh Data"
4. Check browser console for fetched data
5. Check Supabase for synced data

That's it! Much simpler than Web3 login. 🎉

