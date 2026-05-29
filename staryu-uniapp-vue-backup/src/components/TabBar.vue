<template>
  <div class="tabbar">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      class="tabbar-item"
      :class="{ active: isActive(tab.path) }"
      @click="navigate(tab.path)"
    >
      <span class="tabbar-icon">{{ tab.icon }}</span>
      <span class="tabbar-label">{{ tab.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/orders', label: '订单', icon: '📋' },
  { path: '/profile', label: '我的', icon: '👤' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function navigate(path: string) {
  router.push(path)
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 56px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  display: flex;
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom, 0);
}
.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s;
}
.tabbar-item.active { color: #16a34a; }
.tabbar-icon { font-size: 22px; line-height: 1; }
.tabbar-label { font-size: 10px; }
</style>
