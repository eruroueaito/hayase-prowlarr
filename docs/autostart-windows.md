# Windows Auto-start (Task Scheduler) | Windows 开机自启（任务计划程序）

## English

### 1. Create a startup script

Save the following as `start-proxy.bat` in your `hayase-prowlarr` folder:

```bat
@echo off
set PROWLARR_API_KEY=your_api_key_here
node "%~dp0cors-proxy\server.js"
```

Replace `your_api_key_here` with your Prowlarr API key.

### 2. Add to Task Scheduler

1. Press `Win + R`, type `taskschd.msc`, press Enter
2. Click **Create Basic Task** in the right panel
3. **Name**: `Hayase Prowlarr Proxy`
4. **Trigger**: Select **When I log on**
5. **Action**: Select **Start a program**
6. **Program/script**: Browse to your `start-proxy.bat`
7. Click **Finish**

### 3. (Optional) Run hidden without a console window

After creating the task:
1. Find `Hayase Prowlarr Proxy` in the task list, right-click → **Properties**
2. Check **Run whether user is logged on or not**
3. Under **General**, check **Hidden**
4. Click **OK**, enter your Windows password when prompted

### 4. Manage

```powershell
# Run now
schtasks /run /tn "Hayase Prowlarr Proxy"

# Stop
schtasks /end /tn "Hayase Prowlarr Proxy"

# Delete
schtasks /delete /tn "Hayase Prowlarr Proxy" /f
```

---

## 中文

### 1. 创建启动脚本

在 `hayase-prowlarr` 文件夹中保存以下内容为 `start-proxy.bat`：

```bat
@echo off
set PROWLARR_API_KEY=你的API密钥
node "%~dp0cors-proxy\server.js"
```

将 `你的API密钥` 替换为你的 Prowlarr API Key。

### 2. 添加到任务计划程序

1. 按 `Win + R`，输入 `taskschd.msc`，回车
2. 点击右侧 **创建基本任务**
3. **名称**：`Hayase Prowlarr Proxy`
4. **触发器**：选择 **当我登录时**
5. **操作**：选择 **启动程序**
6. **程序或脚本**：浏览到你的 `start-proxy.bat`
7. 点击 **完成**

### 3.（可选）隐藏窗口运行

创建任务后：
1. 在任务列表中找到 `Hayase Prowlarr Proxy`，右键 → **属性**
2. 勾选 **不管用户是否登录都要运行**
3. 在 **常规** 标签下勾选 **隐藏**
4. 点击 **确定**，输入 Windows 密码

### 4. 管理

```powershell
# 立即运行
schtasks /run /tn "Hayase Prowlarr Proxy"

# 停止
schtasks /end /tn "Hayase Prowlarr Proxy"

# 删除
schtasks /delete /tn "Hayase Prowlarr Proxy" /f
```
