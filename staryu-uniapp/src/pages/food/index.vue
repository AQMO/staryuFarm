<template>
  <view class="page">
    <view class="page-header">
      <text class="title">在线点餐</text>
    </view>
    <view class="food-layout">
      <!-- 分类侧栏 -->
      <scroll-view scroll-y class="category-sidebar">
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="category-item"
          :class="{ active: activeCategory === cat.id }"
          @tap="activeCategory = cat.id"
        >
          <text>{{ cat.name }}</text>
        </view>
      </scroll-view>
      <!-- 菜品列表 -->
      <scroll-view scroll-y class="food-list">
        <view v-if="filteredFoods.length > 0">
          <view v-for="food in filteredFoods" :key="food.id" class="food-item card">
            <image :src="food.pic" mode="aspectFill" class="food-img" />
            <view class="food-info">
              <text class="food-name">{{ food.name }}</text>
              <text class="food-desc text-gray" v-if="food.description">{{ food.description }}</text>
              <view class="flex-between">
                <text class="price">
                  <text class="symbol">¥</text>
                  <text class="amount">{{ food.price }}</text>
                </text>
                <view class="btn btn-sm btn-primary" @tap="handleAdd(food)">加入购物车</view>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="empty-state">
          <text class="icon">🍽️</text>
          <text class="text">暂无菜品</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getFoods, getFoodCategories } from '@/api'
import { useCartStore } from '@/stores/cart'
import type { Food, FoodCategory } from '@/api/types'

const cartStore = useCartStore()
const foods = ref<Food[]>([])
const categories = ref<FoodCategory[]>([])
const activeCategory = ref<number>(0)

const filteredFoods = computed(() => {
  if (!activeCategory.value) return foods.value
  return foods.value.filter(f => f.categoryId === activeCategory.value)
})

function handleAdd(food: Food) {
  cartStore.addItem({
    type: 'food',
    itemId: food.id,
    itemName: food.name,
    itemPic: food.pic,
    itemPrice: food.price,
    quantity: 1
  })
}

onMounted(async () => {
  try {
    const [foodsRes, catsRes] = await Promise.all([getFoods(), getFoodCategories()])
    foods.value = foodsRes.data || []
    categories.value = catsRes.data || []
    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0].id
    }
  } catch (e) {
    console.error('Failed to load food data', e)
  }
})
</script>

<style scoped>
.food-layout {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 120rpx);
}

.category-sidebar {
  width: 180rpx;
  background: #f3f4f6;
  height: 100%;
}

.category-item {
  padding: 28rpx 20rpx;
  text-align: center;
  font-size: 26rpx;
  color: #6b7280;
  position: relative;
}

.category-item.active {
  background: #ffffff;
  color: #16a34a;
  font-weight: 600;
}

.category-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 40rpx;
  background: #16a34a;
  border-radius: 3rpx;
}

.food-list {
  flex: 1;
  height: 100%;
}

.food-item {
  display: flex;
  flex-direction: row;
  margin: 16rpx;
  padding: 16rpx;
}

.food-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.food-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.food-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
}

.food-desc {
  font-size: 24rpx;
  margin: 8rpx 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
