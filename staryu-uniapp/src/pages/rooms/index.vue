<template>
  <view class="page">
    <view class="page-header">
      <text class="title">房间预订</text>
    </view>
    <view class="room-list" v-if="rooms.length > 0">
      <view
        v-for="room in rooms"
        :key="room.id"
        class="room-card card"
        @tap="goDetail(room.id)"
      >
        <image :src="room.pic" mode="aspectFill" class="room-img" />
        <view class="room-info">
          <text class="room-name">{{ room.name }}</text>
          <view class="room-tags">
            <text class="tag tag-green">{{ room.capacity }}人</text>
            <text class="tag tag-blue" v-if="room.stock > 0">可订</text>
            <text class="tag tag-red" v-else>已满</text>
          </view>
          <text class="room-facility text-gray" v-if="room.facility">{{ room.facility }}</text>
          <view class="flex-between">
            <text class="price">
              <text class="symbol">¥</text>
              <text class="amount">{{ room.price }}</text>
              <text class="text-gray" style="font-size:24rpx;margin-left:8rpx">/晚</text>
            </text>
            <view class="btn btn-sm btn-primary" @tap.stop="goDetail(room.id)">预订</view>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="empty-state">
      <text class="icon">🏠</text>
      <text class="text">暂无房间</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRooms } from '@/api'
import type { Room } from '@/api/types'

const rooms = ref<Room[]>([])

function goDetail(id: number) {
  uni.navigateTo({ url: `/pages/rooms/detail?id=${id}` })
}

onMounted(async () => {
  try {
    const res = await getRooms()
    rooms.value = res.data || []
  } catch (e) {
    console.error('Failed to load rooms', e)
  }
})
</script>

<style scoped>
.room-card {
  display: flex;
  flex-direction: row;
  margin-bottom: 20rpx;
  padding: 20rpx;
}

.room-img {
  width: 240rpx;
  height: 200rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
}

.room-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.room-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12rpx;
}

.room-tags {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.room-facility {
  font-size: 24rpx;
  margin-bottom: 12rpx;
}
</style>
