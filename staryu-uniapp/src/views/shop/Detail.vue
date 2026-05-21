<template>
  <div class="page">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">&larr;</span>
      <h1>商品详情</h1>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="product">
      <div class="product-banner">
        <img v-if="product.pic" :src="product.pic" alt="" />
        <div v-else class="img-ph">🛍️</div>
      </div>
      <div class="card">
        <h2>{{ product.name }}</h2>
        <p class="price">¥{{ product.price }}</p>
        <p v-if="product.stock" class="stock">库存: {{ product.stock }}</p>
        <p v-if="product.description" class="desc">{{ product.description }}</p>
      </div>
      <div class="bottom-bar">
        <button class="btn btn-outline" @click="addToCart">加入购物车</button>
        <button class="btn btn-primary" @click="buyNow">立即购买</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct, createOrder } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import type { Product } from '@/api/types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const product = ref<Product | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const id = route.params.id as string
    const res = (await getProduct(Number(id))) as { data: Product }
    product.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

function addToCart() {
  if (!product.value) return
  cartStore.addItem({
    productId: product.value.id,
    name: product.value.name,
    price: product.value.price,
    pic: product.value.pic,
    type: 'product',
  })
  alert('已加入购物车')
}

async function buyNow() {
  const info = userStore.userInfo as Record<string, unknown> | null
  if (!info) { router.push('/profile'); return }
  if (!product.value) return
  try {
    await createOrder({
      userId: info.id as number,
      orderType: 'product',
      itemId: product.value.id,
      itemName: product.value.name,
      totalAmount: product.value.price,
      status: 0,
    })
    alert('购买成功！')
    router.push('/orders')
  } catch (e) {
    console.error(e)
    alert('购买失败')
  }
}
</script>

<style scoped>
.product-banner { width: 100%; height: 260px; overflow: hidden; }
.product-banner img { width: 100%; height: 100%; object-fit: cover; }
.img-ph { width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 48px; }
h2 { font-size: 18px; margin-bottom: 8px; }
.price { color: #dc2626; font-size: 24px; font-weight: 700; margin-bottom: 4px; }
.stock { font-size: 13px; color: #9ca3af; margin-bottom: 8px; }
.desc { font-size: 14px; color: #6b7280; line-height: 1.6; padding-top: 8px; border-top: 1px solid #e5e7eb; }
.bottom-bar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: white; border-top: 1px solid #e5e7eb; padding: 12px 16px; display: flex; gap: 12px; z-index: 99; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0)); }
.bottom-bar .btn { flex: 1; }
</style>
