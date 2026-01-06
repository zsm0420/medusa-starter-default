# Vercel Deployment Configuration for Medusa Admin

## Architecture
Medusa Admin is integrated into the main backend project but can be deployed separately on Vercel for better performance.

## Setup Instructions

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel admin deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import this GitHub repository
4. In "Configure Project":
   - Root Directory: `.` (root)
   - Output Directory: `dist/admin` (will be created after build)
5. Click "Deploy"

### 3. Connect Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your admin subdomain (e.g., admin.yourstore.com)
3. Update DNS records as instructed

## Environment Variables

After deploying your Render backend, add these environment variables in Vercel:

| Variable | Description | Required |
|----------|-------------|----------|
| `MEDUSA_ADMIN_BACKEND_URL` | Your Render Medusa API URL | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `COOKIE_SECRET` | Secret for cookies | Yes |

## Important Notes

### CORS Configuration
Make sure your Render backend has the admin URL in `ADMIN_CORS`:
```
ADMIN_CORS=http://localhost:5173,https://your-admin.vercel.app
```

### Authentication
Medusa Admin requires:
1. A user account created via CLI: `npx medusa user -e admin@example.com -p password`
2. The admin will redirect to your backend for authentication

## Post-Deployment Steps

1. **Create Admin User** (on Render backend):
   ```bash
   # Connect to Render shell or use a seed script
   npx medusa user -e admin@yourstore.com -p yourpassword
   ```

2. **Update Backend CORS**:
   - Go to Render dashboard for your backend service
   - Add your Vercel admin URL to `ADMIN_CORS` environment variable
   - Redeploy the backend

3. **Test Admin Access**:
   - Visit your Vercel admin URL
   - Login with the credentials you created
