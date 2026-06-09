<template>
  <view class="page">
    <view class="page-header">
      <text class="title">我的订单</text>
    </view>
    <view v-if="orders.length > 0" class="order-list">
      <view v-for="order in orders" :key="order.id" class="order-card card">
        <view class="order-header">
          <text class="order-no">{{ order.orderNo }}</text>
          <text class="order-status" :class="'status-' + order.status">{{ statusMap[order.status] || order.status }}</text>
        </view>
        <view class="order-body">
          <text class="order-item">{{ order.itemName || order.items }}</text>
          <view class="order-footer">
            <text class="price">
              <text class="symbol">¥</text>
              <text class="amount">{{ order.totalAmount || order.totalPrice }}</text>
            </text>
            <view v-if="order.payMethod" class="pay-tag" :class="'pay-' + order.payMethod">
              {{ order.payMethod === 'wechat' ? '微信支付' : '支付宝' }}
            </view>
          </view>
        </view>
        <view class="order-actions">
          <view v-if="order.status === 'pending'" class="btn btn-primary btn-sm" @tap="goPay(order)">去支付</view>
        </view>
      </view>
    </view>
    <view v-else class="empty-state">
      <text class="icon">📋</text>
      <text class="text">暂无订单</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrders } from '../../api/index.js'

const orders = ref([])
const statusMap = {
  pending: '待支付',
  paid: '已支付',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款'
}

function goPay(order) {
  uni.navigateTo({ url: '/pages/payment/index?id=' + order.id })
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
.order-card {
  margin: 16rpx 24rpx;
  padding: 24rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.order-no {
  font-size: 24rpx;
  color: #9ca3af;
}

.order-status {
  font-size: 24rpx;
  font-weight: 600;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.status-pending {
  color: #f59e0b;
  background: #fef3c7;
}

.status-paid {
  color: #16a34a;
  background: #dcfce7;
}

.status-completed {
  color: #3b82f6;
  background: #dbeafe;
}

.status-cancelled, .status-refunded {
  color: #6b7280;
  background: #f3f4f6;
}

.order-body {
  margin-bottom: 16rpx;
}

.order-item {
  font-size: 28rpx;
  color: #111827;
  margin-bottom: 12rpx;
  display: block;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pay-tag {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.pay-wechat {
  color: #16a34a;
  background: #dcfce7;
}

.pay-alipay {
  color: #3b82f6;
  background: #dbeafe;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-sm {
  padding: 8rpx 32rpx;
  font-size: 24rpx;
  border-radius: 32rpx;
}
</style>
