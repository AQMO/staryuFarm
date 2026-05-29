<template>
  <view class="page">
    <view class="profile-header">
      <view class="avatar-wrap" @tap="handleLogin">
        <image
          v-if="userStore.avatar"
          :src="userStore.avatar"
          mode="aspectFill"
          class="avatar"
        />
        <view v-else class="avatar-placeholder">
          <text style="font-size:48rpx;color:#fff">{{ userStore.nickname ? userStore.nickname.charAt(0) : '👤' }}</text>
        </view>
      </view>
      <view class="user-info">
        <text class="nickname">{{ userStore.nickname || '点击登录' }}</text>
        <text class="user-id" v-if="userStore.userId">ID: {{ userStore.userId }}</text>
      </view>
    </view>
    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-item" @tap="goPage('/pages/orders/index')">
        <text class="menu-icon">📋</text>
        <text class="menu-text">我的订单</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="handleAddress">
        <text class="menu-icon">📍</text>
        <text class="menu-text">收货地址</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="handleAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
    <view class="menu-list" v-if="userStore.isLoggedIn()">
      <view class="menu-item" @tap="handleLogout">
        <text class="menu-icon">🚪</text>
        <text class="menu-text">退出登录</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

function handleLogin() {
  if (!userStore.isLoggedIn()) {
    uni.showToast({ title: '登录功能开发中', icon: 'none' })
  }
}

function goPage(url: string) {
  uni.navigateTo({ url })
}

function handleAddress() {
  uni.showToast({ title: '地址管理开发中', icon: 'none' })
}

function handleAbout() {
  uni.showModal({
    title: '关于星语农庄',
    content: '星语农庄 - 回归自然，享受田园生活',
    showCancel: false
  })
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    }
  })
}
</script>

<style scoped>
.profile-header {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  padding: 80rpx 40rpx 60rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.avatar-wrap {
  margin-right: 32rpx;
}

.avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 64rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
}

.avatar-placeholder {
  width: 128rpx;
  height: 128rpx;
  border-radius: 64rpx;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nickname {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
  display: block;
  margin-bottom: 8rpx;
}

.user-id {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.menu-list {
  margin: 24rpx;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 32rpx;
  border-bottom: 2rpx solid #f3f4f6;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 24rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #111827;
}

.menu-arrow {
  font-size: 32rpx;
  color: #d1d5db;
}
</style>
