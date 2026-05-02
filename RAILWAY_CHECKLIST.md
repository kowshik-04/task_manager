# 🎯 Railway Deployment Checklist - Team Task Manager

**Target Completion Time**: 15 minutes  
**Status**: Ready for deployment  
**Last Updated**: 2026-05-02

---

## ✅ PRE-DEPLOYMENT VALIDATION (Local System)

- [x] Backend builds without errors (`docker build`)
- [x] Backend runs locally (`docker compose up`)
- [x] Database migrations pass
- [x] Health endpoint responds correctly
- [x] All 4 services running (backend, postgres, seed data loaded)
- [x] Frontend connects to backend (CORS working)
- [x] Full user flow tested (login → project → task → update)
- [x] Admin user creation feature working
- [x] Error messages are clear and specific
- [x] Success feedback is visible to users

---

## 🚀 DEPLOYMENT STEPS (Do These in Order)

### STEP 1: Create Railway Account & Project (2 min)

- [ ] Go to https://railway.app
- [ ] Sign up (free account)
- [ ] Create new empty project
- [ ] Name it: `team-task-manager`

**Result**: You have a Railway project dashboard open

---

### STEP 2: Provision PostgreSQL Database (2 min)

- [ ] Click **+ New** in Railway dashboard
- [ ] Select **Database** → **PostgreSQL**
- [ ] Wait for provision (2-3 sec)
- [ ] Click on Postgres service
- [ ] Go to **Variables** tab
- [ ] Note these values (you'll use them):
  - `DATABASE_URL`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_HOST`
  - `POSTGRES_PORT`

**Result**: Railway manages your database, automatic backups enabled

---

### STEP 3: Deploy Backend Service (5 min)

#### Option A: Deploy from GitHub (Recommended)

- [ ] Click **+ New** → **GitHub Repo**
- [ ] Authorize Railway to access GitHub
- [ ] Select your `team-task-manager` repository
- [ ] Railway auto-detects `Dockerfile`
- [ ] Click **Deploy**
- [ ] Wait for build to complete (watch logs)

#### Option B: Deploy from Docker Image

- [ ] Build image locally: `docker build -t yourusername/team-task-manager:latest ./backend`
- [ ] Push to Docker Hub: `docker push yourusername/team-task-manager:latest`
- [ ] In Railway: Click **+ New** → **Docker Image**
- [ ] Enter: `yourusername/team-task-manager:latest`
- [ ] Click **Deploy**

**Result**: Backend service deployed

---

### STEP 4: Configure Environment Variables (3 min)

- [ ] Click on **backend service** in Railway
- [ ] Go to **Variables** tab
- [ ] Click **+ New Variable** and add:

| Key | Value |
|-----|-------|
| `PORT` | `8080` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | *Generate: `openssl rand -hex 32`* |
| `FRONTEND_URL` | `https://your-frontend-domain.com` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |

**Critical**: 
- JWT_SECRET must be strong (use `openssl rand -hex 32`)
- FRONTEND_URL must be your actual frontend domain
- DATABASE_URL references the Postgres service

**Result**: Variables saved

---

### STEP 5: Enable Public Access (1 min)

- [ ] While in backend service, go to **Settings** tab
- [ ] Scroll to **Networking** section
- [ ] Click **Generate Domain**
- [ ] Copy the generated URL (e.g., `https://team-task-manager-prod.railway.app`)

**Result**: Your backend is public and has a domain

---

### STEP 6: Deploy (Click Deploy Button)

- [ ] Click **Deploy** button in Railway
- [ ] Watch the build logs
- [ ] Look for: `✓ Backend running on port 8080`
- [ ] When green status appears, deployment succeeded

**Result**: Backend is live!

---

## 🧪 POST-DEPLOYMENT VALIDATION (5 min)

### Test 1: Health Check

```bash
curl https://your-domain.railway.app/health
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

**If fails:**
- [ ] Check Variables (DATABASE_URL set correctly)
- [ ] Check Logs tab for error messages
- [ ] Wait 30 seconds and retry

---

### Test 2: API Documentation

- [ ] Open: `https://your-domain.railway.app/api-docs`
- [ ] Should see Swagger interface
- [ ] Try one endpoint (e.g., GET /health)

**If fails:**
- [ ] Check backend logs for Express startup errors
- [ ] Verify PORT=8080 in Variables

---

### Test 3: Run Seed Script (If Using GitHub Deploy)

Since Railway will run your Docker build, it should automatically:
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed database with demo accounts
- [ ] Initialize database schema

**To verify seed ran:**
```bash
# Connect to Railway PostgreSQL
# Login test: admin@test.com / admin123
# Login test: member@test.com / member123
```

---

### Test 4: Full User Flow

- [ ] Update `frontend/src/services/api.js`:
  ```javascript
  const baseURL = process.env.REACT_APP_API_URL || 'https://your-domain.railway.app';
  ```
- [ ] Login as: `admin@test.com` / `admin123`
- [ ] Create a project
- [ ] Create a task
- [ ] Update task status
- [ ] Logout
- [ ] Login as: `member@test.com` / `member123`
- [ ] Verify member can see assigned tasks only
- [ ] Update an assigned task status

**If any step fails:**
- [ ] Check browser console for errors
- [ ] Check Railway backend logs
- [ ] Check FRONTEND_URL matches your frontend domain

---

## 🐛 Troubleshooting Table

| Symptom | Cause | Fix |
|---------|-------|-----|
| **Build fails** | Missing dependencies | Check logs: `npm install` errors |
| **Health check 503** | DB not connected | Wait 30s, verify DATABASE_URL in Variables |
| **CORS errors** | Frontend domain not whitelisted | Update FRONTEND_URL in Variables |
| **Port binding error** | PORT not set correctly | Set PORT=8080 in Variables |
| **Cannot login** | Seed script didn't run | Check build logs for Prisma migration errors |
| **App crashes after deploy** | Missing env var | Review all Variables, compare with .env.production |

---

## 📊 Monitoring After Deployment

- [ ] Check **Logs** tab regularly for errors
- [ ] Monitor **Metrics** tab (CPU, Memory, Network)
- [ ] Set up email alerts (Railway → Notifications)
- [ ] Test endpoints daily for uptime

---

## 🔐 Security Verification

- [ ] JWT_SECRET is strong (random 32 chars minimum)
- [ ] NODE_ENV set to `production`
- [ ] CORS only allows your frontend domain
- [ ] Database backups enabled (Railway default)
- [ ] Rate limiting active (200 req/15min default)
- [ ] Helmet security headers enabled
- [ ] No console.log sensitive data (NODE_ENV=production disables debug)

---

## ✨ Deployment Complete!

**When you see:**
- ✅ Green health check
- ✅ API docs responding
- ✅ Login working
- ✅ Tasks being created and updated
- ✅ No errors in logs

**You're live in production!** 🎉

---

## 🎯 Next Steps

1. **Deploy Frontend**: Same process to Vercel/Netlify
2. **Custom Domain**: Add your domain in Railway settings
3. **CI/CD**: Connect GitHub for auto-deploy on push
4. **Monitoring**: Set up error tracking (Sentry optional)
5. **Analytics**: Track user behavior (optional)

---

## 📞 Support

**Railway Docs**: https://docs.railway.com  
**Backend Health**: `curl https://your-domain/health`  
**View Logs**: Railway dashboard → Service → Logs tab  
**Restart Service**: Railway dashboard → Service → Redeploy button

---

**Status**: ✅ System ready for production deployment  
**Deployment Window**: Anytime (no downtime required for new deployment)  
**Estimated Live Time**: ~15 minutes from start to end
