# Privy Authentication Setup

Sport.Fun uses **Privy** for email-based authentication. Users log in with their email (e.g., jordy@nine98.io), and Privy manages the wallet connection behind the scenes.

## How It Works

1. **User logs in with email** via Privy
2. **Privy manages wallet** (Phantom or embedded wallet)
3. **Wallet address is linked** to the email account
4. **We fetch data** using the wallet address from Privy session

## Setup Steps

### Step 1: Get Privy App ID

1. Go to https://privy.io
2. Sign up / Log in
3. Create a new app (or use existing)
4. Copy your **App ID**

### Step 2: Configure Environment

Add to your `.env` file:

```env
VITE_PRIVY_APP_ID=your_privy_app_id_here
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install `@privy-io/react-auth`.

### Step 4: Configure Privy Provider

The `PrivyProvider` is already set up in `src/PrivyProvider.tsx` with:
- Base network (chain ID 8453)
- Email login enabled
- Wallet support enabled
- Dark theme matching your design

### Step 5: Test Login

1. Run `npm run dev`
2. Click "Login with Email"
3. Enter your email (e.g., jordy@nine98.io)
4. Check email for verification code
5. Enter code to complete login
6. Wallet address should appear automatically

## How Data Fetching Works

### Flow:

```
User logs in with email (Privy)
    ↓
Privy provides wallet address
    ↓
Wallet address stored in useWalletStore
    ↓
Data fetching uses wallet address
    ↓
Fetch portfolio from blockchain/API
    ↓
Display in dashboard
```

### Code Flow:

1. **PrivyLogin component** (`src/components/PrivyLogin.tsx`)
   - Handles email login
   - Gets wallet address from Privy user object
   - Updates `useWalletStore` with address

2. **Wallet Store** (`src/store/useWalletStore.ts`)
   - Stores wallet address
   - Fetches portfolio data using address
   - Syncs to Supabase

3. **Data Fetching** (`src/lib/web3.ts`, `src/lib/blockchainSync.ts`)
   - Uses wallet address to query blockchain
   - Gets player shares, prices, trades
   - Updates Supabase database

## Privy User Object Structure

Privy provides a `user` object with:

```typescript
{
  id: string;
  email?: string;
  wallets?: Array<{
    address: string;
    walletClientType: string;
    chainType: string;
  }>;
  linkedAccounts?: Array<{
    type: string;
    address?: string;
  }>;
}
```

We extract the wallet address using `getWalletAddressFromPrivy()` helper.

## Finding Your Privy App ID

### Option 1: Privy Dashboard
1. Go to https://dashboard.privy.io
2. Select your app
3. Copy App ID from settings

### Option 2: Check Sport.Fun
1. Open Sport.Fun website
2. Open DevTools (F12)
3. Go to Network tab
4. Look for requests to `privy.io`
5. Check headers/URLs for app ID

### Option 3: Check Environment
If you have access to Sport.Fun's code/config, check their environment variables.

## Configuration Options

Edit `src/PrivyProvider.tsx` to customize:

### Login Methods
```typescript
loginMethods: ['email', 'wallet', 'sms', 'google', 'twitter']
```

### Embedded Wallets
```typescript
embeddedWallets: {
  createOnLogin: 'users-without-wallets', // or 'off', 'all-users'
}
```

### Appearance
```typescript
appearance: {
  theme: 'dark',
  accentColor: '#00D95F', // Your green
  logo: 'your-logo-url',
}
```

## Troubleshooting

### "VITE_PRIVY_APP_ID not set"
- Add `VITE_PRIVY_APP_ID` to `.env` file
- Restart dev server after adding

### "Login not working"
- Check Privy dashboard for app status
- Verify App ID is correct
- Check browser console for errors

### "Wallet address not found"
- Privy might not have created wallet yet
- Check `user.wallets` array in console
- Try logging out and back in

### "Wrong network"
- Privy is configured for Base (chain 8453)
- Make sure Sport.Fun uses Base
- Check Privy dashboard network settings

## Testing Without Privy

If you want to test without Privy (development):

1. Comment out `PrivyProvider` in `main.tsx`
2. Use manual wallet connection (old `WalletConnect` component)
3. Or manually set wallet address in store

## Production Setup

1. **Get Privy App ID** from Privy dashboard
2. **Add to production environment** variables
3. **Configure allowed domains** in Privy dashboard
4. **Test login flow** thoroughly
5. **Monitor Privy dashboard** for usage/errors

## Security Notes

- ✅ Privy handles authentication securely
- ✅ Wallet addresses are public (safe to use)
- ✅ Private keys never exposed
- ✅ Email verification required
- ⚠️ Keep App ID in environment variables (not in code)

## Next Steps

1. Get Privy App ID
2. Add to `.env` file
3. Test email login
4. Verify wallet address appears
5. Test data fetching with your wallet

Once you have the App ID, everything should work automatically!

