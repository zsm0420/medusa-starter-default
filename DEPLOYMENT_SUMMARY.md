# Medusa E-commerce Platform - Complete Deployment Guide

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel (CDN + Edge)                      │
│  ┌────────────────────────┐    ┌────────────────────────┐       │
│  │   Next.js Storefront   │    │    Medusa Admin        │       │
│  │   (https://store.)     │    │   (https://admin.)     │       │
│  └───────────┬────────────┘    └───────────┬────────────┘       │
│              │                            │                      │
│              └──────────┬─────────────────┘                      │
│                         │                                        │
└─────────────────────────┼────────────────────────────────────────┘
                          │ HTTPS API Calls
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Render (Cloud Infrastructure)               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Medusa API Backend                    │    │
│  │               (https://api.yourstore.com)               │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────────┐ │    │
│  │  │  Node   │──│   PG    │──│  Redis (Cache/Events)   │ │    │
│  │  │  v20    │  │  v15    │  │    (Optional)           │ │    │
│  │  └─────────┘  └─────────┘  └─────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
medusa-starter-default/
├── storefront/                 # Next.js 14 Storefront (Vercel)
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── products/      # Products listing
│   │   │   ├── cart/          # Shopping cart
│   │   │   └── account/       # User account
│   │   └── lib/
│   │       └── providers/     # Medusa & Cart providers
│   ├── package.json
│   ├── vercel.json           # Vercel config
│   └── VERCEL_DEPLOYMENT.md  # Deployment guide
│
├── admin-vercel.json         # Vercel config for Admin
├── ADMIN_VERCEL_DEPLOYMENT.md # Admin deployment guide
│
├── RENDER_DEPLOYMENT.md      # Render backend deployment
│
├── medusa-config.ts          # Medusa backend config
├── package.json              # Backend dependencies
│
└── verify-deployment.sh      # Deployment verification script
```

---

## 🚀 Quick Deployment Steps

### Phase 1: Deploy Backend to Render

1. **Create PostgreSQL Database**
   - Go to Render Dashboard → New → PostgreSQL
   - Name: `medusa-db`
   - Save the connection URL

2. **Create Redis** (Optional but recommended)
   - Render Dashboard → New → Redis
   - Name: `medusa-redis`

3. **Create Web Service**
   - Render Dashboard → New → Web Service
   - Connect GitHub repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Add environment variables (see `RENDER_DEPLOYMENT.md`)

4. **Create Admin User**
   ```bash
   npx medusa user -e admin@yourstore.com -p YourSecurePassword123!
   ```

### Phase 2: Deploy Storefront to Vercel

1. **Push Storefront to GitHub**
   ```bash
   cd storefront
   git init
   git add .
   git commit -m "Add Next.js storefront"
   git remote add origin https://github.com/yourusername/medusa-storefront.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Vercel Dashboard → New Project
   - Import GitHub repository
   - Environment Variables:
     - `NEXT_PUBLIC_MEDUSA_BACKEND_URL`: Your Render backend URL
   - Deploy

### Phase 3: Deploy Admin to Vercel (Optional)

1. **Push Backend to GitHub** (if not already done)
   ```bash
   cd ..
   git add .
   git commit -m "Prepare for Vercel admin deployment"
   git push origin main
   ```

2. **Deploy Admin to Vercel**
   - Use `admin-vercel.json` configuration
   - Import the same repository
   - Environment Variables:
     - `MEDUSA_ADMIN_BACKEND_URL`: Your Render backend URL
     - `JWT_SECRET`: Same as in Render
     - `COOKIE_SECRET`: Same as in Render

---

## 🔧 Environment Variables

### Backend (.env) - Render

```env
# Database (Required)
DATABASE_URL=postgres://user:password@hostname:5432/database

# Redis (Optional but recommended)
REDIS_URL=redis://:password@hostname:6379

# CORS (Update with your Vercel URLs)
STORE_CORS=http://localhost:8000,https://your-storefront.vercel.app
ADMIN_CORS=http://localhost:5173,https://your-admin.vercel.app
AUTH_CORS=http://localhost:5173,https://your-admin.vercel.app

# Security (Generate strong secrets)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
COOKIE_SECRET=your-super-secret-cookie-key-min-32-chars

# Node.js
NODE_VERSION=20
NODE_ENV=production
```

### Storefront (.env.local) - Vercel

```env
# Backend URL (Required)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-api.onrender.com
```

---

## 🔍 Verification

### Run Verification Script

**Linux/macOS:**
```bash
chmod +x verify-deployment.sh
./verify-deployment.sh https://your-api.onrender.com
```

**Windows:**
```bash
verify-deployment.bat https://your-api.onrender.com
```

### Manual Checks

1. **Backend Health**
   ```bash
   curl https://your-api.onrender.com/health
   # Expected: {"status":"ok","type":"health"}
   ```

2. **Store API**
   ```bash
   curl https://your-api.onrender.com/store/products
   # Expected: JSON response with products
   ```

3. **Admin Dashboard**
   - Visit: `https://your-admin.vercel.app`
   - Login with admin credentials

---

## 📋 Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Store API returns products
- [ ] Admin dashboard accessible and login works
- [ ] Storefront loads without errors
- [ ] CORS configured correctly (no console errors)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Admin user created
- [ ] Sample products added via Admin
- [ ] Payment provider configured (Stripe, PayPal, etc.)
- [ ] Shipping provider configured
- [ ] SEO metadata configured in storefront

---

## 💰 Cost Estimation (Monthly)

| Service | Free Tier | Production Tier |
|---------|-----------|-----------------|
| Vercel (Frontend) | Unlimited | Unlimited |
| Vercel (Admin) | Unlimited | Unlimited |
| Render Web Service | 750 hours | ~$7/month |
| Render PostgreSQL | 90 days | ~$7/month |
| Render Redis | 90 days | ~$7/month |
| **Total** | **First 90 days free** | **~$21/month** |

---

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails on Render**
   - Check Node.js version (must be 20)
   - Verify `npm install` completes successfully
   - Check build logs for specific errors

2. **CORS Errors**
   - Ensure URLs are in correct CORS environment variables
   - Include both `http` and `https`
   - Redeploy after updating CORS

3. **Database Connection Failed**
   - Verify `DATABASE_URL` format
   - Check database is in same region
   - Ensure database is active

4. **Admin Login Fails**
   - Verify admin user was created
   - Check `JWT_SECRET` and `COOKIE_SECRET` match
   - Confirm admin URL in `ADMIN_CORS`

---

## 📚 Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)

---

## 📝 Notes

- This deployment uses the latest Medusa v2 architecture
- Frontend and Admin are deployed separately on Vercel for better performance
- Backend runs on Render with PostgreSQL database
- Redis is optional but recommended for caching and event handling
- All services are cloud-native and auto-scalable
