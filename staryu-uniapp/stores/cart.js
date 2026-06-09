import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, deleteCartItem as apiDeleteCartItem } from '../api/index.js'
import { useUserStore } from './user.js'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0))

  async function loadCart() {
    const userStore = useUserStore()
    if (!userStore.userId) return
    try {
      const res = await getCart(userStore.userId)
      items.value = res.data || []
    } catch (e) {
      console.error('Failed to load cart', e)
    }
  }

  async function addItem(data) {
    const userStore = useUserStore()
    if (!userStore.userId) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    try {
      await apiAddToCart({ ...data, userId: userStore.userId })
      await loadCart()
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    } catch (e) {
      console.error('Failed to add to cart', e)
    }
  }

  async function updateItem(id, data) {
    try {
      await apiUpdateCartItem(id, data)
      await loadCart()
    } catch (e) {
      console.error('Failed to update cart item', e)
    }
  }

  async function removeItem(id) {
    try {
      await apiDeleteCartItem(id)
      await loadCart()
    } catch (e) {
      console.error('Failed to delete cart item', e)
    }
  }

  return { items, totalCount, totalPrice, loadCart, addItem, updateItem, removeItem }
})
