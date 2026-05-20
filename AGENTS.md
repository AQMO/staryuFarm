# AGENTS.md - 星语农庄多功能小程序

## 项目概览
星语农庄多功能小程序，包含5大业务模块：房间预订、在线点餐、农产品商城、果木租赁、地块租赁。
项目分为两个子项目：
- **staryu-web**（`/workspace/projects/`）：Next.js 16 后端 + 管理后台，提供 API 和管理面板
- **staryu-uniapp**（`/workspace/staryu-uniapp/`）：Vue 3 移动端前端，模拟小程序体验

## 技术栈
- 后端：Next.js 16 (App Router) + TypeScript + Supabase (PostgreSQL)
- 前端：Vue 3 + TypeScript + Vue Router + Pinia + Vite
- UI：管理后台使用 shadcn/ui，移动端使用手写 Tailwind CSS
- 样式：Tailwind CSS 4

## 构建和运行命令

### staryu-web（工作目录：/workspace/projects/）
- 安装依赖：`pnpm install`
- 开发：`coze dev`（端口 5000）
- 构建：`pnpm run build`
- 启动：`pnpm run start`

### staryu-uniapp（工作目录：/workspace/staryu-uniapp/）
- 安装依赖：`pnpm install`
- 开发：`npx vite --host 0.0.0.0 --port 5001`
- 构建：`pnpm run build`
- 预览：`npx server -l 5000 -s`（需先 build）

## 目录结构

### staryu-web
```
src/
├── app/
│   ├── admin/          # 管理后台页面
│   │   ├── page.tsx    # 仪表盘
│   │   ├── layout.tsx  # 管理布局（侧边栏）
│   │   ├── rooms/      # 房间管理
│   │   ├── food/       # 菜品管理（含分类）
│   │   ├── products/   # 农产品管理
│   │   ├── fruit-trees/# 果木管理
│   │   ├── plots/      # 地块管理
│   │   ├── orders/     # 订单管理
│   │   ├── users/      # 用户管理
│   │   └── config/     # 模块配置
│   └── api/            # REST API 路由
│       ├── config/     # 模块配置 CRUD
│       ├── rooms/      # 房间 CRUD
│       ├── food/       # 菜品 CRUD
│       ├── food-category/ # 菜品分类 CRUD
│       ├── products/   # 农产品 CRUD
│       ├── product-category/ # 农产品分类 CRUD
│       ├── fruit-trees/ # 果木 CRUD
│       ├── plots/      # 地块 CRUD
│       ├── orders/     # 订单 CRUD
│       ├── cart/       # 购物车 CRUD
│       ├── users/      # 用户 CRUD
│       ├── address/    # 收货地址 CRUD
│       └── stats/      # 统计数据
├── components/
│   ├── admin/
│   │   └── CrudPage.tsx  # 通用 CRUD 页面组件
│   └── ui/              # shadcn/ui 组件库
├── storage/database/
│   ├── supabase-client.ts # Supabase 客户端
│   └── shared/schema.ts   # 数据库 Schema 定义
└── page.tsx             # 首页（重定向到 /admin）
```

### staryu-uniapp
```
src/
├── api/index.ts        # API 请求封装
├── stores/             # Pinia 状态管理
│   ├── user.ts         # 用户状态
│   └── config.ts       # 模块配置
├── router/index.ts     # 路由配置
├── views/
│   ├── home/           # 首页（模块入口）
│   ├── rooms/          # 房间预订（列表+详情）
│   ├── food/           # 在线点餐
│   ├── shop/           # 农产品商城（列表+详情）
│   ├── rent/           # 租赁中心（果木+地块）
│   ├── orders/         # 订单列表
│   └── profile/        # 个人中心
└── App.vue             # 根组件（含底部 TabBar）
```

## 数据库表
- `users` - 用户表
- `module_config` - 模块配置表
- `rooms` - 房间表
- `food_category` / `food` - 菜品分类/菜品表
- `product_category` / `products` - 农产品分类/产品表
- `fruit_trees` - 果木表
- `plots` - 地块表
- `orders` - 订单表
- `cart` - 购物车表
- `address` - 收货地址表

## 代码风格
- TypeScript strict 模式，禁止隐式 any
- 函数参数、返回值必须标注类型
- React 组件使用 'use client' 指令（涉及 hooks 的组件）
- API 路由统一使用 getSupabaseClient() 获取数据库客户端
- 前端 API 请求统一通过 src/api/index.ts 封装
