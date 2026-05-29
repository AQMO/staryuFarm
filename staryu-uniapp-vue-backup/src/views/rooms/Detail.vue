<template>
  <div class="page">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">&larr;</span>
      <h1>房间详情</h1>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="room">
      <div class="room-banner">
        <img v-if="room.pic" :src="room.pic" alt="" />
        <div v-else class="img-placeholder">🏡</div>
      </div>
      <div class="card">
        <h2>{{ room.name }}</h2>
        <div class="info-row">
          <span>房型容量：{{ room.capacity }}人</span>
          <span :class="['tag', room.status === 1 ? 'tag-green' : 'tag-red']">
            {{ room.status === 1 ? '可预订' : '已下架' }}
          </span>
        </div>
        <div class="info-row"><span>剩余房间：{{ room.stock }}间</span></div>
        <div v-if="room.facility" class="info-row"><span>设施：{{ room.facility }}</span></div>
        <div v-if="room.description" class="description">{{ room.description }}</div>
      </div>
      <div class="card">
        <h3>预订信息</h3>
        <div class="form-group">
          <label>入住日期</label>
          <input type="date" v-model="checkIn" />
        </div>
        <div class="form-group">
          <label>退房日期</label>
          <input type="date" v-model="checkOut" />
        </div>
        <div class="form-group">
          <label>入住人数</label>
          <input type="number" v-model="guestCount" min="1" :max="room.capacity" />
        </div>
      </div>
      <div class="bottom-bar">
        <div class="price-info">
          <span class="label">价格</span>
          <span class="price">¥{{ room.price }}<small>/晚</small></span>
        </div>
        <button class="btn btn-primary" @click="bookRoom" :disabled="room.status !== 1">立即预订</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRoom, createOrder } from '@/api'
import { useUserStore } from '@/stores/user'
import type { Room } from '@/api/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const room = ref<Room | null>(null)
const loading = ref(true)
const checkIn = ref('')
const checkOut = ref('')
const guestCount = ref(1)

onMounted(async () => {
  try {
    const id = route.params.id as string
    const res = (await getRoom(Number(id))) as { data: Room }
    room.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

async function bookRoom() {
  if (!room.value) return
  const info = userStore.userInfo as Record<string, unknown> | null
  if (!info) { router.push('/profile'); return }
  try {
    await createOrder({
      userId: info.id as number,
      orderType: 'room',
      itemId: room.value.id,
      itemName: room.value.name,
      totalAmount: room.value.price,
      status: 0,
    })
    alert('预订成功！')
    router.push('/orders')
  } catch (e) {
    console.error(e)
    alert('预订失败，请重试')
  }
}
</script>

<style scoped>
.room-banner { width: 100%; height: 220px; overflow: hidden; }
.room-banner img { width: 100%; height: 100%; object-fit: cover; }
.img-placeholder { width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 48px; }
h2 { font-size: 18px; margin-bottom: 8px; }
h3 { font-size: 15px; margin-bottom: 12px; }
.info-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 14px; }
.description { margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; line-height: 1.6; }
.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px; }
.bottom-bar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: white; border-top: 1px solid #e5e7eb; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; z-index: 99; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0)); }
.price { color: #dc2626; font-size: 22px; font-weight: 700; }
.price small { font-size: 12px; color: #9ca3af; font-weight: 400; }
.price-info .label { font-size: 12px; color: #9ca3af; display: block; }
</style>
