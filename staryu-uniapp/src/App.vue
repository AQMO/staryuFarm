<template>
  <router-view />
  <TabBar />
</template>

<script setup lang="ts">
import TabBar from '@/components/TabBar.vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
configStore.loadConfig()
</script>
