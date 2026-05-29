import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ModuleConfig } from '@/api/types'
import { getModuleConfig } from '@/api'

export const useConfigStore = defineStore('config', () => {
  const modules = ref<ModuleConfig[]>([])
  const loaded = ref(false)

  async function loadConfig() {
    if (loaded.value) return
    try {
      const res = await getModuleConfig()
      modules.value = res.data || []
      loaded.value = true
    } catch (e) {
      console.error('Failed to load config', e)
    }
  }

  function getModule(key: string): ModuleConfig | undefined {
    return modules.value.find(m => m.moduleKey === key)
  }

  function isModuleEnabled(key: string): boolean {
    const m = getModule(key)
    return m ? m.isEnabled : false
  }

  return { modules, loaded, loadConfig, getModule, isModuleEnabled }
})
