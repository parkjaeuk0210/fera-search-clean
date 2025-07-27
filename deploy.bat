@echo off
echo 🚀 Deploying Fera Search to Vercel...
echo.

REM Check if vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Please install it first:
    echo npm install -g vercel
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo ⚠️  Warning: .env file not found.
    echo Make sure to set GOOGLE_API_KEY in Vercel dashboard.
)

REM Build the project
echo 📦 Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix the errors and try again.
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo 🔐 Now deploying to Vercel...
echo.

REM Deploy to Vercel
vercel --prod

echo.
echo 🎉 Deployment complete!
echo.
echo 📌 Don't forget to:
echo 1. Set GOOGLE_API_KEY environment variable in Vercel dashboard
echo 2. Configure your custom domain (if any)
echo 3. Check the deployment URL provided by Vercel