<template>
  <div class="page">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">&larr;</span>
      <h1>农产品商城</h1>
    </div>
    <div class="category-tabs">
      <span class="tab" :class="{ active: !selectedCat }" @click="selectedCat = 0">全部</span>
      <span
        v-for="cat in categories"
        :key="cat.id"
        class="tab"
        :class="{ active: selectedCat === cat.id }"
        @click="selectedCat = cat.id"
      >{{ cat.name }}</span>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="filteredProducts.length === 0" class="empty-state">
      <div class="icon">🛍️</div><p>暂无商品</p>
    </div>
    <div v-else class="product-grid">
      <div v-for="p in filteredProducts" :key="p.id" class="product-card" @click="goDetail(p.id)">
        <div class="product-img">
          <img v-if="p.pic" :src="p.pic" alt="" />
          <div v-else class="img-ph">🛍️</div>
        </div>
        <div class="product-info">
          <h4>{{ p.name }}</h4>
          <span class="price">¥{{ p.price }}</span>
          <span v-if="p.stock" class="stock">库存: {{ p.stock }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProducts, getProductCategories } from '@/api'
import type { Product, ProductCategory } from '@/api/types'

const router = useRouter()
const categories = ref<ProductCategory[]>([])
const products = ref<Product[]>([])
const selectedCat = ref(0)
const loading = ref(true)

const filteredProducts = computed(() => {
  if (!selectedCat.value) return products.value
  return products.value.filter((p) => p.categoryId === selectedCat.value)
})

function goDetail(id: number) {
  router.push(`/shop/${id}`)
}

onMounted(async () => {
  try {
    const [catRes, proRes] = await Promise.all([getProductCategories(), getProducts()])
    categories.value = (catRes as unknown as { data: ProductCategory[] }).data || []
    products.value = (proRes as unknown as { data: Product[] }).data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.category-tabs { display: flex; gap: 8px; padding: 12px; overflow-x: auto; }
.tab { padding: 6px 14px; border-radius: 20px; font-size: 13px; background: #f3f4f6; cursor: pointer; white-space: nowrap; }
.tab.active { background: #16a34a; color: white; }
.product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 0 12px; }
.product-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); cursor: pointer; }
.product-card:active { opacity: 0.9; }
.product-img { width: 100%; height: 120px; }
.product-img img { width: 100%; height: 100%; object-fit: cover; }
.img-ph { width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 32px; }
.product-info { padding: 10px; }
.product-info h4 { font-size: 14px; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.price { color: #dc2626; font-size: 16px; font-weight: 700; }
.stock { font-size: 11px; color: #9ca3af; margin-left: 6px; }
</style>
