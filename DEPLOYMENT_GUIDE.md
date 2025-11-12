# Deployment Guide - GitHub & Vercel

## Step 1: Push to GitHub

Your repository: `https://github.com/jordymaui/sdotfun`

### If you haven't set up the remote yet:

```bash
cd "/Users/jordancoltman/Documents/Sport.Fun Portfolio/sdotfun"

# Check if remote exists
git remote -v

# If no remote exists, add it:
git remote add origin https://github.com/jordymaui/sdotfun.git

# If remote exists but points to wrong URL, update it:
# git remote set-url origin https://github.com/jordymaui/sdotfun.git
```

### Commit and push your code:

```bash
# Make sure you're in the project directory
cd "/Users/jordancoltman/Documents/Sport.Fun Portfolio/sdotfun"

# Check what files will be committed (make sure .env is NOT listed)
git status

# Add all files (except those in .gitignore)
git add .

# Commit
git commit -m "Initial commit - Sport.Fun Portfolio Dashboard"

# Set main branch and push
git branch -M main
git push -u origin main
```

**Note:** If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys for GitHub

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New Project"**
3. Import your repository: `jordymaui/sdotfun`
4. Vercel will auto-detect it's a Vite project
5. Configure build settings (should auto-detect):
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Add environment variables (if you have any in `.env`):
   - Go to Project Settings → Environment Variables
   - Add each variable from your `.env` file
7. Click **"Deploy"**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
cd "/Users/jordancoltman/Documents/Sport.Fun Portfolio/sdotfun"
vercel

# For production deployment
vercel --prod
```

## Step 3: Configure Vercel (if needed)

The `vercel.json` file is already configured for your Vite project. It includes:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing support (all routes redirect to index.html)

## Important Notes

✅ **`.gitignore` is set up** - Your `.env` file won't be committed to GitHub
✅ **`vercel.json` is configured** - Vercel will build and deploy correctly
⚠️ **Environment Variables** - Remember to add any `.env` variables in Vercel's dashboard

## Troubleshooting

### If build fails on Vercel:
- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (Vercel uses Node 18+ by default)
- Check build logs in Vercel dashboard

### If the site loads but shows blank page:
- Check browser console for errors
- Verify all asset paths are correct
- Ensure `index.html` is in the root directory

### If routing doesn't work:
- The `vercel.json` includes SPA routing rewrites
- All routes should redirect to `index.html` for client-side routing

## Next Steps

After deployment:
1. Your site will be live at `https://your-project-name.vercel.app`
2. Every push to `main` branch will trigger a new deployment
3. You can set up a custom domain in Vercel settings

