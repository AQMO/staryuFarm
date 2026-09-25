import { reactive } from 'vue'
import { getModuleConfig } from '../api/index.js'

// Singleton reactive state
const state = reactive({
  modules: [],
  loaded: false
})

async function loadConfig() {
  if (state.loaded) return
  try {
    const res = await getModuleConfig()
    state.modules = res.data || []
    state.loaded = true
  } catch (e) {
    console.error('Failed to load config', e)
  }
}

function getModule(key) {
  return state.modules.find(m => m.moduleKey === key)
}

function isModuleEnabled(key) {
  const m = getModule(key)
  return m ? m.isEnabled : false
}

export function useConfigStore() {
  return {
    modules: state.modules,
    get loaded() {
      return state.loaded
    },
    loadConfig,
    getModule,
    isModuleEnabled
  }
}
