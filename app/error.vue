<script setup>
import { Home, ArrowRight, TriangleAlert } from 'lucide-vue-next'

const props = defineProps({
  error: { type: Object, required: true }
})

const is404 = props.error?.statusCode === 404

function handleGoHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="relative bg-slate-900 text-white min-h-screen overflow-x-hidden flex items-center justify-center px-4">
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <BackgroundBlobs />
    </div>

    <div class="glass-card rounded-3xl p-8 sm:p-12 max-w-xl w-full text-center">
      <div class="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
        <TriangleAlert class="w-8 h-8 text-white" />
      </div>

      <div class="text-6xl font-bold mb-4 bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
        {{ error?.statusCode || 500 }}
      </div>

      <h1 class="text-xl sm:text-2xl font-bold mb-3">
        {{ is404 ? 'صفحه مورد نظر پیدا نشد' : 'مشکلی پیش آمد' }}
      </h1>
      <p class="text-gray-400 mb-8 leading-relaxed">
        {{ is404
          ? 'صفحه‌ای که دنبالش هستید حذف شده یا اصلاً وجود نداشته. آدرس را بررسی کنید یا به صفحه اصلی برگردید.'
          : 'یک خطای غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.' }}
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30"
          @click="handleGoHome"
        >
          <Home class="w-5 h-5" />
          بازگشت به صفحه اصلی
        </button>
        <NuxtLink
          to="/contact-us"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all font-medium"
        >
          <ArrowRight class="w-5 h-5" />
          تماس با پشتیبانی
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
