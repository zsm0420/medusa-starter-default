# Medusa 完整部署方案 - 100%免费

## 🏗️ 最终架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel (免费)                            │
│  ┌───────────────────────┐    ┌───────────────────────┐        │
│  │  Next.js 商店前端     │    │  Medusa Admin         │        │
│  │  vercel.app           │    │  vercel.app           │        │
│  └───────────────────────┘    └───────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ HTTPS API
┌─────────────────────────────────────────────────────────────────┐
│                    Render Web Service (免费)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Medusa API 后端                                         │   │
│  │  onrender.com                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │                           │                       │
         ▼                           ▼                       ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Neon          │      │  Redis Cloud    │      │  文件存储        │
│   PostgreSQL    │      │  (30MB免费)     │      │  (可选)          │
│   永久免费       │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## ✅ 免费平台清单

| 服务 | 免费内容 | 限制 | 用途 |
|------|----------|------|------|
| **Vercel** | 无限项目、80GB带宽/月 | 无 | 前端 + Admin 托管 |
| **Render** | 750小时/月 Web Service | 15分钟无请求休眠 | 后端 API 部署 |
| **Neon** | 永久免费 PostgreSQL | 10GB存储 | 主数据库 |
| **Redis Cloud** | 30MB 内存 | 单数据库 | 缓存 + 事件 |

> 💡 **为什么选这个方案？**
> - Render Web Service 网络访问比 Railway 好
> - Neon PostgreSQL **永久免费**，不受90天限制
> - Vercel 前端访问速度快，全球CDN

---

## 📋 完整部署步骤

### 第一阶段：数据库准备

#### 1.1 创建 Neon PostgreSQL (永久免费)

1. 访问 https://console.neon.tech
2. 点击 **Create a project**
3. 配置：
   - **Name**: `medusa-db`
   - **Region**: `Singapore` (离中国近，延迟低)
   - **Compute**: `0.5 vCPU / 0.5GB RAM` (免费)
4. 点击 **Create project**
5. **重要**：在 Connection Details 中复制：
   ```
   Host: ep-xxx.region.neon.tech
   Database: neondb
   User: xxx
   Password: xxx
   ```
6. 完整连接字符串格式：
   ```
   postgres://user:password@ep-xxx.region.neon.tech/neondb
   ```

#### 1.2 创建 Redis Cloud (免费)

1. 访问 https://redis.com/try-free/
2. 点击 **Get Started**
3. 配置：
   - **Subscription**: Fixed
   - **Plan**: $0 (30MB)
   - **Region**: Singapore
4. 点击 **Create Subscription**
5. 创建 Database：
   - **Name**: `medusa-cache`
   - **Memory**: 30MB
6. 完成后复制连接信息：
   ```
   Host: redis-XX.redis.cloud.redislabs.com
   Port: 12345
   Password: xxx
   ```
7. 完整连接字符串：
   ```
   redis://:password@redis-XX.redis.cloud.redislabs.com:12345
   ```

---

### 第二阶段：后端部署 (Render)

#### 2.1 准备代码

确保您的项目已在 GitHub：

```bash
cd /path/to/medusa-starter-default

# 如果还没初始化Git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/medusa-starter-default.git
git push -u origin main
```

#### 2.2 创建 Render Web Service

1. 访问 https://dashboard.render.com
2. 点击 **New +** → **Web Service**
3. 连接您的 GitHub 仓库
4. 配置基本信息：
   - **Name**: `medusa-api`
   - **Root Directory**: (留空，使用根目录)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: **Free**

#### 2.3 配置环境变量

在 **Environment** 标签页，添加以下变量：

```env
# ===== 必需的环境变量 =====

# 数据库 (从 Neon 复制)
DATABASE_URL=postgres://user:password@ep-xxx.region.neon.tech/neondb

# 缓存 (从 Redis Cloud 复制)
REDIS_URL=redis://:password@redis-XX.redis.cloud.redislabs.com:12345

# CORS 配置 (稍后更新)
STORE_CORS=http://localhost:3000,https://*.vercel.app
ADMIN_CORS=http://localhost:5173,https://*.vercel.app
AUTH_CORS=http://localhost:5173,https://*.vercel.app

# 安全密钥 (生成强随机字符串)
JWT_SECRET=abc123xyz789def456ghi789jkl012mno345pqr678stu901vwx234yz567
COOKIE_SECRET=def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123xyz789

# Node.js 版本 (必须为 20)
NODE_VERSION=20

# 环境
NODE_ENV=production
```

