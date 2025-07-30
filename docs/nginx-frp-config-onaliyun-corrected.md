# Corrected FRP Configuration for Aliyun Server

## Issue Identified
The web service on port 8080 is not showing up in the FRP dashboard because:

1. In the server configuration (`frps.toml`), the `vhostHTTPPort` and `vhostHTTPSPort` settings are missing
2. In the client configuration (`frpc.toml`), the "web" proxy is using `type = "tcp"` instead of `type = "http"`

## Corrected Server Configuration

### /root/frp_0.62.1_linux_amd64/frps.toml

```toml
# Basic settings
bindPort = 7000
auth.token = "Abc3309495689@"

# Important: These were missing in the original configuration
vhostHTTPPort = 8080
vhostHTTPSPort = 8443

# Admin dashboard
webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "Abc3309495689!"
```

## Corrected Client Configuration (Mac Mini)

### /Users/zyc_ccz/web_app/frp_0.62.1_darwin_arm64/frpc.toml

```toml
serverAddr = "47.239.138.185"
serverPort = 7000
auth.token = "Abc3309495689@"

# Changed from TCP to HTTP type for proper dashboard display
[[proxies]]
name = "web"
type = "http"  # Changed from "tcp" to "http"
localIP = "127.0.0.1"
localPort = 8080
customDomains = ["47.239.138.185"]  # Added for HTTP type

[[proxies]]
name = "api"
type = "tcp"
localIP = "127.0.0.1"
localPort = 3001
remotePort = 3001
```

## Implementation Steps

1. **Update the server configuration**:
   ```bash
   # SSH into your Aliyun server
   ssh root@47.239.138.185
   
   # Edit the FRP server configuration
   vim /root/frp_0.62.1_linux_amd64/frps.toml
   
   # Add the missing vhostHTTPPort and vhostHTTPSPort settings
   
   # Restart the FRP server
   systemctl restart frps
   # Or if using manual startup:
   # pkill frps
   # nohup ./frps -c ./frps.toml &
   ```

2. **Update the client configuration**:
   ```bash
   # SSH into your Mac Mini or access it directly
   
   # Edit the FRP client configuration
   vim /Users/zyc_ccz/web_app/frp_0.62.1_darwin_arm64/frpc.toml
   
   # Change the web proxy type from "tcp" to "http" and add customDomains
   
   # Restart the FRP client
   launchctl unload ~/Library/LaunchAgents/com.frp.frpc.plist
   launchctl load ~/Library/LaunchAgents/com.frp.frpc.plist
   # Or if using manual startup:
   # pkill frpc
   # ./frpc -c ./frpc.toml
   ```

## Explanation

1. **HTTP vs TCP proxies in FRP**:
   - TCP proxies are simple port forwarding and don't show up in the web dashboard under HTTP services
   - HTTP proxies require the `vhostHTTPPort` setting on the server and appear in the dashboard

2. **Why this fixes the issue**:
   - Adding `vhostHTTPPort = 8080` tells the FRP server which port to use for HTTP proxies
   - Changing the proxy type to "http" makes it use the HTTP protocol instead of raw TCP
   - Adding `customDomains` is required for HTTP proxies to specify the domain/IP to use

After making these changes, both your API service (3001) and web service (8080) should appear in the FRP dashboard.