<template>
  <div class="page">
    <div class="page-header"><h1>个人中心</h1></div>
    <div class="profile-card card">
      <div class="avatar">{{ initial }}</div>
      <div class="user-info">
        <h3>{{ userInfo?.nickname || userInfo?.username || '未登录' }}</h3>
        <p>{{ userInfo?.phone || '' }}</p>
      </div>
    </div>
    <div class="menu-list">
      <div class="menu-item" @click="$router.push('/orders')">
        <span>我的订单</span><span class="arrow">&gt;</span>
      </div>
      <div class="menu-item" @click="$router.push('/address')">
        <span>收货地址</span><span class="arrow">&gt;</span>
      </div>
      <div class="menu-item" @click="handleLogout">
        <span>退出登录</span><span class="arrow">&gt;</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo as Record<string, unknown> | null)
const initial = computed(() => {
  if (!userInfo.value) return '?'
  const name = (userInfo.value.nickname as string) || (userInfo.value.username as string) || '?'
  return name.charAt(0).toUpperCase()
})

function handleLogout() {
  userStore.logout()
  router.push('/home')
}
</script>

<style scoped>
.profile-card { display: flex; align-items: center; gap: 16px; padding: 20px; }
.avatar { width: 60px; height: 60px; border-radius: 50%; background: #16a34a; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; }
.user-info h3 { font-size: 16px; margin-bottom: 2px; }
.user-info p { font-size: 13px; color: #9ca3af; }
.menu-list { margin-top: 16px; background: white; border-radius: 12px; overflow: hidden; }
.menu-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; }
.menu-item:last-child { border-bottom: none; }
.menu-item:active { background: #f9fafb; }
.arrow { color: #d1d5db; }
</style>
