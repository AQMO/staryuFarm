import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getModuleConfig } from '../api/index.js'

export const useConfigStore = defineStore('config', () => {
  const modules = ref([])
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

  function getModule(key) {
    return modules.value.find(m => m.moduleKey === key)
  }

  function isModuleEnabled(key) {
    const m = getModule(key)
    return m ? m.isEnabled : false
  }

  return { modules, loaded, loadConfig, getModule, isModuleEnabled }
})
