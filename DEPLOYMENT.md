# Deployment Guide - Digital Health Wallet

Complete step-by-step guide to deploy your Digital Health Wallet application online for free!

## Prerequisites

- GitHub account
- Vercel account (free) - [Sign up here](https://vercel.com/signup)
- Render account (free) - [Sign up here](https://render.com/register)

---

## Deployment Overview

We'll deploy:
1. **Backend** (Node.js + SQLite) → Render
2. **Frontend** (React) → Vercel

Total time: ~15-20 minutes

---

## Step 1: Push Code to GitHub

Your code is already on GitHub at: `https://github.com/mithunreddy03/digital-health-wallet`

Make sure all latest changes are pushed:
```bash
git add .
git commit -m "chore: Add deployment configuration"
git push
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `digital-health-wallet`
3. Configure the service:

**Basic Settings:**
- **Name**: `digital-health-wallet-api`
- **Region**: Choose closest to your users
- **Branch**: `master`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

**Environment Variables:**
Click "Advanced" and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `JWT_SECRET` | `your_super_secret_key_change_this_12345` |
| `FRONTEND_URL` | `https://your-app-name.vercel.app` (we'll update this later) |

**Instance Type:**
- Select **"Free"** tier

### 2.3 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL (e.g., `https://digital-health-wallet-api.onrender.com`)

⚠️ **Important**: Free tier services sleep after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your repository: `digital-health-wallet`
3. Configure the project:

**Framework Preset**: Vite
**Root Directory**: `client`

**Build Settings:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Environment Variables
Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com/api` |

Replace `your-backend-url` with your actual Render backend URL from Step 2.3.

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Once deployed, you'll get your frontend URL (e.g., `https://digital-health-wallet.vercel.app`)

---

## Step 4: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go back to Render dashboard
2. Select your web service
3. Go to **"Environment"**
4. Update `FRONTEND_URL` with your actual Vercel URL:
   ```
   FRONTEND_URL=https://your-actual-app.vercel.app
   ```
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## Step 5: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://digital-health-wallet.vercel.app`)
2. Try to register a new account
3. Upload a test report
4. Test all features:
   - ✅ Registration & Login
   - ✅ Dashboard with vitals
   - ✅ Upload reports
   - ✅ Filter reports
   - ✅ Share via WhatsApp
   - ✅ Selective sharing

---

## Your App is Live!

**Frontend URL**: `https://your-app.vercel.app`  
**Backend URL**: `https://your-api.onrender.com`

Share your app with anyone! 🌍

---

## Troubleshooting

### Backend Issues

**Problem**: Backend not responding
- **Solution**: Free tier sleeps after inactivity. Wait 30-60 seconds for first request.

**Problem**: CORS errors
- **Solution**: Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash)

**Problem**: Database errors
- **Solution**: Render's free tier has persistent disk. Database will be recreated on first deploy.

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check `VITE_API_URL` environment variable in Vercel settings

**Problem**: 404 on refresh
- **Solution**: The `vercel.json` file handles SPA routing. Make sure it's committed to GitHub.

**Problem**: Build fails
- **Solution**: Check build logs in Vercel. Usually missing dependencies or build errors.

---

## Cost Breakdown

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| Vercel | Free | $0/month | 100GB bandwidth, unlimited projects |
| Render | Free | $0/month | 750 hours/month, sleeps after 15min inactivity |
| **Total** | | **$0/month** | Perfect for personal projects |

---

## Upgrading (Optional)

### To Keep Backend Always Awake:
- Upgrade Render to Starter plan ($7/month)
- Or use a cron job to ping your backend every 10 minutes

### For Better Performance:
- Upgrade Render to Starter plan for better resources
- Use Vercel Pro for analytics and better support

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Registration working
- [ ] Login working
- [ ] File upload working
- [ ] WhatsApp share working
- [ ] All features tested

---

## Security Notes

1. **Change JWT_SECRET**: Use a strong, random secret in production
2. **HTTPS**: Both Vercel and Render provide free HTTPS
3. **Environment Variables**: Never commit `.env` files to GitHub
4. **Database**: SQLite file is stored on Render's persistent disk

---

## Share Your App

Your app is now live! Share these URLs:

- **App**: `https://your-app.vercel.app`
- **GitHub**: `https://github.com/mithunreddy03/digital-health-wallet`

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **GitHub Issues**: Create an issue in your repository

---

## Congratulations!

Your Digital Health Wallet is now live and accessible to anyone in the world! 🌍✨
