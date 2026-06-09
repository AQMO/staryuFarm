<template>
  <view class="page">
    <view class="page-header">
      <text class="title">订单支付</text>
    </view>

    <!-- 订单信息 -->
    <view class="order-info card" v-if="order">
      <text class="info-label">订单号</text>
      <text class="info-value">{{ order.orderNo }}</text>
      <view class="divider" style="margin:20rpx 0"></view>
      <text class="info-label">商品</text>
      <text class="info-value">{{ order.itemName || order.items }}</text>
      <view class="divider" style="margin:20rpx 0"></view>
      <text class="info-label">支付金额</text>
      <text class="pay-amount">
        <text class="symbol">¥</text>
        <text class="amount">{{ order.totalAmount || order.totalPrice }}</text>
      </text>
    </view>

    <!-- 支付方式选择 -->
    <view class="section-title">选择支付方式</view>
    <view class="pay-methods">
      <view class="pay-method card" :class="{ active: payMethod === 'wechat' }" @tap="payMethod = 'wechat'">
        <view class="method-icon wechat-icon">
          <text>💳</text>
        </view>
        <view class="method-info">
          <text class="method-name">微信支付</text>
          <text class="method-desc">推荐使用微信支付</text>
        </view>
        <view class="method-check">
          <view v-if="payMethod === 'wechat'" class="check-active">✓</view>
          <view v-else class="check-default"></view>
        </view>
      </view>
      <view class="pay-method card" :class="{ active: payMethod === 'alipay' }" @tap="payMethod = 'alipay'">
        <view class="method-icon alipay-icon">
          <text>💰</text>
        </view>
        <view class="method-info">
          <text class="method-name">支付宝</text>
          <text class="method-desc">使用支付宝付款</text>
        </view>
        <view class="method-check">
          <view v-if="payMethod === 'alipay'" class="check-active">✓</view>
          <view v-else class="check-default"></view>
        </view>
      </view>
    </view>

    <!-- 支付按钮 -->
    <view class="pay-btn-wrap">
      <view class="btn btn-primary pay-btn" :class="{ disabled: paying }" @tap="handlePay">
        {{ paying ? '支付中...' : '确认支付 ¥' + (order ? (order.totalAmount || order.totalPrice) : '0') }}
      </view>
    </view>

    <!-- 支付结果弹窗 -->
    <view class="pay-result" v-if="showResult">
      <view class="result-card card">
        <text class="result-icon">{{ paySuccess ? '✅' : '❌' }}</text>
        <text class="result-title">{{ paySuccess ? '支付成功' : '支付失败' }}</text>
        <text class="result-desc" v-if="paySuccess">订单已支付完成</text>
        <text class="result-desc" v-else>{{ payErrorMsg }}</text>
        <view class="btn btn-primary result-btn" @tap="goBack">返回订单</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrder, createPayment, simulatePay } from '../../api/index.js'

const order = ref(null)
const payMethod = ref('wechat')
const paying = ref(false)
const showResult = ref(false)
const paySuccess = ref(false)
const payErrorMsg = ref('')

async function handlePay() {
  if (paying.value || !order.value) return
  paying.value = true

  try {
    // 1. 创建支付
    const createRes = await createPayment({
      orderId: order.value.id,
      payMethod: payMethod.value
    })

    if (!createRes.data) {
      payErrorMsg.value = createRes.error || '创建支付失败'
      paySuccess.value = false
      showResult.value = true
      paying.value = false
      return
    }

    const paymentNo = createRes.data.paymentNo

    // 2. 模拟支付（开发模式）
    const payRes = await simulatePay({ paymentNo })

    if (payRes.data) {
      paySuccess.value = true
    } else {
      paySuccess.value = false
      payErrorMsg.value = payRes.error || '支付失败'
    }
  } catch (e) {
    paySuccess.value = false
    payErrorMsg.value = '网络异常，请重试'
  }

  showResult.value = true
  paying.value = false
}

function goBack() {
  uni.navigateBack()
}

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const id = currentPage.options?.id
  if (id) {
    try {
      const res = await getOrder(Number(id))
      order.value = res.data
    } catch (e) {
      console.error('Failed to load order', e)
    }
  }
})
</script>

<style scoped>
.order-info {
  margin: 24rpx;
  padding: 32rpx;
}

.info-label {
  font-size: 24rpx;
  color: #9ca3af;
  display: block;
  margin-bottom: 8rpx;
}

.info-value {
  font-size: 28rpx;
  color: #111827;
  display: block;
}

.pay-amount {
  display: block;
  color: #ef4444;
  font-weight: 700;
}

.pay-amount .symbol {
  font-size: 28rpx;
}

.pay-amount .amount {
  font-size: 48rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  margin: 32rpx 24rpx 16rpx;
}

.pay-method {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 12rpx 24rpx;
  padding: 28rpx;
  border: 2rpx solid transparent;
}

.pay-method.active {
  border-color: #16a34a;
  background: #f0fdf4;
}

.method-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-right: 24rpx;
}

.wechat-icon {
  background: #dcfce7;
}

.alipay-icon {
  background: #dbeafe;
}

.method-info {
  flex: 1;
}

.method-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
  display: block;
  margin-bottom: 4rpx;
}

.method-desc {
  font-size: 24rpx;
  color: #9ca3af;
}

.method-check {
  margin-left: 20rpx;
}

.check-default {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  border: 2rpx solid #d1d5db;
}

.check-active {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-btn-wrap {
  margin: 48rpx 24rpx;
}

.pay-btn {
  text-align: center;
  padding: 28rpx 0;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
}

.pay-btn.disabled {
  opacity: 0.6;
}

.pay-result {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.result-card {
  width: 560rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  margin: 0;
}

.result-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 24rpx;
}

.result-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #111827;
  display: block;
  margin-bottom: 12rpx;
}

.result-desc {
  font-size: 26rpx;
  color: #9ca3af;
  display: block;
  margin-bottom: 40rpx;
}

.result-btn {
  padding: 20rpx 60rpx;
  border-radius: 40rpx;
  text-align: center;
}
</style>
