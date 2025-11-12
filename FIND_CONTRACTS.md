# Finding Sport.Fun Contract Addresses

To connect to the blockchain, we need to find Sport.Fun's smart contract addresses. Here's how:

## Method 1: Browser Developer Tools (Easiest)

1. **Open Sport.Fun Website**
   - Go to https://pro.football.fun/nfl
   - Open browser DevTools (F12)
   - Go to **Network** tab

2. **Filter Network Requests**
   - Filter by "XHR" or "Fetch"
   - Look for API calls that might contain contract addresses
   - Check responses for addresses starting with `0x`

3. **Check Console**
   - Go to **Console** tab
   - Type: `window.ethereum` (if they use Web3)
   - Look for any contract instances or addresses

4. **Inspect Page Source**
   - Right-click → **Inspect Element**
   - Search for "0x" in the HTML/JS
   - Look for contract addresses in script tags

## Method 2: Check Dune Analytics Queries

1. **Visit Dune Dashboard**
   - Go to https://dune.com/fookin_no_wan/footballdotfun
   - Look at the SQL queries
   - Contract addresses are usually in the queries

2. **Example Query Pattern**
   ```sql
   -- Look for FROM clauses like:
   FROM base.contracts
   WHERE address = '0x...'
   
   -- Or:
   FROM ethereum.contracts
   WHERE address = '0x...' AND chain = 'base'
   ```

## Method 3: Blockchain Explorer

Base blockchain explorer:

1. **BaseScan**: https://basescan.org
2. **Base Explorer**: https://explorer.base.org

Search for:
- "Sport.Fun" or "football.fun"
- Look for verified contracts
- Check token contracts (GOLD/USDC)
- Make sure you're on Base network

## Method 4: Check Documentation

1. **Sport.Fun Docs**: https://docs.sport.fun
2. **GitHub**: Search for Sport.Fun repositories
3. **Discord/Telegram**: Ask in their community

## Method 5: Reverse Engineer from Transactions

1. **Connect Your Wallet** to Sport.Fun (make sure you're on Base network)
2. **Make a Test Transaction** (buy/sell)
3. **Check Transaction on BaseScan**: https://basescan.org
4. **Find Contract Address** from the transaction
5. Look for "To" address - that's the contract!

## What We Need

Once you find the addresses, update `.env`:

```env
# Contract Addresses
VITE_NFL_MARKETPLACE_CONTRACT=0x...
VITE_NFL_SHARES_CONTRACT=0x...
VITE_FOOTBALL_MARKETPLACE_CONTRACT=0x...
VITE_FOOTBALL_SHARES_CONTRACT=0x...
VITE_GOLD_CONTRACT=0x...  # USDC/GOLD token

# Network (Base blockchain)
VITE_RPC_URL=https://mainnet.base.org
VITE_CHAIN_ID=8453  # Base Mainnet = 8453, Base Sepolia = 84532
```

## Contract ABIs

After finding addresses, we need the ABIs (Application Binary Interfaces):

1. **Check BaseScan** (https://basescan.org)
   - If contract is verified, ABI is public
   - Go to contract page → "Contract" tab → "Read Contract" or "Write Contract"
   - Make sure you're searching on Base network

2. **Check GitHub**
   - Sport.Fun might have public repos with ABIs

3. **Inspect Network Requests**
   - Check API responses for ABI data

## Quick Test Script

Once you have addresses, test them:

```typescript
import { Contract, JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('https://mainnet.base.org');
const contract = new Contract(
  '0x...', // Your contract address
  ['function name() view returns (string)'], // Basic ABI
  provider
);

try {
  const name = await contract.name();
  console.log('Contract name:', name);
} catch (error) {
  console.error('Not a valid contract:', error);
}
```

## Next Steps

1. Find the contract addresses using methods above
2. Update `.env` file with addresses
3. Get the contract ABIs
4. Update `src/lib/web3.ts` with correct ABIs
5. Test the connection!

Let me know what you find and I'll help integrate it!

