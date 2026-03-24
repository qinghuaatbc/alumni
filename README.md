# 华北电力大学无线871 同学录

同学录网站，支持同学档案、阅览室、相册、地图、电视厅、私信等功能。

---

## 环境要求

- [Node.js](https://nodejs.org/) v18 或以上
- npm v9 或以上

---

## 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/qinghuaatbc/alumni.git
cd alumni
```

### 2. 安装依赖

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. 启动（开发模式）

**后端**（新终端）：
```bash
cd backend
npm run start:dev
```

**前端**（另一个终端）：
```bash
cd frontend
npm run dev
```

访问 http://localhost:5173

---

## 生产部署（单服务器）

前端编译后由 NestJS 直接托管，只需启动一个进程，访问一个端口。

### 第一步：安装依赖

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 第二步：编译前端

```bash
cd frontend
npm run build
# 产物输出到 frontend/dist/
```

### 第三步：编译并启动后端

```bash
cd backend
npm run build
node dist/main.js
```

启动后访问 http://localhost:3000 即可（前端和 API 均由此端口提供）。

### 第四步：用 PM2 守护进程（推荐）

```bash
npm install -g pm2

cd backend
pm2 start dist/main.js --name alumni
pm2 save
pm2 startup   # 开机自启
```

### 第五步：Nginx 反向代理（可选，配置域名/HTTPS）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering off;
    }
}
```

```bash
sudo certbot --nginx -d your-domain.com   # 配置 HTTPS
```

---

## 更新部署

```bash
git pull

cd frontend && npm run build && cd ..
cd backend && npm run build && cd ..

pm2 restart alumni
```

---

## 初始账号

| 用户名 | 密码  | 角色  |
|--------|-------|-------|
| admin  | admin | 管理员 |

管理员可以：添加/编辑/删除书籍、上传图书文件、管理电视频道、删除相册照片。

---

## 初始化演示数据（可选）

```bash
cd backend

# 导入演示同学数据（10位同学）
node -r ts-node/register seed.ts

# 导入演示书籍和照片数据
node -r ts-node/register seed-books.ts
```

---

## 项目结构

```
alumni/
├── backend/          # NestJS 后端（同时托管前端静态文件）
│   ├── src/
│   │   ├── alumni/       # 同学档案
│   │   ├── auth/         # JWT 登录认证
│   │   ├── comments/     # 留言评论
│   │   ├── library/      # 阅览室
│   │   ├── messages/     # 私信
│   │   ├── photos/       # 相册
│   │   ├── proxy/        # 电视直播流代理
│   │   ├── tv/           # 电视频道管理
│   │   └── users/        # 用户管理
│   └── uploads/          # 上传文件存储目录
├── frontend/         # React 前端
│   ├── dist/             # 生产构建产物（npm run build 生成）
│   └── src/
│       ├── api/          # API 请求封装
│       ├── components/   # 公共组件
│       ├── contexts/     # 全局状态（Auth、Settings）
│       ├── pages/        # 页面组件
│       └── i18n.ts       # 中英文翻译
└── README.md
```

---

## 主要功能

| 功能 | 说明 |
|------|------|
| 同学录 | 浏览、搜索同学档案，支持按姓名、班级、城市、毕业年份筛选 |
| 阅览室 | 在线阅读或下载书籍，管理员可上传 PDF/EPUB 等文件 |
| 相册 | 班级照片分类展示，支持灯箱浏览 |
| 地图 | 同学城市分布可视化 |
| 电视厅 | 国内电视台直播（通过后端代理绕过跨域），管理员可管理频道 |
| 私信 | 同学之间一对一私信 |
| 留言板 | 在同学主页留言评论 |
| 中英文切换 | 界面支持中文/英文一键切换 |
| 夜间模式 | 支持白天/夜间主题切换，设置自动保存 |

---

## 技术栈

**后端**
- [NestJS](https://nestjs.com/) + TypeScript
- [TypeORM](https://typeorm.io/) + SQLite（better-sqlite3）
- JWT 认证（passport-jwt）
- Multer 文件上传
- `@nestjs/serve-static`（托管前端静态文件）

**前端**
- [React](https://react.dev/) 18 + TypeScript
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [hls.js](https://github.com/video-dev/hls.js)（HLS 直播播放）
- React Router v6
