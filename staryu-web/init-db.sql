-- 星语农庄数据库初始化脚本
-- 使用方法: mysql -u root -p < init-db.sql

CREATE DATABASE IF NOT EXISTS staryu_farm DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE staryu_farm;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    openid VARCHAR(100),
    nickname VARCHAR(50),
    avatar VARCHAR(500),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user',
    status INT DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 模块配置表
CREATE TABLE IF NOT EXISTS module_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    module_key VARCHAR(50) NOT NULL UNIQUE,
    module_name VARCHAR(50) NOT NULL,
    is_enabled TINYINT(1) NOT NULL DEFAULT 1,
    sort INT DEFAULT 0,
    icon VARCHAR(50),
    description VARCHAR(200),
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 房间表
CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    pic VARCHAR(500) NOT NULL,
    capacity INT NOT NULL,
    facility VARCHAR(200),
    stock INT NOT NULL,
    status INT NOT NULL DEFAULT 1,
    description TEXT,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 菜品分类表
CREATE TABLE IF NOT EXISTS food_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    sort INT DEFAULT 0,
    status INT NOT NULL DEFAULT 1,
    remark VARCHAR(200),
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 菜品表
CREATE TABLE IF NOT EXISTS food (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category_id BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    pic VARCHAR(500) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    status INT NOT NULL DEFAULT 1,
    description TEXT,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 农产品分类表
CREATE TABLE IF NOT EXISTS product_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    sort INT DEFAULT 0,
    status INT NOT NULL DEFAULT 1,
    remark VARCHAR(200),
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 农产品表
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category_id BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    pic VARCHAR(500) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    sales INT NOT NULL DEFAULT 0,
    status INT NOT NULL DEFAULT 1,
    unit VARCHAR(20),
    description TEXT,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 果木表
CREATE TABLE IF NOT EXISTS fruit_trees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    pic VARCHAR(500) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    lease_period INT NOT NULL,
    status INT NOT NULL DEFAULT 1,
    description TEXT,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 地块表
CREATE TABLE IF NOT EXISTS plots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    pic VARCHAR(500) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    lease_period INT NOT NULL,
    status INT NOT NULL DEFAULT 1,
    description TEXT,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    order_type VARCHAR(20) NOT NULL,
    item_id BIGINT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    pay_method VARCHAR(20) DEFAULT NULL COMMENT 'wechat/alipay',
    pay_time DATETIME,
    address_info TEXT,
    remark VARCHAR(200),
    items TEXT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 购物车表
CREATE TABLE IF NOT EXISTS cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    pic VARCHAR(500),
    quantity INT NOT NULL DEFAULT 1,
    created_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 收货地址表
CREATE TABLE IF NOT EXISTS address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(50),
    detail VARCHAR(255) NOT NULL,
    is_default TINYINT(1) DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 菜单表
CREATE TABLE IF NOT EXISTS menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    menu_key VARCHAR(50) NOT NULL UNIQUE,
    url VARCHAR(200),
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_visible TINYINT(1) DEFAULT 1,
    created_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 角色菜单权限表
CREATE TABLE IF NOT EXISTS role_menu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(20) NOT NULL,
    menu_id BIGINT NOT NULL,
    created_at DATETIME,
    UNIQUE KEY uk_role_menu (role, menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 支付记录表
CREATE TABLE IF NOT EXISTS payment_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_no VARCHAR(50) NOT NULL UNIQUE COMMENT '支付流水号',
    order_id BIGINT NOT NULL COMMENT '关联订单ID',
    order_no VARCHAR(50) NOT NULL COMMENT '关联订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    pay_method VARCHAR(20) NOT NULL COMMENT '支付方式: wechat/alipay',
    amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '支付状态: pending/success/failed/refunded',
    transaction_id VARCHAR(100) DEFAULT NULL COMMENT '第三方支付流水号',
    callback_data TEXT COMMENT '支付回调原始数据',
    paid_at DATETIME DEFAULT NULL COMMENT '支付成功时间',
    created_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付记录表';

-- ===== 初始数据 =====

-- 管理员账号 (用户名: admin, 密码: admin123)
INSERT INTO users (username, password, nickname, role, status, created_at) VALUES
  ('admin', 'admin123', '系统管理员', 'admin', 1, NOW())
ON DUPLICATE KEY UPDATE nickname=VALUES(nickname);

-- 模块配置
INSERT INTO module_config (module_key, module_name, is_enabled, sort, icon, description) VALUES
  ('room', '房间预订', 1, 1, 'home', '农庄房间在线预订'),
  ('food', '在线点餐', 1, 2, 'utensils', '农庄特色菜品在线点餐'),
  ('product', '农产品商城', 1, 3, 'shopping-bag', '新鲜农产品在线购买'),
  ('fruit_tree', '果木租赁', 1, 4, 'tree-pine', '认养果木享受丰收'),
  ('plot', '地块租赁', 1, 5, 'map', '租一块地种自己的菜')
ON DUPLICATE KEY UPDATE module_name=VALUES(module_name);

-- 管理后台菜单
INSERT INTO menus (name, menu_key, url, icon, sort_order, is_visible) VALUES
  ('仪表盘', 'dashboard', '/admin/dashboard', '📊', 1, 1),
  ('房间管理', 'rooms', '/admin/rooms', '🏠', 2, 1),
  ('菜品管理', 'food', '/admin/food', '🍽️', 3, 1),
  ('农产品管理', 'products', '/admin/products', '🛍️', 4, 1),
  ('果木管理', 'fruit-trees', '/admin/fruit-trees', '🌳', 5, 1),
  ('地块管理', 'plots', '/admin/plots', '🗺️', 6, 1),
  ('订单管理', 'orders', '/admin/orders', '📋', 7, 1),
  ('用户管理', 'users', '/admin/users', '👥', 8, 1),
  ('模块配置', 'config', '/admin/config', '⚙️', 9, 1),
  ('菜单管理', 'menu', '/admin/menu', '📑', 10, 1),
  ('权限配置', 'permission', '/admin/permission', '🔐', 11, 1),
  ('支付记录', 'payments', '/admin/payments', '💳', 12, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name), url=VALUES(url), icon=VALUES(icon), sort_order=VALUES(sort_order);

-- admin 角色拥有所有菜单权限
INSERT INTO role_menu (role, menu_id, created_at)
SELECT 'admin', id, NOW() FROM menus
ON DUPLICATE KEY UPDATE role=VALUES(role);

-- operator 角色拥有基础业务菜单权限
INSERT INTO role_menu (role, menu_id, created_at)
SELECT 'operator', id, NOW() FROM menus WHERE menu_key IN ('dashboard', 'rooms', 'food', 'products', 'fruit-trees', 'plots', 'orders')
ON DUPLICATE KEY UPDATE role=VALUES(role);
