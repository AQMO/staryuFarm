import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error('API Error:', err)
    return Promise.reject(err)
  }
)

// ========== Config ==========
export const getConfig = () => api.get('/config')
export const updateConfig = (id: number, data: Record<string, unknown>) => api.put(`/config/${id}`, data)

// ========== Rooms ==========
export const getRooms = () => api.get('/rooms')
export const getRoom = (id: number) => api.get(`/rooms/${id}`)
export const createRoom = (data: Record<string, unknown>) => api.post('/rooms', data)
export const updateRoom = (id: number, data: Record<string, unknown>) => api.put(`/rooms/${id}`, data)
export const deleteRoom = (id: number) => api.delete(`/rooms/${id}`)

// ========== Food ==========
export const getFoods = (categoryId?: number) => api.get('/food', { params: { categoryId } })
export const getFood = (id: number) => api.get(`/food/${id}`)
export const createFood = (data: Record<string, unknown>) => api.post('/food', data)
export const updateFood = (id: number, data: Record<string, unknown>) => api.put(`/food/${id}`, data)
export const deleteFood = (id: number) => api.delete(`/food/${id}`)

// ========== Food Category ==========
export const getFoodCategories = () => api.get('/food-category')
export const createFoodCategory = (data: Record<string, unknown>) => api.post('/food-category', data)
export const updateFoodCategory = (id: number, data: Record<string, unknown>) => api.put(`/food-category/${id}`, data)
export const deleteFoodCategory = (id: number) => api.delete(`/food-category/${id}`)

// ========== Products ==========
export const getProducts = (categoryId?: number) => api.get('/products', { params: { categoryId } })
export const getProduct = (id: number) => api.get(`/products/${id}`)
export const createProduct = (data: Record<string, unknown>) => api.post('/products', data)
export const updateProduct = (id: number, data: Record<string, unknown>) => api.put(`/products/${id}`, data)
export const deleteProduct = (id: number) => api.delete(`/products/${id}`)

// ========== Product Category ==========
export const getProductCategories = () => api.get('/product-category')
export const createProductCategory = (data: Record<string, unknown>) => api.post('/product-category', data)
export const updateProductCategory = (id: number, data: Record<string, unknown>) => api.put(`/product-category/${id}`, data)
export const deleteProductCategory = (id: number) => api.delete(`/product-category/${id}`)

// ========== Fruit Trees ==========
export const getFruitTrees = () => api.get('/fruit-trees')
export const getFruitTree = (id: number) => api.get(`/fruit-trees/${id}`)
export const createFruitTree = (data: Record<string, unknown>) => api.post('/fruit-trees', data)
export const updateFruitTree = (id: number, data: Record<string, unknown>) => api.put(`/fruit-trees/${id}`, data)
export const deleteFruitTree = (id: number) => api.delete(`/fruit-trees/${id}`)

// ========== Plots ==========
export const getPlots = () => api.get('/plots')
export const getPlot = (id: number) => api.get(`/plots/${id}`)
export const createPlot = (data: Record<string, unknown>) => api.post('/plots', data)
export const updatePlot = (id: number, data: Record<string, unknown>) => api.put(`/plots/${id}`, data)
export const deletePlot = (id: number) => api.delete(`/plots/${id}`)

// ========== Orders ==========
export const getOrders = (params?: Record<string, unknown>) => api.get('/orders', { params })
export const getOrder = (id: number) => api.get(`/orders/${id}`)
export const createOrder = (data: Record<string, unknown>) => api.post('/orders', data)
export const updateOrder = (id: number, data: Record<string, unknown>) => api.put(`/orders/${id}`, data)

// ========== Cart ==========
export const getCart = (userId: number) => api.get('/cart', { params: { userId } })
export const addToCart = (data: Record<string, unknown>) => api.post('/cart', data)
export const updateCartItem = (id: number, data: Record<string, unknown>) => api.put(`/cart/${id}`, data)
export const deleteCartItem = (id: number) => api.delete(`/cart/${id}`)
export const clearCart = (userId: number) => api.delete('/cart', { params: { userId } })

// ========== Users ==========
export const login = (data: Record<string, unknown>) => api.post('/users/login', data)
export const register = (data: Record<string, unknown>) => api.post('/users', data)
export const getUser = (id: number) => api.get(`/users/${id}`)
export const updateUser = (id: number, data: Record<string, unknown>) => api.put(`/users/${id}`, data)

// ========== Address ==========
export const getAddresses = (userId: number) => api.get('/address', { params: { userId } })
export const createAddress = (data: Record<string, unknown>) => api.post('/address', data)
export const updateAddress = (id: number, data: Record<string, unknown>) => api.put(`/address/${id}`, data)
export const deleteAddress = (id: number) => api.delete(`/address/${id}`)

// ========== Stats ==========
export const getStats = () => api.get('/stats')

export default api
