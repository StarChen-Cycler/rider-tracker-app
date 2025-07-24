# FRP Setup Guide for Multi-Service Deployment

This guide covers setting up FRP (Fast Reverse Proxy) to expose your Mac Mini's HTTPS dev server through an Aliyun Linux server, while avoiding conflicts with existing FRP services.

## Architecture Overview

```
[Mac Mini] ---> [Aliyun Server] ---> [Internet]
- App 1 (existing)     - frps (HTTPS)    - users
- App 2 (rider-tracker) - Direct SSL     - HTTPS termination
- pnpm dev (port 3000)
```

## Prerequisites

### For Basic HTTP Access (Your Current Case)
- Mac Mini: frpc client installed
- Aliyun Server: frps server installed with public IP
- Existing FRP setup working
- **No domain name needed**
- **No SSL certificate needed**

### For HTTPS with Custom Domain (Advanced Setup)
- All above requirements PLUS:
- Domain name with DNS pointing to Aliyun server
- SSL certificate for the domain

## Quick Start for Simple HTTP Access

**If you just want to access your dev server via IP (no domain needed):**

1. **Aliyun Server**: Add this to `/etc/frp/frps.ini`:
   ```ini
   vhost_http_port = 8080
   ```

2. **Mac Mini**: Add this to `/usr/local/etc/frp/frpc.ini`:
   ```ini
   [rider-tracker]
   type = http
   local_ip = 127.0.0.1
   local_port = 3000
   subdomain = rider-tracker
   ```

3. **Start services**:
   ```bash
   # Mac Mini: Start dev server with HTTP
   pnpm run dev -- --https false --host 0.0.0.0 --port 3000
   
   # Restart FRP client
   sudo systemctl restart frpc  # or your FRP restart command
   ```

4. **Access your app**: 
   - **From command line**: `curl -H "Host: rider-tracker" http://your_aliyun_server_ip:8080`
   - **From browser**: You'll need to set up subdomain routing or use a browser extension to set the Host header
   - **Alternative**: Use direct port forwarding instead (see below)

### Even Simpler: Direct Port Forwarding (Easiest for Browser Access)

If you want direct browser access without Host headers:

**Mac Mini frpc.ini:**
```ini
[rider-tracker-direct]
type = tcp
local_ip = 127.0.0.1
local_port = 3000
remote_port = 8090
```

**Access directly**: `http://your_aliyun_server_ip:8090`

**Firewall**: `sudo ufw allow 8090`

This gives you direct access without any subdomain routing complexity!

## 1. Aliyun Server Configuration (frps)

### Option A: Simple HTTP Setup (Your Current Case)

If you just want to access your dev server via IP address without domain name:

```ini
# /etc/frp/frps.ini
[common]
bind_port = 7000
vhost_http_port = 8080
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = your_secure_password
token = your_secure_token

# Enable logging
log_file = /var/log/frps.log
log_level = info
max_clients = 100
```

Then restart FRP:
```bash
sudo systemctl restart frps
```

**Access your app at**: `http://your_aliyun_server_ip:8080` (with Host header or subdomain routing)

### Option B: HTTPS with Domain (Advanced Setup)

### 1.1 Update frps.ini

Since you have an existing FRP service, we need to configure multiple services without conflicts:

```ini
# /etc/frp/frps.ini
[common]
bind_port = 7000
vhost_http_port = 8080
vhost_https_port = 8443
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = your_secure_password
token = your_secure_token

# Enable HTTP/HTTPS multiplexing
enable_prometheus = true
log_file = /var/log/frps.log
log_level = info
max_clients = 100

# Allow multiple subdomains
subdomain_host = yourdomain.com

# HTTPS certificate configuration (for direct HTTPS)
tls_cert_file = /etc/ssl/frp/cert.pem
tls_key_file = /etc/ssl/frp/private.key
```

### 1.2 SSL Certificate Setup

Place your SSL certificate files on the Aliyun server:

```bash
# Create SSL directory if it doesn't exist
sudo mkdir -p /etc/ssl/frp

# Copy your certificate files (adjust paths as needed)
sudo cp /path/to/your/cert.pem /etc/ssl/frp/cert.pem
sudo cp /path/to/your/private.key /etc/ssl/frp/private.key

# Set proper permissions
sudo chmod 600 /etc/ssl/frp/private.key
sudo chmod 644 /etc/ssl/frp/cert.pem
```

### 1.3 Restart FRP Service

```bash
# Restart FRP server
sudo systemctl restart frps

# Check status
sudo systemctl status frps
```

## 2. Mac Mini Configuration (frpc)

### Option A: Simple HTTP Setup (Your Current Case)

