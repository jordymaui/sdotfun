# Base Network Information

Sport.Fun is built on **Base**, Coinbase's Layer 2 blockchain.

## Base Network Details

### Mainnet
- **Chain ID**: `8453`
- **RPC URL**: `https://mainnet.base.org`
- **Block Explorer**: https://basescan.org
- **Alternative RPC**: 
  - Alchemy: `https://base-mainnet.g.alchemy.com/v2/YOUR_KEY`
  - Infura: `https://base-mainnet.infura.io/v3/YOUR_KEY`
  - Public: `https://mainnet.base.org`

### Testnet (Base Sepolia)
- **Chain ID**: `84532`
- **RPC URL**: `https://sepolia.base.org`
- **Block Explorer**: https://sepolia.basescan.org

## Adding Base to MetaMask

### Method 1: Chainlist (Easiest)
1. Go to https://chainlist.org/chain/8453
2. Click "Connect Wallet"
3. Click "Add to MetaMask"
4. Approve the network addition

### Method 2: Manual Addition
1. Open MetaMask
2. Go to Settings → Networks → Add Network
3. Enter:
   - **Network Name**: Base
   - **RPC URL**: https://mainnet.base.org
   - **Chain ID**: 8453
   - **Currency Symbol**: ETH
   - **Block Explorer**: https://basescan.org
4. Save

## Base-Specific Features

### Gas Fees
- Base has very low gas fees (usually < $0.01)
- Uses ETH for gas (same as Ethereum)
- Much cheaper than Ethereum mainnet

### Bridging
- Bridge from Ethereum: https://bridge.base.org
- Bridge from other chains via Base Bridge

### Native Tokens
- ETH is used for gas
- USDC is commonly used (native on Base)
- GOLD token = USDC on Sport.Fun

## Finding Contracts on Base

### BaseScan Explorer
1. Go to https://basescan.org
2. Search for contract address or transaction hash
3. View contract code, ABI, and transactions
4. Check "Contract" tab for verified contracts

### Common Base Contract Patterns
- Contracts follow same standards as Ethereum (ERC-20, ERC-721, ERC-1155)
- ABIs are identical to Ethereum contracts
- Use same ethers.js/web3.js libraries

## RPC Endpoints

### Public (Free, Rate Limited)
```
https://mainnet.base.org
```

### Recommended (For Production)
- **Alchemy**: https://www.alchemy.com/base
- **Infura**: https://www.infura.io
- **QuickNode**: https://www.quicknode.com/chains/base

Get free API keys from these providers for better reliability.

## Testing on Base

### Testnet (Base Sepolia)
- Use for testing before mainnet
- Get testnet ETH from faucets
- Same contract patterns as mainnet

## Why Base?

- ✅ Low gas fees
- ✅ Fast transactions
- ✅ Ethereum-compatible
- ✅ Secure (Coinbase-backed)
- ✅ Growing ecosystem

## Resources

- **Base Docs**: https://docs.base.org
- **BaseScan**: https://basescan.org
- **Base Bridge**: https://bridge.base.org
- **Base Status**: https://status.base.org

## For Your Dashboard

Make sure your `.env` has:
```env
VITE_RPC_URL=https://mainnet.base.org
VITE_CHAIN_ID=8453
```

And users need Base network in MetaMask to connect!

