<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 safe-area-top safe-area-bottom">
    <!-- Login Card -->
    <div class="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-sm">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-lg">
          <Icon name="heroicons:map-pin" class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">骑行追踪</h1>
        <p class="text-gray-600 text-sm">记录每一次骑行旅程</p>
      </div>

      <!-- Error Message -->
      <div 
        v-if="error" 
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
      >
        <div class="flex items-start">
          <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-red-500 mr-3 mt-0.5" />
          <div class="text-sm text-red-700">
            <div class="font-medium">{{ error }}</div>
            <div v-if="error.includes('MemFire') || error.includes('environment')" class="mt-2 text-xs opacity-80">
              请检查 MemFire Cloud 配置是否正确
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div 
        v-if="successMessage" 
        class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
      >
        <div class="flex items-center">
          <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-3" />
          <span class="text-sm text-green-700 font-medium">{{ successMessage }}</span>
        </div>
      </div>

      <!-- Login Method Tabs -->
      <div class="mb-6">
        <div class="flex bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            @click="setLoginMethod('phone')"
            :class="loginMethod === 'phone' ? 'bg-white shadow text-primary-600' : 'text-gray-600'"
            class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all"
          >
            手机号登录
          </button>
          <button
            type="button"
            @click="setLoginMethod('email')"
            :class="loginMethod === 'email' ? 'bg-white shadow text-primary-600' : 'text-gray-600'"
            class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all"
          >
            邮箱登录
          </button>
        </div>
      </div>

      <!-- Phone Login Form -->
      <div v-if="loginMethod === 'phone'" class="space-y-6">
        <!-- Phone Input -->
        <div>
          <label class="form-label text-gray-700" for="phone">手机号码</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 text-sm">+86</span>
            </div>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="form-input pl-14"
              placeholder="请输入手机号码"
              required
              :disabled="loading"
              maxlength="11"
              @input="validatePhone"
            />
          </div>
          <p v-if="phoneError" class="mt-1 text-xs text-red-600">{{ phoneError }}</p>
        </div>

        <!-- Auth Mode Tabs -->
        <div class="flex bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            @click="setPhoneAuthMode('otp')"
            :class="phoneAuthMode === 'otp' ? 'bg-white shadow text-primary-600' : 'text-gray-600'"
            class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all"
          >
            验证码登录
          </button>
          <button
            type="button"
            @click="setPhoneAuthMode('password')"
            :class="phoneAuthMode === 'password' ? 'bg-white shadow text-primary-600' : 'text-gray-600'"
            class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all"
          >
            密码登录
          </button>
        </div>

        <!-- OTP Mode -->
        <div v-if="phoneAuthMode === 'otp'">
          <!-- Verification Code Input -->
          <div v-if="otpSent">
            <label class="form-label text-gray-700" for="otp">验证码</label>
            <div class="flex gap-3">
              <input
                id="otp"
                v-model="formData.otp"
                type="text"
                class="form-input flex-1"
                placeholder="请输入6位验证码"
                required
                :disabled="loading"
                maxlength="6"
                inputmode="numeric"
                pattern="[0-9]*"
              />
              <button
                type="button"
                @click="sendOtp"
                :disabled="!isPhoneValid || otpCooldown > 0 || loading"
                class="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400"
              >
                {{ otpCooldown > 0 ? `${otpCooldown}s` : '重发' }}
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">验证码已发送到 +86 {{ formData.phone }}</p>
          </div>

          <!-- Send OTP Button -->
          <AppButton
            v-if="!otpSent"
            @click="sendOtp"
            :loading="loading"
            :disabled="!isPhoneValid"
            variant="primary"
            size="lg"
            full-width
          >
            获取验证码
          </AppButton>

          <!-- Verify OTP Button -->
          <AppButton
            v-else
            @click="verifyOtp"
            :loading="loading"
            :disabled="!formData.otp || formData.otp.length !== 6"
            variant="primary"
            size="lg"
            full-width
          >
            立即登录
          </AppButton>
        </div>

        <!-- Password Mode -->
        <div v-else class="space-y-4">
          <!-- Password Input -->
          <div>
            <label class="form-label text-gray-700" for="password">密码</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="form-input"
              :placeholder="passwordMode === 'register' ? '请设置6位以上密码' : '请输入密码'"
              required
              :disabled="loading"
              minlength="6"
            />
          </div>

          <!-- Register with password: OTP verification -->
          <div v-if="passwordMode === 'register'">
            <div v-if="passwordOtpSent">
              <label class="form-label text-gray-700" for="password-otp">验证码</label>
              <div class="flex gap-3">
                <input
                  id="password-otp"
                  v-model="formData.passwordOtp"
                  type="text"
                  class="form-input flex-1"
                  placeholder="请输入验证码"
                  required
                  :disabled="loading"
                  maxlength="6"
                />
                <button
                  type="button"
                  @click="sendPasswordOtp"
                  :disabled="!isPhoneValid || !formData.password || passwordOtpCooldown > 0 || loading"
                  class="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400"
                >
                  {{ passwordOtpCooldown > 0 ? `${passwordOtpCooldown}s` : '重发' }}
                </button>
              </div>
            </div>

            <AppButton
              v-if="!passwordOtpSent"
              @click="sendPasswordOtp"
              :loading="loading"
              :disabled="!isPhoneValid || !formData.password || formData.password.length < 6"
              variant="secondary"
              size="lg"
              full-width
            >
              发送验证码注册
            </AppButton>

            <AppButton
              v-else
              @click="registerWithPassword"
              :loading="loading"
              :disabled="!formData.passwordOtp || formData.passwordOtp.length !== 6"
              variant="primary"
              size="lg"
              full-width
            >
              完成注册
            </AppButton>

            <div class="text-center">
              <button
                type="button"
                @click="passwordMode = 'login'"
                class="text-sm text-primary-600 hover:text-primary-700"
                :disabled="loading"
              >
                已有账号？直接登录
              </button>
            </div>
          </div>

          <!-- Login with password -->
          <div v-else>
            <AppButton
              @click="loginWithPassword"
              :loading="loading"
              :disabled="!isPhoneValid || !formData.password"
              variant="primary"
              size="lg"
              full-width
            >
              登录
            </AppButton>

            <div class="text-center">
              <button
                type="button"
                @click="passwordMode = 'register'"
                class="text-sm text-primary-600 hover:text-primary-700"
                :disabled="loading"
              >
                没有账号？立即注册
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Email Login Form -->
      <div v-else class="space-y-6">
        <!-- Email Input -->
        <div>
          <label class="form-label text-gray-700" for="email">电子邮箱</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            placeholder="请输入邮箱地址"
            required
            :disabled="loading"
            @input="validateEmail"
          />
          <p v-if="emailError" class="mt-1 text-xs text-red-600">{{ emailError }}</p>
        </div>

        <!-- Email Auth Mode Tabs -->
        <div class="flex bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            @click="setEmailAuthMode('login')"
            :class="emailAuthMode === 'login' ? 'bg-white shadow text-primary-600' : 'text-gray-600'"
            class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all"
          >
            登录
          </button>
          <button
            type="button"
            @click="setEmailAuthMode('register')"
            :class="emailAuthMode === 'register' ? 'bg-white shadow text-primary-600' : 'text-gray-600'"
            class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all"
          >
            注册
          </button>
        </div>

        <!-- Password Input -->
        <div>
          <label class="form-label text-gray-700" for="email-password">密码</label>
          <input
            id="email-password"
            v-model="formData.emailPassword"
            type="password"
            class="form-input"
            :placeholder="emailAuthMode === 'register' ? '请设置6位以上密码' : '请输入密码'"
            required
            :disabled="loading"
            minlength="6"
          />
        </div>

        <!-- Login/Register Button -->
        <AppButton
          @click="emailAuthMode === 'login' ? loginWithEmail() : registerWithEmail()"
          :loading="loading"
          :disabled="!isEmailValid || !formData.emailPassword || formData.emailPassword.length < 6"
          variant="primary"
          size="lg"
          full-width
        >
          {{ emailAuthMode === 'login' ? '登录' : '注册' }}
        </AppButton>

        <!-- Forgot Password -->
        <div v-if="emailAuthMode === 'login'" class="text-center">
          <button
            type="button"
            @click="showResetPasswordModal = true"
            class="text-sm text-primary-600 hover:text-primary-700"
            :disabled="loading"
          >
            忘记密码？
          </button>
        </div>
      </div>

      <!-- Reset Password Modal -->
      <div 
        v-if="showResetPasswordModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="showResetPasswordModal = false"
      >
        <div class="bg-white rounded-xl p-6 w-full max-w-sm">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">重置密码</h3>
          
          <div class="mb-4">
            <label class="form-label text-gray-700" for="reset-email">电子邮箱</label>
            <input
              id="reset-email"
              v-model="formData.resetEmail"
              type="email"
              class="form-input"
              placeholder="请输入您的邮箱"
              required
            />
          </div>
          
          <div class="flex gap-3">
            <button
              @click="showResetPasswordModal = false"
              class="flex-1 py-2 px-4 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              取消
            </button>
            <button
              @click="handlePasswordReset"
              :disabled="!formData.resetEmail || loading"
              class="flex-1 py-2 px-4 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {{ loading ? '发送中...' : '发送重置链接' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500 leading-relaxed">
          登录即表示同意
          <a href="#" class="text-primary-600 hover:text-primary-700">《用户协议》</a>
          和
          <a href="#" class="text-primary-600 hover:text-primary-700">《隐私政策》</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useSupabase'

