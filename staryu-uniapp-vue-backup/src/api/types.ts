// Common entity types for API responses

export interface ModuleItem {
  id: number
  moduleKey: string
  moduleName: string
  isEnabled: boolean
  sort: number
  icon: string
  description: string
  updatedAt?: string | null
}

export interface Room {
  id: number
  name: string
  price: number
  pic: string
  capacity: number
  facility?: string | null
  stock: number
  status: number
  description?: string | null
  createdAt?: string
  updatedAt?: string | null
}

export interface FoodCategory {
  id: number
  name: string
  sort?: number
  createdAt?: string
}

export interface Food {
  id: number
  name: string
  price: number
  pic: string
  categoryId: number
  description?: string | null
  status: number
  sales?: number
  createdAt?: string
}

export interface ProductCategory {
  id: number
  name: string
  sort?: number
  createdAt?: string
}

export interface Product {
  id: number
  name: string
  price: number
  pic: string
  categoryId: number
  description?: string | null
  stock?: number
  sales?: number
  status: number
  createdAt?: string
}

export interface FruitTree {
  id: number
  name: string
  variety?: string | null
  pic: string
  annualRent: number
  description?: string | null
  status: number
  createdAt?: string
}

export interface Plot {
  id: number
  name: string
  area?: number | null
  pic: string
  annualRent: number
  description?: string | null
  status: number
  createdAt?: string
}

export interface Order {
  id: number
  userId: number
  orderType: string
  itemId: number
  itemName: string
  quantity?: number
  totalAmount: number
  status: number
  createdAt?: string
  updatedAt?: string | null
}

export interface User {
  id: number
  phone: string
  nickname?: string | null
  avatar?: string | null
  token?: string
}

export interface CartItemData {
  id?: number
  productId: number
  name: string
  price: number
  pic: string
  quantity: number
  type: 'food' | 'product'
}
