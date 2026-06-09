<template>
  <view class="page">
    <view class="page-header">
      <text class="title">房间预订</text>
    </view>
    <view v-if="rooms.length > 0" class="room-list">
      <view
        v-for="room in rooms"
        :key="room.id"
        class="room-card card"
        @tap="goDetail(room.id)"
      >
        <image :src="room.pic" mode="aspectFill" class="room-img" />
        <view class="room-info">
          <text class="room-name">{{ room.name }}</text>
          <text class="text-gray">{{ room.facility }}</text>
          <view class="flex-between">
            <text class="price">
              <text class="symbol">¥</text>
              <text class="amount">{{ room.price }}</text>
              <text class="text-gray" style="font-size:24rpx;margin-left:8rpx">/晚</text>
            </text>
            <text class="tag tag-green">{{ room.capacity }}人</text>
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

<script setup>
import { ref, onMounted } from 'vue'
import { getRooms } from '../../api/index.js'

const rooms = ref([])

function goDetail(id) {
  uni.navigateTo({ url: '/pages/rooms/detail?id=' + id })
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
  margin: 20rpx 24rpx;
  padding: 20rpx;
}

.room-img {
  width: 200rpx;
  height: 160rpx;
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
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
}
</style>
