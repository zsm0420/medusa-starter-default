# Render Deployment Configuration for Medusa Backend

## Architecture
- **Web Service**: Medusa API (Node.js)
- **Database**: PostgreSQL 15
- **Redis**: For caching and events (optional for v2)

## Prerequisites
1. [Render Account](https://render.com)
2. [GitHub Repository](https://github.com/yourusername/medusa-starter-default)

---

## Step 1: Create PostgreSQL Database

### 1.1 Create Database Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `medusa-db`
   - **Database**: `medusa_v2`
   - **User**: `medusa_user`
   - **Plan**: `Free` (for development) or `Standard` (for production)
4. Click **Create Database**

### 1.2 Save Connection Info
After creation, note these values from the connection details:
- `Internal Database URL`: `postgres://user:password@hostname:5432/database`
- You'll need this for the web service

---

## Step 2: Create Redis (Optional but Recommended)

### 2.1 Create Redis Service
1. Click **New +** → **Redis**
2. Configure:
   - **Name**: `medusa-redis`
   - **Plan**: `Free` (or `Standard` for production)
3. Click **Create Redis**

### 2.2 Save Connection Info
Note the `Internal Redis URL`:
- Format: `redis://:password@hostname:6379`

---

## Step 3: Create Medusa Web Service

### 3.1 Create Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `medusa-api`
   - **Root Directory**: (leave empty, use root)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: `Free` (for development) or `Standard` (for production)

### 3.2 Environment Variables
Add these in the **Environment** tab:

```env
# Database (from Step 1)
DATABASE_URL=postgres://user:password@hostname:5432/database

# Redis (from Step 2) - Optional but recommended
REDIS_URL=redis://:password@hostname:6379

# CORS Configuration
# Update with your Vercel frontend URL after deployment
STORE_CORS=http://localhost:8000,https://your-storefront.vercel.app
ADMIN_CORS=http://localhost:5173,https://your-admin.vercel.app
AUTH_CORS=http://localhost:5173,https://your-admin.vercel.app

# Security Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-here
COOKIE_SECRET=your-super-secret-cookie-key-here

# Node Version
NODE_VERSION=20

# Environment
NODE_ENV=production
```

### 3.3 Advanced Settings
- **Health Check Path**: `/health`
- **Instance Type**: `Small` (or larger for production)

### 3.4 Deploy
Click **Create Web Service**. Wait for build and deployment (~5-10 minutes).

---

## Step 4: Create Admin User

After successful deployment, create an admin user via Render's shell:

1. Go to your **medusa-api** service
2. Click **Shell** → **Connect Shell**
3. Run:
   ```bash
   npx medusa user -e admin@yourstore.com -p YourSecurePassword123!
   ```

4. Note: If `medusa` command fails, use the seed script approach instead.

---

## Step 5: Verify Deployment

### 5.1 Test Health Endpoint
Visit: `https://your-service-name.onrender.com/health`

Expected response:
```json
{
  "status": "ok",
  "type": "health"
}
```

### 5.2 Test API Documentation
Visit: `https://your-service-name.onrender.com/docs`

---

## Step 6: Update CORS for Production

After deploying your Vercel frontend and admin:

1. Go to **medusa-api** service on Render
2. Click **Environment** → **Edit Variables**
3. Update `STORE_CORS` and `ADMIN_CORS`:
   ```env
   STORE_CORS=http://localhost:8000,https://your-storefront.vercel.app,https://your-custom-domain.com
   ADMIN_CORS=http://localhost:5173,https://your-admin.vercel.app,https://admin.your-custom-domain.com
   ```
4. Click **Save Changes**
5. The service will automatically redeploy

---

## Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ⚠️ Optional | Redis connection string (recommended) |
| `STORE_CORS` | ✅ | Allowed origins for storefront |
| `ADMIN_CORS` | ✅ | Allowed origins for admin |
| `AUTH_CORS` | ✅ | Allowed origins for authentication |
| `JWT_SECRET` | ✅ | Secret for JWT tokens (min 32 chars) |
| `COOKIE_SECRET` | ✅ | Secret for cookies (min 32 chars) |
| `NODE_VERSION` | ✅ | Node.js version (20) |
| `NODE_ENV` | ✅ | Environment (production) |

---

## Troubleshooting

### Build Fails
- Check **Logs** tab for errors
- Ensure Node.js version is 20 in `package.json` engines
- Verify all dependencies are correctly installed

### Database Connection Failed
- Verify `DATABASE_URL` format is correct
- Check that database is in same region as web service
- Ensure database is active (not suspended)

### CORS Errors
- Double-check CORS environment variables
- Include both `http` and `https` versions
- Restart service after updating CORS

### Admin Login Fails
- Ensure admin user was created successfully
- Verify `JWT_SECRET` and `COOKIE_SECRET` are set
- Check that admin URL is in `ADMIN_CORS`

---

## Cost Estimation (Monthly)

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| PostgreSQL | 90 days | ~$7/month |
| Redis | 90 days | ~$7/month |
| Web Service | 750 hours | ~$7/month |
| **Total** | **First 90 days free** | **~$21/month** |

---

## Next Steps

1. ✅ Deploy Render backend
2. 🔄 Deploy Vercel storefront (update `NEXT_PUBLIC_MEDUSA_BACKEND_URL`)
3. 🔄 Deploy Vercel admin
4. 🔗 Configure custom domains
