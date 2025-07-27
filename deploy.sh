#!/bin/bash

echo "🚀 Deploying Fera Search to Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found."
    echo "Make sure to set GOOGLE_API_KEY in Vercel dashboard."
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🔐 Now deploying to Vercel..."
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📌 Don't forget to:"
echo "1. Set GOOGLE_API_KEY environment variable in Vercel dashboard"
echo "2. Configure your custom domain (if any)"
echo "3. Check the deployment URL provided by Vercel"