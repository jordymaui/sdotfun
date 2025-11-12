# Deployment Guide

Your dashboard is currently running **locally** (only on your computer). To make it accessible online, you need to deploy it.

## Quick Answer

**Yes, you need to host it!** Recommended: **Vercel** (easiest and free).

## Deployment Options

### Option 1: Vercel (Recommended - Easiest) ⭐

**Why Vercel:**
- ✅ Free tier
- ✅ Automatic deployments from Git
- ✅ Built-in environment variables
- ✅ Fast global CDN
- ✅ Perfect for React/Vite apps

**Steps:**

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/sport-fun-portfolio.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"

3. **Add Environment Variables**:
   - In Vercel project settings → Environment Variables
   - Add: `VITE_BASESCAN_API_KEY` = `T11YTXFX8EAUPSBND7393T2U4UTQRFECWJ`
   - Add: `VITE_SUPABASE_URL` (if using Supabase)
   - Add: `VITE_SUPABASE_ANON_KEY` (if using Supabase)
   - Redeploy after adding

4. **Done!** Your site will be live at `your-project.vercel.app`

### Option 2: Netlify

**Similar to Vercel:**
- Go to https://netlify.com
- Sign up with GitHub
- Deploy from Git
- Add environment variables in site settings

### Option 3: GitHub Pages

**Free but more manual:**
- Build the project: `npm run build`
- Push `dist/` folder to `gh-pages` branch
- Enable GitHub Pages in repo settings

### Option 4: Your Own Server

- Build: `npm run build`
- Upload `dist/` folder to your server
- Configure web server (nginx, Apache, etc.)

## Build Command

Before deploying, you need to build for production:

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

## Environment Variables for Production

Make sure to add these in your hosting platform:

```env
VITE_BASESCAN_API_KEY=T11YTXFX8EAUPSBND7393T2U4UTQRFECWJ
VITE_SUPABASE_URL=https://kwwcpxjnvudseryreptg.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

**Important:** Never commit `.env` to Git! Always use hosting platform's environment variable settings.

## Recommended: Vercel Setup

### Step-by-Step:

1. **Install Vercel CLI** (optional, for local testing):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from command line**:
   ```bash
   vercel
   ```
   - Follow prompts
   - Add environment variables when asked

3. **Or use web interface**:
   - Connect GitHub repo
   - Auto-deploys on every push

### Vercel Configuration

Create `vercel.json` (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

Vercel usually auto-detects Vite, so this might not be needed.

## Post-Deployment Checklist

- [ ] Environment variables added
- [ ] Site loads correctly
- [ ] Data fetching works (check browser console)
- [ ] Supabase connection works (if using)
- [ ] Custom domain configured (optional)

## Cost

- **Vercel/Netlify**: Free for personal projects
- **Custom domain**: ~$10-15/year (optional)
- **Supabase**: Free tier available

## Quick Deploy Now

Want to deploy right now? I can help you:

1. Set up Git repository
2. Create Vercel account
3. Deploy the site

Just let me know!