```ini
# /usr/local/etc/frp/frpc.ini
[common]
server_addr = your_aliyun_server_ip
server_port = 7000
token = your_secure_token
log_file = /var/log/frpc.log
log_level = info

# Existing app configuration (keep as is)
[existing-app]
type = http
local_ip = 127.0.0.1
local_port = your_existing_app_port
subdomain = existing-app

# New rider-tracker app (HTTP)
[rider-tracker]
type = http
local_ip = 127.0.0.1
local_port = 3000
subdomain = rider-tracker
```

**Access URLs:**
- Existing app: `http://existing-app.your_aliyun_server_ip:8080`
- Rider tracker: `http://rider-tracker.your_aliyun_server_ip:8080`

### Option B: HTTPS with Domain (Advanced Setup)

### 2.1 Update frpc.ini

Add the new service configuration while keeping existing ones:

```ini
# /usr/local/etc/frp/frpc.ini
[common]
server_addr = your_aliyun_server_ip
server_port = 7000
token = your_secure_token
log_file = /var/log/frpc.log
log_level = info

# Existing app configuration (keep as is)
[existing-app]
type = http
local_ip = 127.0.0.1
local_port = your_existing_app_port
subdomain = existing-app
custom_domains = existing-app.yourdomain.com

# New rider-tracker app (HTTPS)
[rider-tracker]
type = https
local_ip = 127.0.0.1
local_port = 3000
subdomain = rider-tracker
custom_domains = rider-tracker.yourdomain.com
```

### Option A: Simple HTTP Dev Server

For basic HTTP access, modify your Nuxt config or create a simple dev script:

```json
// Add to package.json scripts
{
  "dev:frp": "nuxt dev --host 0.0.0.0 --port 3000 --https false",
  "dev:local": "nuxt dev --https --host localhost --port 3000"
}
```

Or temporarily disable HTTPS in your `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  devServer: {
    https: false, // Disable for FRP HTTP setup
    host: '0.0.0.0',
    port: 3000
  },
  // ... rest of config
})
```

### Option B: HTTPS Development Server

Your Nuxt config already has HTTPS enabled. For FRP HTTPS, you might want to create a specific dev script:

```json
// Add to package.json scripts
{
  "dev:frp": "cross-env NODE_TLS_REJECT_UNAUTHORIZED=0 nuxt dev --host 0.0.0.0 --port 3000",
  "dev:local": "nuxt dev --https --host localhost --port 3000"
}
```

## 3. Service Management

### 3.1 Start Services on Mac Mini

```bash
# Start FRP client
sudo /usr/local/bin/frpc -c /usr/local/etc/frp/frpc.ini

# Or using launchd (recommended for auto-start)
sudo launchctl load /Library/LaunchDaemons/frpc.plist

# Start your dev server
cd /path/to/rider-tracker-app
pnpm run dev:frp
```

### 3.2 Auto-start Configuration (Mac Mini)

Create a launchd plist for auto-starting:

```xml
<!-- /Library/LaunchDaemons/frpc.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>frpc</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/frpc</string>
        <string>-c</string>
        <string>/usr/local/etc/frp/frpc.ini</string>
    </array>
    <key>KeepAlive</key>
    <true/>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardErrorPath</key>
    <string>/var/log/frpc.err</string>
    <key>StandardOutPath</key>
    <string>/var/log/frpc.out</string>
</dict>
</plist>
```

## 4. Port Management Strategy

### 4.1 Port Allocation

| Service | Local Port (Mac) | FRP HTTPS Port | Domain |
|---------|------------------|----------------|---------|
| Existing App | your_existing_app_port | 8443 | existing-app.yourdomain.com |
| Rider Tracker | 3000 | 8443 | rider-tracker.yourdomain.com |

### 4.2 Conflict Resolution

1. **Different subdomains**: Use unique subdomain names
2. **Different local ports**: Ensure no port conflicts on Mac Mini  
3. **Single HTTPS port**: FRP handles multiple HTTPS services via vhost_https_port (8443)
4. **DNS routing**: Different custom_domains for each service

## 5. Security Considerations

### 5.1 Firewall Configuration (Aliyun)

**For Simple HTTP Setup:**
```bash
# Allow FRP ports
sudo ufw allow 7000        # FRP control port
sudo ufw allow 8080        # FRP HTTP port
```

**For HTTPS Setup:**  
```bash
# Allow FRP ports
sudo ufw allow 7000        # FRP control port
sudo ufw allow 8080        # FRP HTTP port
sudo ufw allow 8443        # FRP HTTPS port

# Optional: Deny direct access to HTTP port if you only want HTTPS
sudo ufw deny 8080
```

### 5.2 Token Security

```bash
# Generate a secure token
openssl rand -base64 32

# Use the same token in both frps.ini and frpc.ini
```