#### 2.4 部署后端

1. 点击 **Create Web Service**
2. 等待构建完成 (5-10分钟)
3. 如果构建失败，查看 **Logs** 排查问题
4. 成功后会看到类似：
   ```
   Server is running on port 10000
   Health check passed
   ```

#### 2.5 记录 API 地址

部署成功后，记录您的后端地址：
```
https://medusa-api.onrender.com
```

---

### 第三阶段：创建管理员账户

#### 3.1 使用 Render Shell

1. 在 Render Dashboard找到 `medusa-api` 服务
2. 点击 **Shell** → **Connect Shell**
3. 运行命令创建管理员：

```bash
npx medusa user -e admin@yourstore.com -p YourSecurePassword123!
```

如果上述命令失败，尝试：

```bash
# 方法1: 使用 seed 脚本
npm run seed

# 方法2: 手动创建
node -e "
const { UserService } = require('@medusajs/medusa/services/user')
const { createHash } = require('crypto')

// 这需要在正确的 Medusa 容器上下文中运行
console.log('Please use: npx medusa user -e email -p password')
"
```

#### 3.2 验证创建成功

```bash
curl https://medusa-api.onrender.com/admin/auth
# 应该返回 HTTP 200 或 401 (表示端点存在)
```

---

### 第四阶段：部署商店前端 (Vercel)

#### 4.1 使用官方 Next.js 模板

```bash
# 克隆官方 Next.js 商店模板
git clone https://github.com/medusajs/nextjs-starter-medusa.git my-storefront
cd my-storefront

# 安装依赖
npm install
```

#### 4.2 本地测试

```bash
# 设置环境变量
cp .env.example .env.local
# 编辑 .env.local，添加:
# NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# 启动本地开发
npm run dev
```

访问 http://localhost:3000 确认工作正常。

#### 4.3 推送到 GitHub

```bash
git init
git add .
git commit -m "Add Next.js storefront"
git remote add origin https://github.com/yourusername/my-storefront.git
git push -u origin main
```

#### 4.4 部署到 Vercel

1. 访问 https://vercel.com/dashboard
2. 点击 **Add New...** → **Project**
3. 导入 `my-storefront` 仓库
4. 配置环境变量：
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa-api.onrender.com
   ```
5. 点击 **Deploy**
6. 部署成功后记录前端地址：
   ```
   https://my-storefront.vercel.app
   ```

---

### 第五阶段：部署 Admin 后台 (Vercel)

#### 5.1 克隆官方 Admin

```bash
git clone https://github.com/medusajs/admin.git my-medusa-admin
cd my-medusa-admin

# 安装依赖
npm install
```

#### 5.2 配置环境变量

创建 `.env.local`：

```env
MEDUSA_ADMIN_BACKEND_URL=https://medusa-api.onrender.com
```

#### 5.3 本地测试

```bash
npm run dev
```

访问 http://localhost:5173 确认可以登录。

#### 5.4 推送到 GitHub

```bash
git init
git add .
git commit -m "Add Medusa Admin"
git remote add origin https://github.com/yourusername/my-medusa-admin.git
git push -u origin main
```

#### 5.5 部署到 Vercel

1. 访问 https://vercel.com/dashboard
2. 点击 **Add New...** → **Project**
3. 导入 `my-medusa-admin` 仓库
4. **重要**：在 **Configuration** 中：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 配置环境变量：
   ```
   MEDUSA_ADMIN_BACKEND_URL=https://medusa-api.onrender.com
   ```
6. 点击 **Deploy**
7. 部署成功后记录 Admin 地址：
   ```
   https://my-medusa-admin.vercel.app
   ```

---

### 第六阶段：更新后端 CORS

现在前端和 Admin 都部署成功了，需要更新后端的 CORS 配置。

#### 6.1 更新 Render 环境变量

1. 在 Render Dashboard 找到 `medusa-api` 服务
2. 点击 **Environment** → **Edit Variables**
3. 更新 `ADMIN_CORS` 和 `STORE_CORS`：

```env
# 更新 CORS (替换为实际地址)
STORE_CORS=http://localhost:3000,https://my-storefront.vercel.app
ADMIN_CORS=http://localhost:5173,https://my-medusa-admin.vercel.app
AUTH_CORS=http://localhost:5173,https://my-medusa-admin.vercel.app
```
4. 点击 **Save Changes**
5. 服务会自动重新部署

---

## 🔍 验证部署

### 快速检查

```bash
# 1. 检查后端健康
curl https://medusa-api.onrender.com/health

