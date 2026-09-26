/**
 * 模块配置 store（纯 JS，不依赖 Vue）
 * 管理小程序首页各模块的显示/隐藏和排序
 */

var state = {
  modules: [],
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

function loadConfig() {
  if (state.loading) return
  state.loading = true
  var api = require('../api/index.js')
  api.getModuleConfig().then(function(res) {
    if (res && res.data) {
      state.modules = res.data
      try {
        uni.setStorageSync('moduleConfig', JSON.stringify(res.data))
      } catch(e) {}
    }
    state.loading = false
    notify()
  }).catch(function() {
    try {
      var cached = uni.getStorageSync('moduleConfig')
      if (cached) state.modules = JSON.parse(cached)
    } catch(e) {}
    state.loading = false
    notify()
  })
}

function getVisibleModules() {
  return state.modules.filter(function(m) { return m.isVisible === 1 })
    .sort(function(a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0) })
}

function init() {
  try {
    var cached = uni.getStorageSync('moduleConfig')
    if (cached) state.modules = JSON.parse(cached)
  } catch(e) {}
  loadConfig()
}

module.exports = {
  get state() { return state },
  subscribe: subscribe,
  loadConfig: loadConfig,
  getVisibleModules: getVisibleModules,
  init: init
}
