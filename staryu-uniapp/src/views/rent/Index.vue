<template>
  <div class="page">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">&larr;</span>
      <h1>租赁中心</h1>
    </div>
    <div class="tabs">
      <span :class="{ active: tab === 'tree' }" @click="tab = 'tree'">果木租赁</span>
      <span :class="{ active: tab === 'plot' }" @click="tab = 'plot'">地块租赁</span>
    </div>
    <div v-if="tab === 'tree'">
      <div v-if="trees.length === 0" class="empty-state"><div class="icon">🌳</div><p>暂无果木</p></div>
      <div v-for="t in trees" :key="t.id" class="card rent-card">
        <div class="rent-img">
          <img v-if="t.pic" :src="t.pic" alt="" />
          <div v-else class="img-ph">🌳</div>
        </div>
        <div class="rent-info">
          <h3>{{ t.name }}</h3>
          <p class="variety">{{ t.variety || '' }}</p>
          <p class="desc">{{ t.description || '' }}</p>
          <div class="rent-bottom">
            <span class="price">¥{{ t.annualRent }}<small>/年</small></span>
            <span :class="['tag', t.status === 1 ? 'tag-green' : 'tag-gray']">
              {{ t.status === 1 ? '可认养' : '已下架' }}
            </span>
          </div>
        </div>
        <button v-if="t.status === 1" class="btn btn-primary btn-sm rent-btn" @click="rentItem('fruit_tree', t.id, t.name, t.annualRent)">认养</button>
      </div>
    </div>
    <div v-else>
      <div v-if="plots.length === 0" class="empty-state"><div class="icon">🗺️</div><p>暂无地块</p></div>
      <div v-for="p in plots" :key="p.id" class="card rent-card">
        <div class="rent-img">
          <img v-if="p.pic" :src="p.pic" alt="" />
          <div v-else class="img-ph">🗺️</div>
        </div>
        <div class="rent-info">
          <h3>{{ p.name }}</h3>
          <p class="variety">{{ p.area ? p.area + '㎡' : '' }}</p>
          <p class="desc">{{ p.description || '' }}</p>
          <div class="rent-bottom">
            <span class="price">¥{{ p.annualRent }}<small>/年</small></span>
            <span :class="['tag', p.status === 1 ? 'tag-green' : 'tag-gray']">
              {{ p.status === 1 ? '可租赁' : '已下架' }}
            </span>
          </div>
        </div>
        <button v-if="p.status === 1" class="btn btn-primary btn-sm rent-btn" @click="rentItem('plot', p.id, p.name, p.annualRent)">租赁</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFruitTrees, getPlots, createOrder } from '@/api'
import { useUserStore } from '@/stores/user'
import type { FruitTree, Plot } from '@/api/types'

const router = useRouter()
const userStore = useUserStore()

const tab = ref('tree')
const trees = ref<FruitTree[]>([])
const plots = ref<Plot[]>([])

async function rentItem(type: string, itemId: number, itemName: string, amount: number) {
  const info = userStore.userInfo as Record<string, unknown> | null
  if (!info) { router.push('/profile'); return }
  try {
    await createOrder({
      userId: info.id as number,
      orderType: type,
      itemId,
      itemName,
      totalAmount: amount,
      status: 0,
    })
    alert(type === 'fruit_tree' ? '认养成功！' : '租赁成功！')
    router.push('/orders')
  } catch (e) {
    console.error(e)
    alert('操作失败')
  }
}

onMounted(async () => {
  try {
    const [treeRes, plotRes] = await Promise.all([getFruitTrees(), getPlots()])
    trees.value = (treeRes as unknown as { data: FruitTree[] }).data || []
    plots.value = (plotRes as unknown as { data: Plot[] }).data || []
  } catch (e) { console.error(e) }
})
</script>

<style scoped>
.tabs { display: flex; background: white; border-bottom: 1px solid #e5e7eb; }
.tabs span { flex: 1; text-align: center; padding: 12px; font-size: 14px; cursor: pointer; color: #6b7280; }
.tabs span.active { color: #16a34a; font-weight: 600; border-bottom: 2px solid #16a34a; }
.rent-card { display: flex; gap: 12px; position: relative; }
.rent-img { width: 100px; height: 80px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
.rent-img img { width: 100%; height: 100%; object-fit: cover; }
.img-ph { width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.rent-info { flex: 1; }
.rent-info h3 { font-size: 15px; margin-bottom: 2px; }
.variety { font-size: 12px; color: #6b7280; }
.desc { font-size: 12px; color: #9ca3af; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rent-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.price { color: #dc2626; font-size: 16px; font-weight: 700; }
.price small { font-size: 11px; color: #9ca3af; font-weight: 400; }
.rent-btn { position: absolute; right: 16px; bottom: 16px; }
</style>
