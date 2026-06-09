// uni-app 请求封装
const BASE_URL = ''

function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('userInfo')
          uni.reLaunch({ url: '/pages/profile/index' })
          reject(new Error('未登录'))
        } else {
          reject(new Error('请求失败: ' + res.statusCode))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

// ============ 房间 ============
export const getRooms = () => request({ url: '/api/rooms' })
export const getRoom = (id) => request({ url: '/api/rooms/' + id })

// ============ 菜品 ============
export const getFoods = () => request({ url: '/api/food' })
export const getFoodCategories = () => request({ url: '/api/food-category' })

// ============ 农产品 ============
export const getProducts = () => request({ url: '/api/products' })
export const getProduct = (id) => request({ url: '/api/products/' + id })
export const getProductCategories = () => request({ url: '/api/product-category' })

// ============ 果木 ============
export const getFruitTrees = () => request({ url: '/api/fruit-trees' })

// ============ 地块 ============
export const getPlots = () => request({ url: '/api/plots' })

// ============ 订单 ============
export const getOrders = (params) => request({ url: '/api/orders', data: params })
export const createOrder = (data) => request({ url: '/api/orders', method: 'POST', data })

// ============ 购物车 ============
export const getCart = (userId) => request({ url: '/api/cart', data: { userId } })
export const addToCart = (data) => request({ url: '/api/cart', method: 'POST', data })
export const updateCartItem = (id, data) => request({ url: '/api/cart/' + id, method: 'PUT', data })
export const deleteCartItem = (id) => request({ url: '/api/cart/' + id, method: 'DELETE' })

// ============ 用户 ============
export const getUsers = () => request({ url: '/api/users' })
export const login = (data) => request({ url: '/api/users/login', method: 'POST', data })

// ============ 地址 ============
export const getAddresses = (userId) => request({ url: '/api/address', data: { userId } })
export const addAddress = (data) => request({ url: '/api/address', method: 'POST', data })
export const updateAddress = (id, data) => request({ url: '/api/address/' + id, method: 'PUT', data })
export const deleteAddress = (id) => request({ url: '/api/address/' + id, method: 'DELETE' })

// ============ 配置 ============
export const getModuleConfig = () => request({ url: '/api/config' })

// ============ 统计 ============
export const getStats = () => request({ url: '/api/stats' })

// ============ 支付 ============
export const createPayment = (data) =>
  request({ url: '/api/payments/create', method: 'POST', data })
export const simulatePay = (paymentNo) =>
  request({ url: '/api/payments/simulate-pay', method: 'POST', data: { paymentNo } })
export const getPaymentStatus = (paymentNo) =>
  request({ url: '/api/payments/status/' + paymentNo })
export const getPaymentByOrder = (orderId) =>
  request({ url: '/api/payments/order/' + orderId })
