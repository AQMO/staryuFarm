import { reactive } from 'vue'

// Singleton reactive state
const state = reactive({
  userInfo: null,
  userId: 0,
  nickname: '',
  avatar: ''
})

function setUser(info) {
  state.userInfo = info
  state.userId = info.id || 0
  state.nickname = info.nickname || ''
  state.avatar = info.avatar || ''
  uni.setStorageSync('userInfo', JSON.stringify(info))
  uni.setStorageSync('userId', info.id || 0)
}

function loadFromStorage() {
  try {
    const stored = uni.getStorageSync('userInfo')
    if (stored) {
      const info = JSON.parse(stored)
      state.userInfo = info
      state.userId = info.id || 0
      state.nickname = info.nickname || ''
      state.avatar = info.avatar || ''
    }
    const storedId = uni.getStorageSync('userId')
    if (storedId) state.userId = storedId
  } catch (e) {
    console.error('Failed to load user from storage', e)
  }
}

function clearUser() {
  state.userInfo = null
  state.userId = 0
  state.nickname = ''
  state.avatar = ''
  uni.removeStorageSync('userInfo')
  uni.removeStorageSync('userId')
}

export function useUserStore() {
  return {
    get userInfo() {
      return state.userInfo
    },
    get userId() {
      return state.userId
    },
    get nickname() {
      return state.nickname
    },
    get avatar() {
      return state.avatar
    },
    setUser,
    loadFromStorage,
    clearUser
  }
}
