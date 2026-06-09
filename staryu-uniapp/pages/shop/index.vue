<template>
  <view class="page">
    <view class="page-header">
      <text class="title">农产品商城</text>
    </view>
    <view v-if="products.length > 0" class="product-grid">
      <view
        v-for="product in products"
        :key="product.id"
        class="product-card card"
        @tap="goDetail(product.id)"
      >
        <image :src="product.pic" mode="aspectFill" class="product-img" />
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="text-gray" style="font-size:22rpx">{{ product.description }}</text>
          <text class="price">
            <text class="symbol">¥</text>
            <text class="amount">{{ product.price }}</text>
          </text>
        </view>
      </view>
    </view>
    <view v-else class="empty-state">
      <text class="icon">🛒</text>
      <text class="text">暂无产品</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProducts } from '../../api/index.js'

const products = ref([])

function goDetail(id) {
  uni.navigateTo({ url: '/pages/shop/detail?id=' + id })
}

onMounted(async () => {
  try {
    const res = await getProducts()
    products.value = res.data || []
  } catch (e) {
    console.error('Failed to load products', e)
  }
})
</script>

<style scoped>
.product-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
}

.product-card {
  width: calc(50% - 16rpx);
  margin: 8rpx;
  overflow: hidden;
  padding: 0;
}

.product-img {
  width: 100%;
  height: 300rpx;
}

.product-info {
  padding: 20rpx;
}

.product-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
  display: block;
  margin-bottom: 8rpx;
}
</style>
