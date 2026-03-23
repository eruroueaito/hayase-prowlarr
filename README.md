# Hayase Prowlarr Extension

A [Hayase](https://hayase.app) extension that searches torrents via your local [Prowlarr](https://prowlarr.com) instance, aggregating results from all your configured indexers (Nyaa, AnimeTosho, DMHY, etc.).

[中文说明](#中文说明)

---

## Prerequisites

- [Hayase](https://hayase.app) installed
- [Prowlarr](https://prowlarr.com) installed with at least one indexer configured
- [Node.js](https://nodejs.org) (v18+)
- [mkcert](https://github.com/FiloSottile/mkcert) for local HTTPS certificates

## Setup

### 1. Install and configure Prowlarr

<details>
<summary><b>macOS</b></summary>

```bash
brew install prowlarr
```
</details>

<details>
<summary><b>Windows</b></summary>

Download the installer from [prowlarr.com](https://prowlarr.com) or use:
```powershell
winget install Prowlarr.Prowlarr
```
</details>

Open `http://localhost:9696`, then:
- **Add indexers**: Settings → Indexers → add sites you want (Nyaa, AnimeTosho, etc.)
- **Copy API Key**: Settings → General → Security → API Key

### 2. Generate local HTTPS certificates

Hayase loads from `https://hayase.app`, so the proxy must also be HTTPS to avoid mixed-content blocking.

<details>
<summary><b>macOS</b></summary>

```bash
brew install mkcert
mkcert -install
mkcert -key-file ~/localhost-key.pem -cert-file ~/localhost.pem localhost
```
</details>

<details>
<summary><b>Windows</b></summary>

```powershell
# Install mkcert (choose one)
choco install mkcert
# or
scoop install mkcert

# Generate certificates
mkcert -install
mkcert -key-file %USERPROFILE%\localhost-key.pem -cert-file %USERPROFILE%\localhost.pem localhost
```
</details>

> **What does this do?** Creates a local Certificate Authority trusted only by your machine, then signs a certificate for `localhost`. Fully reversible — see [Uninstall](#uninstall).

### 3. Start the CORS proxy

```bash
git clone https://github.com/eruroueaito/hayase-prowlarr.git
cd hayase-prowlarr
```

<details>
<summary><b>macOS / Linux</b></summary>

```bash
PROWLARR_API_KEY=your_api_key_here node cors-proxy/server.js
```
</details>

<details>
<summary><b>Windows (PowerShell)</b></summary>

```powershell
$env:PROWLARR_API_KEY="your_api_key_here"
node cors-proxy/server.js
```
</details>

<details>
<summary><b>Windows (CMD)</b></summary>

```cmd
set PROWLARR_API_KEY=your_api_key_here
node cors-proxy/server.js
```
</details>

You should see:
```
CORS proxy listening on https://localhost:3001
Forwarding to Prowlarr at http://localhost:9696
```

**Environment variables:**

| Variable | Default | Description |
|---|---|---|
| `PROWLARR_API_KEY` | — | Your Prowlarr API key (required) |
| `PROWLARR_URL` | `http://localhost:9696` | Prowlarr instance URL |
| `PORT` | `3001` | Proxy listen port |

### 4. Import the extension in Hayase

1. Open Hayase
2. Go to Extensions
3. Click Import, enter:
   ```
   https://raw.githubusercontent.com/eruroueaito/hayase-prowlarr/main/index.json
   ```
4. Done — search any anime and you'll see results from Prowlarr

## Optional: Auto-start the proxy

By default the proxy stops when you close the terminal or restart your machine. See the guide for your platform to make it start automatically:

- [macOS (launchd)](docs/autostart-macos.md)
- [Windows (Task Scheduler)](docs/autostart-windows.md)
- [Cross-platform (pm2)](docs/autostart-pm2.md)

## Uninstall

<details>
<summary><b>macOS</b></summary>

```bash
mkcert -uninstall
rm ~/localhost-key.pem ~/localhost.pem
brew uninstall mkcert
```
</details>

<details>
<summary><b>Windows</b></summary>

```powershell
mkcert -uninstall
del %USERPROFILE%\localhost-key.pem %USERPROFILE%\localhost.pem
# Then uninstall mkcert via choco/scoop
```
</details>

## Troubleshooting

| Issue | Solution |
|---|---|
| No results | Check that the CORS proxy is running and Prowlarr has working indexers |
| Certificate error | Run `mkcert -install` again, then restart Hayase |
| 400 Bad Request | Verify your API key is correct |
| CORS error | Make sure you're using the HTTPS proxy, not connecting to Prowlarr directly |

## Security Note

- The CORS proxy is for **local use only**. Do not expose it to the public internet.
- mkcert creates a local CA trusted only by your machine. The private key is stored at `~/Library/Application Support/mkcert` (macOS) or `%LOCALAPPDATA%\mkcert` (Windows). If compromised, an attacker could theoretically MITM your local connections — but this requires physical access to your machine.

---

# 中文说明

一个 [Hayase](https://hayase.app) 扩展，通过本地 [Prowlarr](https://prowlarr.com) 实例搜索种子资源，聚合你配置的所有 indexer（Nyaa、动漫花园、ACG.RIP 等）的结果。

## 前置条件

- 已安装 [Hayase](https://hayase.app)
- 已安装 [Prowlarr](https://prowlarr.com) 并配置了至少一个 indexer
- [Node.js](https://nodejs.org)（v18+）
- [mkcert](https://github.com/FiloSottile/mkcert)（生成本地 HTTPS 证书）

## 安装步骤

### 1. 安装并配置 Prowlarr

<details>
<summary><b>macOS</b></summary>

```bash
brew install prowlarr
```
</details>

<details>
<summary><b>Windows</b></summary>

从 [prowlarr.com](https://prowlarr.com) 下载安装包，或使用：
```powershell
winget install Prowlarr.Prowlarr
```
</details>

打开 `http://localhost:9696`：
- **添加 Indexer**：Settings → Indexers → 添加你想用的站点
- **复制 API Key**：Settings → General → Security → API Key

### 2. 生成本地 HTTPS 证书

Hayase 从 `https://hayase.app` 加载，浏览器会阻止 HTTPS 页面请求 HTTP 资源，所以代理必须是 HTTPS。

<details>
<summary><b>macOS</b></summary>

```bash
brew install mkcert
mkcert -install
mkcert -key-file ~/localhost-key.pem -cert-file ~/localhost.pem localhost
```
</details>

<details>
<summary><b>Windows</b></summary>

```powershell
# 安装 mkcert（任选一种）
choco install mkcert
# 或
scoop install mkcert

# 生成证书
mkcert -install
mkcert -key-file %USERPROFILE%\localhost-key.pem -cert-file %USERPROFILE%\localhost.pem localhost
```
</details>

> **这是什么？** 在你的系统信任链中创建一个本地 CA，然后给 `localhost` 签一张证书。只影响你本机，完全可逆——见[卸载](#卸载)。

### 3. 启动 CORS 代理

```bash
git clone https://github.com/eruroueaito/hayase-prowlarr.git
cd hayase-prowlarr
```

<details>
<summary><b>macOS / Linux</b></summary>

```bash
PROWLARR_API_KEY=你的API密钥 node cors-proxy/server.js
```
</details>

<details>
<summary><b>Windows (PowerShell)</b></summary>

```powershell
$env:PROWLARR_API_KEY="你的API密钥"
node cors-proxy/server.js
```
</details>

<details>
<summary><b>Windows (CMD)</b></summary>

```cmd
set PROWLARR_API_KEY=你的API密钥
node cors-proxy/server.js
```
</details>

看到以下输出说明成功：
```
CORS proxy listening on https://localhost:3001
Forwarding to Prowlarr at http://localhost:9696
```

**环境变量：**

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PROWLARR_API_KEY` | — | Prowlarr API 密钥（必填） |
| `PROWLARR_URL` | `http://localhost:9696` | Prowlarr 地址 |
| `PORT` | `3001` | 代理监听端口 |

### 4. 在 Hayase 中导入扩展

1. 打开 Hayase
2. 进入 Extensions 页面
3. 点击 Import，输入：
   ```
   https://raw.githubusercontent.com/eruroueaito/hayase-prowlarr/main/index.json
   ```
4. 完成——搜索任意动画即可看到 Prowlarr 的结果

## 可选：代理开机自启

默认情况下关闭终端或重启电脑后代理会停止。参考以下指南设置自动启动：

- [macOS (launchd)](docs/autostart-macos.md)
- [Windows (任务计划程序)](docs/autostart-windows.md)
- [跨平台 (pm2)](docs/autostart-pm2.md)

## 卸载

<details>
<summary><b>macOS</b></summary>

```bash
mkcert -uninstall
rm ~/localhost-key.pem ~/localhost.pem
brew uninstall mkcert
```
</details>

<details>
<summary><b>Windows</b></summary>

```powershell
mkcert -uninstall
del %USERPROFILE%\localhost-key.pem %USERPROFILE%\localhost.pem
# 然后通过 choco/scoop 卸载 mkcert
```
</details>

## 常见问题

| 问题 | 解决方案 |
|---|---|
| 没有搜索结果 | 确认 CORS 代理在运行，且 Prowlarr 的 indexer 正常工作 |
| 证书错误 | 重新执行 `mkcert -install`，然后重启 Hayase |
| 400 Bad Request | 检查 API Key 是否正确 |
| CORS 错误 | 确保使用 HTTPS 代理，不要直接连 Prowlarr |

## 安全说明

- CORS 代理仅供**本地使用**，不要暴露到公网。
- mkcert 创建的 CA 只被你的本机信任，私钥存放在 `~/Library/Application Support/mkcert`（macOS）或 `%LOCALAPPDATA%\mkcert`（Windows）。
