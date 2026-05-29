<template>
  <view class="page">
    <view class="page-header">
      <text class="title">农产品商城</text>
    </view>
    <!-- 分类标签 -->
    <scroll-view scroll-x class="category-tabs" v-if="categories.length > 0">
      <view
        class="tab-item"
        :class="{ active: activeCategory === 0 }"
        @tap="activeCategory = 0"
      >
        <text>全部</text>
      </view>
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="tab-item"
        :class="{ active: activeCategory === cat.id }"
        @tap="activeCategory = cat.id"
      >
        <text>{{ cat.name }}</text>
      </view>
    </scroll-view>
    <!-- 产品网格 -->
    <view class="product-grid" v-if="filteredProducts.length > 0">
      <view
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card card"
        @tap="goDetail(product.id)"
      >
        <image :src="product.pic" mode="aspectFill" class="product-img" />
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-unit text-gray" v-if="product.unit">{{ product.unit }}</text>
          <view class="flex-between">
            <text class="price">
              <text class="symbol">¥</text>
              <text class="amount">{{ product.price }}</text>
            </text>
            <view class="btn btn-sm btn-primary" @tap.stop="handleAdd(product)">加入购物车</view>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="empty-state">
      <text class="icon">🛒</text>
      <text class="text">暂无产品</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getProducts, getProductCategories } from '@/api'
import { useCartStore } from '@/stores/cart'
import type { Product, ProductCategory } from '@/api/types'

const cartStore = useCartStore()
const products = ref<Product[]>([])
const categories = ref<ProductCategory[]>([])
const activeCategory = ref<number>(0)

const filteredProducts = computed(() => {
  if (!activeCategory.value) return products.value
  return products.value.filter(p => p.categoryId === activeCategory.value)
})

function goDetail(id: number) {
  uni.navigateTo({ url: `/pages/shop/detail?id=${id}` })
}

function handleAdd(product: Product) {
  cartStore.addItem({
    type: 'product',
    itemId: product.id,
    itemName: product.name,
    itemPic: product.pic,
    itemPrice: product.price,
    quantity: 1
  })
}

onMounted(async () => {
  try {
    const [productsRes, catsRes] = await Promise.all([getProducts(), getProductCategories()])
    products.value = productsRes.data || []
    categories.value = catsRes.data || []
  } catch (e) {
    console.error('Failed to load products', e)
  }
})
</script>

<style scoped>
.category-tabs {
  white-space: nowrap;
  padding: 16rpx 24rpx;
  background: #ffffff;
}

.tab-item {
  display: inline-block;
  padding: 12rpx 32rpx;
  margin-right: 16rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #6b7280;
  background: #f3f4f6;
}

.tab-item.active {
  background: #16a34a;
  color: #ffffff;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 12rpx;
}

.product-card {
  width: calc(50% - 24rpx);
  margin: 12rpx;
  padding: 0;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 300rpx;
}

.product-info {
  padding: 16rpx 20rpx 20rpx;
}

.product-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-unit {
  font-size: 22rpx;
  margin-bottom: 12rpx;
  display: block;
}
</style>
