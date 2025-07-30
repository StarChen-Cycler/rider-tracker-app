I'll provide you with a comprehensive guide for installing nvm, Node.js, and pnpm on your Ubuntu Linux system.

## Installing NVM (Node Version Manager)

### Step 1: Install nvm

```bash
# Download and install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Or using wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Step 2: Reload your shell configuration

```bash
# Reload bash profile
source ~/.bashrc

# Or restart your terminal
```

### Step 3: Verify nvm installation

```bash
nvm --version
```

## Installing Node.js using NVM

### Install the latest LTS version of Node.js

```bash
# Install the latest LTS (Long Term Support) version
nvm install --lts

# Use the LTS version
nvm use --lts

# Set LTS as default
nvm alias default node
```

### Alternative: Install specific Node.js versions

```bash
# Install specific version (e.g., Node.js 18)
nvm install 18

# Install specific version (e.g., Node.js 20)
nvm install 20

# List installed versions
nvm list

# Switch between versions
nvm use 18
nvm use 20
```

### Verify Node.js and npm installation

```bash
node --version
npm --version
```

## Installing pnpm

### Method 1: Using npm (recommended)

```bash
npm install -g pnpm
```

### Method 2: Using curl (standalone installer)

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Method 3: Using wget

```bash
wget -qO- https://get.pnpm.io/install.sh | sh -
```

After using Method 2 or 3, reload your shell:

```bash
source ~/.bashrc
```

### Verify pnpm installation

```bash
pnpm --version
```

## Additional Configuration (Optional)

### Set up pnpm store location (optional)

```bash
# Set global store directory
pnpm config set store-dir ~/.pnpm-store
```

### Enable pnpm shamefully-hoist (if needed for compatibility)

```bash
pnpm config set shamefully-hoist true
```

## Quick Summary Commands

Here's a complete script you can run to install everything at once:

```bash
#!/bin/bash

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install latest LTS Node.js
nvm install --lts
nvm use --lts
nvm alias default node

# Install pnpm
npm install -g pnpm

# Verify installations
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "pnpm version: $(pnpm --version)"
echo "nvm version: $(nvm --version)"
```

## Troubleshooting Tips

1. **If nvm command not found after installation:**

   ```bash
   source ~/.bashrc
   # or
   source ~/.bash_profile
   # or restart your terminal
   ```
2. **To update nvm to the latest version:**

   ```bash
   nvm install node --reinstall-packages-from=node
   ```
3. **If you need to install build tools for native modules:**

   ```bash
   sudo apt update
   sudo apt install build-essential
   ```

That's it! You now have nvm, Node.js, and pnpm installed on your Ubuntu system. You can manage multiple Node.js versions with nvm and use pnpm as a faster, more efficient package manager alternative to npm.
