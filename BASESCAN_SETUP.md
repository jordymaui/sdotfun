# BaseScan API Setup

## Step 1: Get Your API Key

1. **Log into BaseScan**: https://basescan.org
2. **Go to API section**: Look for "API" in the menu or go to https://basescan.org/apis
3. **Find your API key**: It should be displayed on your account page
4. **Copy the API key** (it looks like: `ABC123XYZ...`)

## Step 2: Add to Environment

Create or update your `.env` file in the project root:

```env
VITE_BASESCAN_API_KEY=your_api_key_here
```

**Important**: 
- Replace `your_api_key_here` with your actual API key
- Don't include quotes around the key
- Make sure there are no spaces

## Step 3: Restart Dev Server

After adding the API key:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 4: Test It

1. Add the `<DataFetcher />` component to a page
2. Click "Refresh Data"
3. Check browser console - you should see:
   - `✅ Found X tokens`
   - `✅ Found X transactions`

## Optional: Watchlist Setup

The screenshot shows BaseScan's watchlist feature. You can optionally:

1. **Add your address to watchlist** (the modal you're seeing)
   - Address: `0xFc1A8921eA05bEC9ceb536f8aEE02AF881D72F6B`
   - Description: "Sport.Fun Address"
   - Check "Also Track ERC1155 Token Transfers" (Sport.Fun likely uses ERC-1155 for player shares)
   - Click "Continue"

2. **Benefits of watchlist**:
   - Email notifications for transactions
   - Better tracking of token transfers
   - Easier to monitor your portfolio

**Note**: Watchlist is optional - the API will work without it, but it helps with tracking.

## API Rate Limits

BaseScan free tier has rate limits:
- **5 calls per second**
- **100,000 calls per day**

For your use case, this should be plenty!

## Troubleshooting

### "API key not working"
- Make sure you copied the full key
- Check for extra spaces in `.env`
- Restart dev server after adding key

### "Rate limit exceeded"
- You're making too many requests
- Wait a few seconds and try again
- Consider caching results

### "No data returned"
- Check wallet address is correct
- Verify you have transactions on Base
- Check browser console for API errors

## Next Steps

Once API key is working:

1. ✅ Test data fetching
2. ⏳ Find Sport.Fun contract addresses from your transactions
3. ⏳ Map contracts to player names
4. ⏳ Parse transaction data structure
5. ⏳ Display portfolio in dashboard

You're all set! 🎉

