# FRP Setup Guide for New Computer

This guide explains how to configure FRP service for your new computer without impacting the existing Mac Mini setup. The setup will support HTTPS requirements for the Rider Tracker App.

## Overview

Based on the actual Nginx configuration, the current system uses IP-based access rather than subdomains. Here's the updated architecture:

```
[Mac Mini] --FRP Client--> [Aliyun Server] --Internet-->
Stock Monitor App          FRP Server + Nginx
├─ Frontend :8080         ├─ frps :7000 (control)
├─ Backend :3001          ├─ HTTP proxy :8080  
└─ frpc tunnel            ├─ HTTPS proxy :8443
                          └─ nginx (SSL termination at 47.239.138.185)
Rider Tracker App
└─ Nuxt dev :3000

[New Computer] --FRP Client--> [Aliyun Server] --Internet-->
Rider Tracker App              FRP Server + Nginx
└─ Nuxt dev :3000             ├─ frps :7000 (control)
                              ├─ HTTP proxy :8080
                              ├─ HTTPS proxy :8443
                              └─ nginx (SSL termination at 47.239.138.185)
```

## Important Note

The issue you're experiencing is that your current FRP client configuration uses `type = tcp` which doesn't support HTTP routing. For web applications like Rider Tracker, you need to use `type = https` to enable proper routing through FRP and Nginx.

Since your Nuxt app is configured to serve HTTPS on port 3000, the FRP client must use `type = https` and the Nginx configuration must proxy to the FRP server's HTTPS port (8443) to maintain end-to-end encryption.

## Prerequisites

1. FRP client (frpc) installed on your new computer
2. Access to the Aliyun server FRP server configuration
3. Understanding of the existing configuration in `current-frp-config-onthesystem.md`

## Method 1: Path-based Routing (Recommended)

This method uses the same ports but different paths to distinguish between the two computers.

### Step 1: Configure FRP Client (New Computer)

Create `frpc.toml` on your new computer:

```toml
[common]
server_addr = 47.239.138.185
server_port = 7000
token = "Abc3309495689@"

# Rider Tracker App Tunnel
[rider-tracker-new]
type = http
local_ip = 127.0.0.1
local_port = 3000
custom_domains = 47.239.138.185
```

### Step 2: Update Nginx Configuration (Aliyun Server)

Update `/etc/nginx/sites-available/frp-proxy` with path-based routing:

```nginx
# Modified configuration with path-based routing
server {
    listen 443 ssl;
    server_name 47.239.138.185;

    # SSL Certificate Configuration
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    # SSL Protocol Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305';

    # SSL Session Configuration - Important for iOS Safari compatibility
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Additional Security Headers
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Route to Mac Mini setup (default path)
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_redirect off;

        # Increase proxy timeouts
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Route to new computer setup (for HTTPS-enabled apps)
    location /new-computer/ {
        proxy_pass https://127.0.0.1:8443/new-computer/;  # FRP HTTPS port for proper SSL handling
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_redirect off;

        # Increase proxy timeouts
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # SSL configuration for backend HTTPS
        proxy_ssl_verify off;
        proxy_ssl_session_reuse on;
    }
}

server {
    listen 80;
    server_name 47.239.138.185;

    # Force redirect to HTTPS
    return 301 https://$host$request_uri;
}
```

### Step 3: Update FRP Server Configuration (Aliyun Server)

Ensure your `frps.toml` has the following configuration:
```toml
bindPort = 7000

# Vhost HTTP and HTTPS ports (required for HTTP/HTTPS tunnels)
vhostHTTPPort = 8080
vhostHTTPSPort = 8443

# Authentication Token (!!! USE A STRONG, UNIQUE SECRET HERE !!!)
auth.token = "Abc3309495689@"

# Optional: Dashboard (Choose a secure username and password)
webServer.addr = "0.0.0.0" 
webServer.port = 7500
webServer.user = "admin"
webServer.password = "Abc3309495689!"
```

Note: The error you're seeing indicates that `vhostHTTPPort` is not properly configured in your FRP server. Make sure this setting is present and correctly spelled in your `frps.toml` file.

After updating the configuration, restart the FRP server:
```bash
# Stop existing FRP server
pkill frps

# Start new FRP server
./frps -c ./frps.toml

# Or if using systemd service:
# sudo systemctl restart frps
```

