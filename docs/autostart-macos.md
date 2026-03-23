# macOS Auto-start (launchd) | macOS 开机自启 (launchd)

## English

### 1. Create the plist file

```bash
cat > ~/Library/LaunchAgents/com.hayase.prowlarr-proxy.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.hayase.prowlarr-proxy</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/path/to/hayase-prowlarr/cors-proxy/server.js</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PROWLARR_API_KEY</key>
        <string>your_api_key_here</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/hayase-proxy.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/hayase-proxy.log</string>
</dict>
</plist>
EOF
```

### 2. Edit the plist

Replace in the file:
- `/usr/local/bin/node` → your actual node path (run `which node` to find it)
- `/path/to/hayase-prowlarr/cors-proxy/server.js` → actual path to `server.js`
- `your_api_key_here` → your Prowlarr API key

### 3. Load the service

```bash
launchctl load ~/Library/LaunchAgents/com.hayase.prowlarr-proxy.plist
```

### 4. Manage

```bash
# Stop
launchctl unload ~/Library/LaunchAgents/com.hayase.prowlarr-proxy.plist

# Check status
launchctl list | grep hayase

# View logs
tail -f /tmp/hayase-proxy.log

# Remove auto-start
launchctl unload ~/Library/LaunchAgents/com.hayase.prowlarr-proxy.plist
rm ~/Library/LaunchAgents/com.hayase.prowlarr-proxy.plist
```

---

## 中文

### 1. 创建 plist 文件

```bash
cat > ~/Library/LaunchAgents/com.hayase.prowlarr-proxy.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.hayase.prowlarr-proxy</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/path/to/hayase-prowlarr/cors-proxy/server.js</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PROWLARR_API_KEY</key>
        <string>你的API密钥</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/hayase-proxy.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/hayase-proxy.log</string>
</dict>
</plist>
EOF
```

### 2. 修改 plist 中的路径

替换以下内容：
- `/usr/local/bin/node` → 你的 node 路径（运行 `which node` 查看）
- `/path/to/hayase-prowlarr/cors-proxy/server.js` → `server.js` 的实际路径
- `你的API密钥` → 你的 Prowlarr API Key

### 3. 加载服务

```bash
launchctl load ~/Library/LaunchAgents/com.hayase.prowlarr-proxy.plist
```

### 4. 管理

```bash
# 停止
launchctl unload ~/Library/LaunchAgents/com.hayase.prowlarr-proxy.plist

# 查看状态
launchctl list | grep hayase

# 查看日志
tail -f /tmp/hayase-proxy.log

# 移除自启动
launchctl unload ~/Library/LaunchAgents/com.hayase.prowlarr-proxy.plist
rm ~/Library/LaunchAgents/com.hayase.prowlarr-proxy.plist
```
