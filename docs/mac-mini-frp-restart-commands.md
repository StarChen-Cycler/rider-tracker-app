# Mac Mini FRP Client Restart Commands

Use these commands to restart the FRP client on your Mac Mini after making configuration changes:

## If using launchctl (recommended)

```bash
# Unload the current service
launchctl unload ~/Library/LaunchAgents/com.frp.frpc.plist

# Load the service with the new configuration
launchctl load ~/Library/LaunchAgents/com.frp.frpc.plist
```

## If running manually

```bash
# Find and kill the current frpc process
ps -ef | grep frpc | grep -v grep
kill [PID]  # Replace [PID] with the process ID from the previous command

# Start frpc with the updated configuration
cd /Users/zyc_ccz/web_app/frp_0.62.1_darwin_arm64/
./frpc -c ./frpc.toml
```

## Verify the connection

```bash
# Check if frpc is running
ps -ef | grep frpc | grep -v grep

# Check the logs (if available)
tail -f /tmp/frpc.log  # Adjust path if your logs are elsewhere
```

## Troubleshooting

If the service doesn't appear in the FRP dashboard after restart:

1. Check that the FRP server (frps) is running on the Aliyun server
2. Verify that the local service (web server on port 8080) is running
3. Check for any error messages in the frpc logs
4. Ensure the token in frpc.toml matches the one in frps.toml
5. Verify that the server has `vhostHTTPPort = 8080` in its configuration