// Set page layout and middleware
definePageMeta({
  layout: false,
  middleware: 'guest'
})

// Page meta
useHead({
  title: '登录 - 骑行追踪',
  meta: [
    { name: 'description', content: '使用手机号或邮箱登录骑行追踪应用' }
  ]
})

// Auth composable
const { 
  signInWithPhone, 
  signUpWithPhone, 
  sendSmsOtp, 
  verifyPhoneOtp, 
  signIn,
  signUp,
  resetPassword,
  error, 
  loading, 
  clearError 
} = useAuth()

// We're using the auth composable methods, no need for direct supabase client

// Router
const router = useRouter()
const route = useRoute()

// Get redirect URL from query parameter
const redirectTo = computed(() => String(route.query.redirect || '/'))

// Form state
const formData = reactive({
  phone: '',
  otp: '',
  password: '',
  passwordOtp: '',
  email: '',
  emailPassword: '',
  resetEmail: ''
})

// UI state
const successMessage = ref('')
const loginMethod = ref('phone') // 'phone' or 'email'
const phoneAuthMode = ref('otp') // 'otp' or 'password'
const passwordMode = ref('login') // 'login' or 'register'
const emailAuthMode = ref('login') // 'login' or 'register'
const otpSent = ref(false)
const passwordOtpSent = ref(false)
const otpCooldown = ref(0)
const passwordOtpCooldown = ref(0)
const phoneError = ref('')
const emailError = ref('')
const showResetPasswordModal = ref(false)

