#!/bin/bash

echo "🚀 Rider Tracker App - macOS Setup Script"
echo "=========================================="
echo

# Check if pnpm is installed
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm is already installed"
else
    echo "⚠️  pnpm not found. Installing pnpm..."
    if command -v npm &> /dev/null; then
        npm install -g pnpm
        echo "✅ pnpm installed successfully"
    else
        echo "❌ npm not found. Please install Node.js first:"
        echo "   Visit https://nodejs.org/ to download and install Node.js"
        exit 1
    fi
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo
    echo "📝 Creating .env file from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env file created. Please update it with your actual API keys."
    else
        echo "⚠️  .env.example not found. Creating a basic .env file..."
        cat > .env << EOF
# MemFire Cloud Configuration (Replace Supabase)
NUXT_PUBLIC_MEMFIRE_URL=https://your-project.memfiredb.com
NUXT_PUBLIC_MEMFIRE_ANON_KEY=your-memfire-anon-key

# Amap (高德地图) Configuration
NUXT_PUBLIC_AMAP_KEY=your-amap-api-key
NUXT_PUBLIC_AMAP_SECURITY_KEY=your-amap-security-key

# Optional: Additional Amap Settings
NUXT_PUBLIC_AMAP_VERSION=2.0
NUXT_PUBLIC_AMAP_SERVICE_HOST=https://restapi.amap.com
EOF
        echo "✅ Basic .env file created. Please update it with your actual API keys."
    fi
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo
echo "📦 Installing dependencies..."
if pnpm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo
echo "✅ macOS setup completed!"
echo
echo "📝 Next steps:"
echo "1. Update the .env file with your actual API keys"
echo "2. Run the database schema in your Supabase/MemFire Cloud SQL editor"
echo "3. Run \"pnpm dev\" to start the development server"
echo "4. Open https://localhost:3000 in your browser"