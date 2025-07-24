# FRP Setup Guide for Rider Tracker App

This guide explains how to set up FRP (Fast Reverse Proxy) to expose your local development server to the internet, which is particularly useful for mobile testing of geolocation features that require HTTPS.

## What is FRP?

FRP is a fast reverse proxy that helps you expose a local server behind a NAT or firewall to the internet. It's especially useful for:
- Testing mobile applications that require HTTPS
- Sharing your local development environment with others
- Bypassing network restrictions

## Architecture Overview

```
[Mobile Device] ←→ [Internet] ←→ [FRP Server] ←→ [Your Computer]
                              (Public VPS/Server)
```

## Server-Side Setup (FRP Server)

### 1. Requirements

- A public server/VPS with a static IP address
- A domain name (optional but recommended for HTTPS)
- Root access to the server

### 2. Download FRP

```bash
# Connect to your server
ssh root@your-server-ip

# Download FRP (check https://github.com/fatedier/frp/releases for latest version)
wget https://github.com/fatedier/frp/releases/download/v0.58.0/frp_0.58.0_linux_amd64.tar.gz

# Extract the archive
tar -zxvf frp_0.58.0_linux_amd64.tar.gz
cd frp_0.58.0_linux_amd64
```

### 3. Configure FRP Server

Edit `frps.ini`:

```ini
[common]
bind_port = 7000
bind_udp_port = 7001
token = your-secure-token-here
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = your-dashboard-password
vhost_http_port = 80
vhost_https_port = 443
subdomain_host = yourdomain.com
```

### 4. Run FRP Server

```bash
# Run in background
nohup ./frps -c ./frps.ini &

# Or create a systemd service (recommended for production)
```

### 5. Systemd Service Setup (Optional but Recommended)

Create `/etc/systemd/system/frps.service`:

```ini
[Unit]
Description=FRP Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/frp
ExecStart=/path/to/frp/frps -c /path/to/frp/frps.ini
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable frps
sudo systemctl start frps
sudo systemctl status frps
```

### 6. Firewall Configuration

```bash
# Open required ports
sudo ufw allow 7000/tcp    # FRP communication
sudo ufw allow 7001/udp    # FRP UDP
sudo ufw allow 7500/tcp    # Dashboard
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
```

## Client-Side Setup (Your Development Machine)

### 1. Download FRP

```bash
# For Windows
# Download frp_0.58.0_windows_amd64.zip from GitHub releases

# For macOS
wget https://github.com/fatedier/frp/releases/download/v0.58.0/frp_0.58.0_darwin_amd64.tar.gz
tar -zxvf frp_0.58.0_darwin_amd64.tar.gz
cd frp_0.58.0_darwin_amd64

# For Linux
wget https://github.com/fatedier/frp/releases/download/v0.58.0/frp_0.58.0_linux_amd64.tar.gz
tar -zxvf frp_0.58.0_linux_amd64.tar.gz
cd frp_0.58.0_linux_amd64
```

### 2. Configure FRP Client

Edit `frpc.ini`:

```ini
[common]
server_addr = your-server-ip
server_port = 7000
token = your-secure-token-here

[web]
type = https
local_port = 3000
subdomain = ridertracker
# If using custom domain instead of subdomain:
# custom_domains = your-custom-domain.com
```

### 3. Run FRP Client

```bash
# Run FRP client
./frpc -c ./frpc.ini

# For Windows:
# frpc.exe -c frpc.ini
```

### 4. Systemd Service Setup for Client (Linux)

Create `/etc/systemd/system/frpc.service`:

```ini
[Unit]
Description=FRP Client
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/frp
ExecStart=/path/to/frp/frpc -c /path/to/frp/frpc.ini
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable frpc
sudo systemctl start frpc
sudo systemctl status frpc
```

## Using FRP with Rider Tracker App

### 1. Start Your Development Server

```bash
cd /path/to/rider-tracker-app
pnpm dev
```

### 2. Configure FRP Client for Rider Tracker

Update your `frpc.ini`:

```ini
[common]
server_addr = your-server-ip-or-domain
server_port = 7000
token = your-secure-token-here

[rider-tracker]
type = https
local_ip = 127.0.0.1
local_port = 3000
subdomain = rider
# Or use custom domain:
# custom_domains = rider.yourdomain.com
```

### 3. Access Your App

Once FRP is running, you can access your development server at:
- `https://rider.yourdomain.com` (if using subdomain)
- `https://your-custom-domain.com` (if using custom domain)

## HTTPS Certificate Setup

### Using Let's Encrypt with Nginx (Recommended)

1. Install Nginx and Certbot:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx certbot python3-certbot-nginx
```

2. Configure Nginx for FRP:

Create `/etc/nginx/sites-available/frp`:

```nginx
server {
    listen 80;
    server_name rider.yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:7000;  # FRP HTTP port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Enable the site and get SSL certificate:

```bash
sudo ln -s /etc/nginx/sites-available/frp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d rider.yourdomain.com
```

## Security Considerations

1. **Use Strong Tokens**: Always use strong, random tokens for authentication
2. **Firewall Rules**: Only open necessary ports
3. **Regular Updates**: Keep FRP updated to the latest version
4. **Access Control**: Use dashboard authentication
5. **Encryption**: Always use HTTPS for production applications

## Troubleshooting

### Common Issues

1. **Connection Refused**: Check if FRP server is running and ports are open
2. **Authentication Failed**: Verify token matches between client and server
3. **Subdomain Not Working**: Ensure `subdomain_host` is correctly configured on server
4. **HTTPS Issues**: Check certificate validity and Nginx configuration

### Debugging Commands

```bash
# Check FRP server status
systemctl status frps

# Check FRP client status
systemctl status frpc

# View logs
journalctl -u frps -f
journalctl -u frpc -f

# Test connection
telnet your-server-ip 7000
```

## Alternative Solutions

If FRP seems complex, consider these alternatives:
1. **ngrok**: Commercial service with free tier
2. **Cloudflare Tunnel**: Free tunneling service
3. **localtunnel**: Simple npm package for tunneling
4. **Serveo**: SSH-based tunneling service

## Best Practices

1. **Development Only**: Use FRP only for development and testing
2. **Monitor Usage**: Keep an eye on bandwidth usage
3. **Backup Configuration**: Keep copies of your configuration files
4. **Document Setup**: Maintain documentation for your team
5. **Regular Maintenance**: Update FRP regularly for security patches

This setup allows you to test your Rider Tracker app on mobile devices with proper HTTPS, which is required for geolocation APIs in modern browsers.