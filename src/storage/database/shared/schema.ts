import { pgTable, serial, varchar, integer, numeric, text, timestamp, boolean, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// System health check table (DO NOT DELETE)
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// ============== User System ==============

export const users = pgTable("users", {
  id: serial().primaryKey(),
  openid: varchar("openid", { length: 128 }).notNull().unique(),
  nickname: varchar("nickname", { length: 50 }),
  avatar: varchar("avatar", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 20 }).notNull().default("user"), // user | admin
  status: integer("status").notNull().default(1), // 1: active, 0: disabled
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("users_openid_idx").on(table.openid),
  index("users_role_idx").on(table.role),
]);

// ============== Module Config (Switch Control) ==============

export const moduleConfig = pgTable("module_config", {
  id: serial().primaryKey(),
  module_key: varchar("module_key", { length: 50 }).notNull().unique(), // room, food, product, fruit_tree, plot
  module_name: varchar("module_name", { length: 50 }).notNull(),
  is_enabled: boolean("is_enabled").notNull().default(true),
  sort: integer("sort").notNull().default(0),
  icon: varchar("icon", { length: 100 }),
  description: varchar("description", { length: 255 }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("module_config_key_idx").on(table.module_key),
]);

// ============== Room Booking Module ==============

export const rooms = pgTable("rooms", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  pic: varchar("pic", { length: 255 }).notNull(),
  capacity: integer("capacity").notNull(),
  facility: varchar("facility", { length: 255 }),
  stock: integer("stock").notNull(),
  status: integer("status").notNull().default(1), // 1: active, 0: disabled
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("rooms_status_idx").on(table.status),
]);

// ============== Food Ordering Module ==============

export const foodCategory = pgTable("food_category", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  sort: integer("sort").default(0),
  status: integer("status").notNull().default(1),
  remark: varchar("remark", { length: 255 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("food_category_status_idx").on(table.status),
]);

export const food = pgTable("food", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  category_id: integer("category_id").notNull().references(() => foodCategory.id),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  pic: varchar("pic", { length: 255 }),
  stock: integer("stock").notNull(),
  status: integer("status").notNull().default(1),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("food_category_id_idx").on(table.category_id),
  index("food_status_idx").on(table.status),
]);

// ============== Agricultural Products Module ==============

export const productCategory = pgTable("product_category", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  sort: integer("sort").default(0),
  status: integer("status").notNull().default(1),
  pic: varchar("pic", { length: 255 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("product_category_status_idx").on(table.status),
]);

export const products = pgTable("products", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  category_id: integer("category_id").notNull().references(() => productCategory.id),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  original_price: numeric("original_price", { precision: 10, scale: 2 }),
  pic: varchar("pic", { length: 255 }),
  pics: text("pics"), // JSON array of image URLs
  stock: integer("stock").notNull(),
  sales: integer("sales").notNull().default(0),
  unit: varchar("unit", { length: 20 }).default("份"),
  status: integer("status").notNull().default(1),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("products_category_id_idx").on(table.category_id),
  index("products_status_idx").on(table.status),
]);

// ============== Address ==============

export const address = pgTable("address", {
  id: serial().primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  province: varchar("province", { length: 50 }),
  city: varchar("city", { length: 50 }),
  district: varchar("district", { length: 50 }),
  detail: varchar("detail", { length: 255 }).notNull(),
  is_default: boolean("is_default").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("address_user_id_idx").on(table.user_id),
]);

// ============== Fruit Tree Leasing Module ==============

export const fruitTrees = pgTable("fruit_trees", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  pic: varchar("pic", { length: 255 }).notNull(),
  pics: text("pics"),
  stock: integer("stock").notNull(),
  lease_period: integer("lease_period").notNull(), // lease period in days
  variety: varchar("variety", { length: 50 }),
  location: varchar("location", { length: 100 }),
  expected_harvest: varchar("expected_harvest", { length: 100 }),
  status: integer("status").notNull().default(1),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("fruit_trees_status_idx").on(table.status),
]);

// ============== Plot Leasing Module ==============

export const plots = pgTable("plots", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  pic: varchar("pic", { length: 255 }).notNull(),
  pics: text("pics"),
  area: numeric("area", { precision: 10, scale: 2 }).notNull(), // area in square meters
  stock: integer("stock").notNull(),
  lease_period: integer("lease_period").notNull(), // lease period in days
  location: varchar("location", { length: 100 }),
  soil_type: varchar("soil_type", { length: 50 }),
  status: integer("status").notNull().default(1),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("plots_status_idx").on(table.status),
]);

// ============== Orders (Unified) ==============

export const orders = pgTable("orders", {
  id: serial().primaryKey(),
  order_no: varchar("order_no", { length: 32 }).notNull().unique(),
  user_id: integer("user_id").notNull().references(() => users.id),
  order_type: varchar("order_type", { length: 20 }).notNull(), // room, food, product, fruit_tree, plot
  total_amount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, paid, confirmed, completed, cancelled, refunded
  contact_name: varchar("contact_name", { length: 50 }),
  contact_phone: varchar("contact_phone", { length: 20 }),
  address_id: integer("address_id").references(() => address.id),
  address_info: text("address_info"), // snapshot of address
  remark: varchar("remark", { length: 255 }),
  items: text("items").notNull(), // JSON array of order items
  paid_at: timestamp("paid_at", { withTimezone: true }),
  completed_at: timestamp("completed_at", { withTimezone: true }),
  cancelled_at: timestamp("cancelled_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("orders_order_no_idx").on(table.order_no),
  index("orders_user_id_idx").on(table.user_id),
  index("orders_order_type_idx").on(table.order_type),
  index("orders_status_idx").on(table.status),
  index("orders_created_at_idx").on(table.created_at),
]);

// ============== Cart ==============

export const cart = pgTable("cart", {
  id: serial().primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  item_type: varchar("item_type", { length: 20 }).notNull(), // food, product
  item_id: integer("item_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
  index("cart_user_id_idx").on(table.user_id),
  index("cart_item_type_idx").on(table.item_type),
]);
