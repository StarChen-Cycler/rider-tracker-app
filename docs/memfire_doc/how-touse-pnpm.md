I'll provide you with a comprehensive guide of common pnpm commands used throughout the development process.

## Project Initialization

### Create a new project

```bash
# Initialize a new package.json
pnpm init

# Create a new project from template
pnpm create <template-name>
# Examples:
pnpm create react-app my-app
pnpm create next-app my-next-app
pnpm create vite my-vite-app
```

## Package Management

### Installing Dependencies

```bash
# Install all dependencies from package.json
pnpm install
# or simply
pnpm i

# Install a specific package
pnpm add <package-name>

# Install as dev dependency
pnpm add -D <package-name>
# or
pnpm add --save-dev <package-name>

# Install globally
pnpm add -g <package-name>

# Install specific version
pnpm add <package-name>@<version>

# Install from different sources
pnpm add <package-name>@latest
pnpm add <package-name>@beta
pnpm add github:user/repo
```

### Removing Dependencies

```bash
# Remove a package
pnpm remove <package-name>
# or
pnpm rm <package-name>

# Remove dev dependency
pnpm remove -D <package-name>

# Remove global package
pnpm remove -g <package-name>
```

### Updating Dependencies

```bash
# Update all dependencies
pnpm update

# Update specific package
pnpm update <package-name>

# Update to latest version (ignoring semver)
pnpm update <package-name> --latest

# Check outdated packages
pnpm outdated
```

## Running Scripts

### Execute package.json scripts

```bash
# Run any script defined in package.json
pnpm run <script-name>
# or for common scripts, you can omit 'run'
pnpm start
pnpm test
pnpm build
pnpm dev

# Run script with arguments
pnpm run <script-name> -- --arg1 --arg2

# List all available scripts
pnpm run
```

### Execute commands directly

```bash
# Run a command using locally installed packages
pnpm exec <command>

# Run a command from node_modules/.bin
pnpm <command>

# Example: run TypeScript compiler
pnpm tsc
pnpm exec tsc
```

## Development Workflow

### Local Development

```bash
# Start development server (if defined in scripts)
pnpm dev
# or
pnpm start

# Run tests
pnpm test
pnpm test --watch
pnpm test --coverage

# Run linting
pnpm lint
pnpm lint:fix

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Environment Management

```bash
# Run with specific NODE_ENV
NODE_ENV=production pnpm build

# Use different package.json scripts for different environments
pnpm run build:dev
pnpm run build:prod
pnpm run build:staging
```

## Workspace Management (Monorepos)

### Workspace Commands

```bash
# Install dependencies for all workspace packages
pnpm install

# Run command in all workspace packages
pnpm -r <command>
pnpm --recursive <command>

# Run command in specific workspace
pnpm --filter <package-name> <command>

# Examples:
pnpm -r build
pnpm --filter frontend dev
pnpm --filter backend test
```

### Cross-workspace Dependencies

```bash
# Add local workspace package as dependency
pnpm add <workspace-package-name> --workspace

# Link workspace packages
pnpm link <path-to-package>
```

## Information and Debugging

### Package Information

```bash
# List installed packages
pnpm list
pnpm ls

# List global packages
pnpm list -g

# Show package information
pnpm info <package-name>

# Show dependency tree
pnpm list --depth=0
```

### Debugging and Troubleshooting

```bash
# Clear pnpm cache
pnpm store prune

# Verify store integrity
pnpm store status

# Show pnpm configuration
pnpm config list

# Show current pnpm store path
pnpm store path

# Audit for vulnerabilities
pnpm audit
pnpm audit --fix
```

## Configuration

### Common pnpm Configuration

```bash
# Set registry
pnpm config set registry https://registry.npmjs.org/

# Set store directory
pnpm config set store-dir ~/.pnpm-store

# Enable/disable shamefully-hoist
pnpm config set shamefully-hoist true

# Set node-linker (for compatibility)
pnpm config set node-linker hoisted

# Auto-install peers
pnpm config set auto-install-peers true
```

## Publishing and Distribution

### Package Publishing

```bash
# Build and publish
pnpm build
pnpm publish

# Publish with tag
pnpm publish --tag beta

# Publish to specific registry
pnpm publish --registry https://npm.pkg.github.com

# Dry run (test publish without actually publishing)
pnpm publish --dry-run
```

## Common Development Patterns

### Typical Development Workflow

```bash
# 1. Clone and setup
git clone <repo>
cd <project>
pnpm install

# 2. Start development
pnpm dev

# 3. Run tests during development
pnpm test --watch

# 4. Before committing
pnpm lint
pnpm test
pnpm build

# 5. Update dependencies periodically
pnpm outdated
pnpm update
```

### Package.json Scripts Examples

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext ts,tsx",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx}",
    "clean": "rm -rf dist node_modules",
    "reinstall": "pnpm clean && pnpm install"
  }
}
```

## Performance and Optimization

### Speed up installations

```bash
# Use frozen lockfile in CI
pnpm install --frozen-lockfile

# Skip optional dependencies
pnpm install --ignore-optional

# Production-only install
pnpm install --prod
# or
pnpm install --production
```

## Most Frequently Used Commands Summary

Here are the commands you'll use most often:

```bash
# Daily development
pnpm install          # Install dependencies
pnpm dev             # Start development server
pnpm build           # Build for production
pnpm test            # Run tests
pnpm lint            # Check code quality

# Package management
pnpm add <package>   # Add dependency
pnpm add -D <package> # Add dev dependency
pnpm remove <package> # Remove dependency
pnpm update          # Update dependencies

# Information
pnpm list            # List installed packages
pnpm outdated        # Check for updates
```

This covers the most common pnpm commands you'll use throughout your development process, from project setup to deployment!
