# 🚀 Railway Deployment Guide - Team Task Manager

**Status**: Phase 3 - Production Deployment  
**Timeline**: ~15 minutes to live  
**Target**: https://your-app.railway.app

---

## 📋 Prerequisites

✅ Backend running locally (confirmed)  
✅ Docker image builds successfully (confirmed)  
✅ Database migrations tested (confirmed)  
✅ Environment variables documented (confirmed)

**Before Starting:**
- [ ] Sign up for Railway: https://railway.app (free account)
- [ ] Have your project ready
- [ ] GitHub/Docker Hub account for image push (optional - Railway can build from GitHub)

---

## 🎯 Phase 3.1: Prepare for Deployment (5 min)

### Step 1: Build & Push Docker Image (Optional - if not using GitHub)

If using Railway's GitHub integration, **skip this step**. Otherwise:

```bash
# Login to Docker Hub
docker login

# Build image
docker build -t yourusername/team-task-manager:latest ./backend

# Push to Docker Hub
docker push yourusername/team-task-manager:latest
```

### Step 2: Update Frontend URL

Update `backend/.env.example` to document the production frontend URL:

```bash
FRONTEND_URL=https://your-frontend.vercel.app
# or wherever your frontend will be hosted
```

### Step 3: Create Railway Project

1. Go to **https://railway.app**
2. Sign in / Create account
3. Click **+ New Project**
4. Select **Empty Project**

---

## 🗄️ Phase 3.2: Add Managed PostgreSQL Database (3 min)

**Why managed?** Railway handles backups, scaling, security patches.

1. In your Railway project, click **+ New**
2. Select **Database**
3. Choose **PostgreSQL**
4. Railway automatically provisions:
   - Database: `railway`
   - User: `postgres` (auto-generated password)
   - Port: 5432
   - Connection string: Available in **Variables**

**✅ Copy these variables** (you'll need them):
- `DATABASE_URL` - Full connection string
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

---

## 🚀 Phase 3.3: Deploy Backend Service (5 min)

### Option A: Deploy from GitHub (Recommended)

1. Click **+ New** → **GitHub Repo**
2. Authorize Railway to access GitHub
3. Select your repository
4. Railway auto-detects `Dockerfile`
5. Click **Deploy**

### Option B: Deploy from Docker Image

1. Click **+ New** → **Docker Image**
2. Enter image URI:
   - Docker Hub: `yourusername/team-task-manager:latest`
   - GitHub Container Registry: `ghcr.io/yourusername/team-task-manager:latest`
3. Click **Deploy**

### Step 1: Configure Environment Variables

1. Click on your **backend service**
2. Go to **Variables** tab
3. Add the following:

```
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=8080
```

**Where to get values:**
- `DATABASE_URL`: From Postgres service Variables (Railway auto-fills via `${{Postgres.DATABASE_URL}}`)
- `JWT_SECRET`: Generate: `openssl rand -hex 32`
- `PORT`: Railway defaults to 8080 (don't change unless needed)

### Step 2: Enable Public Access

1. Go to **Settings** tab
2. Scroll to **Networking**
3. Click **Generate Domain**
4. Your app gets a URL like: `https://team-task-manager-prod.railway.app`

### Step 3: Deploy

1. Click **Deploy** button
2. Watch the build logs
3. Look for: `✓ Backend running on port 8080`
4. When green (healthy), your backend is live!

---

## 🔌 Phase 3.4: Connect Frontend to Backend (2 min)

Once backend is deployed:

1. Copy your Railway backend URL: `https://team-task-manager-prod.railway.app`
2. Update **`frontend/src/services/api.js`**:

```javascript
const baseURL = process.env.REACT_APP_API_URL || 'https://team-task-manager-prod.railway.app';
```

3. If deploying frontend to Vercel:
   - Add env variable: `REACT_APP_API_URL=https://team-task-manager-prod.railway.app`
   - Redeploy frontend

---

## ✅ Phase 3.5: Test Production Deployment (3 min)

### Test 1: Health Check

```bash
curl https://team-task-manager-prod.railway.app/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "data": {
    "server": "running",
    "database": "connected"
  }
}
```

### Test 2: API Docs

Open: `https://team-task-manager-prod.railway.app/api-docs`

### Test 3: Full User Flow

1. Signup / Login
2. Create a project
3. Create a task
4. Verify all operations work end-to-end

---

## 🐛 Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| **Deployment fails** | Missing env vars | Check **Variables** tab has `DATABASE_URL` |
| **Health check fails** | DB connection issue | Verify `DATABASE_URL` is correct in Postgres Variables |
| **CORS errors** | Frontend URL not in whitelist | Add frontend domain to `FRONTEND_URL` |
| **503 Service Unavailable** | Container not listening on port 8080 | Check `PORT=8080` in Variables |
| **Cannot connect to database** | Railway PostgreSQL not healthy | Wait 2-3 min for DB to initialize |

---

## 📊 Railway Dashboard Commands

```bash
# View logs
# Railway UI → Service → Logs tab

# View variables
# Railway UI → Service → Variables tab

# Restart service
# Railway UI → Service → Redeploy button

# View metrics
# Railway UI → Service → Metrics tab (CPU, Memory, Network)
```

---

## 🎯 Deployment Checklist

- [ ] Railway project created
- [ ] PostgreSQL database provisioned
- [ ] Backend service deployed
- [ ] Environment variables configured
- [ ] Public domain generated
- [ ] Health check passing
- [ ] API docs accessible
- [ ] Full user flow tested
- [ ] Frontend connected to backend
- [ ] Email notifications enabled (optional)

---

## 🔐 Production Security Checklist

- [ ] `JWT_SECRET` is strong (use `openssl rand -hex 32`)
- [ ] `NODE_ENV=production` (disables debug logging)
- [ ] CORS whitelist updated (only your frontend domain)
- [ ] Rate limiting enabled (default: 200 req/15min)
- [ ] Helmet security headers enabled
- [ ] Database backups enabled (Railway default: yes)
- [ ] Monitor error rates (Railway dashboard)
- [ ] SSL/TLS enabled (Railway automatic)

---

## 📈 Next Steps After Deployment

1. **Setup monitoring**: Railway → Logs → Alerts
2. **Enable auto-scaling**: Settings → Scaling (if needed)
3. **Add custom domain**: Settings → Domain → Link custom domain
4. **Setup CI/CD**: Connect to GitHub for auto-deploys on push
5. **Add analytics**: Segment frontend events

---

## 🚨 Quick Reference

**Backend deployed?** → Check health: `curl https://your-domain/health`  
**Can't login?** → Check database connection and seed data  
**Member can't access project?** → Verify they were added by admin  
**API returning 401?** → JWT token expired or missing Authorization header

---

**Questions?** Reference the Railway docs: https://docs.railway.com
