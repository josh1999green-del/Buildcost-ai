# BuildCostAI — Deployment Guide

## Deploy to Vercel in 5 minutes

### Step 1 — Upload to GitHub
1. Go to github.com and sign in (or create free account)
2. Click **New repository** → name it `buildcost-ai` → Create
3. Click **uploading an existing file**
4. Upload ALL the files in this folder keeping the folder structure:
   - `package.json`
   - `next.config.js`
   - `pages/index.js`
   - `pages/_app.js`
   - `pages/api/estimate.js`
   - `styles/globals.css`
5. Click **Commit changes**

### Step 2 — Deploy on Vercel
1. Go to vercel.com → **Add New → Project**
2. Click **Import** next to your `buildcost-ai` GitHub repo
3. Click **Deploy** (leave all settings as default)
4. Wait ~60 seconds for it to build

### Step 3 — Add your Anthropic API key
1. In Vercel, go to your project → **Settings → Environment Variables**
2. Click **Add**
3. Name: `ANTHROPIC_API_KEY`
4. Value: your Anthropic API key (get one at console.anthropic.com)
5. Click **Save**
6. Go to **Deployments** → click the **three dots** on your latest deployment → **Redeploy**

### Done!
Your app is now live at `https://buildcost-ai.vercel.app` (or similar URL).
Works on any browser — desktop, iPad, iPhone — with no CORS issues.

## Getting an Anthropic API key
1. Go to console.anthropic.com
2. Sign up / log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)
5. Paste it into Vercel as shown above

## Cost
- Vercel hosting: FREE (hobby tier)
- Anthropic API: ~£0.10–0.25 per estimate generated
- Your app charges £49+ per estimate = huge profit margin
