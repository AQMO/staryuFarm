# 星语农庄多功能小程序

## 项目结构

```
staryuFarm/
├── staryu-web/          # 后端 + 管理后台 (Spring + SpringMVC + Hibernate + MySQL)
├── staryu-uniapp/       # 小程序前端 (uni-app + Vue 3 + TypeScript)
├── AGENTS.md            # 项目开发规范
├── DESIGN.md            # 设计规范
└── .gitignore
```

## staryu-web（后端 + 管理后台）

### 技术栈
- Spring 5.3.39 + SpringMVC + Hibernate 5.6.15 + MySQL 8.0
- Druid 连接池 | Maven WAR 打包 | Element UI 管理后台

### 快速启动
1. 初始化数据库：`mysql -u root -p < staryu-web/init-db.sql`
2. 修改数据库连接：编辑 `staryu-web/src/main/resources/jdbc.properties`
3. 构建：`cd staryu-web && mvn clean package -DskipTests`
4. 部署：将 `target/staryu-web.war` 放到 Tomcat 9 的 webapps/ROOT.war
5. 访问：`http://localhost:8080/admin/login`（默认账号 admin / admin123）

### IDEA 启动
详见 [staryu-web/.idea-setup.md](staryu-web/.idea-setup.md)

## staryu-uniapp（小程序前端）

### 技术栈
- uni-app + Vue 3 + TypeScript + Pinia + Vite

### HBuilderX 运行
1. 打开 HBuilderX → 文件 → 导入 → 选择 `staryu-uniapp` 目录
2. 安装依赖：终端执行 `pnpm install`
3. 修改 API 地址：编辑 `staryu-uniapp/src/api/index.ts` 中的 `BASE_URL`
4. 运行到浏览器：右键项目 → 运行 → 运行到浏览器
5. 运行到微信小程序：右键项目 → 运行 → 运行到小程序模拟器 → 微信开发者工具

### 命令行运行（H5 预览）
```bash
cd staryu-uniapp
pnpm install
pnpm dev:h5
```

## 功能模块

| 模块 | 说明 |
|------|------|
| 房间预订 | 农庄房间在线预订 |
| 在线点餐 | 农庄特色菜品点餐 |
| 农产品商城 | 新鲜农产品在线购买 |
| 果木租赁 | 认养果木享受丰收 |
| 地块租赁 | 租一块地种自己的菜 |
