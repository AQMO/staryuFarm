<template>
  <view class="page">
    <view class="page-header">
      <text class="title">收银台</text>
    </view>

    <!-- 订单信息 -->
    <view class="order-info card">
      <view class="order-row">
        <text class="label">订单号</text>
        <text class="value">{{ order.orderNo }}</text>
      </view>
      <view class="order-row">
        <text class="label">商品</text>
        <text class="value">{{ order.itemName }}</text>
      </view>
      <view class="order-row">
        <text class="label">数量</text>
        <text class="value">x{{ order.quantity }}</text>
      </view>
      <view class="divider"></view>
      <view class="order-row">
        <text class="label total-label">应付金额</text>
        <text class="price">
          <text class="symbol">¥</text>
          <text class="amount">{{ order.totalPrice || order.totalAmount }}</text>
        </text>
      </view>
    </view>

    <!-- 支付方式选择 -->
    <view class="pay-methods card">
      <text class="section-title">选择支付方式</text>

      <view class="method-item" :class="{ active: payMethod === 'wechat' }" @tap="payMethod = 'wechat'">
        <view class="method-left">
          <text class="method-icon wechat-icon">💬</text>
          <view class="method-info">
            <text class="method-name">微信支付</text>
            <text class="method-desc">推荐使用微信支付</text>
          </view>
        </view>
        <view class="radio" :class="{ checked: payMethod === 'wechat' }">
          <text v-if="payMethod === 'wechat'" class="check-mark">✓</text>
        </view>
      </view>

      <view class="method-item" :class="{ active: payMethod === 'alipay' }" @tap="payMethod = 'alipay'">
        <view class="method-left">
          <text class="method-icon alipay-icon">🔵</text>
          <view class="method-info">
            <text class="method-name">支付宝支付</text>
            <text class="method-desc">支付宝安全支付</text>
          </view>
        </view>
        <view class="radio" :class="{ checked: payMethod === 'alipay' }">
          <text v-if="payMethod === 'alipay'" class="check-mark">✓</text>
        </view>
      </view>
    </view>

    <!-- 支付按钮 -->
    <view class="pay-footer">
      <view class="pay-total">
        <text class="pay-label">合计:</text>
        <text class="pay-price">¥{{ order.totalPrice || order.totalAmount }}</text>
      </view>
      <view class="pay-btn" :class="{ disabled: paying }" @tap="handlePay">
        <text class="pay-btn-text">{{ paying ? '支付中...' : '立即支付' }}</text>
      </view>
    </view>

    <!-- 支付结果弹窗 -->
    <view v-if="showResult" class="result-mask" @tap="showResult = false">
      <view class="result-popup" @tap.stop>
        <text class="result-icon">{{ paySuccess ? '✅' : '❌' }}</text>
        <text class="result-title">{{ paySuccess ? '支付成功' : '支付失败' }}</text>
        <text class="result-desc" v-if="paySuccess">订单 {{ order.orderNo }} 已支付成功</text>
        <text class="result-desc" v-else>{{ errorMsg }}</text>
        <view class="result-btn" @tap="handleResultClose">
          <text class="result-btn-text">{{ paySuccess ? '查看订单' : '重新支付' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createPayment, simulatePay } from '@/api'
import type { Order } from '@/api/types'

const order = ref<Order>({} as Order)
const payMethod = ref('wechat')
const paying = ref(false)
const showResult = ref(false)
const paySuccess = ref(false)
const errorMsg = ref('')
const paymentNo = ref('')
const orderId = ref(0)

onMounted(() => {
  // 从页面参数获取订单信息
  try {
    const pages = getCurrentPages()
    const cur = pages[pages.length - 1] as any
    const opts = cur?.$page?.options || cur?.options || {}
    if (opts.order) {
      order.value = JSON.parse(decodeURIComponent(opts.order))
      orderId.value = order.value.id
    }
  } catch (e) {
    console.error('解析订单数据失败', e)
  }
})

function handlePay() {
  if (paying.value) return
  paying.value = true

  createPayment({ orderId: order.value.id, payMethod: payMethod.value })
    .then((res: any) => {
      if (res.error) {
        paying.value = false
        errorMsg.value = res.error
        paySuccess.value = false
        showResult.value = true
        return
      }
      paymentNo.value = res.paymentNo || res.data?.paymentNo

      // 模拟支付（开发环境）
      // 生产环境: 此处应调用微信/支付宝 SDK 发起真实支付
      return simulatePay(paymentNo.value)
    })
    .then((res: any) => {
      paying.value = false
      if (res) {
        if (res.success || res.data?.status === 'success') {
          paySuccess.value = true
        } else {
          paySuccess.value = false
          errorMsg.value = res.error || '支付失败，请重试'
        }
        showResult.value = true
      }
    })
    .catch((err: any) => {
      paying.value = false
      paySuccess.value = false
      errorMsg.value = '网络异常，请重试'
      showResult.value = true
    })
}

function handleResultClose() {
  if (paySuccess.value) {
    uni.redirectTo({ url: '/pages/orders/index' })
  } else {
    showResult.value = false
  }
}
</script>

<style scoped>
.page { background: #f5f5f5; min-height: 100vh; padding-bottom: 140rpx; }
.page-header { background: #16a34a; padding: 60rpx 32rpx 32rpx; }
.title { color: #fff; font-size: 36rpx; font-weight: bold; }
.card { margin: 20rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 28rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04); }

.order-info .order-row { display: flex; justify-content: space-between; align-items: center; padding: 12rpx 0; }
.order-info .label { color: #6b7280; font-size: 28rpx; }
.order-info .value { color: #1f2937; font-size: 28rpx; }
.total-label { font-weight: bold; color: #1f2937 !important; }
.price { color: #ef4444; }
.symbol { font-size: 28rpx; }
.amount { font-size: 40rpx; font-weight: bold; }
.divider { height: 1rpx; background: #e5e7eb; margin: 16rpx 0; }

.section-title { font-size: 30rpx; font-weight: bold; color: #1f2937; margin-bottom: 24rpx; display: block; }

.method-item { display: flex; justify-content: space-between; align-items: center; padding: 28rpx 20rpx; border: 2rpx solid #e5e7eb; border-radius: 16rpx; margin-bottom: 20rpx; transition: all 0.2s; }
.method-item.active { border-color: #16a34a; background: #f0fdf4; }

.method-left { display: flex; align-items: center; gap: 20rpx; }
.method-icon { font-size: 48rpx; width: 80rpx; height: 80rpx; display: flex; align-items: center; justify-content: center; border-radius: 16rpx; }
.wechat-icon { background: #e8f8ee; }
.alipay-icon { background: #e8f0fe; }

.method-info { display: flex; flex-direction: column; gap: 4rpx; }
.method-name { font-size: 30rpx; font-weight: bold; color: #1f2937; }
.method-desc { font-size: 24rpx; color: #9ca3af; }

.radio { width: 40rpx; height: 40rpx; border-radius: 50%; border: 2rpx solid #d1d5db; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.radio.checked { background: #16a34a; border-color: #16a34a; }
.check-mark { color: #fff; font-size: 24rpx; font-weight: bold; }

.pay-footer { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 20rpx 32rpx; box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: center; z-index: 100; }
.pay-total { display: flex; align-items: baseline; gap: 8rpx; }
.pay-label { font-size: 28rpx; color: #6b7280; }
.pay-price { font-size: 40rpx; font-weight: bold; color: #ef4444; }

.pay-btn { background: #16a34a; border-radius: 44rpx; padding: 20rpx 60rpx; }
.pay-btn.disabled { background: #9ca3af; }
.pay-btn-text { color: #fff; font-size: 30rpx; font-weight: bold; }

/* 支付结果弹窗 */
.result-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.result-popup { background: #fff; border-radius: 24rpx; padding: 60rpx 48rpx; text-align: center; width: 560rpx; }
.result-icon { font-size: 80rpx; display: block; margin-bottom: 24rpx; }
.result-title { font-size: 36rpx; font-weight: bold; color: #1f2937; display: block; margin-bottom: 16rpx; }
.result-desc { font-size: 26rpx; color: #6b7280; display: block; margin-bottom: 40rpx; }
.result-btn { background: #16a34a; border-radius: 44rpx; padding: 20rpx 0; }
.result-btn-text { color: #fff; font-size: 30rpx; font-weight: bold; }
</style>
