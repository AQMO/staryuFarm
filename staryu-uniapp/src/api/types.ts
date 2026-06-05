// 通用类型定义
export interface Room {
  id: number
  name: string
  price: number
  pic: string
  capacity: number
  facility: string
  stock: number
  status: number
  description?: string
  createdAt?: string
}

export interface Food {
  id: number
  name: string
  price: number
  pic: string
  categoryId: number
  description?: string
  status: number
  categoryName?: string
}

export interface FoodCategory {
  id: number
  name: string
  sort: number
  icon?: string
}

export interface Product {
  id: number
  name: string
  price: number
  pic: string
  categoryId: number
  stock: number
  status: number
  description?: string
  unit: string
  categoryName?: string
}

export interface ProductCategory {
  id: number
  name: string
  sort: number
  icon?: string
}

export interface FruitTree {
  id: number
  name: string
  price: number
  pic: string
  variety: string
  age: number
  status: number
  description?: string
  leasePeriod?: string
}

export interface Plot {
  id: number
  name: string
  price: number
  pic: string
  area: number
  status: number
  description?: string
  leasePeriod?: string
}

export interface Order {
  id: number
  userId: number
  orderNo: string
  type: string
  itemId: number
  itemName: string
  quantity: number
  totalPrice: number
  totalAmount: number
  status: string
  payMethod?: string
  addressId?: number
  remark?: string
  createdAt?: string
}

export interface PaymentRecord {
  id: number
  paymentNo: string
  orderId: number
  orderNo: string
  userId: number
  payMethod: string
  amount: number
  status: string
  transactionId?: string
  paidAt?: string
  createdAt?: string
}

export interface CartItem {
  id: number
  userId: number
  type: string
  itemId: number
  itemName: string
  itemPic: string
  itemPrice: number
  quantity: number
}

export interface User {
  id: number
  openid?: string
  nickname: string
  avatar?: string
  phone?: string
  username?: string
  role?: string
  status?: number
}

export interface Address {
  id: number
  userId: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: number
}

export interface ModuleConfig {
  id: number
  moduleKey: string
  moduleName: string
  isEnabled: boolean
  sort: number
  icon: string
  description?: string
}
