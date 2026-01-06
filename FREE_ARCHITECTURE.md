# Medusa 完整部署架构 - 免费方案

## 🏗️ 推荐的免费架构

```
[Vercel: Next.js 商店前端] ←→ [Railway: Medusa API] ←→ [Neon: PostgreSQL]
                                            ↓
                             [Redis Cloud: 缓存/事件]
[Vercel: Medusa Admin] ──────────────────────┘
```

## ✅ 免费平台清单

| 服务 | 免费额度 | 链接 | 用途 |
|------|----------|------|------|
| **Vercel** | 无限 | vercel.com | 前端 + Admin 托管 |
| **Neon** | 完全免费 | neon.tech | PostgreSQL 数据库 |
| **Redis Cloud** | 30MB 免费 | redis.com | 缓存 + 事件队列 |
| **Railway** | $5/月 | railway.app | 后端 API 部署 |

> 💡 **为什么不推荐 Render？**
> - Render 的 PostgreSQL 和 Redis 90 天后过期
> - Railway 的 $5 额度足够小项目长期运行
> - Neon 的 PostgreSQL 永久免费

---

## 📦 推荐的 Next.js 商店前端

官方有两个模板供选择：

### 1. **Medusa Storefront (官方 Next.js 模板)**
```bash
npx create-medusa-app@latest --frontend nextjs
```

特点：
- 完整的产品目录、购物车、结账流程
- 使用 Tailwind CSS
- 内置 Medusa 集成
- 支持暗色模式

### 2. **Medusa UI (组件库)**
```bash
# 基于 @medusajs/ui 组件库
```

我建议使用官方模板，因为功能更完整。

---

## 🎯 Medusa Admin 管理后台

### 部署官方 Medusa Admin

Medusa Admin 是独立的 React 应用，需要单独部署：

1. **克隆官方仓库**
   ```bash
   git clone https://github.com/medusajs/admin.git medusa-admin
   cd medusa-admin
   ```

2. **配置环境变量**
   ```env
   MEDUSA_ADMIN_BACKEND_URL=https://your-medusa-api.railway.app
   ```

3. **部署到 Vercel**
   - 直接导入 GitHub 仓库到 Vercel
   - 自动检测为 Vite 应用
   - 配置环境变量

---

## 🚀 完整部署步骤

### 步骤 1: 准备数据库 (Neon)

1. 访问 [Neon Console](https://console.neon.tech)
2. 创建新项目：
   - Name: `medusa-db`
   - Region: 选择离你最近的
3. 复制连接字符串：
   ```
   postgres://user:password@ep-xxx.region.neon.tech/medusa
   ```

### 步骤 2: 准备缓存 (Redis Cloud)

1. 访问 [Redis Cloud](https://redis.com/try-free/)
2. 创建免费订阅：
   - Plan: Fixed (30MB)
   - Region: 选择离你最近的
3. 复制连接字符串：
   ```
   redis://:password@redis-xxx.redis.cloud.redislabs.com:12345
   ```

### 步骤 3: 部署后端 (Railway)

1. 访问 [Railway Dashboard](https://railway.app/dashboard)
2. 创建新项目
3. 连接 GitHub 仓库 (medusa-starter-default)
4. 添加环境变量：
   ```env
   DATABASE_URL=postgres://...@ep-xxx.neon.tech/medusa
   REDIS_URL=redis://...@redis-xxx.redis.cloud.redislabs.com:12345
   STORE_CORS=http://localhost:3000,https://*.vercel.app
   ADMIN_CORS=http://localhost:5173,https://*.vercel.app
   AUTH_CORS=http://localhost:5173,https://*.vercel.app
   JWT_SECRET=your-32-char-secret-key
   COOKIE_SECRET=your-32-char-secret-key
   NODE_VERSION=20
   NODE_ENV=production
   ```
5. 部署完成后，复制 API URL (例如: `https://medusa-api.railway.app`)

### 步骤 4: 创建管理员用户

在 Railway 后台打开 Shell：
```bash
npx medusa user -e admin@yourstore.com -p SecurePassword123!
```

### 步骤 5: 部署商店前端 (Vercel)

使用官方 Next.js 模板：

```bash
# 在本地创建
npx create-medusa-app@latest my-storefront --frontend nextjs

# 或手动设置
git clone https://github.com/medusajs/nextjs-starter-medusa my-storefront
cd my-storefront
npm install
```

配置 Vercel：
1. 推送到 GitHub
2. 导入 Vercel
3. 环境变量：
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-api.railway.app
   ```
4. 部署

### 步骤 6: 部署 Admin 后台 (Vercel)

```bash
# 克隆官方 Admin 仓库
git clone https://github.com/medusajs/admin.git my-medusa-admin
cd my-medusa-admin
npm install
```

配置 Vercel：
1. 推送到 GitHub
2. 导入 Vercel
3. 环境变量：
   ```
   MEDUSA_ADMIN_BACKEND_URL=https://your-medusa-api.railway.app
   ```
4. 部署

---

## 🔗 资源链接

### 官方仓库

- **后端**: https://github.com/medusajs/medusa
- **Admin**: https://github.com/medusajs/admin
- **Next.js 商店**: https://github.com/medusajs/nextjs-starter-medusa
- **UI 组件库**: https://github.com/medusajs/ui

### 文档

- [Medusa 文档](https://docs.medusajs.com)
- [部署指南](https://docs.medusajs.com/deployment)
- [Admin 部署](https://docs.medusajs.com/admin/deployment)

---

## 📋 部署检查清单

### 完成后验证

- [ ] Neon PostgreSQL 创建并获取连接字符串
- [ ] Redis Cloud 创建并获取连接字符串
- [ ] Railway 后端部署成功
- [ ] 后端健康检查通过 (`/health`)
- [ ] 管理员用户创建成功
- [ ] Vercel 商店前端部署成功
- [ ] Vercel Admin 后台部署成功
- [ ] Admin 登录测试通过
- [ ] CORS 配置正确
- [ ] 自定义域名配置 (可选)

---

## 💰 成本总结

| 服务 | 免费额度 | 成本 |
|------|----------|------|
| Vercel | 无限带宽、80GB 带宽/月 | $0 |
| Neon PostgreSQL | 10GB 存储，无限数据库 | $0 |
| Redis Cloud | 30MB 内存 | $0 |
| Railway | $5/月额度 (750 小时) | $0 |
| **总计** | | **$0/月** |

> ✅ 这个架构可以永久免费运行小型到中型项目！
