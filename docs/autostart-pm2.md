# Cross-platform Auto-start (pm2) | 跨平台开机自启 (pm2)

Works on macOS, Windows, and Linux.

适用于 macOS、Windows 和 Linux。

---

## English

### 1. Install pm2

```bash
npm install -g pm2
```

### 2. Start the proxy with pm2

```bash
cd hayase-prowlarr
PROWLARR_API_KEY=your_api_key_here pm2 start cors-proxy/server.js --name hayase-proxy
```

On Windows (PowerShell):
```powershell
cd hayase-prowlarr
$env:PROWLARR_API_KEY="your_api_key_here"
pm2 start cors-proxy/server.js --name hayase-proxy
```

### 3. Enable auto-start on boot

```bash
pm2 save
pm2 startup
```

`pm2 startup` will print a command — copy and run it. This registers pm2 with your system's init system.

### 4. Manage

```bash
pm2 status              # View status
pm2 logs hayase-proxy   # View logs
pm2 restart hayase-proxy
pm2 stop hayase-proxy
pm2 delete hayase-proxy # Remove from pm2
```

### Uninstall auto-start

```bash
pm2 unstartup
pm2 delete hayase-proxy
pm2 save
```

---

## 中文

### 1. 安装 pm2

```bash
npm install -g pm2
```

### 2. 用 pm2 启动代理

```bash
cd hayase-prowlarr
PROWLARR_API_KEY=你的API密钥 pm2 start cors-proxy/server.js --name hayase-proxy
```

Windows (PowerShell)：
```powershell
cd hayase-prowlarr
$env:PROWLARR_API_KEY="你的API密钥"
pm2 start cors-proxy/server.js --name hayase-proxy
```

### 3. 设置开机自启

```bash
pm2 save
pm2 startup
```

`pm2 startup` 会输出一条命令——复制并执行它。这会将 pm2 注册到系统的启动服务中。

### 4. 管理

```bash
pm2 status              # 查看状态
pm2 logs hayase-proxy   # 查看日志
pm2 restart hayase-proxy
pm2 stop hayase-proxy
pm2 delete hayase-proxy # 从 pm2 中移除
```

### 卸载自启动

```bash
pm2 unstartup
pm2 delete hayase-proxy
pm2 save
```
