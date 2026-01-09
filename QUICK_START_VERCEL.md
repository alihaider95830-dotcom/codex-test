# Quick Start - Deploy to Vercel

Follow these simple steps to deploy your Notes Share app to Vercel:

## Step 1: Set Up Database

Choose one of these PostgreSQL providers:

### Option A: Vercel Postgres (Easiest)
1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the `DATABASE_URL`

### Option B: Neon (Free & Fast)
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string

### Option C: Supabase (Feature-Rich)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection String
4. Copy the connection string

## Step 2: Deploy to Vercel

### Via Vercel Dashboard:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Add Environment Variables**

   Click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `JWT_EXPIRE` | `7d` |
   | `DATABASE_URL` | Your PostgreSQL connection string from Step 1 |
   | `CLIENT_URL` | Leave empty for now, update after deployment |

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

5. **Update CLIENT_URL**
   - After deployment, copy your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Go to Settings → Environment Variables
   - Update `CLIENT_URL` to your Vercel URL
   - Click "Redeploy" in the Deployments tab

## Step 3: Test Your App

1. Visit your Vercel URL
2. Register a new account
3. Create a test note
4. Done! 🎉

## Troubleshooting

### Build Failed?
- Check the build logs in Vercel
- Ensure all environment variables are set
- Try redeploying

### Can't Connect to Database?
- Verify `DATABASE_URL` is correct
- Make sure database allows connections from Vercel
- Check if SSL is enabled for your database

### API Returns 404?
- This is normal initially
- Give it a few minutes for functions to warm up
- Check function logs in Vercel dashboard

## Need Help?

See the full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

## Quick Commands

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Test your deployment:
```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-09T..."}
```

---

**That's it!** Your Notes Share app is now live on Vercel. 🚀
