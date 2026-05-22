-- 星语农庄数据库初始化脚本
-- 使用方法: mysql -u root -p < init-db.sql

CREATE DATABASE IF NOT EXISTS staryu_farm DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE staryu_farm;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(50),
    phone VARCHAR(20),
    avatar VARCHAR(500),
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

-- 初始模块配置数据
INSERT INTO module_config (module_key, module_name, is_enabled, sort, icon, description) VALUES
  ('room', '房间预订', 1, 1, 'home', '农庄房间在线预订'),
  ('food', '在线点餐', 1, 2, 'utensils', '农庄特色菜品在线点餐'),
  ('product', '农产品商城', 1, 3, 'shopping-bag', '新鲜农产品在线购买'),
  ('fruit_tree', '果木租赁', 1, 4, 'tree-pine', '认养果木享受丰收'),
  ('plot', '地块租赁', 1, 5, 'map', '租一块地种自己的菜')
ON DUPLICATE KEY UPDATE module_name=VALUES(module_name);
