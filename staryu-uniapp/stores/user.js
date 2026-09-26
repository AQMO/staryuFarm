/**
 * 用户状态 store（纯 JS，不依赖 Vue）
 */

var state = {
  userInfo: null,
  userId: null,
  openid: null,
  nickname: '',
  avatar: '',
  phone: '',
  role: 'user',
  isLoggedIn: false,
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
    var info = uni.getStorageSync('userInfo')
    if (info) {
      var parsed = JSON.parse(info)
      state.userInfo = parsed
      state.userId = parsed.id || null
      state.openid = parsed.openid || null
      state.nickname = parsed.nickname || ''
      state.avatar = parsed.avatar || ''
      state.phone = parsed.phone || ''
      state.role = parsed.role || 'user'
      state.isLoggedIn = true
    }
  } catch(e) {}
}

function saveToStorage() {
  try {
    if (state.userInfo) {
      uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
    } else {
      uni.removeStorageSync('userInfo')
    }
  } catch(e) {}
}

function setUserInfo(info) {
  state.userInfo = info
  state.userId = info.id || null
  state.openid = info.openid || null
  state.nickname = info.nickname || ''
  state.avatar = info.avatar || ''
  state.phone = info.phone || ''
  state.role = info.role || 'user'
  state.isLoggedIn = true
  saveToStorage()
  notify()
}

function clearUser() {
  state.userInfo = null
  state.userId = null
  state.openid = null
  state.nickname = ''
  state.avatar = ''
  state.phone = ''
  state.role = 'user'
  state.isLoggedIn = false
  saveToStorage()
  notify()
}

function login(openid, nickname, avatar, phone) {
  var api = require('../api/index.js')
  state.loading = true
  return api.login(openid, nickname, avatar, phone).then(function(res) {
    if (res && res.data) {
      setUserInfo(res.data)
    }
    state.loading = false
    return res
  }).catch(function(err) {
    state.loading = false
    throw err
  })
}

module.exports = {
  get state() { return state },
  subscribe: subscribe,
  loadFromStorage: loadFromStorage,
  setUserInfo: setUserInfo,
  clearUser: clearUser,
  login: login
}
