# Vercel Deployment Configuration for Medusa Storefront

## Setup Instructions

### 1. Push to GitHub
```bash
cd storefront
git init
git add .
git commit -m "Add Next.js storefront"
git remote add origin https://github.com/yourusername/medusa-storefront.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure Environment Variables:
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL`: Your Render Medusa API URL (will be added later)
5. Click "Deploy"

### 3. Connect Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Your Medusa API URL (Render) | Yes |

## Post-Deployment Steps

After deploying your Render backend:
1. Go to Vercel Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_MEDUSA_BACKEND_URL` with your Render API URL
3. Redeploy to apply changes
