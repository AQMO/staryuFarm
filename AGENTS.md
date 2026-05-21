# AGENTS.md - 星语农庄多功能小程序

## 项目概览
星语农庄多功能小程序，包含5大业务模块：房间预订、在线点餐、农产品商城、果木租赁、地块租赁。
项目分为两个子项目：
- **staryu-web**（`/workspace/projects/`）：Spring+SpringMVC+Hibernate 后端 + JSP管理后台
- **staryu-uniapp**（`/workspace/staryu-uniapp/`）：Vue 3 移动端前端，模拟小程序体验

## 技术栈
- 后端：Spring 6 + SpringMVC + Hibernate 6 + MySQL(PostgreSQL via Supabase) + Maven
- 管理后台：HTML + CSS3 + JavaScript + Element UI + jQuery
- 前端：Vue 3 + TypeScript + Vue Router + Pinia + Vite
- 样式：Tailwind CSS (uniapp) / Element UI (admin)

## 构建和运行命令

### staryu-web（工作目录：/workspace/projects/）
- 编译：`mvn clean package -DskipTests`
- 运行：`export PGDATABASE_URL && java -jar target/staryu-web.jar --server.port=5000`
- 开发：先编译再运行（嵌入式Tomcat，端口5000）
- JSP管理后台：`http://localhost:5000/admin/dashboard`

### staryu-uniapp（工作目录：/workspace/staryu-uniapp/）
- 安装依赖：`pnpm install`
- 开发：`npx vite --host 0.0.0.0 --port 5001`
- 构建：`pnpm run build`
- 预览：`npx server -l 5000 -s`（需先 build）

## 目录结构

### staryu-web
```
src/main/
├── java/com/staryu/
│   ├── Main.java              # 嵌入式Tomcat启动入口
│   ├── config/
│   │   ├── WebConfig.java     # Web MVC配置
│   │   └── DataSourceConfig.java # 数据源配置(读取PGDATABASE_URL)
│   ├── entity/                # Hibernate实体类
│   │   ├── User.java
│   │   ├── ModuleConfig.java
│   │   ├── Room.java
│   │   ├── Food.java / FoodCategory.java
│   │   ├── Product.java / ProductCategory.java
│   │   ├── FruitTree.java
│   │   ├── Plot.java
│   │   ├── Order.java
│   │   ├── Cart.java
│   │   └── Address.java
│   ├── dao/                   # 数据访问层(BaseDao + 各实体Dao)
│   ├── service/               # 业务逻辑层(BusinessService)
│   └── controller/            # SpringMVC控制器
│       ├── AdminController.java  # 管理后台页面路由
│       ├── ConfigController.java # 模块配置API
│       ├── RoomController.java   # 房间API
│       ├── FoodController.java / FoodCategoryController.java
│       ├── ProductController.java / ProductCategoryController.java
│       ├── FruitTreeController.java
│       ├── PlotController.java
│       ├── OrderController.java
│       ├── CartController.java
│       ├── UserController.java
│       ├── AddressController.java
│       └── StatsController.java
├── resources/
│   ├── applicationContext.xml  # Spring IoC配置
│   ├── spring-mvc.xml          # SpringMVC配置
│   └── jdbc.properties         # JDBC参数(开发用)
└── webapp/
    ├── WEB-INF/web.xml         # Servlet配置
    ├── admin/                  # 管理后台HTML页面
    │   ├── dashboard.html
    │   ├── rooms.html
    │   ├── food.html
    │   ├── products.html
    │   ├── fruit-trees.html
    │   ├── plots.html
    │   ├── orders.html
    │   ├── users.html
    │   └── config.html
    └── static/                 # 静态资源
```

### staryu-uniapp
```
src/
├── api/index.ts        # API请求封装(axios)
├── stores/             # Pinia状态管理
│   ├── user.ts         # 用户状态
│   ├── config.ts       # 模块配置
│   └── cart.ts         # 购物车
├── router/index.ts     # 路由配置
├── views/
│   ├── home/           # 首页（模块入口）
│   ├── rooms/          # 房间预订（列表+详情）
│   ├── food/           # 在线点餐
│   ├── shop/           # 农产品商城（列表+详情）
│   ├── rent/           # 租赁中心（果木+地块）
│   ├── orders/         # 订单列表
│   └── profile/        # 个人中心
├── components/
│   └── TabBar.vue      # 底部TabBar
└── App.vue             # 根组件
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
- Java: Spring注解驱动，Hibernate注解映射
- 控制器REST风格返回JSON（@ResponseBody）
- DAO基于Hibernate SessionFactory
- 管理后台使用Element UI + jQuery AJAX
- 前端API请求统一通过src/api/index.ts封装
