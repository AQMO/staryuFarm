<template>
  <div class="page">
    <div class="page-header"><h1>我的订单</h1></div>
    <div class="tabs">
      <span v-for="t in statusTabs" :key="t.value" :class="{ active: currentStatus === t.value }" @click="currentStatus = t.value">{{ t.label }}</span>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="filteredOrders.length === 0" class="empty-state"><div class="icon">📋</div><p>暂无订单</p></div>
    <div v-else>
      <div v-for="o in filteredOrders" :key="o.id" class="card order-card">
        <div class="order-header">
          <span class="order-type">{{ typeLabel(o.orderType) }}</span>
          <span :class="['status', 'status-' + o.status]">{{ statusLabel(o.status) }}</span>
        </div>
        <h4>{{ o.itemName }}</h4>
        <div class="order-footer">
          <span class="amount">¥{{ o.totalAmount }}</span>
          <span class="time">{{ formatDate(o.createdAt) }}</span>
        </div>
        <div v-if="o.status === 0" class="order-actions">
          <button class="btn btn-primary btn-sm" @click="payOrder(o.id)">支付</button>
          <button class="btn btn-outline btn-sm" @click="cancelOrder(o.id)">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getOrders, updateOrder } from '@/api'
import { useUserStore } from '@/stores/user'
import type { Order } from '@/api/types'

const userStore = useUserStore()
const orders = ref<Order[]>([])
const currentStatus = ref(-1)
const loading = ref(true)

const statusTabs = [
  { label: '全部', value: -1 },
  { label: '待支付', value: 0 },
  { label: '已支付', value: 1 },
  { label: '已完成', value: 2 },
  { label: '已取消', value: 3 },
]

const filteredOrders = computed(() => {
  if (currentStatus.value === -1) return orders.value
  return orders.value.filter((o) => o.status === currentStatus.value)
})

function typeLabel(type: string) {
  const map: Record<string, string> = { room: '房间预订', food: '在线点餐', product: '农产品', fruit_tree: '果木租赁', plot: '地块租赁' }
  return map[type] || type
}

function statusLabel(status: number) {
  const map: Record<number, string> = { 0: '待支付', 1: '已支付', 2: '已完成', 3: '已取消' }
  return map[status] || '未知'
}

function formatDate(d: string | null | undefined) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-CN')
}

async function payOrder(id: number) {
  try {
    await updateOrder(id, { status: 1 })
    orders.value = orders.value.map((o) => (o.id === id ? { ...o, status: 1 } : o))
    alert('支付成功！')
  } catch (e) { console.error(e) }
}

async function cancelOrder(id: number) {
  try {
    await updateOrder(id, { status: 3 })
    orders.value = orders.value.map((o) => (o.id === id ? { ...o, status: 3 } : o))
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  const info = userStore.userInfo as Record<string, unknown> | null
  if (!info) { loading.value = false; return }
  try {
    const res = (await getOrders({ userId: info.id as number })) as unknown as { data: Order[]; total: number }
    orders.value = res.data || []
  } catch (e) { console.error(e) } finally { loading.value = false }
})
</script>

<style scoped>
.tabs { display: flex; gap: 0; background: white; border-bottom: 1px solid #e5e7eb; }
.tabs span { flex: 1; text-align: center; padding: 10px 4px; font-size: 13px; cursor: pointer; color: #6b7280; }
.tabs span.active { color: #16a34a; font-weight: 600; border-bottom: 2px solid #16a34a; }
.order-card { padding: 14px; }
.order-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.order-type { font-size: 12px; color: #16a34a; background: #dcfce7; padding: 2px 8px; border-radius: 10px; }
.status { font-size: 12px; }
.status-0 { color: #ea580c; }
.status-1 { color: #16a34a; }
.status-2 { color: #6b7280; }
.status-3 { color: #9ca3af; }
h4 { font-size: 15px; margin-bottom: 6px; }
.order-footer { display: flex; justify-content: space-between; align-items: center; }
.amount { color: #dc2626; font-weight: 700; }
.time { font-size: 12px; color: #9ca3af; }
.order-actions { display: flex; gap: 8px; margin-top: 10px; justify-content: flex-end; }
</style>
