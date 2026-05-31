<template>
  <view class="page">
    <view class="page-header">
      <text class="title">租赁中心</text>
    </view>
    <!-- 切换标签 -->
    <view class="type-tabs">
      <view class="tab-item" :class="{ active: activeType === 'fruit_tree' }" @tap="activeType = 'fruit_tree'">
        <text>🌳 果木租赁</text>
      </view>
      <view class="tab-item" :class="{ active: activeType === 'plot' }" @tap="activeType = 'plot'">
        <text>🌱 地块租赁</text>
      </view>
    </view>
    <!-- 果木列表 -->
    <view v-if="activeType === 'fruit_tree'" class="item-list">
      <view v-if="fruitTrees.length > 0">
        <view v-for="tree in fruitTrees" :key="tree.id" class="rent-card card">
          <image :src="tree.pic" mode="aspectFill" class="rent-img" />
          <view class="rent-info">
            <text class="rent-name">{{ tree.name }}</text>
            <view class="rent-tags">
              <text class="tag tag-green" v-if="tree.variety">{{ tree.variety }}</text>
              <text class="tag tag-orange" v-if="tree.age">{{ tree.age }}年树龄</text>
            </view>
            <text class="text-gray" style="font-size:24rpx" v-if="tree.leasePeriod">租期: {{ tree.leasePeriod }}</text>
            <view class="flex-between">
              <text class="price">
                <text class="symbol">¥</text>
                <text class="amount">{{ tree.price }}</text>
                <text class="text-gray" style="font-size:24rpx;margin-left:8rpx">/年</text>
              </text>
              <view class="btn btn-sm btn-primary">租赁</view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="icon">🌳</text>
        <text class="text">暂无果木</text>
      </view>
    </view>
    <!-- 地块列表 -->
    <view v-if="activeType === 'plot'" class="item-list">
      <view v-if="plots.length > 0">
        <view v-for="plot in plots" :key="plot.id" class="rent-card card">
          <image :src="plot.pic" mode="aspectFill" class="rent-img" />
          <view class="rent-info">
            <text class="rent-name">{{ plot.name }}</text>
            <view class="rent-tags">
              <text class="tag tag-blue" v-if="plot.area">{{ plot.area }}㎡</text>
              <text class="tag tag-green" v-if="plot.status === 1">可租</text>
              <text class="tag tag-red" v-else>已租</text>
            </view>
            <text class="text-gray" style="font-size:24rpx" v-if="plot.leasePeriod">租期: {{ plot.leasePeriod }}</text>
            <view class="flex-between">
              <text class="price">
                <text class="symbol">¥</text>
                <text class="amount">{{ plot.price }}</text>
                <text class="text-gray" style="font-size:24rpx;margin-left:8rpx">/年</text>
              </text>
              <view class="btn btn-sm btn-primary">租赁</view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="icon">🌱</text>
        <text class="text">暂无地块</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFruitTrees, getPlots } from '@/api'
import type { FruitTree, Plot } from '@/api/types'

const activeType = ref('fruit_tree')
const fruitTrees = ref<FruitTree[]>([])
const plots = ref<Plot[]>([])

onMounted(async () => {
  try {
    const [treesRes, plotsRes] = await Promise.all([getFruitTrees(), getPlots()])
    fruitTrees.value = treesRes.data || []
    plots.value = plotsRes.data || []
  } catch (e) {
    console.error('Failed to load rent data', e)
  }
})
</script>

<style scoped>
.type-tabs {
  display: flex;
  flex-direction: row;
  background: #ffffff;
  padding: 16rpx 24rpx;
  gap: 20rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  background: #f3f4f6;
  color: #6b7280;
}

.tab-item.active {
  background: #16a34a;
  color: #ffffff;
}

.rent-card {
  display: flex;
  flex-direction: row;
  margin-bottom: 20rpx;
  padding: 20rpx;
}

.rent-img {
  width: 220rpx;
  height: 200rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
}

.rent-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rent-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12rpx;
}

.rent-tags {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  margin-bottom: 12rpx;
}
</style>
