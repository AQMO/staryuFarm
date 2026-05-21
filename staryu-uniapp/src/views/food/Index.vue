<template>
  <div class="page food-page">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">&larr;</span>
      <h1>在线点餐</h1>
    </div>
    <div class="food-content">
      <div class="category-sidebar">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="category-item"
          :class="{ active: selectedCat === cat.id }"
          @click="selectedCat = cat.id"
        >
          {{ cat.name }}
        </div>
      </div>
      <div class="food-list">
        <div v-if="filteredFoods.length === 0" class="empty-state"><p>暂无菜品</p></div>
        <div v-for="food in filteredFoods" :key="food.id" class="food-item">
          <div class="food-img">
            <img v-if="food.pic" :src="food.pic" alt="" />
            <div v-else class="img-ph">🍽️</div>
          </div>
          <div class="food-info">
            <h4>{{ food.name }}</h4>
            <p class="food-desc">{{ food.description || '' }}</p>
            <div class="food-bottom">
              <span class="price">¥{{ food.price }}</span>
              <div class="qty-ctrl">
                <button v-if="getQty(food.id) > 0" @click="removeFood(food.id)">-</button>
                <span v-if="getQty(food.id) > 0">{{ getQty(food.id) }}</span>
                <button @click="addFood(food)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="cartStore.count > 0" class="cart-bar" @click="showCart = true">
      <div class="cart-info">
        <span class="cart-icon">🛒</span>
        <span>¥{{ cartStore.total }}</span>
      </div>
      <button class="btn btn-primary btn-sm" @click.stop="submitOrder">去结算({{ cartStore.count }})</button>
    </div>
    <div v-if="showCart" class="cart-overlay" @click="showCart = false">
      <div class="cart-panel" @click.stop>
        <h3>购物车</h3>
        <div v-for="(item, i) in cartStore.items" :key="i" class="cart-item">
          <span class="cart-name">{{ item.name }}</span>
          <span class="cart-price">¥{{ item.price }}</span>
          <div class="qty-ctrl">
            <button @click="cartStore.updateQuantity(i, item.quantity - 1)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(i, item.quantity + 1)">+</button>
          </div>
        </div>
        <div class="cart-total">合计: ¥{{ cartStore.total }}</div>
        <button class="btn btn-primary btn-block" @click="submitOrder">提交订单</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFoods, getFoodCategories, createOrder } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import type { Food, FoodCategory } from '@/api/types'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const categories = ref<FoodCategory[]>([])
const foods = ref<Food[]>([])
const selectedCat = ref(0)
const showCart = ref(false)

const filteredFoods = computed(() => {
  if (!selectedCat.value) return foods.value
  return foods.value.filter((f) => f.categoryId === selectedCat.value)
})

function getQty(foodId: number): number {
  const item = cartStore.items.find((i) => i.productId === foodId && i.type === 'food')
  return item ? item.quantity : 0
}

function addFood(food: Food) {
  cartStore.addItem({
    productId: food.id,
    name: food.name,
    price: food.price,
    pic: food.pic,
    type: 'food',
  })
}

function removeFood(foodId: number) {
  const idx = cartStore.items.findIndex((i) => i.productId === foodId && i.type === 'food')
  if (idx >= 0) cartStore.updateQuantity(idx, cartStore.items[idx].quantity - 1)
}

async function submitOrder() {
  const info = userStore.userInfo as Record<string, unknown> | null
  if (!info) { router.push('/profile'); return }
  try {
    for (const item of cartStore.items) {
      await createOrder({
        userId: info.id as number,
        orderType: 'food',
        itemId: item.productId,
        itemName: item.name,
        totalAmount: item.price * item.quantity,
        quantity: item.quantity,
        status: 0,
      })
    }
    cartStore.clear()
    showCart.value = false
    alert('下单成功！')
    router.push('/orders')
  } catch (e) {
    console.error(e)
    alert('下单失败')
  }
}

onMounted(async () => {
  try {
    const [catRes, foodRes] = await Promise.all([getFoodCategories(), getFoods()])
    categories.value = (catRes as unknown as { data: FoodCategory[] }).data || []
    foods.value = (foodRes as unknown as { data: Food[] }).data || []
    if (categories.value.length > 0) selectedCat.value = categories.value[0].id
  } catch (e) { console.error(e) }
})
</script>

<style scoped>
.food-content { display: flex; min-height: calc(100vh - 60px - 56px); }
.category-sidebar { width: 80px; background: #f3f4f6; flex-shrink: 0; }
.category-item { padding: 14px 8px; text-align: center; font-size: 13px; cursor: pointer; color: #6b7280; }
.category-item.active { background: white; color: #16a34a; font-weight: 600; border-left: 3px solid #16a34a; }
.food-list { flex: 1; padding: 8px 12px; }
.food-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
.food-img { width: 70px; height: 70px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
.food-img img { width: 100%; height: 100%; object-fit: cover; }
.img-ph { width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.food-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.food-info h4 { font-size: 14px; }
.food-desc { font-size: 11px; color: #9ca3af; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.food-bottom { display: flex; justify-content: space-between; align-items: center; }
.price { color: #dc2626; font-size: 16px; font-weight: 700; }
.qty-ctrl { display: flex; align-items: center; gap: 6px; }
.qty-ctrl button { width: 22px; height: 22px; border-radius: 50%; border: none; background: #16a34a; color: white; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.qty-ctrl span { font-size: 13px; min-width: 16px; text-align: center; }
.cart-bar { position: fixed; bottom: 56px; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: #333; color: white; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; z-index: 99; }
.cart-icon { margin-right: 6px; }
.cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; }
.cart-panel { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: white; border-radius: 16px 16px 0 0; padding: 20px; max-height: 60vh; overflow-y: auto; }
.cart-panel h3 { font-size: 16px; margin-bottom: 12px; }
.cart-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
.cart-name { flex: 1; font-size: 14px; }
.cart-price { color: #dc2626; font-size: 14px; }
.cart-total { text-align: right; font-size: 16px; font-weight: 700; margin: 12px 0; }
</style>
