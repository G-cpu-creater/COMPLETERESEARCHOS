# ResearchOS Deployment Guide

This guide covers multiple free deployment options for ResearchOS.

---

## Option 1: Netlify (Recommended for Static/Serverless)

### Pros:
- ✅ Free tier: 100GB bandwidth/month
- ✅ Automatic CI/CD from GitHub
- ✅ Fast global CDN
- ✅ Easy setup, no credit card required
- ✅ Good for Next.js

### Cons:
- ⚠️ Need external database (use Neon or Supabase free tier)
- ⚠️ Serverless functions have 10s timeout on free tier

### Setup Steps:

1. **Install Netlify CLI** (optional):
```bash
npm install -g netlify-cli
```

2. **Deploy via GitHub**:
   - Go to [Netlify](https://www.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select `ElctrDc` repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

3. **Set Environment Variables**:
   - In Netlify dashboard → Site settings → Environment variables
   - Add:
     ```
     DATABASE_URL=your_neon_or_supabase_url
     NEXTAUTH_SECRET=generate_random_string_32_chars
     NEXTAUTH_URL=https://your-site.netlify.app
     ```

4. **Free Database Options**:
   - **Neon** (PostgreSQL): https://neon.tech (Free: 0.5GB)
   - **Supabase**: https://supabase.com (Free: 500MB)

---

## Option 2: Railway (Recommended for Full-Stack)

### Pros:
- ✅ $5 free credit monthly (~500 hours)
- ✅ PostgreSQL database included
- ✅ Simple GitHub integration
- ✅ Automatic HTTPS
- ✅ Best for apps with database

### Cons:
- ⚠️ Free credit runs out (but renews monthly)
- ⚠️ Requires credit card for verification

### Setup Steps:

1. **Go to Railway**:
   - Visit [Railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `ElctrDc` repository

3. **Add PostgreSQL Database**:
   - In your project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create `DATABASE_URL` variable

4. **Configure Environment Variables**:
   - Click on your service → Variables tab
   - Add:
     ```
     NEXTAUTH_SECRET=generate_random_string_32_chars
     NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
     ```

5. **Deploy**:
   - Railway automatically deploys on push to main
   - Get your URL from the "Settings" tab

---

## Option 3: Render

### Pros:
- ✅ Free tier available
- ✅ PostgreSQL database free tier
- ✅ Auto-deploy from GitHub
- ✅ No credit card required initially

### Cons:
- ⚠️ Free tier spins down after inactivity (slow cold starts)
- ⚠️ Limited to 750 hours/month on free tier

### Setup Steps:

1. **Go to Render**:
   - Visit [Render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your `ElctrDc` repository
   - Settings:
     - Name: `researchos`
     - Environment: `Node`
     - Build Command: `npm install --legacy-peer-deps && npx prisma generate && npm run build`
     - Start Command: `npm run start`

3. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `researchos-db`
   - Plan: Free
   - Copy the "Internal Database URL"

4. **Set Environment Variables**:
   - In Web Service → Environment
   - Add:
     ```
     DATABASE_URL=<paste_internal_database_url>
     NEXTAUTH_SECRET=generate_random_string_32_chars
     NEXTAUTH_URL=https://researchos.onrender.com
     ```

5. **Deploy**:
   - Click "Manual Deploy" or push to GitHub

---

## Option 4: Fly.io

### Pros:
- ✅ Good free tier (3 shared CPUs, 256MB RAM)
- ✅ Can host database + app
- ✅ Global deployment
- ✅ Good performance

### Cons:
- ⚠️ Requires credit card
- ⚠️ CLI-based deployment
- ⚠️ Slightly complex setup

### Setup Steps:

1. **Install Fly CLI**:
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

2. **Login**:
```bash
fly auth login
```

3. **Launch App**:
```bash
cd d:\VSCODEresearchos\ElctrDc
fly launch --name researchos
```

4. **Add PostgreSQL**:
```bash
fly postgres create --name researchos-db
fly postgres attach --app researchos researchos-db
```

5. **Set Secrets**:
```bash
fly secrets set NEXTAUTH_SECRET="your-secret-32-chars"
fly secrets set NEXTAUTH_URL="https://researchos.fly.dev"
```

6. **Deploy**:
```bash
fly deploy
```

---

## Recommended Setup by Use Case

### For Testing/Demo (Easiest):
→ **Netlify** + **Neon Database**
- Fastest setup
- No credit card needed
- Good performance

### For Production (Best Free Tier):
→ **Railway**
- Everything included
- Best developer experience
- $5/month credit is generous

### For Long-term Free:
→ **Render**
- Truly free forever
- Includes database
- Auto-sleep acceptable for demos

---

## Free Database Options (If Needed)

| Provider | Storage | Connection Limit | Notes |
|----------|---------|-----------------|-------|
| **Neon** | 0.5 GB | 100 | Best for serverless |
| **Supabase** | 500 MB | 60 | Includes auth, storage |
| **Railway** | 1 GB | Unlimited | Included with app |
| **Render** | 256 MB | 97 | Free but slow |
| **ElephantSQL** | 20 MB | 5 | Very limited |

---

## Quick Start: Netlify + Neon (Fastest)

```bash
# 1. Create Neon database
# Go to https://neon.tech → Create project → Copy connection string

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Login to Netlify
netlify login

# 4. Deploy
netlify init

# 5. Set environment variables
netlify env:set DATABASE_URL "your_neon_url"
netlify env:set NEXTAUTH_SECRET "$(openssl rand -base64 32)"
netlify env:set NEXTAUTH_URL "https://your-site.netlify.app"

# 6. Build and deploy
netlify deploy --prod
```

---

## Generate NEXTAUTH_SECRET

### Windows PowerShell:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Mac/Linux:
```bash
openssl rand -base64 32
```

---

## Troubleshooting

### Build Fails with Dependency Issues:
- Add `--legacy-peer-deps` to build command
- Use Node 20.x (set in environment variables)

### Database Connection Errors:
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Ensure database allows external connections
- Run `npx prisma generate` before build

### NextAuth Errors:
- Ensure `NEXTAUTH_URL` matches your deployment URL
- `NEXTAUTH_SECRET` must be at least 32 characters

---

## Cost Comparison (Monthly)

| Platform | Free Tier | Paid (if needed) |
|----------|-----------|------------------|
| Netlify | 100GB bandwidth | $19/mo (Pro) |
| Railway | $5 credit | $5-20/mo usage |
| Render | 750 hours | $7/mo (Starter) |
| Fly.io | 3 VMs | $1.94/mo per VM |
| Vercel | 100GB bandwidth | $20/mo (Pro) |

---

## My Recommendation

**For you right now:** Use **Railway**

Why?
1. ✅ Includes PostgreSQL (no extra setup)
2. ✅ $5 free credit is enough for small projects
3. ✅ Push to GitHub = auto-deploy
4. ✅ Easy to scale later
5. ✅ Good developer experience

**Setup time:** 5 minutes

Would you like me to help you deploy to Railway right now?