### Step 4: Restart Services

#### Restart FRP Client (New Computer)
```bash
# Stop existing FRP client if running
pkill frpc

# Start new FRP client
./frpc -c ./frpc.toml

# For automatic startup, see "Automatic Startup" section at the end of this guide
```

#### Restart Nginx (Aliyun Server)
```bash
# Test the configuration for syntax errors
sudo nginx -t

# If the test passes, reload Nginx to apply changes
sudo systemctl reload nginx

# Check Nginx status to ensure it's running
sudo systemctl status nginx
```

### Step 5: Test the Setup

1. Start your Rider Tracker App locally on the new computer:
   ```bash
   cd rider-tracker-app
   pnpm dev
   ```

2. Start FRP client on the new computer:
   ```bash
   ./frpc -c ./frpc.toml
   ```

3. Access your app via:
   - Mac Mini: `https://47.239.138.185/`
   - New Computer (Method 1 - Path-based): `https://47.239.138.185/new-computer/`

## Method 2: Port-based Access

This method uses different ports to distinguish between the two computers.

### Step 1: Configure FRP Client (New Computer)

Create `frpc.toml` on your new computer:

```toml
[common]
server_addr = 47.239.138.185
server_port = 7000
token = "Abc3309495689@"

# Rider Tracker App Tunnel on different port
[rider-tracker-new]
type = http
local_ip = 127.0.0.1
local_port = 3000
custom_domains = 47.239.138.185
```

### Step 2: Update Nginx Configuration (Aliyun Server)

Update `/etc/nginx/sites-available/frp-proxy` to add subdomain routing:

```nginx
# Add these server blocks to your existing configuration

# HTTPS server for new computer (using subdomain)
server {
    listen 443 ssl;
    server_name new-computer.47.239.138.185;  # Subdomain for new computer

    # Use same SSL configuration as your existing server block
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass https://127.0.0.1:8443/;  # FRP HTTPS port for proper SSL handling
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_redirect off;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # SSL configuration for backend HTTPS
        proxy_ssl_verify off;
        proxy_ssl_session_reuse on;
    }
}

# HTTP redirect for new subdomain
server {
    listen 80;
    server_name new-computer.47.239.138.185;
    return 301 https://$host$request_uri;
}
```

### Step 3: Update FRP Server Configuration (Aliyun Server)

Ensure your `frps.toml` has the following configuration (same as Method 1):
```toml
bindPort = 7000

# Vhost HTTP and HTTPS ports (required for HTTP/HTTPS tunnels)
vhostHTTPPort = 8080
vhostHTTPSPort = 8443

# Authentication Token (!!! USE A STRONG, UNIQUE SECRET HERE !!!)
auth.token = "Abc3309495689@"

# Optional: Dashboard (Choose a secure username and password)
webServer.addr = "0.0.0.0" 
webServer.port = 7500
webServer.user = "admin"
webServer.password = "Abc3309495689!"
```

Note: Even for TCP tunnels, it's good practice to have the vhost ports configured as they enable mixed tunnel types. The error you're seeing indicates that `vhostHTTPPort` is not properly configured in your FRP server.

After updating the configuration, restart the FRP server:
```bash
# Stop existing FRP server
pkill frps

# Start new FRP server
./frps -c ./frps.toml

# Or if using systemd service:
# sudo systemctl restart frps
```

### Step 4: Configure Aliyun Server Security

No additional ports need to be opened since we're using subdomains on the existing ports (80 and 443). However, you need to ensure your DNS or hosts file is configured to resolve the subdomain.

#### DNS Configuration (if using real DNS)
Add an A record for:
- Name: new-computer
- Type: A
- Value: 47.239.138.185

#### Hosts File Configuration (for testing)
Add this line to your local hosts file:
```
47.239.138.185 new-computer.47.239.138.185
```

On Windows: `C:\Windows\System32\drivers\etc\hosts`
On Linux/Mac: `/etc/hosts`

### Step 5: Restart Services

#### Restart FRP Client (New Computer)
```bash
# Stop existing FRP client if running
pkill frpc

# Start new FRP client
./frpc -c ./frpc.toml
```

#### Restart Nginx (Aliyun Server)
```bash
# Test the configuration for syntax errors
sudo nginx -t

# If the test passes, reload Nginx to apply changes
sudo systemctl reload nginx

# Check Nginx status to ensure it's running
sudo systemctl status nginx
```

