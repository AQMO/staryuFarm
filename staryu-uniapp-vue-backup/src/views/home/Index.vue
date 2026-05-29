<template>
  <div class="page">
    <div class="page-header">
      <h1>星语农庄</h1>
    </div>
    <div class="banner">
      <div class="banner-text">
        <h2>欢迎来到星语农庄</h2>
        <p>体验田园生活，享受自然馈赠</p>
      </div>
    </div>
    <div class="module-grid">
      <div
        v-for="m in enabledModules"
        :key="m.moduleKey"
        class="module-card"
        @click="goModule(m.moduleKey)"
      >
        <div class="module-icon">{{ iconMap[m.icon] || '📦' }}</div>
        <div class="module-name">{{ m.moduleName }}</div>
        <div class="module-desc">{{ m.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/config'

const router = useRouter()
const configStore = useConfigStore()

const iconMap: Record<string, string> = {
  home: '🏡',
  utensils: '🍽️',
  'shopping-bag': '🛍️',
  'tree-pine': '🌳',
  map: '🗺️',
}

const enabledModules = computed(() =>
  configStore.modules.filter((m) => m.isEnabled).sort((a, b) => a.sort - b.sort)
)

function goModule(key: string) {
  const routeMap: Record<string, string> = {
    room: '/rooms',
    food: '/food',
    product: '/shop',
    fruit_tree: '/rent',
    plot: '/rent',
  }
  router.push(routeMap[key] || '/')
}
</script>

<style scoped>
.banner {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  margin: 12px;
  border-radius: 12px;
  padding: 24px 20px;
  color: white;
}
.banner h2 { font-size: 20px; margin-bottom: 6px; }
.banner p { font-size: 13px; opacity: 0.85; }

.module-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 12px;
}
.module-card {
  background: white;
  border-radius: 12px;
  padding: 16px 10px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: transform 0.2s;
}
.module-card:active { transform: scale(0.96); }
.module-icon { font-size: 32px; margin-bottom: 6px; }
.module-name { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px; }
.module-desc { font-size: 11px; color: #9ca3af; line-height: 1.3; }
</style>
