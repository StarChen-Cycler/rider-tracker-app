// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: true, 
  devServer: {
    https: true, // 启用 HTTPS
    host: '0.0.0.0',
    port: 3000
  },
  modules: [
    '@nuxt/eslint', 
    '@nuxt/icon', 
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],
  
  // App configuration
  app: {
    head: {
      title: 'Rider Tracker - Track Your Cycling & Motorbike Adventures',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Track your cycling and motorbike adventures with GPS tracking and route recording' },
        { name: 'theme-color', content: '#3b82f6' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    // Set transitions for layout and pages
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  // CSS configuration
  css: [
    '~/assets/css/main.css'
  ],

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      // MemFire Cloud configuration (compatible with Supabase)
      memfireUrl: process.env.NUXT_PUBLIC_MEMFIRE_URL,
      memfireAnonKey: process.env.NUXT_PUBLIC_MEMFIRE_ANON_KEY,
      // Legacy Supabase configuration (deprecated)
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      amapKey: process.env.NUXT_PUBLIC_AMAP_KEY,
      amapSecurityKey: process.env.NUXT_PUBLIC_AMAP_SECURITY_KEY,
      amapVersion: process.env.NUXT_PUBLIC_AMAP_VERSION || '2.0',
      amapServiceHost: process.env.NUXT_PUBLIC_AMAP_SERVICE_HOST || 'https://restapi.amap.com'
    }
  },

  // Vue configuration  
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('amap-')
    }
  },

  // Suppress warnings in development
  vite: {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }
  },

  // PWA-like features for mobile
  experimental: {
    payloadExtraction: false
  },

  // Optimization for mobile
  nitro: {
    compressPublicAssets: true
  },

  // Image optimization
  image: {
    quality: 80,
    format: ['webp', 'avif', 'jpeg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },

  // Tailwind CSS configuration
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a'
            }
          }
        }
      }
    }
  }
})