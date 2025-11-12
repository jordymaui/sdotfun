# Push to GitHub - Commands to Run

Your repo: https://github.com/jordymaui/sdotfun

## Run these commands in Terminal:

```bash
cd "/Users/jordancoltman/Documents/Sport.Fun Portfolio"

# Initialize git (if not already)
git init

# Add your GitHub repo
git remote add origin https://github.com/jordymaui/sdotfun.git

# Check .gitignore is protecting .env
cat .gitignore | grep -E "\.env"

# Add all files (except .env which is in .gitignore)
git add .

# Check what will be committed (make sure .env is NOT listed)
git status

# Commit
git commit -m "Initial commit - Sport.Fun Portfolio Dashboard"

# Push to GitHub
git branch -M main
git push -u origin main
```

## Important Notes:

- ✅ `.env` file is in `.gitignore` - it won't be committed (good!)
- ✅ Your API key stays private
- ⚠️ If you get "remote already exists" error, run: `git remote set-url origin https://github.com/jordymaui/sdotfun.git`

## After Pushing:

1. Go to https://github.com/jordymaui/sdotfun
2. You should see all your files
3. Then deploy to Vercel!

