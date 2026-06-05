// uni-app 请求封装
const BASE_URL = ''

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

interface ApiResponse<T = any> {
  data: T
  error?: string
  message?: string
}

function request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res: any) => {
        if (res.statusCode === 200) {
          resolve(res.data as ApiResponse<T>)
        } else if (res.statusCode === 401) {
          // 未登录，跳转登录页
          uni.removeStorageSync('userInfo')
          uni.reLaunch({ url: '/pages/profile/index' })
          reject(new Error('未登录'))
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (err: any) => {
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

// ============ 房间 ============
export const getRooms = () => request({ url: '/api/rooms' })
export const getRoom = (id: number) => request({ url: `/api/rooms/${id}` })

// ============ 菜品 ============
export const getFoods = () => request({ url: '/api/food' })
export const getFoodCategories = () => request({ url: '/api/food-category' })

// ============ 农产品 ============
export const getProducts = () => request({ url: '/api/products' })
export const getProduct = (id: number) => request({ url: `/api/products/${id}` })
export const getProductCategories = () => request({ url: '/api/product-category' })

// ============ 果木 ============
export const getFruitTrees = () => request({ url: '/api/fruit-trees' })

// ============ 地块 ============
export const getPlots = () => request({ url: '/api/plots' })

// ============ 订单 ============
export const getOrders = (params?: any) => request({ url: '/api/orders', data: params })
export const createOrder = (data: any) => request({ url: '/api/orders', method: 'POST', data })

// ============ 购物车 ============
export const getCart = (userId: number) => request({ url: '/api/cart', data: { userId } })
export const addToCart = (data: any) => request({ url: '/api/cart', method: 'POST', data })
export const updateCartItem = (id: number, data: any) => request({ url: `/api/cart/${id}`, method: 'PUT', data })
export const deleteCartItem = (id: number) => request({ url: `/api/cart/${id}`, method: 'DELETE' })

// ============ 用户 ============
export const getUsers = () => request({ url: '/api/users' })
export const login = (data: { code: string }) => request({ url: '/api/users/login', method: 'POST', data })

// ============ 地址 ============
export const getAddresses = (userId: number) => request({ url: '/api/address', data: { userId } })
export const addAddress = (data: any) => request({ url: '/api/address', method: 'POST', data })
export const updateAddress = (id: number, data: any) => request({ url: `/api/address/${id}`, method: 'PUT', data })
export const deleteAddress = (id: number) => request({ url: `/api/address/${id}`, method: 'DELETE' })

// ============ 配置 ============
export const getModuleConfig = () => request({ url: '/api/config' })

// ============ 统计 ============
export const getStats = () => request({ url: '/api/stats' })

// ============ 支付 ============
export const createPayment = (data: { orderId: number; payMethod: string }) =>
  request({ url: '/api/payments/create', method: 'POST', data })
export const simulatePay = (paymentNo: string) =>
  request({ url: '/api/payments/simulate-pay', method: 'POST', data: { paymentNo } })
export const getPaymentStatus = (paymentNo: string) =>
  request({ url: `/api/payments/status/${paymentNo}` })
export const getPaymentByOrder = (orderId: number) =>
  request({ url: `/api/payments/order/${orderId}` })