// Phone validation
const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(formData.phone)
})

// Email validation
const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
})

const validatePhone = () => {
  phoneError.value = ''
  if (formData.phone && !isPhoneValid.value) {
    phoneError.value = '请输入正确的手机号码'
  }
}

const validateEmail = () => {
  emailError.value = ''
  if (formData.email && !isEmailValid.value) {
    emailError.value = '请输入正确的邮箱地址'
  }
}

// Set login method
const setLoginMethod = (method) => {
  loginMethod.value = method
  clearError()
  resetForms()
}

// Set phone auth mode
const setPhoneAuthMode = (mode) => {
  phoneAuthMode.value = mode
  clearError()
  resetForms()
}

// Set email auth mode
const setEmailAuthMode = (mode) => {
  emailAuthMode.value = mode
  clearError()
  resetForms()
}

// Reset forms
const resetForms = () => {
  formData.otp = ''
  formData.password = ''
  formData.passwordOtp = ''
  otpSent.value = false
  passwordOtpSent.value = false
  successMessage.value = ''
}

// OTP cooldown timer
const startCooldown = (type = 'otp') => {
  const cooldownRef = type === 'otp' ? otpCooldown : passwordOtpCooldown
  cooldownRef.value = 60
  
  const timer = setInterval(() => {
    cooldownRef.value--
    if (cooldownRef.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// Send OTP for login
const sendOtp = async () => {
  console.log('📱 Sending OTP to:', formData.phone)
  clearError()

  try {
    const { error: otpError } = await sendSmsOtp(`+86${formData.phone}`)
    
    if (otpError) {
      console.error('❌ SMS OTP error:', otpError)
      throw otpError
    }
    
    console.log('✅ OTP sent successfully')
    otpSent.value = true
    successMessage.value = '验证码已发送，请查收短信'
    startCooldown('otp')
  } catch (err) {
    console.error('❌ Send OTP failed:', err)
  }
}

// Verify OTP for login
const verifyOtp = async () => {
  console.log('🔐 Verifying OTP for phone:', formData.phone)
  clearError()

  try {
    const { error: verifyError } = await verifyPhoneOtp(`+86${formData.phone}`, formData.otp)
    
    if (verifyError) {
      console.error('❌ OTP verification error:', verifyError)
      throw verifyError
    }
    
    console.log('✅ OTP verification successful, redirecting...')
    await router.push(redirectTo.value)
  } catch (err) {
    console.error('❌ OTP verification failed:', err)
  }
}

// Send OTP for password registration
const sendPasswordOtp = async () => {
  console.log('📱 Sending registration OTP to:', formData.phone)
  clearError()

  try {
    const { error: signUpError } = await signUpWithPhone(`+86${formData.phone}`, formData.password)
    
    if (signUpError) {
      console.error('❌ Phone registration error:', signUpError)
      throw signUpError
    }
    
    console.log('✅ Registration OTP sent successfully')
    passwordOtpSent.value = true
    successMessage.value = '验证码已发送，请查收短信'
    startCooldown('passwordOtp')
  } catch (err) {
    console.error('❌ Send registration OTP failed:', err)
  }
}

// Register with password + OTP
const registerWithPassword = async () => {
  console.log('📝 Completing registration for phone:', formData.phone)
  clearError()

  try {
    const { error: verifyError } = await verifyPhoneOtp(`+86${formData.phone}`, formData.passwordOtp)
    
    if (verifyError) {
      console.error('❌ Registration verification error:', verifyError)
      throw verifyError
    }
    
    console.log('✅ Registration completed, redirecting...')
    await router.push(redirectTo.value)
  } catch (err) {
    console.error('❌ Registration verification failed:', err)
  }
}

// Login with phone + password
const loginWithPassword = async () => {
  console.log('🔑 Phone password login for:', formData.phone)
  clearError()

  try {
    const { error: loginError } = await signInWithPhone(`+86${formData.phone}`, formData.password)
    
    if (loginError) {
      console.error('❌ Phone login error:', loginError)
      throw loginError
    }
    
    console.log('✅ Phone login successful, redirecting...')
    await router.push(redirectTo.value)
  } catch (err) {
    console.error('❌ Phone login failed:', err)
  }
}

// Login with email
const loginWithEmail = async () => {
  console.log('🔑 Email login for:', formData.email)
  clearError()

  try {
    const { error: loginError } = await signIn(formData.email, formData.emailPassword)
    
    if (loginError) {
      console.error('❌ Email login error:', loginError)
      throw loginError
    }
    
    console.log('✅ Email login successful, redirecting...')
    await router.push(redirectTo.value)
  } catch (err) {
    console.error('❌ Email login failed:', err)
  }
}

// Register with email
const registerWithEmail = async () => {
  console.log('📝 Email registration for:', formData.email)
  clearError()

  try {
    const { error: signUpError } = await signUp(formData.email, formData.emailPassword)
    
    if (signUpError) {
      console.error('❌ Email registration error:', signUpError)
      throw signUpError
    }
    
    console.log('✅ Email registration successful, redirecting...')
    successMessage.value = '注册成功！请查收邮件进行验证。'
    // Optionally, show a modal for email verification
  } catch (err) {
    console.error('❌ Email registration failed:', err)
  }
}

// Handle password reset
const handlePasswordReset = async () => {
  console.log('🔑 Password reset for:', formData.resetEmail)
  clearError()

  try {
    const { error: resetError } = await resetPassword(formData.resetEmail)
    
    if (resetError) {
      console.error('❌ Password reset error:', resetError)
      throw resetError
    }
    
    console.log('✅ Password reset email sent successfully')
    successMessage.value = '密码重置链接已发送至您的邮箱。'
    showResetPasswordModal.value = false
  } catch (err) {
    console.error('❌ Password reset failed:', err)
  }
}

// Check environment setup on mount
onMounted(() => {
  console.log('🌐 Login page mounted')
  
  const config = useRuntimeConfig()
  console.log('⚙️ Runtime config check:', {
    hasMemfireUrl: !!(config.public.memfireUrl || config.public.supabaseUrl),
    hasMemfireKey: !!(config.public.memfireAnonKey || config.public.supabaseAnonKey),
    currentError: error.value,
    currentLoading: loading.value
  })
})

// Clear errors when component unmounts
onUnmounted(() => {
  clearError()
})
</script>

<style scoped>
/* Ensure full height on mobile */
@media (max-height: 640px) {
  .min-h-screen {
    min-height: 100vh;
    min-height: 100svh;
  }
}

/* Custom focus styles for better mobile UX */
input:focus {
  transform: scale(1.01);
  transition: transform 0.2s ease;
}

/* Improve touch targets on mobile */
button, input {
  touch-action: manipulation;
}

/* Tab animation */
.flex.bg-gray-100 button {
  transition: all 0.3s ease;
}

/* Chinese typography optimization */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style> 