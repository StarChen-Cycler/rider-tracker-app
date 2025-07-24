# Rider Tracker App 🚴‍♂️🏍️

A mobile-first web application for tracking cycling and motorbike rides with GPS tracking, route recording, and ride analytics.

## Features

- **Real-time GPS tracking** with high accuracy location services
- **Route recording** with automatic distance and duration calculation
- **Mobile-optimized UI** with responsive design for all screen sizes
- **Amap integration** (高德地图) for detailed maps and location services
- **Ride management** with history, statistics, and sharing capabilities
- **Offline support** for recording rides without internet connection
- **User profiles** with customizable preferences and settings

## Tech Stack

- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **Database**: Supabase (PostgreSQL)
- **Maps**: Amap (高德地图 API)
- **Icons**: Heroicons
- **State Management**: Vue 3 Composition API

## Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Supabase account
- Amap API key (高德地图开发者账号)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd rider-tracker-app
```

#### Option 1: Automatic Setup (Recommended)
Use our platform-specific setup scripts:

```bash
# Windows
pnpm run setup:windows

# macOS
pnpm run setup:macos

# Linux
pnpm run setup:linux
```

#### Option 2: Manual Setup
```bash
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Amap (高德地图) Configuration
AMAP_KEY=your_amap_api_key
AMAP_SECURITY_KEY=your_amap_security_key
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the database migrations (see Database Schema section)
3. Enable Row Level Security (RLS)
4. Configure authentication settings

### 4. API Keys Setup

#### Supabase Setup:
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API
4. Add them to your `.env` file

#### Amap Setup:
1. Go to [Amap Developer Console](https://lbs.amap.com/dev/)
2. Create a new application
3. Get your API key and security key
4. Add them to your `.env` file

### 5. Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## HTTPS Setup with Nginx

For geolocation to work properly in Chrome, Safari, and Firefox, the application needs to be served over HTTPS. Here's how to set it up with Nginx:

### 1. Install Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Get SSL Certificate

You can use Let's Encrypt to get a free SSL certificate:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com
```

Or use a self-signed certificate for development:

```bash
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt
```

### 3. Configure Nginx

Create a configuration file at `/etc/nginx/sites-available/rider-tracker`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect all HTTP requests to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    # SSL certificate configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;    # For Let's Encrypt
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;  # For Let's Encrypt
    
    # Or for self-signed certificates:
    # ssl_certificate /etc/nginx/ssl/nginx.crt;
    # ssl_certificate_key /etc/nginx/ssl/nginx.key;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS (optional, but recommended)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Proxy settings for Nuxt.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Enable the Configuration

```bash
sudo ln -s /etc/nginx/sites-available/rider-tracker /etc/nginx/sites-enabled/
sudo nginx -t  # Test the configuration
sudo systemctl reload nginx  # Apply the configuration
```

### 5. Update Nuxt Configuration

In your `nuxt.config.ts`, make sure you have the following:

```typescript
export default defineNuxtConfig({
  // ... other config
  nitro: {
    compressPublicAssets: true
  },
  
  // This helps Nuxt understand it's behind a proxy
  runtimeConfig: {
    public: {
      // ... other config
    }
  }
})
```

Now your application will be accessible over HTTPS, allowing geolocation to work properly in all modern browsers.

For more information, check out the [Nuxt.js documentation](https://nuxt.com/docs/getting-started/deployment).

## FRP Setup for Remote Access

For easier mobile testing and development, you can use FRP (Fast Reverse Proxy) to expose your local development server to the internet. This is especially useful for testing geolocation features that require HTTPS.

See our detailed [FRP Setup Guide](docs/frp-guide.md) for complete instructions on:
- Setting up an FRP server on a public VPS
- Configuring the FRP client on your development machine
- Exposing your local Nuxt development server to the internet
- Setting up HTTPS with Let's Encrypt certificates

## Database Schema

The application uses the following database tables:

### Users Table (handled by Supabase Auth)
- Standard Supabase auth.users table

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  preferred_vehicle VARCHAR(20) CHECK (preferred_vehicle IN ('bicycle', 'motorbike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Rides Table
```sql
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('bicycle', 'motorbike')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('recording', 'paused', 'completed', 'cancelled')),
  start_location JSONB NOT NULL,
  end_location JSONB,
  duration INTEGER, -- in milliseconds
  distance NUMERIC, -- in meters
  route_points JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE
);
```

### Route Points Table
```sql
CREATE TABLE route_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  speed NUMERIC,
  altitude NUMERIC
);
```

### Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_points ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Rides policies
CREATE POLICY "Users can view own rides" ON rides
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rides" ON rides
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rides" ON rides
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rides" ON rides
  FOR DELETE USING (auth.uid() = user_id);

-- Route points policies
CREATE POLICY "Users can view own route points" ON route_points
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = route_points.ride_id 
      AND rides.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create route points for own rides" ON route_points
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = route_points.ride_id 
      AND rides.user_id = auth.uid()
    )
  );
```

## Project Structure

```
rider-tracker-app/
├── assets/
│   └── css/
│       └── main.css          # Global styles and Tailwind
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── LoadingSpinner.vue
│   │   └── AppButton.vue
│   └── map/                  # Map-related components
│       └── AmapContainer.vue
├── composables/
│   ├── useSupabase.ts        # Supabase integration
│   └── useAmap.ts            # Amap integration
├── layouts/
│   └── default.vue           # Mobile-optimized layout
├── pages/                    # App pages (to be created)
├── types/
│   └── database.ts           # TypeScript types
├── utils/
│   ├── constants.ts          # App constants
│   └── formatters.ts         # Utility functions
├── nuxt.config.ts            # Nuxt configuration
└── package.json
```