# 2. 检查商店 API
curl https://medusa-api.onrender.com/store/products

# 3. 检查 Admin API
curl https://medusa-api.onrender.com/admin/auth
```

### 完整验证脚本

创建 `verify.sh`：

```bash
#!/bin/bash

BACKEND="https://medusa-api.onrender.com"
STOREFRONT="https://my-storefront.vercel.app"
ADMIN="https://my-medusa-admin.vercel.app"

echo "=== Medusa 部署验证 ==="
echo ""

echo "1. 检查后端健康..."
curl -s $BACKEND/health | head -c 100
echo -e "\n"

echo "2. 检查商店 API..."
curl -s $BACKEND/store/products | head -c 100
echo -e "\n"

echo "3. 检查 Admin API..."
curl -s $BACKEND/admin/auth | head -c 100
echo -e "\n"

echo "4. 检查商店前端..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" $STOREFRONT

echo "5. 检查 Admin 后台..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" $ADMIN

echo ""
echo "=== 验证完成 ==="
echo "后端: $BACKEND"
echo "商店: $STOREFRONT"
echo "Admin: $ADMIN"
```

运行：
```bash
chmod +x verify.sh
./verify.sh
```

---

## 📋 部署完成检查清单

- [ ] Neon PostgreSQL 创建成功，获取连接字符串
- [ ] Redis Cloud 创建成功，获取连接字符串
- [ ] Render 后端部署成功
- [ ] 后端健康检查通过 (`/health`)
- [ ] 管理员账户创建成功
- [ ] Vercel 商店前端部署成功
- [ ] Vercel Admin 后台部署成功
- [ ] 后端 CORS 更新为生产地址
- [ ] Admin 登录测试通过
- [ ] 商店前端能正常调用 API

---

## 💰 成本总结

| 服务 | 免费内容 | 月成本 |
|------|----------|--------|
| Vercel | 无限项目、80GB带宽 | $0 |
| Render | 750小时 Web Service | $0 |
| Neon | 永久免费 PostgreSQL | $0 |
| Redis Cloud | 30MB 缓存 | $0 |
| **总计** | | **$0/月** |

✅ **这个方案可以永久免费运行！**

---

## 🐛 常见问题

### Render 构建失败

**问题**: `npm install` 失败或内存不足

**解决方案**:
```bash
# 在 package.json 中添加构建优化
{
  "scripts": {
    "build": "npm run build"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Neon 连接失败

**问题**: 连接被拒绝

**解决方案**:
1. 在 Neon Dashboard 检查 IP 白名单
2. 添加 Render 的 IP 段或允许所有 IP (0.0.0.0/0)
3. 检查连接字符串格式是否正确

### CORS 错误

**问题**: 前端无法调用后端 API

**解决方案**:
1. 确保后端 CORS 已包含前端地址
2. 检查是否缺少 `http://` 或 `https://`
3. 重新部署后端使 CORS 生效

### 15分钟休眠

**问题**: Render 免费版 15分钟无请求会休眠

**解决方案**:
1. 这是免费版的限制，无法避免
2. 首次访问需要等待几秒唤醒
3. 或者升级到 Paid Plan ($7/月)

---

## 🎯 下一步操作

按照以下顺序执行：

1. ✅ 创建 Neon PostgreSQL 数据库
2. ✅ 创建 Redis Cloud 缓存
3. ✅ 部署 Render 后端 API
4. ✅ 创建管理员账户
5. ✅ 部署 Vercel 商店前端
6. ✅ 部署 Vercel Admin 后台
7. ✅ 更新后端 CORS 配置
8. 🔗 配置自定义域名 (可选)

需要我帮您开始执行哪个步骤？
