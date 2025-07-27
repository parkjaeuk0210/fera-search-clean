# Vercel Deployment Guide

This guide will help you deploy the Search App to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional)
3. Your Google API key for the AI service

## Deployment Steps

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```

2. In the project root directory, run:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Select your Vercel account
   - Choose the project name
   - Accept the default settings

4. Set up environment variables:
   ```bash
   vercel env add GOOGLE_API_KEY
   ```
   Enter your API key when prompted.

5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project"

4. Import your GitHub repository

5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `client/dist` (auto-detected)

6. Add environment variables:
   - Click "Environment Variables"
   - Add `GOOGLE_API_KEY` with your API key value

7. Click "Deploy"

### Option 3: Manual Deploy

1. Build the project locally:
   ```bash
   npm install
   npm run build
   ```

2. Install Vercel CLI and deploy:
   ```bash
   npm i -g vercel
   vercel --prod
   ```

## Environment Variables

You need to set the following environment variable in Vercel:

- `GOOGLE_API_KEY`: Your Google API key for the AI service

To add environment variables in Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the variable name and value
4. Select which environments to apply it to (Production, Preview, Development)

## Post-Deployment

After deployment, Vercel will provide you with:
- A production URL (e.g., `your-app.vercel.app`)
- Preview URLs for each commit
- Automatic HTTPS
- Global CDN distribution

## Troubleshooting

### Build Errors
- Make sure all dependencies are listed in `package.json`
- Check that TypeScript types are properly defined
- Verify that all imports use correct paths

### API Errors
- Ensure `GOOGLE_API_KEY` is properly set in Vercel environment variables
- Check the Vercel function logs for detailed error messages
- Verify API rate limits haven't been exceeded

### CORS Issues
- The API routes already include CORS headers
- If issues persist, check your domain settings in Vercel

## Performance Tips

1. **Edge Functions**: Consider converting API routes to Edge Functions for better performance
2. **Caching**: Implement caching strategies for frequently searched queries
3. **Image Optimization**: Use Vercel's image optimization for any images

## Custom Domain

To add a custom domain:
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your domain and follow the DNS configuration instructions

## Monitoring

Vercel provides built-in analytics and monitoring:
- Real-time logs for functions
- Performance metrics
- Error tracking
- Usage analytics

Access these in your Vercel dashboard under the project's Analytics tab.