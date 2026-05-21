import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getConfig } from '@/api'

interface ModuleItem {
  id: number
  moduleKey: string
  moduleName: string
  isEnabled: boolean
  sort: number
  icon: string
  description: string
}

export const useConfigStore = defineStore('config', () => {
  const modules = ref<ModuleItem[]>([])
  const loaded = ref(false)

  async function loadConfig() {
    if (loaded.value) return
    try {
      const res = await getConfig() as { data: ModuleItem[] }
      modules.value = res.data || []
      loaded.value = true
    } catch (e) {
      console.error('Load config failed:', e)
    }
  }

  function isModuleEnabled(key: string): boolean {
    const m = modules.value.find((item) => item.moduleKey === key)
    return m ? m.isEnabled : true
  }

  return { modules, loaded, loadConfig, isModuleEnabled }
})