## Mobile Optimization

The app is built with mobile-first approach:

- **Touch-friendly UI**: Minimum 44px touch targets
- **Responsive design**: Adapts to different screen sizes
- **Safe areas**: Handles iOS safe areas properly
- **Performance**: Optimized for mobile networks
- **PWA features**: App-like experience on mobile devices

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Use Tailwind CSS for styling
- Implement proper error handling

### Mobile UX Guidelines
- Design for thumbs-first interaction
- Use bottom navigation for main actions
- Implement swipe gestures where appropriate
- Optimize for one-handed usage

### Performance
- Lazy load components and pages
- Optimize images and assets
- Use proper caching strategies
- Minimize bundle size

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build command
pnpm build

# Publish directory
.output/public
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review the code examples in the components

---

**Note**: This is a demo application. Make sure to implement proper security measures, data validation, and error handling for production use.

## Step-by-Step Implementation Guide

### Starting from Current Setup

If you're starting with the existing Rider Tracker app and want to implement HTTPS with Nginx, follow these steps:

1. **Install Nginx** on your server:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nginx

   # Windows (using Chocolatey)
   choco install nginx

   # macOS (using Homebrew)
   brew install nginx
   ```

2. **Check if Nginx is running**:
   ```bash
   # Ubuntu/Debian/macOS
   sudo systemctl status nginx
   # or
   sudo service nginx status

   # Windows
   sc query nginx
   ```

3. **Create Nginx configuration directory** (if it doesn't exist):
   ```bash
   # Ubuntu/Debian/macOS
   sudo mkdir -p /etc/nginx/sites-available
   sudo mkdir -p /etc/nginx/sites-enabled

   # Windows
   mkdir C:\nginx\conf\sites-available
   mkdir C:\nginx\conf\sites-enabled
   ```

4. **Create the configuration file**:
   ```bash
   # Ubuntu/Debian/macOS
   sudo nano /etc/nginx/sites-available/rider-tracker

   # Windows
   notepad C:\nginx\conf\sites-available\rider-tracker.conf
   ```

   Paste the configuration from the "Configure Nginx" section above.

5. **Enable the site**:
   ```bash
   # Ubuntu/Debian/macOS
   sudo ln -s /etc/nginx/sites-available/rider-tracker /etc/nginx/sites-enabled/
   
   # Windows (requires administrator PowerShell)
   New-Item -ItemType SymbolicLink -Path "C:\nginx\conf\sites-enabled\rider-tracker.conf" -Target "C:\nginx\conf\sites-available\rider-tracker.conf"
   ```

6. **Update main Nginx configuration** to include your sites:
   ```bash
   # Ubuntu/Debian/macOS
   sudo nano /etc/nginx/nginx.conf

   # Windows
   notepad C:\nginx\conf\nginx.conf
   ```

   Add this line inside the `http` block if it's not already there:
   ```
   include /etc/nginx/sites-enabled/*;  # For Linux
   # or
   include conf/sites-enabled/*.conf;   # For Windows
   ```

7. **Get SSL certificate**:
   ```bash
   # Using Let's Encrypt on Ubuntu/Debian
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   
   # For self-signed certificate (development only)
   sudo mkdir -p /etc/nginx/ssl
   sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt
   ```

8. **Test Nginx configuration**:
   ```bash
   # Ubuntu/Debian/macOS
   sudo nginx -t
   
   # Windows
   nginx -t
   ```

9. **Start/reload Nginx**:
   ```bash
   # Ubuntu/Debian/macOS
   sudo systemctl reload nginx
   # or
   sudo service nginx reload
   
   # Windows
   nginx -s reload
   ```

10. **Start your Nuxt app**:
    ```bash
    cd rider-tracker-app
    pnpm run build
    pnpm run start
    ```

### Managing Nginx Service

#### Starting Nginx
```bash
# Ubuntu/Debian/macOS
sudo systemctl start nginx
# or
sudo service nginx start

# Windows
start nginx
# or
net start nginx
```

#### Stopping Nginx
```bash
# Ubuntu/Debian/macOS
sudo systemctl stop nginx
# or
sudo service nginx stop

# Windows
nginx -s stop
# or
net stop nginx
```

#### Restarting Nginx
```bash
# Ubuntu/Debian/macOS
sudo systemctl restart nginx
# or
sudo service nginx restart

# Windows
nginx -s stop && start nginx
# or
net stop nginx && net start nginx
```

#### Reloading Configuration (without stopping)
```bash
# Ubuntu/Debian/macOS
sudo systemctl reload nginx
# or
sudo service nginx reload

# Windows
nginx -s reload
```

### Troubleshooting

1. **Check Nginx error logs**:
   ```bash
   # Ubuntu/Debian/macOS
   sudo tail -f /var/log/nginx/error.log
   
   # Windows
   type C:\nginx\logs\error.log
   ```

2. **Check if ports are in use**:
   ```bash
   # Ubuntu/Debian/macOS
   sudo netstat -tulpn | grep -E ':80|:443'
   
   # Windows
   netstat -ano | findstr ":80 :443"
   ```

3. **Test SSL configuration**:
   Visit [SSL Labs](https://www.ssllabs.com/ssltest/) and enter your domain to test your SSL setup.

4. **Common issues**:
   - **403 Forbidden**: Check file permissions and Nginx user
   - **502 Bad Gateway**: Make sure your Nuxt app is running
   - **SSL certificate errors**: Verify certificate paths and permissions
