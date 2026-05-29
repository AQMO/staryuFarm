import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface CartItem {
  id?: number
  productId?: number
  name: string
  price: number
  pic?: string
  quantity: number
  type: 'food' | 'product'
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  function addItem(item: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find(
      (i) => i.productId === item.productId && i.type === item.type
    )
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...item, quantity: 1 })
    }
  }

  function removeItem(index: number) {
    items.value.splice(index, 1)
  }

  function updateQuantity(index: number, qty: number) {
    if (qty <= 0) {
      items.value.splice(index, 1)
    } else {
      items.value[index].quantity = qty
    }
  }

  function clear() {
    items.value = []
  }

  return { items, total, count, addItem, removeItem, updateQuantity, clear }
})
