<template>
  <view class="page">
    <!-- 顶部 Banner -->
    <view class="header">
      <view class="header-bg"></view>
      <view class="header-content">
        <text class="app-title">星语农庄</text>
        <text class="app-subtitle">回归自然，享受田园生活</text>
      </view>
    </view>

    <!-- 功能模块 -->
    <view class="module-grid">
      <view
        v-for="mod in enabledModules"
        :key="mod.moduleKey"
        class="module-item"
        @tap="navigateTo(mod.moduleKey)"
      >
        <view class="module-icon" :class="'icon-' + mod.moduleKey">
          <text class="icon-text">{{ iconMap[mod.moduleKey] || '📦' }}</text>
        </view>
        <text class="module-name">{{ mod.moduleName }}</text>
        <text class="module-desc">{{ mod.description }}</text>
      </view>
    </view>

    <!-- 热门推荐 -->
    <view class="section">
      <text class="section-title">热门房间</text>
      <view class="room-list" v-if="rooms.length > 0">
        <view
          v-for="room in rooms.slice(0, 3)"
          :key="room.id"
          class="room-card card"
          @tap="goRoomDetail(room.id)"
        >
          <image :src="room.pic" mode="aspectFill" class="room-img" />
          <view class="room-info">
            <text class="room-name">{{ room.name }}</text>
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
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getModuleConfig, getRooms } from '../../api/index.js'
import { useConfigStore } from '../../stores/config.js'

const configStore = useConfigStore()
const rooms = ref([])

const iconMap = {
  room: '🏠',
  food: '🍽️',
  product: '🛒',
  fruit_tree: '🌳',
  plot: '🌱'
}

const enabledModules = computed(() => {
  return configStore.modules.filter(m => m.isEnabled).sort((a, b) => a.sort - b.sort)
})

function navigateTo(key) {
  const routeMap = {
    room: '/pages/rooms/index',
    food: '/pages/food/index',
    product: '/pages/shop/index',
    fruit_tree: '/pages/rent/index?type=fruit_tree',
    plot: '/pages/rent/index?type=plot'
  }
  const url = routeMap[key]
  if (url) {
    uni.navigateTo({ url })
  }
}

function goRoomDetail(id) {
  uni.navigateTo({ url: '/pages/rooms/detail?id=' + id })
}

onMounted(async () => {
  await configStore.loadConfig()
  try {
    const res = await getRooms()
    rooms.value = res.data || []
  } catch (e) {
    console.error('Failed to load rooms', e)
  }
})
</script>

<style scoped>
.header {
  position: relative;
  height: 360rpx;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
}

.header-content {
  position: relative;
  z-index: 1;
  padding: 100rpx 40rpx 40rpx;
  color: #ffffff;
}

.app-title {
  font-size: 52rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 12rpx;
}

.app-subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.module-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -40rpx 24rpx 24rpx;
  position: relative;
  z-index: 2;
}

.module-item {
  width: calc(33.33% - 20rpx);
  margin: 10rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.module-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  background: #f0fdf4;
}

.icon-text {
  font-size: 44rpx;
}

.module-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6rpx;
}

.module-desc {
  font-size: 20rpx;
  color: #9ca3af;
  text-align: center;
}

.section {
  margin: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24rpx;
  display: block;
}

.room-card {
  display: flex;
  flex-direction: row;
  margin-bottom: 20rpx;
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
