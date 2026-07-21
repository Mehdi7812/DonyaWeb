<script setup>
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { ref } from 'vue'

useHead({
  title: 'ورود | دنیا وب'
})

definePageMeta({
  layout: "auth",
});

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'لطفاً ایمیل و رمز عبور را وارد کنید'
    return
  }

  isLoading.value = true
  try {
    // TODO: اتصال به API واقعی ورود
    await new Promise((resolve) => setTimeout(resolve, 1200))
    // در صورت موفقیت، کاربر را به داشبورد هدایت کنید
    // await navigateTo('/dashboard')
  } catch (err) {
    errorMessage.value = 'ایمیل یا رمز عبور اشتباه است'
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

          <h1 class="text-2xl font-bold mb-1">ورود به حساب کاربری</h1>
          <p class="text-gray-400 text-sm">به دنیا وب خوش آمدید</p>
        </div>

        <div
          v-if="errorMessage"
          class="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center"
        >
          {{ errorMessage }}
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
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
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm text-gray-300">رمز عبور</label>
              <a href="#" class="text-xs text-purple-300 hover:text-purple-200 transition-colors">فراموشی رمز عبور؟</a>
            </div>
            <div class="relative">
              <Lock class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
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
          </div>

          <label class="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0"
            >
            مرا به خاطر بسپار
          </label>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'در حال ورود...' : 'ورود' }}
          </button>
        </form>

        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-white/10"></div>
          <span class="text-xs text-gray-500">یا</span>
          <div class="flex-1 h-px bg-white/10"></div>
        </div>

        <p class="text-center text-sm text-gray-400">
          حساب کاربری ندارید؟
          <NuxtLink to="/register" class="text-purple-300 hover:text-purple-200 font-medium transition-colors">ثبت‌نام کنید</NuxtLink>
        </p>
      </div>
    </div>
  </section>
</template>