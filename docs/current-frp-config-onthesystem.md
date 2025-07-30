# Mac Mini 上运行的程序

### 1. FRP 客户端 (frpc)

- **版本**: frp_0.62.1_darwin_arm64
- **配置**: `/usr/local/etc/frp/frpc.ini` 或 `frpc.toml`
- **启动方式**:
  - 手动: `./frpc -c ./frpc.toml`
  - 自动启动: 通过 launchd (`~/Library/LaunchAgents/com.frp.frpc.plist`)
- **作用**: 将本地服务通过隧道转发到Aliyun服务器

### 2. Web应用项目

#### Stock Monitor 应用:@update t

- **前端**: 使用 pnpm 构建的 Vue/React 应用
- **后端**: Python Flask 应用 (`/Users/web_app/stock-monitor/src/server/app.py`)
- **运行方式**:
  - 开发模式: `pnpm dev`
  - 生产模式: `pnpm build` + `./app-daemon.sh restart`
  - 后端服务: `gunicorn --workers 3 --bind 0.0.0.0:3001 wsgi:app`
- **端口**: 前端8080，后端3001

#### Rider Tracker 应用 (最新):

- **项目**: `rider-tracker-app` (从GitHub克隆)
- **运行**: `pnpm install` + `pnpm dev`
- **端口**: 3000 (根据Nuxt配置)

## Aliyun 服务器上运行的程序

### 1. FRP 服务器 (frps)

- **版本**: 从0.62.0升级到0.62.1再到0.63.0
- **配置文件**: `frps.toml`
- **运行方式**:
  - 早期: 手动启动 `./frps -c frps.toml`
  - 后期: systemd服务 `systemctl start frps`
  - 最新: `nohup ./frps -c ./frps.toml &`
- **端口配置**:
  - 控制端口: 7000
  - HTTP端口: 8080
  - HTTPS端口: 8443 (推测)
  - 管理面板: 7500

### 2. Nginx 反向代理

- **安装**: `apt install -y nginx certbot python3-certbot-nginx`
- **配置**: `/etc/nginx/sites-available/frp-proxy`
- **SSL证书**: 生成了自签名证书
  ```bash
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt
  ```
- **作用**: 作为FRP的前端代理，处理HTTPS终端和域名路由

## 系统架构总结

```
[Mac Mini] --FRP Client--> [Aliyun Server] --Internet-->
Stock Monitor App          FRP Server + Nginx
├─ Frontend :8080         ├─ frps :7000 (control)
├─ Backend :3001          ├─ HTTP proxy :8080  
└─ frpc tunnel            ├─ HTTPS proxy :8443
                          └─ nginx (SSL termination)
Rider Tracker App
└─ Nuxt dev :3000
```

## FRP和Nginx的具体作用

### FRP的作用:

1. **内网穿透**: 将Mac Mini上的本地服务(8080端口的前端，3001端口的后端)暴露到公网
2. **多服务支持**: 通过子域名或不同端口支持多个应用
3. **协议转发**: 支持HTTP/HTTPS/TCP等多种协议转发

### Nginx的作用:

1. **SSL终端**: 处理HTTPS证书，将HTTPS请求解密后转发给FRP
2. **反向代理**: 作为FRP前端的代理服务器
3. **域名路由**: 根据域名将请求路由到不同的后端服务
4. **负载均衡**: 可以为高流量提供负载均衡(虽然当前配置中没有使用)

这个设置允许Mac Mini上的开发服务器通过Aliyun服务器的公网IP被外部访问，同时保持了SSL安全性和多服务支持。
