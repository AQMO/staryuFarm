<template>
  <view class="page">
    <view class="page-header">
      <text class="title">在线点餐</text>
    </view>
    <view class="category-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="tab-item"
          :class="{ active: currentCat === cat.id }"
          @tap="currentCat = cat.id"
        >
          <text>{{ cat.name }}</text>
        </view>
      </scroll-view>
    </view>
    <view v-if="filteredFoods.length > 0" class="food-list">
      <view v-for="food in filteredFoods" :key="food.id" class="food-card card">
        <image :src="food.pic" mode="aspectFill" class="food-img" />
        <view class="food-info">
          <text class="food-name">{{ food.name }}</text>
          <text class="text-gray" style="font-size:24rpx">{{ food.description }}</text>
          <view class="flex-between">
            <text class="price">
              <text class="symbol">¥</text>
              <text class="amount">{{ food.price }}</text>
            </text>
            <view class="add-btn" @tap="addToCart(food)">
              <text class="add-icon">+</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="empty-state">
      <text class="icon">🍽️</text>
      <text class="text">暂无菜品</text>
    </view>
    <view class="cart-bar" v-if="cartCount > 0" @tap="goCart">
      <text class="cart-icon">🛒</text>
      <text class="cart-count">{{ cartCount }}件</text>
      <text class="cart-total">¥{{ cartTotal }}</text>
      <view class="btn btn-primary">去结算</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getFoods, getFoodCategories } from '../../api/index.js'
import { useCartStore } from '../../stores/cart.js'

const cartStore = useCartStore()
const categories = ref([])
const foods = ref([])
const currentCat = ref(0)

const filteredFoods = computed(() => {
  if (currentCat.value === 0) return foods.value
  return foods.value.filter(f => f.categoryId === currentCat.value)
})

const cartCount = computed(() => cartStore.totalCount)
const cartTotal = computed(() => cartStore.totalPrice)

function addToCart(food) {
  cartStore.addItem({
    id: food.id,
    name: food.name,
    price: food.price,
    pic: food.pic
  })
  uni.showToast({ title: '已加入购物车', icon: 'success' })
}

function goCart() {
  uni.navigateTo({ url: '/pages/orders/index' })
}

onMounted(async () => {
  try {
    const [catRes, foodRes] = await Promise.all([getFoodCategories(), getFoods()])
    categories.value = [{ id: 0, name: '全部' }, ...(catRes.data || [])]
    foods.value = foodRes.data || []
  } catch (e) {
    console.error('Failed to load foods', e)
  }
})
</script>

<style scoped>
.tabs-scroll {
  white-space: nowrap;
  padding: 20rpx 24rpx;
}

.tab-item {
  display: inline-block;
  padding: 12rpx 32rpx;
  margin-right: 16rpx;
  border-radius: 32rpx;
  font-size: 26rpx;
  background: #f3f4f6;
  color: #6b7280;
}

.tab-item.active {
  background: #16a34a;
  color: #ffffff;
}

.food-card {
  display: flex;
  flex-direction: row;
  margin: 16rpx 24rpx;
  padding: 20rpx;
}

.food-img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 16rpx;
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

.add-btn {
  width: 52rpx;
  height: 52rpx;
  border-radius: 26rpx;
  background: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 700;
}

.cart-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1f2937;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  z-index: 100;
}

.cart-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.cart-count {
  color: #ffffff;
  font-size: 26rpx;
  margin-right: 20rpx;
}

.cart-total {
  color: #fbbf24;
  font-size: 32rpx;
  font-weight: 700;
  flex: 1;
}
</style>
