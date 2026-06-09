<template>
  <view class="page">
    <view class="page-header">
      <text class="title">个人中心</text>
    </view>
    <view class="profile-card card" v-if="user">
      <view class="avatar-box">
        <image :src="user.avatar || '/static/avatar-default.png'" mode="aspectFill" class="avatar" />
      </view>
      <text class="nickname">{{ user.nickname || '未登录' }}</text>
      <text class="text-gray">{{ user.phone || '' }}</text>
    </view>
    <view class="profile-card card" v-else @tap="goLogin">
      <view class="avatar-box">
        <view class="avatar avatar-placeholder">
          <text style="font-size:40rpx;color:#9ca3af">👤</text>
        </view>
      </view>
      <text class="nickname">点击登录</text>
    </view>
    <view class="menu-list">
      <view class="menu-item card" @tap="goPage('/pages/orders/index')">
        <text>📋 我的订单</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item card">
        <text>📍 收货地址</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item card">
        <text>📞 联系客服</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item card">
        <text>ℹ️ 关于我们</text>
        <text class="arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../../stores/user.js'

const userStore = useUserStore()
const user = computed(() => userStore.userInfo)

function goLogin() {
  uni.showToast({ title: '登录功能开发中', icon: 'none' })
}

function goPage(url) {
  uni.navigateTo({ url })
}
</script>

<style scoped>
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24rpx;
  padding: 40rpx;
}

.avatar-box {
  margin-bottom: 20rpx;
}

.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 70rpx;
}

.avatar-placeholder {
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nickname {
  font-size: 34rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8rpx;
}

.menu-list {
  margin: 0 24rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  margin-bottom: 16rpx;
  font-size: 28rpx;
}

.arrow {
  color: #d1d5db;
  font-size: 32rpx;
}
</style>
