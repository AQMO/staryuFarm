<template>
  <view class="page">
    <view class="page-header">
      <text class="back-btn" @tap="goBack">‹</text>
      <text class="title">产品详情</text>
    </view>
    <view v-if="product">
      <image :src="product.pic" mode="aspectFill" class="detail-img" />
      <view class="detail-info card">
        <text class="detail-name">{{ product.name }}</text>
        <view class="detail-tags">
          <text class="tag tag-blue" v-if="product.unit">{{ product.unit }}</text>
          <text class="tag tag-green" v-if="product.stock > 0">有货</text>
          <text class="tag tag-red" v-else>缺货</text>
        </view>
        <view class="divider"></view>
        <view class="detail-row">
          <text class="text-gray">价格</text>
          <text class="price">
            <text class="symbol">¥</text>
            <text class="amount">{{ product.price }}</text>
          </text>
        </view>
        <view class="detail-row" v-if="product.categoryName">
          <text class="text-gray">分类</text>
          <text>{{ product.categoryName }}</text>
        </view>
        <view class="detail-row" v-if="product.stock">
          <text class="text-gray">库存</text>
          <text>{{ product.stock }}</text>
        </view>
        <view class="divider"></view>
        <view v-if="product.description">
          <text class="desc-title">产品介绍</text>
          <text class="desc-content">{{ product.description }}</text>
        </view>
      </view>
      <view class="bottom-bar">
        <text class="price">
          <text class="symbol">¥</text>
          <text class="amount">{{ product.price }}</text>
        </text>
        <view class="btn btn-primary book-btn" @tap="handleAddCart">加入购物车</view>
      </view>
    </view>
    <view v-else class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProduct } from '@/api'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/api/types'

const cartStore = useCartStore()
const product = ref<Product | null>(null)

function goBack() {
  uni.navigateBack()
}

function handleAddCart() {
  if (!product.value) return
  if (product.value.stock <= 0) {
    uni.showToast({ title: '暂无库存', icon: 'none' })
    return
  }
  cartStore.addItem({
    type: 'product',
    itemId: product.value.id,
    itemName: product.value.name,
    itemPic: product.value.pic,
    itemPrice: product.value.price,
    quantity: 1
  })
}

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const id = currentPage.options?.id
  if (id) {
    try {
      const res = await getProduct(Number(id))
      product.value = res.data
    } catch (e) {
      console.error('Failed to load product', e)
    }
  }
})
</script>

<style scoped>
.detail-img {
  width: 750rpx;
  height: 450rpx;
}

.detail-name {
  font-size: 38rpx;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20rpx;
}

.detail-tags {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
}

.desc-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16rpx;
  display: block;
}

.desc-content {
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.6;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.book-btn {
  padding: 20rpx 60rpx;
  border-radius: 40rpx;
}
</style>
