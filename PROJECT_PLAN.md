# TrackPoint 埋点研发体系项目方案

## 一、 项目整体概览

TrackPoint 是一个完整的前后端全链路埋点研发体系，旨在提供项目用户行为分析、性能监控、报警监控的能力。本项目采用简单的目录结构将 SDK、服务端和前端平台统一管理，以降低多仓库维护成本，方便跨包调试和代码共享。

整个系统数据流向和核心模块分为三个部分：

1. **埋点 SDK (`@byte/track-point`)**：嵌入在各个业务前端项目中，负责采集用户的行为（点击、浏览）、错误信息、环境数据（浏览器、OS等），并统一上报给 Server。
2. **埋点数据服务 (Server)**：接收 SDK 上报的数据并持久化存储；同时提供 RESTful API 给埋点平台使用，用于事件管理和数据统计查询。
3. **埋点平台 (Admin Dashboard)**：提供给内部开发和运营人员使用的可视化系统，包含埋点事件 CRUD 管理、数据条件筛选和可视化数据看板（PV/UV统计）。

---

## 二、 技术选型

为了保证项目的极速落地，同时体现对全栈核心链路的掌控力，技术栈选型如下：

### 1. 仓库管理与基建
- **包管理工具**：**npm / pnpm**
- **工程化策略**：**极简目录结构**。跳过复杂的 `pnpm workspace` 和全局规范配置，直接通过物理目录拆分。在 Admin 等需要引入 SDK 的项目中，使用 `npm install file:../sdk` 直接本地链接，把宝贵的时间留给核心的业务逻辑。

### 2. 埋点 SDK (packages/sdk)
- **开发语言**：**TypeScript** (提供完善的类型提示)
- **打包构建**：**Vite (Library Mode)**。底层依然基于 Rollup，但免去了繁琐的配置，开箱即用，极速输出干净的 JS/TS 库文件。

### 3. 埋点数据服务 (packages/server)
- **运行环境**：**Node.js**
- **开发语言**：**TypeScript**
- **后端框架**：**Express** (轻量灵活，快速构建 RESTful API)
- **数据库**：**SQLite** (轻量级本地文件数据库，无需额外部署，极速开发落地)
- **ORM 框架**：**Prisma** (现代化的 ORM，类型安全，便捷操作数据库和表结构)

### 4. 埋点平台 (packages/admin)
- **开发框架**：**React 18** + **TypeScript**
- **构建工具**：**Vite** (极速构建，优秀的开发体验)
- **UI 组件库 / 样式**：**Tailwind CSS + shadcn/ui** (极其轻量且可高度定制化，配合 zustand 管理状态，一天内即可拼出高效、现代化的管理后台页面)
- **状态管理**：**zustand** (轻量级状态管理)
- **数据可视化**：**ECharts** (满足折线图、饼图等丰富的数据看板需求)

---

## 三、 目录结构规划

```text
TrackPoint/
├── packages/
│   ├── sdk/                # 埋点 SDK 核心代码 (Vite Library Mode)
│   ├── server/             # 埋点数据服务 (Express + SQLite + Prisma)
│   └── admin/              # 埋点数据看板与管理平台 (React + Vite + shadcn)
└── README.md
```

---

## 四、 开发阶段划分

为了确保按时交付并保障数据流向的清晰，项目分为以下 4 个阶段推进，**核心策略是“先有数据，再存数据，最后看数据”**：

### 阶段一：埋点 SDK 开发（采集端先行）

**目标**：SDK 产出的数据结构决定了后端的数据库该怎么建。先造发送端！
1. **工程搭建**：在 `packages/sdk` 使用 Vite 库模式初始化 TS 打包环境。
2. **核心逻辑开发**：
   - `Tracker` 类初始化 (`register`)：记录项目 ID、采样率等。
   - `addCommonParams`：支持动态添加全局通用参数。
   - **自动获取环境信息**：解析 UserAgent 获取 OS、Browser、当前 URL 等。
   - **核心上报 (`sendEvent`)**：实现基于缓存队列和延时/满量触发的上报机制，通过 `navigator.sendBeacon` 或 `fetch` 发送给 Server。
   - **自动错误捕获**：监听 `window.onerror` 和 `unhandledrejection` 实现运行时错误上报。

### 阶段二：Server 端基础搭建与数据库设计（服务端落地）

**目标**：接收 SDK 发来的 JSON 数据，并将其持久化。
1. **数据库表结构设计 (Prisma + SQLite)**：
   - `Project`：接入的项目配置表。
   - `Event`：埋点事件定义与管理表。
   - `TrackLog`：存储上报的埋点明细，采用 JSON 字段格式存储动态的 `params`。
2. **搭建 Express 基础服务**：
   - 编写供 SDK 调用的数据接收接口（如：`POST /api/track/upload`）。
   - 编写供 Admin 平台调用的事件增删改查（CRUD）API。
   - 编写供 Admin 平台调用的数据看板统计接口（如按时间段聚合查询 PV/UV）。

### 阶段三：埋点平台开发（展示与管理层）

**目标**：将收集到的数据转化为可视化的图表和管理表格。
1. **基础搭建**：在 `packages/admin` 使用 Vite + React 初始化，配置 Tailwind CSS 和 shadcn/ui。
2. **本地联调依赖**：使用 `npm install file:../sdk` 将第一阶段开发的 SDK 引入 Admin 平台以供测试。
3. **埋点管理模块**：使用 shadcn 的 Table 组件等开发“事件信息管理”页面，对接服务端的 CRUD 接口。
4. **数据看板模块**：开发数据条件筛选表单，接入 ECharts 绘制事件的 PV/UV 趋势折线图和终端设备分布饼图。

### 阶段四：全链路联调与复盘验收（测试与闭环）

1. **全链路测试**：在本地跑通 `前端页面触发行为 -> SDK 拦截与队列上报 -> Server 接收并 Prisma 入库 -> Admin 平台查询并展示大屏图表` 的闭环链路。
2. **文档梳理**：完善项目的 README，记录如何启动前后端服务，以备后续面试复盘和演示使用。
