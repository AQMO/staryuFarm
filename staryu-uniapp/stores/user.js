import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const userId = ref(0)
  const nickname = ref('')
  const avatar = ref('')

  function setUser(info) {
    userInfo.value = info
    userId.value = info.id || 0
    nickname.value = info.nickname || ''
    avatar.value = info.avatar || ''
    uni.setStorageSync('userInfo', JSON.stringify(info))
    uni.setStorageSync('userId', info.id || 0)
  }

  function loadFromStorage() {
    try {
      const stored = uni.getStorageSync('userInfo')
      if (stored) {
        const info = JSON.parse(stored)
        userInfo.value = info
        userId.value = info.id || 0
        nickname.value = info.nickname || ''
        avatar.value = info.avatar || ''
      }
      const storedId = uni.getStorageSync('userId')
      if (storedId) userId.value = storedId
    } catch (e) {
      console.error('Failed to load user from storage', e)
    }
  }

  function clearUser() {
    userInfo.value = null
    userId.value = 0
    nickname.value = ''
    avatar.value = ''
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('userId')
  }

  return { userInfo, userId, nickname, avatar, setUser, loadFromStorage, clearUser }
})
