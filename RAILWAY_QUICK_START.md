# 📋 Railway Deployment Quick Reference Card

**Deployment Status**: ✅ Ready  
**Estimated Time**: 15 minutes  
**Live URL Format**: `https://your-project-name-prod.railway.app`

---

## 🔑 Your Production Configuration

### JWT_SECRET (Generated)
```
72adabb8efc3a5ec0441052fec68a7d5d77f7e775d190d9f5e18f9c88f11b26e
```
**Copy this value to Railway Variables → JWT_SECRET**

### Demo Accounts (Pre-Seeded)
```
Admin:   admin@test.com / admin123
Member:  member@test.com / member123
```

---

## 🚀 Deployment in 5 Steps

### 1. Create Railway Project
```
Go to: https://railway.app → New Project → Empty Project
```

### 2. Add PostgreSQL
```
Railway Dashboard → + New → Database → PostgreSQL
Copy: DATABASE_URL from Variables tab
```

### 3. Deploy Backend
```
Railway Dashboard → + New → GitHub Repo (or Docker Image)
Select: team-task-manager repository
Wait for build ✓
```

### 4. Set Variables
```
In Railway backend service → Variables tab, add:

PORT=8080
NODE_ENV=production
JWT_SECRET=72adabb8efc3a5ec0441052fec68a7d5d77f7e775d190d9f5e18f9c88f11b26e
FRONTEND_URL=https://your-frontend-domain.com
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### 5. Generate Domain & Test
```
Settings → Networking → Generate Domain
Test: curl https://your-domain/health
```

---

## ✅ Success Indicators

✅ Health check returns 200 with database: connected  
✅ API docs accessible at /api-docs  
✅ Login works with demo account  
✅ Projects can be created  
✅ Tasks can be updated  
✅ Member can't see admin projects  

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check logs for dependency errors |
| Health 503 | DATABASE_URL not set or wrong format |
| CORS error | FRONTEND_URL doesn't match your domain |
| Can't login | Seed script failed, check migrations |
| Port error | Verify PORT=8080 is set |

---

## 📊 Key Endpoints

```
GET  /health              # System status
GET  /api-docs            # Swagger documentation
POST /api/auth/login      # User authentication
POST /api/projects        # Create project
GET  /api/projects        # List projects
POST /api/users           # Create user (admin only)
POST /api/tasks           # Create task
```

---

## 🔗 Important Links

- **Railway Dashboard**: https://railway.app
- **Deployment Guide**: See `RAILWAY_DEPLOYMENT.md`
- **Full Checklist**: See `RAILWAY_CHECKLIST.md`
- **Documentation**: https://docs.railway.com

---

## 💡 Pro Tips

1. **Set NODE_ENV=production** → Disables verbose logging
2. **Strong JWT_SECRET** → Use `openssl rand -hex 32`
3. **CORS whitelist** → Only your frontend domain
4. **Monitor logs** → Railway Dashboard → Logs tab
5. **Database backups** → Automatic with managed PostgreSQL

---

## 📱 After Deployment

1. Update frontend API endpoint to Railway URL
2. Deploy frontend to Vercel/Netlify
3. Test full end-to-end flow
4. Setup custom domain (optional)
5. Configure CI/CD for auto-deploy

---

**Ready?** Open Railway dashboard and follow the 5 steps above! 🚀
