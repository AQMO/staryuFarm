import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<Record<string, unknown> | null>(null)
  const token = ref('')

  const isLoggedIn = computed(() => !!userInfo.value)

  function setLogin(data: { user: Record<string, unknown>; token?: string }) {
    userInfo.value = data.user
    token.value = data.token || ''
    if (data.token) {
      localStorage.setItem('staryu_token', data.token)
    }
    localStorage.setItem('staryu_user', JSON.stringify(data.user))
  }

  function logout() {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('staryu_token')
    localStorage.removeItem('staryu_user')
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('staryu_user')
    if (saved) {
      try {
        userInfo.value = JSON.parse(saved)
        token.value = localStorage.getItem('staryu_token') || ''
      } catch {
        logout()
      }
    }
  }

  loadFromStorage()

  return { userInfo, token, isLoggedIn, setLogin, logout, loadFromStorage }
})