### Step 6: Test the Setup

1. Start your Rider Tracker App locally on the new computer:
   ```bash
   cd rider-tracker-app
   pnpm dev
   ```

2. Start FRP client on the new computer:
   ```bash
   ./frpc -c ./frpc.toml
   ```

3. Access your app via:
   - Mac Mini: `https://47.239.138.185/`
   - New Computer (Method 2 - Subdomain): `https://new-computer.47.239.138.185/`

Note: If you haven't configured DNS, you'll need to add an entry to your local hosts file as described in Step 4.

## Automatic Startup

### For automatic startup on Linux:

Create a systemd service:
```ini
[Unit]
Description=FRP Client for Rider Tracker
After=network.target

[Service]
Type=simple
User=your-user
ExecStart=/path/to/frpc -c /path/to/frpc.toml
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable frpc-rider-tracker.service
sudo systemctl start frpc-rider-tracker.service
```

### For automatic startup on Windows:

#### Option 1: Using Task Scheduler (Recommended)

1. Open Task Scheduler (taskschd.msc)
2. Click "Create Task" in the right-hand Actions panel
3. In the "General" tab:
   - Name: FRP Client for Rider Tracker
   - Check "Run with highest privileges"
   - Configure for your Windows version

4. In the "Triggers" tab:
   - Click "New"
   - Set "Begin the task" to "At startup"
   - Click OK

5. In the "Actions" tab:
   - Click "New"
   - Action: Start a program
   - Program/script: Browse to your frpc.exe file
   - Add arguments: `-c "C:\path\to\your\frpc.toml"`
   - Start in: Directory containing frpc.exe
   - Click OK

6. In the "Conditions" tab:
   - Uncheck "Start the task only if the computer is on AC power" if this is a laptop
   - Click OK

7. In the "Settings" tab:
   - Check "Allow task to be run on demand"
   - Check "Run task as soon as possible after a scheduled start is missed"
   - Click OK

#### Option 2: Using Windows Startup Folder

1. Press Win + R, type `shell:startup`, and press Enter
2. Create a batch file named `start-frpc.bat` with the following content:
   ```batch
   @echo off
   cd /d "C:\path\to\your\frpc\directory"
   start /b frpc.exe -c frpc.toml
   ```

3. Place this batch file in the startup folder

#### Option 3: Using Windows Service (Advanced)

For a more robust solution, you can register FRP as a Windows service using tools like NSSM (Non-Sucking Service Manager):

1. Download NSSM from https://nssm.cc/download
2. Extract and run `nssm install FRPClient`
3. In the NSSM GUI:
   - Path: Path to frpc.exe
   - Arguments: `-c "C:\path\to\your\frpc.toml"`
   - Startup directory: Directory containing frpc.exe
   - Service name: FRPClient
4. Click "Install service"
5. Start the service:
   ```cmd
   net start FRPClient
   ```

## HTTPS Development Considerations

Since the Rider Tracker App requires HTTPS for geolocation APIs:

1. The Nginx configuration above provides HTTPS termination
2. Your local development server (`pnpm dev`) can still run on HTTP
3. External access will be via HTTPS through Nginx

## Troubleshooting

1. **Connection Issues**:
   - Verify Aliyun server IP and ports are accessible
   - Check firewall settings on both client and server
   - Ensure frps is running on the Aliyun server: `systemctl status frps`

2. **HTTPS Problems**:
   - Confirm SSL certificates are properly configured in Nginx
   - Check that Nginx is correctly proxying to FRP: `sudo nginx -t`
   - Verify that the FRP server has `vhostHTTPSPort` configured (should be 8443)
   - Ensure the FRP client uses `type = https` for applications that serve HTTPS
   - Check that Nginx proxies to the correct FRP HTTPS port (8443) for HTTPS applications

3. **FRP Issues**:
   - Check FRP client logs for connection errors
   - Verify the FRP server dashboard at `http://47.239.138.185:7500`

## Security Considerations

1. Use strong authentication for FRP dashboard
2. Restrict access to FRP admin ports with firewall rules
3. Regularly update FRP to latest version
4. Use firewall rules to limit access to necessary ports only
5. The FRP authentication token has already been configured in both frps.toml and frpc.toml as "Abc3309495689@"