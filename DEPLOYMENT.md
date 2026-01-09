# Deployment Guide - Vercel

This guide will help you deploy the Notes Share application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Git repository (GitHub, GitLab, or Bitbucket)
3. Vercel CLI (optional): `npm i -g vercel`

## Database Setup

Since Vercel uses serverless functions, you'll need a PostgreSQL database. We recommend:

### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Select "Storage" from the top menu
3. Click "Create Database"
4. Select "Postgres"
5. Choose your region and create the database
6. Copy the `DATABASE_URL` connection string

### Option 2: External PostgreSQL Providers

You can also use external PostgreSQL providers:
- **Neon** (https://neon.tech) - Free tier with good performance
- **Supabase** (https://supabase.com) - Free tier with additional features
- **Railway** (https://railway.app) - Easy setup
- **ElephantSQL** (https://www.elephantsql.com) - Free tier available

## Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your repository
   - Vercel will auto-detect the framework

3. **Configure Environment Variables**

   In the Vercel dashboard, add these environment variables:

   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   JWT_EXPIRE=7d
   DATABASE_URL=postgresql://user:password@host:port/database
   CLIENT_URL=https://your-app.vercel.app
   ```

   **Important**:
   - Replace `JWT_SECRET` with a strong, random string
   - Replace `DATABASE_URL` with your PostgreSQL connection string
   - `CLIENT_URL` will be your Vercel app URL (you can update this after first deployment)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-app.vercel.app`

5. **Update CLIENT_URL**
   - After first deployment, go to Settings → Environment Variables
   - Update `CLIENT_URL` to your actual Vercel URL
   - Redeploy the application

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add CLIENT_URL
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Setup

### 1. Initialize Database

After deployment, you need to initialize the database tables. The application will automatically sync the database schema on first run.

To verify:
1. Visit `https://your-app.vercel.app/api/health`
2. You should see: `{"status":"ok","timestamp":"..."}`

### 2. Test the Application

1. Go to your Vercel URL
2. Register a new account
3. Create a test note
4. Test sharing functionality

### 3. Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Update `CLIENT_URL` environment variable to your custom domain
5. Redeploy

## Important Notes

### Real-time Features (Socket.io)

Socket.io works with Vercel, but there are some limitations:
- WebSocket connections may disconnect more frequently in serverless environments
- For production, consider using:
  - **Pusher** (https://pusher.com)
  - **Ably** (https://ably.com)
  - **Socket.io with a dedicated server** on Railway/Render

To disable Socket.io notifications temporarily, you can skip the Socket.io connection in production.

### Database Migrations

If you need to make schema changes:
1. Update the models in `server/models/`
2. The application will automatically sync on next deployment
3. For production, consider using proper migrations with Sequelize CLI

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-min-32-chars` |
| `JWT_EXPIRE` | Token expiration time | `7d` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `CLIENT_URL` | Frontend URL | `https://your-app.vercel.app` |

### Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Use a production PostgreSQL database
- [ ] Enable proper CORS settings (update `CLIENT_URL`)
- [ ] Configure Content Security Policy in Helmet
- [ ] Review rate limiting settings
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up monitoring and error tracking (Sentry, LogRocket, etc.)

## Troubleshooting

### Build Fails

**Error**: `Module not found`
- **Solution**: Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error**: `Build timeout`
- **Solution**: Increase build timeout in Vercel settings
- Or optimize your build process

### Database Connection Issues

**Error**: `Unable to connect to database`
- **Solution**: Verify `DATABASE_URL` is correctly set
- Check database is accessible from Vercel's IP ranges
- Ensure SSL is enabled for PostgreSQL

### API Not Working

**Error**: `404 on API routes`
- **Solution**: Check `vercel.json` configuration
- Verify routes are correctly set up
- Check Vercel function logs

### Socket.io Not Connecting

**Issue**: Real-time notifications not working
- **Solution**: This is expected in serverless environments
- Consider using alternative real-time services
- Or deploy backend separately on Railway/Render

## Monitoring

### View Logs

```bash
vercel logs
```

Or view in the Vercel dashboard under "Deployments" → "Runtime Logs"

### Performance Monitoring

Vercel provides built-in analytics:
1. Go to your project
2. Click "Analytics"
3. View performance metrics

## Updating the Application

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically deploy the changes.

## Alternative Deployment (Full-Stack Hosting)

If you prefer traditional hosting instead of serverless:

### Railway (Recommended for Full-Stack)

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Add environment variables
5. Railway will deploy both frontend and backend

### Render

1. Go to https://render.com
2. Create two services:
   - Web Service for backend
   - Static Site for frontend
3. Configure environment variables
4. Deploy

## Support

For issues with deployment:
- Check Vercel documentation: https://vercel.com/docs
- Review function logs in Vercel dashboard
- Open an issue on GitHub

---

**Happy Deploying!** 🚀
