#!/bin/bash

# Force fresh deployment to Vercel bypassing cache

echo "🚀 Deploying backend to Vercel (bypassing cache)..."
echo ""

# Build locally first to ensure no errors
echo "📦 Building TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to Vercel with force flag
echo "🌐 Deploying to Vercel..."
vercel --prod --force

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Test your endpoints:"
echo "  curl https://api.beyoglu-karshi.com/api/version"
echo "  curl https://api.beyoglu-karshi.com/api/categories"
echo "  curl https://api.beyoglu-karshi.com/api/health"

