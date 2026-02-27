# Hainan-Travel-Recommendation-System
本项目是基于B/S架构开发的海南旅游线路个性化推荐平台，采用Java+SpringBoot搭建后端服务，Vue.js实现前端页面，搭配MySQL数据库、Tomcat服务器部署。平台聚焦海南本地旅游场景，为用户提供景点查询、个性化线路推荐、在线订票支付、评价互动等一站式服务，解决旅游线路信息分散、推荐匹配度低的痛点。

## 在 IntelliJ IDEA 中启动项目

### 环境准备

1. 安装 [Node.js](https://nodejs.org/)（建议 v18 或以上版本，安装后自带 npm）。
2. 安装 [IntelliJ IDEA](https://www.jetbrains.com/idea/)（Ultimate 或 Community 版均可）。
3. 在 IDEA 中安装 **Vue.js** 插件（`File → Settings → Plugins`，搜索 "Vue.js" 并安装）。

### 启动前端项目

1. 用 IDEA 打开项目根目录（`File → Open`，选择本仓库所在文件夹）。
2. 打开 IDEA 内置终端（`View → Tool Windows → Terminal`，或使用快捷键 `Alt+F12`）。
3. 在终端中进入前端目录并安装依赖：
   ```bash
   cd frontend
   npm install
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   ```
5. 启动成功后，终端会显示本地访问地址（默认为 `http://localhost:5173`），在浏览器中打开即可预览项目。

### 生产构建

如果需要构建用于部署的生产版本：

```bash
cd frontend
npm run build
```

构建产物将输出到 `frontend/dist` 目录。可使用以下命令本地预览构建结果：

```bash
npm run preview
```

### 项目结构说明

```
├── frontend/              # 前端项目（Vue 3 + Vite）
│   ├── src/
│   │   ├── views/         # 页面组件（首页、景点、线路、登录等）
│   │   ├── components/    # 公共组件（导航栏、侧边栏）
│   │   ├── router/        # 路由配置
│   │   ├── assets/        # 静态资源与样式
│   │   ├── App.vue        # 根组件
│   │   └── main.js        # 入口文件
│   ├── package.json       # 前端依赖配置
│   └── vite.config.js     # Vite 构建配置
├── LICENSE
└── README.md
```