## 6. Monitoring and Debugging

### 6.1 Check FRP Status

```bash
# On Mac Mini
tail -f /var/log/frpc.log

# On Aliyun Server  
tail -f /var/log/frps.log
sudo systemctl status frps
```

### 6.2 Test Connectivity

**For Simple HTTP Setup:**
```bash
# Test from Mac Mini (local HTTP dev server)
curl http://127.0.0.1:3000

# Test FRP HTTP connection with subdomain
curl -H "Host: rider-tracker" http://your_aliyun_ip:8080

# Test from browser: http://your_aliyun_ip:8080 (you'll need to set Host header or use subdomain routing)
```

**For HTTPS Setup:**
```bash
# Test from Mac Mini (local HTTPS dev server)
curl -k https://127.0.0.1:3000

# Test FRP HTTPS connection directly  
curl -k https://your_aliyun_ip:8443 -H "Host: rider-tracker.yourdomain.com"

# Test final endpoint (should work without -k flag if proper SSL)
curl https://rider-tracker.yourdomain.com
```

## 7. FRP-Only vs Nginx Approach

**This guide uses FRP-only setup** which is simpler and perfectly suitable for development and smaller deployments.

**FRP-Only Benefits:**
1. **Simplicity**: One service to manage (FRP)
2. **Direct HTTPS**: Built-in SSL termination
3. **Less complexity**: No additional reverse proxy layer
4. **Sufficient performance**: Good for development and moderate traffic

**When you might want Nginx later:**
- High traffic production deployments
- Need advanced caching strategies  
- Complex routing requirements
- Multiple non-FRP services to manage

## 8. Troubleshooting

### 8.1 Common Issues

**Connection Refused:**
```bash
# Check if services are running
ps aux | grep frp
lsof -i :3000  # Check if dev server is running
```

**SSL Certificate Issues:**
```bash
# Test SSL
openssl s_client -connect rider-tracker.yourdomain.com:443
```

**Port Conflicts:**
```bash
# Find what's using a port
lsof -i :8443  # FRP HTTPS port
lsof -i :3000  # Local dev server port
```

### 8.2 Performance Optimization

```ini
# In frpc.ini
[common]
pool_count = 5
tcp_mux = true
connect_timeout = 10

# In frps.ini
[common]
max_pool_count = 50
```

## 9. Development Workflow

### 9.1 Daily Development

```bash
# Start FRP client on Mac Mini (if not auto-starting)
sudo launchctl load /Library/LaunchDaemons/frpc.plist

# Start your dev server
pnpm run dev:frp

# Access your app
open https://rider-tracker.yourdomain.com
```

### 9.2 Production Considerations

For production deployment, consider:
1. Using `pnpm run build` and `pnpm run preview`
2. Process managers like PM2
3. Load balancing if scaling
4. CDN for static assets
5. Database connection pooling

## 10. Quick Start Checklist

### Simple HTTP Setup (No Domain Required)

**Mac Mini Setup:**
- [ ] Configure `/usr/local/etc/frp/frpc.ini` with HTTP type
- [ ] Disable HTTPS in Nuxt config or use `--https false` flag
- [ ] Test local HTTP server: `curl http://127.0.0.1:3000`
- [ ] Restart FRP client

**Aliyun Server Setup:**
- [ ] Add `vhost_http_port = 8080` to `/etc/frp/frps.ini`
- [ ] Configure firewall: `sudo ufw allow 8080`
- [ ] Restart frps service

**Testing:**
- [ ] Test connection: `curl -H "Host: rider-tracker" http://your_aliyun_ip:8080`
- [ ] Verify existing app still works
- [ ] Check HMR works for development

### Advanced HTTPS Setup (Domain Required)

**Mac Mini Setup:**
- [ ] Install frpc
- [ ] Configure `/usr/local/etc/frp/frpc.ini` with HTTPS type
- [ ] Setup launchd plist for auto-start
- [ ] Add dev:frp script to package.json
- [ ] Test local HTTPS server

**Aliyun Server Setup:**
- [ ] Update `/etc/frp/frps.ini` with HTTPS configuration
- [ ] Setup SSL certificates in `/etc/ssl/frp/`
- [ ] Configure firewall rules for FRP ports
- [ ] Start frps service

**Testing:**
- [ ] Test FRP connection
- [ ] Test SSL certificate
- [ ] Test both applications work
- [ ] Monitor logs for errors

**Final Verification:**
- [ ] Access rider-tracker.yourdomain.com
- [ ] Verify existing app still works
- [ ] Check HMR works for development
- [ ] Test on mobile devices

This setup gives you a robust, scalable architecture for exposing multiple services through FRP while maintaining security and avoiding conflicts.