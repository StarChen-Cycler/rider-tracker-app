<template>
  <div class="min-h-screen bg-gray-50 p-4 safe-area-top safe-area-bottom">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">开发工具</h1>
            <p class="text-gray-600 mt-1">开发和测试辅助工具集</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span class="text-sm text-gray-600">开发模式</span>
          </div>
        </div>
      </div>

      <!-- Development Warning -->
      <div v-if="!isDev" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-red-500 mr-2" />
          <span class="text-red-700 font-medium">此页面仅在开发模式下可用</span>
        </div>
      </div>

      <div v-if="isDev" class="space-y-6">
        <!-- Quick Navigation -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">快速导航</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <NuxtLink 
              to="/"
              class="btn-secondary text-center"
            >
              <Icon name="heroicons:home" class="w-4 h-4 mx-auto mb-1" />
              <span class="text-xs">首页</span>
            </NuxtLink>
            <NuxtLink 
              to="/login"
              class="btn-secondary text-center"
            >
              <Icon name="heroicons:key" class="w-4 h-4 mx-auto mb-1" />
              <span class="text-xs">登录页</span>
            </NuxtLink>
            <NuxtLink 
              to="/debug-auth"
              class="btn-secondary text-center"
            >
              <Icon name="heroicons:bug-ant" class="w-4 h-4 mx-auto mb-1" />
              <span class="text-xs">认证调试</span>
            </NuxtLink>
            <NuxtLink 
              to="/track"
              class="btn-secondary text-center"
            >
              <Icon name="heroicons:play" class="w-4 h-4 mx-auto mb-1" />
              <span class="text-xs">追踪页面</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Environment Info -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">环境信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2 font-mono text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">开发模式:</span>
                <span class="text-green-600">{{ isDev ? '✓ 是' : '✗ 否' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">客户端:</span>
                <span class="text-green-600">{{ isClient ? '✓ 是' : '✗ 否' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">MemFire URL:</span>
                <span class="text-blue-600">{{ hasMemfireUrl ? '✓ 已配置' : '✗ 未配置' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">MemFire Key:</span>
                <span class="text-blue-600">{{ hasMemfireKey ? '✓ 已配置' : '✗ 未配置' }}</span>
              </div>
            </div>
            
            <div class="space-y-2 font-mono text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">认证状态:</span>
                <span :class="user ? 'text-green-600' : 'text-gray-500'">
                  {{ user ? '✓ 已登录' : '- 未登录' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">用户邮箱:</span>
                <span class="text-gray-600">{{ user?.email || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">认证加载:</span>
                <span :class="loading ? 'text-yellow-600' : 'text-green-600'">
                  {{ loading ? '⏳ 加载中' : '✓ 完成' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">认证错误:</span>
                <span :class="error ? 'text-red-600' : 'text-green-600'">
                  {{ error ? '✗ 有错误' : '✓ 正常' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Test Actions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">测试操作</h2>
          <div class="space-y-4">
            <div class="flex flex-wrap gap-3">
              <button
                @click="testNotification"
                class="btn-primary"
              >
                测试通知
              </button>
              <button
                @click="clearLocalStorage"
                class="btn-secondary"
              >
                清除本地存储
              </button>
              <button
                @click="reloadPage"
                class="btn-secondary"
              >
                重新加载页面
              </button>
            </div>
            
            <div v-if="testMessage" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-700">{{ testMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Console Logs -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">控制台日志</h2>
          <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            <div v-for="(log, index) in consoleLogs" :key="index" class="mb-1">
              <span class="text-gray-500">{{ log.time }}</span>
              <span class="ml-2">{{ log.message }}</span>
            </div>
            <div v-if="consoleLogs.length === 0" class="text-gray-600">
              等待日志输出...
            </div>
          </div>
        </div>

        <!-- Back to App -->
        <div class="text-center">
          <NuxtLink 
            to="/"
            class="btn-primary inline-flex items-center gap-2"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4" />
            返回应用
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useSupabase'

// Page meta
definePageMeta({
  layout: false
})

useHead({
  title: '开发工具 - 骑行追踪',
  meta: [
    { name: 'description', content: '开发和测试辅助工具' }
  ]
})

// Environment checks
const isDev = import.meta.dev
const isClient = import.meta.client

// Runtime config
const config = useRuntimeConfig()
const hasMemfireUrl = computed(() => !!(config.public.memfireUrl || config.public.supabaseUrl))
const hasMemfireKey = computed(() => !!(config.public.memfireAnonKey || config.public.supabaseAnonKey))

// Auth state
const { user, loading, error } = useAuth()

// Test state
const testMessage = ref('')
const consoleLogs = ref([])

// Test functions
const testNotification = () => {
  testMessage.value = `测试通知 - ${new Date().toLocaleTimeString()}`
  setTimeout(() => {
    testMessage.value = ''
  }, 3000)
  
  addLog('📱 测试通知已触发')
}

const clearLocalStorage = () => {
  localStorage.clear()
  sessionStorage.clear()
  testMessage.value = '本地存储已清除'
  setTimeout(() => {
    testMessage.value = ''
  }, 3000)
  
  addLog('🗑️ 本地存储已清除')
}

const reloadPage = () => {
  addLog('🔄 重新加载页面')
  window.location.reload()
}

const addLog = (message) => {
  consoleLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message
  })
  
  // Keep only last 20 logs
  if (consoleLogs.value.length > 20) {
    consoleLogs.value = consoleLogs.value.slice(0, 20)
  }
}

// Initialize logs
onMounted(() => {
  addLog('🚀 开发工具页面已加载')
  addLog(`🔧 开发模式: ${isDev ? '已启用' : '已禁用'}`)
  addLog(`🌐 MemFire配置: URL ${hasMemfireUrl.value ? '✓' : '✗'}, Key ${hasMemfireKey.value ? '✓' : '✗'}`)
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium;
}
</style> 