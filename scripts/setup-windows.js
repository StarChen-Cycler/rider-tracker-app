#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Rider Tracker App - Windows Setup Script');
console.log('============================================\n');

// Check if pnpm is installed
try {
  execSync('pnpm --version', { stdio: 'ignore' });
  console.log('✅ pnpm is already installed');
} catch (error) {
  console.log('⚠️  pnpm not found. Installing pnpm...');
  try {
    execSync('npm install -g pnpm', { stdio: 'inherit' });
    console.log('✅ pnpm installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install pnpm. Please install it manually:');
    console.error('   npm install -g pnpm');
    process.exit(1);
  }
}

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n📝 Creating .env file from .env.example...');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created. Please update it with your actual API keys.');
  } else {
    console.log('⚠️  .env.example not found. Creating a basic .env file...');
    const basicEnvContent = `# MemFire Cloud Configuration (Replace Supabase)
NUXT_PUBLIC_MEMFIRE_URL=https://your-project.memfiredb.com
NUXT_PUBLIC_MEMFIRE_ANON_KEY=your-memfire-anon-key

# Amap (高德地图) Configuration
NUXT_PUBLIC_AMAP_KEY=your-amap-api-key
NUXT_PUBLIC_AMAP_SECURITY_KEY=your-amap-security-key

# Optional: Additional Amap Settings
NUXT_PUBLIC_AMAP_VERSION=2.0
NUXT_PUBLIC_AMAP_SERVICE_HOST=https://restapi.amap.com
`;
    fs.writeFileSync(envPath, basicEnvContent);
    console.log('✅ Basic .env file created. Please update it with your actual API keys.');
  }
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('pnpm install', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

console.log('\n✅ Windows setup completed!');
console.log('\n📝 Next steps:');
console.log('1. Update the .env file with your actual API keys');
console.log('2. Run the database schema in your Supabase/MemFire Cloud SQL editor');
console.log('3. Run "pnpm dev" to start the development server');
console.log('4. Open https://localhost:3000 in your browser');