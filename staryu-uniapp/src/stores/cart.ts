import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/api/types'
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, deleteCartItem as apiDeleteCartItem } from '@/api'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

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

  async function addItem(data: { type: string; itemId: number; itemName: string; itemPic: string; itemPrice: number; quantity: number }) {
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

  async function updateItem(id: number, data: any) {
    try {
      await apiUpdateCartItem(id, data)
      await loadCart()
    } catch (e) {
      console.error('Failed to update cart item', e)
    }
  }

  async function removeItem(id: number) {
    try {
      await apiDeleteCartItem(id)
      await loadCart()
    } catch (e) {
      console.error('Failed to remove cart item', e)
    }
  }

  return { items, totalCount, totalPrice, loadCart, addItem, updateItem, removeItem }
})
