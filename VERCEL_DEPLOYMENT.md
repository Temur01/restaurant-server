# Vercel Deployment Guide

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed globally (optional but recommended): `npm install -g vercel`

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy the project**
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked about settings, you can accept the defaults
   - The build command should be: `npm run build`
   - The output directory should be: `dist`

3. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   ```
   
   Or add them through the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables:
     - `DATABASE_URL` - Your PostgreSQL connection string
     - `JWT_SECRET` - Your JWT secret key
     - `NODE_ENV` - Set to `production`

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push
   ```

2. **Import Project in Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables**
   - Before deploying, add these environment variables in the project settings:
     - `DATABASE_URL` - Your PostgreSQL connection string
     - `JWT_SECRET` - Your JWT secret key
     - `NODE_ENV` - Set to `production`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

## Required Environment Variables

Make sure to set these environment variables in your Vercel project:

- `DATABASE_URL` - PostgreSQL connection string (format: `postgresql://user:password@host:port/database`)
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Set to `production`
- `PORT` - (Optional) Vercel will set this automatically

## Database Setup

### Using Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to the "Storage" tab
3. Create a new Postgres database
4. Vercel will automatically set the `DATABASE_URL` environment variable

### Using External PostgreSQL Database

If you're using an external database (like Render, Supabase, or Neon):
1. Get your connection string from your database provider
2. Add it as the `DATABASE_URL` environment variable in Vercel

## Post-Deployment

1. **Run Database Migration**
   - If you need to run migrations, you can use Vercel CLI:
   ```bash
   vercel env pull .env.local
   npm run db:migrate
   ```

2. **Test Your API**
   - Your API will be available at: `https://your-project-name.vercel.app`
   - Test the health endpoint: `https://your-project-name.vercel.app/api/health`
   - View API docs: `https://your-project-name.vercel.app/api-docs`

3. **Update CORS Origins**
   - Make sure to update the `allowedOrigins` array in `src/server.ts` to include your Vercel deployment URL

## Important Notes

1. **File Uploads**: Vercel's serverless functions have limited file system access. The `/uploads` directory won't persist between deployments. Consider using:
   - Vercel Blob Storage
   - AWS S3
   - Cloudinary
   - Other cloud storage services

2. **Cold Starts**: Serverless functions may experience cold starts (initial delay when the function hasn't been used recently)

3. **Execution Time Limits**: Vercel has execution time limits for serverless functions (10 seconds on free plan, 60 seconds on Pro)

4. **Build Process**: Make sure your TypeScript builds successfully before deploying:
   ```bash
   npm run build
   ```

## Troubleshooting

### Build Fails
- Check that all dependencies are in `dependencies` (not `devDependencies`)
- Ensure TypeScript compiles without errors locally

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check if your database allows connections from Vercel's IP ranges
- Consider using connection pooling for better performance

### CORS Errors
- Add your Vercel deployment URL to the `allowedOrigins` array in `src/server.ts`

## Custom Domain (Optional)

To add a custom domain:
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Monitoring

- View logs in the Vercel dashboard under "Deployments" → Select a deployment → "Logs"
- Monitor performance and errors in the "Analytics" tab

