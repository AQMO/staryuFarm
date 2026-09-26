/**
 * 购物车 store（纯 JS，不依赖 Vue）
 */

var STORAGE_KEY = 'cartItems'

var state = {
  items: [],
  loading: false
}

var listeners = []

function notify() {
  for (var i = 0; i < listeners.length; i++) {
    listeners[i]()
  }
}

function subscribe(fn) {
  listeners.push(fn)
  return function() {
    var idx = listeners.indexOf(fn)
    if (idx > -1) listeners.splice(idx, 1)
  }
}

function loadFromStorage() {
  try {
    var data = uni.getStorageSync(STORAGE_KEY)
    if (data) state.items = JSON.parse(data)
  } catch(e) {}
}

function saveToStorage() {
  try {
    uni.setStorageSync(STORAGE_KEY, JSON.stringify(state.items))
  } catch(e) {}
}

function addToCart(product) {
  var found = null
  for (var i = 0; i < state.items.length; i++) {
    if (state.items[i].id === product.id) {
      found = state.items[i]
      break
    }
  }
  if (found) {
    found.quantity = (found.quantity || 1) + 1
  } else {
    state.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      pic: product.pic || '',
      quantity: 1,
      unit: product.unit || '份'
    })
  }
  saveToStorage()
  notify()
}

function removeFromCart(productId) {
  var newItems = []
  for (var i = 0; i < state.items.length; i++) {
    if (state.items[i].id !== productId) {
      newItems.push(state.items[i])
    }
  }
  state.items = newItems
  saveToStorage()
  notify()
}

function updateQuantity(productId, quantity) {
  for (var i = 0; i < state.items.length; i++) {
    if (state.items[i].id === productId) {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }
      state.items[i].quantity = quantity
      break
    }
  }
  saveToStorage()
  notify()
}

function clearCart() {
  state.items = []
  saveToStorage()
  notify()
}

function getTotalCount() {
  var total = 0
  for (var i = 0; i < state.items.length; i++) {
    total += state.items[i].quantity || 0
  }
  return total
}

function getTotalPrice() {
  var total = 0
  for (var i = 0; i < state.items.length; i++) {
    total += (state.items[i].price || 0) * (state.items[i].quantity || 0)
  }
  return total
}

module.exports = {
  get state() { return state },
  subscribe: subscribe,
  loadFromStorage: loadFromStorage,
  addToCart: addToCart,
  removeFromCart: removeFromCart,
  updateQuantity: updateQuantity,
  clearCart: clearCart,
  getTotalCount: getTotalCount,
  getTotalPrice: getTotalPrice
}
