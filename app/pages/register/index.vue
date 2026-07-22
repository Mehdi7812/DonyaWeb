<script setup>
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-vue-next'
import { ref, computed } from 'vue'

useHead({
  title: 'ثبت‌نام | دنیاوب'
})

definePageMeta({
  layout: "auth",
});

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const passwordStrength = computed(() => {
  const val = password.value
  if (!val) return { label: '', width: '0%', color: '' }
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++

  if (score <= 1) return { label: 'ضعیف', width: '25%', color: 'bg-red-500' }
  if (score === 2) return { label: 'متوسط', width: '50%', color: 'bg-yellow-500' }
  if (score === 3) return { label: 'خوب', width: '75%', color: 'bg-blue-500' }
  return { label: 'قوی', width: '100%', color: 'bg-green-500' }
})

async function handleRegister() {
  errorMessage.value = ''

  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'لطفاً همه فیلدها را تکمیل کنید'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'رمز عبور و تکرار آن یکسان نیستند'
    return
  }
  if (password.value.length < 8) {
    errorMessage.value = 'رمز عبور باید حداقل ۸ کاراکتر باشد'
    return
  }
  if (!acceptTerms.value) {
    errorMessage.value = 'برای ادامه باید قوانین و مقررات را بپذیرید'
    return
  }

  isLoading.value = true
  try {
    // TODO: اتصال به API واقعی ثبت‌نام
    await new Promise((resolve) => setTimeout(resolve, 1200))
    // در صورت موفقیت، کاربر را هدایت کنید
    // await navigateTo('/login')
  } catch (err) {
    errorMessage.value = 'مشکلی در ثبت‌نام پیش آمد، دوباره تلاش کنید'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-center">
    <div class="w-full max-w-md relative z-10">
      <div class="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
        <div class="flex flex-col items-center mb-8">
          <NuxtLink to="/" class="flex items-center justify-center mb-4 w-30">
            <NuxtImg src="/logo.png" cover />
          </NuxtLink>

          <h1 class="text-2xl font-bold mb-1">ساخت حساب کاربری</h1>
          <p class="text-gray-400 text-sm">به جمع مشتریان دنیاوب بپیوندید</p>
        </div>

        <div
          v-if="errorMessage"
          class="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center"
        >
          {{ errorMessage }}
        </div>

        <form class="space-y-5" @submit.prevent="handleRegister">
          <div>
            <label for="fullName" class="block text-sm text-gray-300 mb-2">نام و نام خانوادگی</label>
            <div class="relative">
              <User class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="fullName"
                v-model="fullName"
                type="text"
                autocomplete="name"
                placeholder="نام کامل خود را وارد کنید"
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm text-gray-300 mb-2">ایمیل</label>
            <div class="relative">
              <Mail class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="example@email.com"
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm text-gray-300 mb-2">رمز عبور</label>
            <div class="relative">
              <Lock class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="حداقل ۸ کاراکتر"
                class="w-full pr-12 pl-12 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
              <button
                type="button"
                class="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-gray-200 transition-colors"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
            <div v-if="password" class="mt-2">
              <div class="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="passwordStrength.color"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">قدرت رمز عبور: {{ passwordStrength.label }}</p>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm text-gray-300 mb-2">تکرار رمز عبور</label>
            <div class="relative">
              <Lock class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="رمز عبور را دوباره وارد کنید"
                class="w-full pr-12 pl-12 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
              <button
                type="button"
                class="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-gray-200 transition-colors"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <EyeOff v-if="showConfirmPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <label class="flex items-start gap-2 text-sm text-gray-400 cursor-pointer select-none">
            <input
              v-model="acceptTerms"
              type="checkbox"
              class="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0"
            >
            <span>
              <NuxtLink to="/terms" class="text-purple-300 hover:text-purple-200 transition-colors">قوانین و مقررات</NuxtLink>
              را می‌پذیرم
            </span>
          </label>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check v-if="!isLoading" class="w-5 h-5" />
            {{ isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام' }}
          </button>
        </form>

        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-white/10"></div>
          <span class="text-xs text-gray-500">یا</span>
          <div class="flex-1 h-px bg-white/10"></div>
        </div>

        <p class="text-center text-sm text-gray-400">
          قبلاً ثبت‌نام کرده‌اید؟
          <NuxtLink to="/login" class="text-purple-300 hover:text-purple-200 font-medium transition-colors">وارد شوید</NuxtLink>
        </p>
      </div>
    </div>
  </section>
</template>