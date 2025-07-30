# Setup Scripts

This directory contains platform-specific setup scripts to help developers quickly set up the Rider Tracker App development environment.

## Available Scripts

### Windows
```bash
pnpm run setup:windows
```
Or directly run:
```bash
node scripts/setup-windows.js
```

### macOS
```bash
pnpm run setup:macos
```
Or directly run:
```bash
bash scripts/setup-macos.sh
```
*Note: You may need to make the script executable first: `chmod +x scripts/setup-macos.sh`*

### Linux
```bash
pnpm run setup:linux
```
Or directly run:
```bash
bash scripts/setup-linux.sh
```
*Note: You may need to make the script executable first: `chmod +x scripts/setup-linux.sh`*

## What the Scripts Do

1. Check if pnpm is installed, and install it if missing
2. Create a `.env` file from `.env.example` if it doesn't exist
3. Install all project dependencies using pnpm
4. Provide instructions for next steps

## Manual Setup

If you prefer to set up manually, follow these steps:

1. Install pnpm: `npm install -g pnpm`
2. Create `.env` file: `cp .env.example .env`
3. Install dependencies: `pnpm install`
4. Update `.env` with your actual API keys
5. Run development server: `pnpm dev`