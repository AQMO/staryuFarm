<template>
  <view class="page">
    <view class="page-header">
      <text class="title">我的订单</text>
    </view>
    <!-- 订单类型切换 -->
    <view class="order-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @tap="activeTab = tab.key"
      >
        <text>{{ tab.name }}</text>
      </view>
    </view>
    <!-- 订单列表 -->
    <view v-if="filteredOrders.length > 0">
      <view v-for="order in filteredOrders" :key="order.id" class="order-card card">
        <view class="flex-between mb-20">
          <text class="order-no text-gray">订单号: {{ order.orderNo }}</text>
          <text class="tag" :class="statusTagClass(order.status)">{{ statusText(order.status) }}</text>
        </view>
        <view class="flex-row">
          <text class="order-item-name">{{ order.itemName }}</text>
          <text class="text-gray" style="margin-left:16rpx">x{{ order.quantity }}</text>
          <text v-if="order.payMethod" class="pay-tag" :class="order.payMethod === 'wechat' ? 'pay-wechat' : 'pay-alipay'">
            {{ order.payMethod === 'wechat' ? '微信' : '支付宝' }}
          </text>
        </view>
        <view class="divider"></view>
        <view class="flex-between">
          <text class="price">
            <text class="symbol">¥</text>
            <text class="amount">{{ order.totalPrice }}</text>
          </text>
          <view class="order-actions">
            <text class="text-hint" style="font-size:24rpx">{{ formatDate(order.createdAt) }}</text>
            <view v-if="order.status === 'pending'" class="pay-btn-small" @tap.stop="goPay(order)">
              <text class="pay-btn-text">去支付</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="empty-state">
      <text class="icon">📋</text>
      <text class="text">暂无订单</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getOrders } from '@/api'
import type { Order } from '@/api/types'

const orders = ref<Order[]>([])
const activeTab = ref('all')

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'room', name: '房间' },
  { key: 'food', name: '点餐' },
  { key: 'product', name: '商城' },
  { key: 'fruit_tree', name: '果木' },
  { key: 'plot', name: '地块' }
]

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(o => o.type === activeTab.value)
})

function statusText(status: string): string {
  const map: Record<string, string> = { pending: '待支付', paid: '已支付', completed: '已完成', cancelled: '已取消' }
  return map[status] || '未知'
}

function statusTagClass(status: string): string {
  const map: Record<string, string> = { pending: 'tag-orange', paid: 'tag-blue', completed: 'tag-green', cancelled: 'tag-gray' }
  return map[status] || 'tag-gray'
}

function goPay(order: Order) {
  const orderStr = encodeURIComponent(JSON.stringify(order))
  uni.navigateTo({ url: `/pages/payment/index?order=${orderStr}` })
}

function formatDate(createdAt: any): string {
  if (!createdAt) return ''
  if (Array.isArray(createdAt)) {
    const [y, m, d, h, min] = createdAt
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
  }
  return String(createdAt).substring(0, 16)
}

onMounted(async () => {
  try {
    const res = await getOrders()
    orders.value = res.data || []
  } catch (e) {
    console.error('Failed to load orders', e)
  }
})
</script>

<style scoped>
.order-tabs {
  display: flex;
  flex-direction: row;
  background: #ffffff;
  padding: 16rpx 12rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.tab-item {
  padding: 14rpx 28rpx;
  margin: 0 8rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #6b7280;
  background: #f3f4f6;
  flex-shrink: 0;
}

.tab-item.active {
  background: #16a34a;
  color: #ffffff;
}

.order-card {
  margin-bottom: 20rpx;
}

.order-no {
  font-size: 24rpx;
}

.order-item-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.pay-btn-small {
  background: #16a34a;
  border-radius: 32rpx;
  padding: 8rpx 24rpx;
}

.pay-btn-text {
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
}

.pay-tag {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  margin-left: 12rpx;
}

.pay-wechat {
  background: #e8f8ee;
  color: #07c160;
}

.pay-alipay {
  background: #e8f0fe;
  color: #1677ff;
}
</style>
