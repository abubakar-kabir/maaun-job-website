# Deployment Guide

## Your Setup

Your app has two parts that need to be deployed:
1. **Frontend**: React app (deployed to Netlify) ✅
2. **Backend**: json-server (needs separate deployment)

## Deployment Steps

### Step 1: Deploy Backend to Render (Free Tier)

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Fill in settings:
   - **Name**: maaun-job-app-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
5. Click "Deploy"
6. Copy the deployed URL (e.g., `https://maaun-job-app-backend.onrender.com`)

### Step 2: Update Netlify Environment Variables

1. Go to your Netlify site settings → "Build & deploy" → "Environment"
2. Add: `VITE_API_BASE_URL=https://your-render-url.onrender.com`
3. Redeploy your site

### Step 3: Push Your Changes

```bash
git add .
git commit -m "Configure backend API for production deployment"
git push
```

## Testing Locally

```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run dev
```

Then visit `http://localhost:3000`

## Alternative: Deploy to Heroku, Railway, or Vercel Functions

You can also use:
- **Railway**: Similar to Render, very easy
- **Heroku**: Popular, but now has limited free tier
- **Supabase**: If you want a database
