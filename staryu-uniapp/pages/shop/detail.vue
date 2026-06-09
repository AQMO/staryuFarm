<template>
  <view class="page" v-if="product">
    <image :src="product.pic" mode="aspectFill" class="detail-img" />
    <view class="detail-body">
      <text class="detail-name">{{ product.name }}</text>
      <text class="price" style="margin-bottom:20rpx">
        <text class="symbol">¥</text>
        <text class="amount">{{ product.price }}</text>
      </text>
      <view class="divider"></view>
      <text class="desc-title">商品详情</text>
      <text class="desc-content">{{ product.description }}</text>
    </view>
    <view class="bottom-bar">
      <text class="price">
        <text class="symbol">¥</text>
        <text class="amount">{{ product.price }}</text>
      </text>
      <view class="btn btn-primary book-btn" @tap="handleBuy">立即购买</view>
    </view>
  </view>
  <view v-else class="loading"><text>加载中...</text></view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProduct } from '../../api/index.js'

const product = ref(null)

function handleBuy() {
  uni.showToast({ title: '购买功能开发中', icon: 'none' })
}

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
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
  margin-bottom: 16rpx;
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
