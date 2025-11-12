
# Sport.Fun Portfolio Dashboard

A real-time portfolio analytics dashboard for Sport.Fun (NFL & Football player shares trading).

## Features

- 📊 Real-time portfolio tracking
- 💰 P&L calculations
- 📈 Trade history
- 🔄 Auto-sync from BaseScan API
- 💾 Supabase database integration

## Development

### Setup

```bash
# Install dependencies
npm install

# Create .env file (see below)
# Add your API keys

# Start dev server
npm run dev
```

### Environment Variables

Create `.env` file:

```env
VITE_BASESCAN_API_KEY=your_basescan_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

**Quick deploy to Vercel:**
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## Project Structure

- `src/components/` - React components
- `src/lib/` - Data fetching & Supabase
- `src/store/` - State management
- `supabase/schema.sql` - Database schema

## Documentation

- `DEPLOYMENT.md` - How to deploy
- `SIMPLE_SETUP.md` - Setup guide
- `BASESCAN_SETUP.md` - BaseScan API setup
  