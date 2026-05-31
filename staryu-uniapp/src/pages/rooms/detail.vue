<template>
  <view class="page">
    <view class="page-header">
      <text class="back-btn" @tap="goBack">‹</text>
      <text class="title">房间详情</text>
    </view>
    <view v-if="room">
      <image :src="room.pic" mode="aspectFill" class="detail-img" />
      <view class="detail-info card">
        <text class="detail-name">{{ room.name }}</text>
        <view class="detail-tags">
          <text class="tag tag-green">{{ room.capacity }}人</text>
          <text class="tag tag-blue" v-if="room.stock > 0">可订</text>
          <text class="tag tag-red" v-else>已满</text>
        </view>
        <view class="divider"></view>
        <view class="detail-row">
          <text class="text-gray">价格</text>
          <text class="price">
            <text class="symbol">¥</text>
            <text class="amount">{{ room.price }}</text>
            <text class="text-gray" style="font-size:24rpx;margin-left:8rpx">/晚</text>
          </text>
        </view>
        <view class="detail-row" v-if="room.facility">
          <text class="text-gray">设施</text>
          <text>{{ room.facility }}</text>
        </view>
        <view class="detail-row" v-if="room.stock">
          <text class="text-gray">剩余</text>
          <text>{{ room.stock }} 间</text>
        </view>
        <view class="divider"></view>
        <view v-if="room.description">
          <text class="desc-title">房间介绍</text>
          <text class="desc-content">{{ room.description }}</text>
        </view>
      </view>
      <view class="bottom-bar">
        <text class="price">
          <text class="symbol">¥</text>
          <text class="amount">{{ room.price }}</text>
          <text class="text-gray" style="font-size:24rpx;color:#fff;margin-left:8rpx">/晚</text>
        </text>
        <view class="btn btn-primary book-btn" @tap="handleBook">立即预订</view>
      </view>
    </view>
    <view v-else class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRoom } from '@/api'
import type { Room } from '@/api/types'

const room = ref<Room | null>(null)

function goBack() {
  uni.navigateBack()
}

function handleBook() {
  if (!room.value) return
  if (room.value.stock <= 0) {
    uni.showToast({ title: '房间已满', icon: 'none' })
    return
  }
  uni.showToast({ title: '预订功能开发中', icon: 'none' })
}

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const id = currentPage.options?.id
  if (id) {
    try {
      const res = await getRoom(Number(id))
      room.value = res.data
    } catch (e) {
      console.error('Failed to load room', e)
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
