# on the aliyun server

### /etc/nginx/sites-available/frp-proxy

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

    # Route to Mac Mini Stock Monitor Frontend (default path)

    location / {

    proxy_pass http://127.0.0.1:8080;  # FRP HTTP port for Mac Mini frontend (port 8080)

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

    # Route to Mac Mini Stock Monitor Backend API

    location /api/ {

    proxy_pass http://127.0.0.1:3001/;  # FRP port for Mac Mini backend (port 3001)

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

}

server {

    listen 80;

    server_name 47.239.138.185;

    # Force redirect to HTTPS

    return 301 https://$host$request_uri;

}

### /root/frp_0.62.1_linux_amd64/frps.toml

bindPort = 7000

auth.token = "Abc3309495689@"

webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "Abc3309495689!"

# on macmini

### /Users/zyc_ccz/web_app/frp_0.62.1_darwin_arm64/frpc.toml

serverAddr = "47.239.138.185"
serverPort = 7000
auth.token = "Abc3309495689@"

[[proxies]]
name = "web"
type = "tcp"
localIP = "127.0.0.1"
localPort = 8080
remotePort = 8080

[[proxies]]
name = "api"
type = "tcp"
localIP = "127.0.0.1"
localPort = 3001
remotePort = 3001
