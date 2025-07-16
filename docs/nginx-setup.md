# Setting Up Nginx with HTTPS for Rider Tracker App

This guide provides detailed instructions for setting up Nginx as a reverse proxy with HTTPS for the Rider Tracker application.

## Why Use Nginx with HTTPS?

1. **Geolocation API Requirement**: Modern browsers (Chrome, Firefox, Safari) require HTTPS for using the Geolocation API
2. **Security**: Protects user data and prevents man-in-the-middle attacks
3. **Performance**: Nginx can handle static assets efficiently and provide caching
4. **SSL Termination**: Handles the SSL/TLS encryption/decryption, reducing load on your application server

## Prerequisites

- A server with administrative access
- Domain name pointed to your server's IP address
- Basic knowledge of command line operations

## Installation Instructions

### For Ubuntu/Debian

1. **Install Nginx**:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Verify Nginx is running**:
   ```bash
   sudo systemctl status nginx
   ```

3. **Install Certbot** (for Let's Encrypt SSL certificates):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

4. **Create Nginx configuration**:
   ```bash
   sudo nano /etc/nginx/sites-available/rider-tracker
   ```

5. **Add the following configuration** (replace `yourdomain.com` with your actual domain):
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
       
       # SSL certificate paths will be configured by Certbot
       
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

6. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/rider-tracker /etc/nginx/sites-enabled/
   ```

7. **Test Nginx configuration**:
   ```bash
   sudo nginx -t
   ```

8. **Obtain SSL certificate**:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```
   Follow the prompts to complete the certificate setup.

9. **Reload Nginx**:
   ```bash
   sudo systemctl reload nginx
   ```

### For Windows

1. **Install Nginx**:
   - Download the Windows version from [nginx.org](http://nginx.org/en/download.html)
   - Extract to a location like `C:\nginx`

2. **Create SSL certificates directory**:
   ```cmd
   mkdir C:\nginx\ssl
   ```

3. **Generate self-signed certificate** (for development):
   - Install OpenSSL for Windows
   - Run:
     ```cmd
     openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout C:\nginx\ssl\nginx.key -out C:\nginx\ssl\nginx.crt
     ```

4. **Create configuration file**:
   - Create `C:\nginx\conf\rider-tracker.conf`
   - Add the following content:
     ```nginx
     server {
         listen 80;
         server_name localhost;
         
         # Redirect all HTTP requests to HTTPS
         return 301 https://$host$request_uri;
     }

     server {
         listen 443 ssl;
         server_name localhost;
         
         # SSL certificate configuration
         ssl_certificate ssl/nginx.crt;
         ssl_certificate_key ssl/nginx.key;
         
         # SSL settings
         ssl_protocols TLSv1.2 TLSv1.3;
         ssl_prefer_server_ciphers on;
         ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
         ssl_session_cache shared:SSL:10m;
         ssl_session_timeout 10m;
         
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

5. **Update main Nginx configuration**:
   - Edit `C:\nginx\conf\nginx.conf`
   - Add inside the `http` block:
     ```nginx
     include conf/rider-tracker.conf;
     ```

6. **Start Nginx**:
   ```cmd
   cd C:\nginx
   start nginx
   ```

7. **Test configuration**:
   ```cmd
   nginx -t
   ```

8. **Reload configuration** (after changes):
   ```cmd
   nginx -s reload
   ```

## Managing Nginx Service

### Ubuntu/Debian

- **Start Nginx**:
  ```bash
  sudo systemctl start nginx
  ```

- **Stop Nginx**:
  ```bash
  sudo systemctl stop nginx
  ```

- **Restart Nginx**:
  ```bash
  sudo systemctl restart nginx
  ```

- **Reload configuration** (without stopping):
  ```bash
  sudo systemctl reload nginx
  ```

- **Check status**:
  ```bash
  sudo systemctl status nginx
  ```

- **Enable auto-start on boot**:
  ```bash
  sudo systemctl enable nginx
  ```

- **Disable auto-start on boot**:
  ```bash
  sudo systemctl disable nginx
  ```

### Windows

- **Start Nginx**:
  ```cmd
  start nginx
  ```

- **Stop Nginx**:
  ```cmd
  nginx -s stop
  ```

- **Reload configuration**:
  ```cmd
  nginx -s reload
  ```

- **Reopen log files**:
  ```cmd
  nginx -s reopen
  ```

- **Check if Nginx is running**:
  ```cmd
  tasklist /fi "imagename eq nginx.exe"
  ```

## Troubleshooting

### Common Issues

1. **403 Forbidden**:
   - Check file permissions
   - Verify Nginx user has access to the required directories

2. **502 Bad Gateway**:
   - Ensure your Nuxt app is running
   - Check if the port in `proxy_pass` matches your app's port

3. **SSL Certificate Issues**:
   - Verify certificate paths
   - Check certificate expiration date
   - Ensure private key permissions are correct

4. **Port Conflicts**:
   - Check if ports 80 and 443 are already in use:
     ```bash
     # Linux
     sudo netstat -tulpn | grep -E ':80|:443'
     
     # Windows
     netstat -ano | findstr ":80 :443"
     ```

### Checking Logs

- **Ubuntu/Debian**:
  ```bash
  sudo tail -f /var/log/nginx/error.log
  sudo tail -f /var/log/nginx/access.log
  ```

- **Windows**:
  ```cmd
  type C:\nginx\logs\error.log
  type C:\nginx\logs\access.log
  ```

## SSL Certificate Renewal

### Let's Encrypt (Ubuntu/Debian)

Let's Encrypt certificates expire after 90 days. Certbot installs a timer to automatically renew certificates.

- **Check renewal timer**:
  ```bash
  sudo systemctl list-timers | grep certbot
  ```

- **Test renewal process**:
  ```bash
  sudo certbot renew --dry-run
  ```

- **Force renewal**:
  ```bash
  sudo certbot renew
  ```

## Security Enhancements

Consider adding these to your Nginx configuration for better security:

```nginx
# Additional security headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options SAMEORIGIN;
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'";

# Disable server tokens
server_tokens off;
```

## Performance Optimizations

For better performance, consider adding:

```nginx
# Enable gzip compression
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_proxied any;
gzip_vary on;
gzip_types
  application/javascript
  application/json
  application/x-javascript
  application/xml
  text/css
  text/javascript
  text/plain
  text/xml;

# Cache static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, no-transform";
}
```

## Further Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [SSL Configuration Generator](https://ssl-config.mozilla.org/) 


# If no domain

If you're only using Nginx for development without a domain name, you can set up a local HTTPS environment using self-signed certificates. Here's how to do it:

## Setting Up HTTPS for Development Without a Domain

### 1. Generate Self-Signed Certificate

For Windows:
```powershell
# Create directory for certificates
mkdir -p C:\nginx\ssl

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout C:\nginx\ssl\nginx.key -out C:\nginx\ssl\nginx.crt
```

For Linux/macOS:
```bash
# Create directory for certificates
sudo mkdir -p /etc/nginx/ssl

# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt
```

When prompted, you can use `localhost` for the Common Name field.

### 2. Configure Nginx for Localhost

Create this configuration file:

For Windows (`C:\nginx\conf\nginx.conf`):
```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout  65;

    server {
        listen 80;
        server_name localhost;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name localhost;
        
        ssl_certificate      ssl/nginx.crt;
        ssl_certificate_key  ssl/nginx.key;
        
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

For Linux/macOS (`/etc/nginx/sites-available/rider-tracker`):
```nginx
server {
    listen 80;
    server_name localhost;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name localhost;
    
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Start/Restart Nginx

For Windows:
```powershell
# Start Nginx (if not running)
cd C:\nginx
start nginx

# Or reload configuration (if already running)
nginx -s reload
```

For Linux/macOS:
```bash
# Enable site configuration
sudo ln -s /etc/nginx/sites-available/rider-tracker /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 4. Trust the Self-Signed Certificate

When you first visit `https://localhost` in your browser, you'll get a security warning because the certificate is self-signed. You'll need to:

1. Click "Advanced" or "Details"
2. Click "Proceed to localhost (unsafe)" or similar option

For a better development experience, you can add the certificate to your system's trusted certificates:

#### Windows:
1. Double-click the `nginx.crt` file
2. Click "Install Certificate"
3. Select "Local Machine" and click "Next"
4. Choose "Place all certificates in the following store"
5. Click "Browse" and select "Trusted Root Certification Authorities"
6. Click "Next" and "Finish"

#### macOS:
```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /etc/nginx/ssl/nginx.crt
```

#### Linux (Chrome/Chromium):
```bash
# For Chrome/Chromium
mkdir -p ~/.pki/nssdb
certutil -d sql:$HOME/.pki/nssdb -A -t "P,," -n "localhost" -i /etc/nginx/ssl/nginx.crt
```

### 5. Access Your Application

Now you can access your application at `https://localhost` and the geolocation API should work properly.

### 6. Add Hosts Entry (Optional)

If you want to use a fake domain name locally (like `dev.ridertracker.local`), add this to your hosts file:

Windows (`C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1 dev.ridertracker.local
```

Linux/macOS (`/etc/hosts`):
```
127.0.0.1 dev.ridertracker.local
```

Then update your Nginx configuration to use this name instead of `localhost`.

This setup gives you a local HTTPS environment for development without needing a real domain name, which allows geolocation and other secure-context APIs to work properly.