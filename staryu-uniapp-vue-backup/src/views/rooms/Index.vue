<template>
  <div class="page">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">&larr;</span>
      <h1>房间预订</h1>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="rooms.length === 0" class="empty-state">
      <div class="icon">🏡</div>
      <p>暂无房间</p>
    </div>
    <div v-else class="room-list">
      <div v-for="room in rooms" :key="room.id" class="card room-card" @click="goDetail(room.id)">
        <div class="room-img">
          <img v-if="room.pic" :src="room.pic" alt="" />
          <div v-else class="img-placeholder">🏡</div>
        </div>
        <div class="room-info">
          <h3>{{ room.name }}</h3>
          <p class="room-meta">{{ room.capacity }}人 | 剩余{{ room.stock }}间</p>
          <div class="room-bottom">
            <span class="price">¥{{ room.price }}<small>/晚</small></span>
            <span :class="['tag', room.status === 1 ? 'tag-green' : 'tag-red']">
              {{ room.status === 1 ? '可预订' : '已下架' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRooms } from '@/api'
import type { Room } from '@/api/types'

const router = useRouter()
const rooms = ref<Room[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = (await getRooms()) as { data: Room[] }
    rooms.value = res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

function goDetail(id: number) {
  router.push(`/rooms/${id}`)
}
</script>

<style scoped>
.room-card { display: flex; gap: 12px; cursor: pointer; }
.room-card:active { background: #f9fafb; }
.room-img { width: 110px; height: 80px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
.room-img img { width: 100%; height: 100%; object-fit: cover; }
.img-placeholder { width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.room-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.room-info h3 { font-size: 15px; font-weight: 600; }
.room-meta { font-size: 12px; color: #9ca3af; }
.room-bottom { display: flex; justify-content: space-between; align-items: center; }
.price { color: #dc2626; font-size: 18px; font-weight: 700; }
.price small { font-size: 11px; font-weight: 400; color: #9ca3af; }
</style>
