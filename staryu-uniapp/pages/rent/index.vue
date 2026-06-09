<template>
  <view class="page">
    <view class="page-header">
      <text class="title">租赁中心</text>
    </view>
    <view class="type-tabs">
      <view class="tab-item" :class="{ active: activeType === 'fruit_tree' }" @tap="activeType = 'fruit_tree'">
        <text>🌳 果木租赁</text>
      </view>
      <view class="tab-item" :class="{ active: activeType === 'plot' }" @tap="activeType = 'plot'">
        <text>🌱 地块租赁</text>
      </view>
    </view>
    <view v-if="activeType === 'fruit_tree'">
      <view v-if="fruitTrees.length > 0" class="item-list">
        <view v-for="tree in fruitTrees" :key="tree.id" class="item-card card">
          <image :src="tree.pic" mode="aspectFill" class="item-img" />
          <view class="item-info">
            <text class="item-name">{{ tree.name }}</text>
            <text class="text-gray" style="font-size:24rpx">{{ tree.variety }}</text>
            <view class="flex-between">
              <text class="price">
                <text class="symbol">¥</text>
                <text class="amount">{{ tree.price }}</text>
                <text class="text-gray" style="font-size:24rpx;margin-left:8rpx">/年</text>
              </text>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="icon">🌳</text>
        <text class="text">暂无果木</text>
      </view>
    </view>
    <view v-else>
      <view v-if="plots.length > 0" class="item-list">
        <view v-for="plot in plots" :key="plot.id" class="item-card card">
          <image :src="plot.pic" mode="aspectFill" class="item-img" />
          <view class="item-info">
            <text class="item-name">{{ plot.name }}</text>
            <text class="text-gray" style="font-size:24rpx">{{ plot.area }}㎡</text>
            <view class="flex-between">
              <text class="price">
                <text class="symbol">¥</text>
                <text class="amount">{{ plot.price }}</text>
                <text class="text-gray" style="font-size:24rpx;margin-left:8rpx">/季</text>
              </text>
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

<script setup>
import { ref, onMounted } from 'vue'
import { getFruitTrees, getPlots } from '../../api/index.js'

const fruitTrees = ref([])
const plots = ref([])
const activeType = ref('fruit_tree')

onMounted(async () => {
  try {
    const [treeRes, plotRes] = await Promise.all([getFruitTrees(), getPlots()])
    fruitTrees.value = treeRes.data || []
    plots.value = plotRes.data || []
  } catch (e) {
    console.error('Failed to load rent data', e)
  }
})
</script>

<style scoped>
.type-tabs {
  display: flex;
  padding: 20rpx 24rpx;
  gap: 16rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  border-radius: 16rpx;
  background: #f3f4f6;
  font-size: 28rpx;
}

.tab-item.active {
  background: #16a34a;
  color: #ffffff;
}

.item-card {
  display: flex;
  flex-direction: row;
  margin: 16rpx 24rpx;
  padding: 20rpx;
}

.item-img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
}
</style>
