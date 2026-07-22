<script setup>
import { Search, CheckCircle2, XCircle, Loader2 } from 'lucide-vue-next'

const domain = ref('')
const status = ref('idle') // idle | loading | available | taken

// لیست پسوندهای فرضی
const tlds = ['.com', '.ir', '.net', '.co']

function checkDomain() {
  if (!domain.value.trim()) return
  
  status.value = 'loading'
  
  // شبیه‌سازی درخواست به سرور
  setTimeout(() => {
    // فرض می‌کنیم دامنه‌های دارای "test" قبلاً ثبت شده‌اند
    if (domain.value.includes('test')) {
      status.value = 'taken'
    } else {
      status.value = 'available'
    }
  }, 1500)
}
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-20">
    <div class="glass-strong rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl">
      <div class="relative flex-1 flex items-center">
        <input
          v-model="domain"
          type="text"
          placeholder="نام دامنه مورد نظر خود را وارد کنید..."
          class="w-full px-6 py-4 rounded-xl input-glass text-white placeholder-gray-400 outline-none text-lg"
          @keyup.enter="checkDomain"
        >
      </div>
      <button 
        @click="checkDomain"
        :disabled="status === 'loading'"
        class="px-8 py-4 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
      >
        <Loader2 v-if="status === 'loading'" class="w-5 h-5 animate-spin" />
        <Search v-else class="w-5 h-5" />
        بررسی دامنه
      </button>
    </div>

    <!-- نتیجه بررسی -->
    <Transition name="fade-slide">
      <div v-if="status !== 'idle' && status !== 'loading'" class="mt-4 p-4 rounded-xl glass flex items-center gap-3" :class="status === 'available' ? 'border-green-500/30' : 'border-red-500/30'">
        <CheckCircle2 v-if="status === 'available'" class="w-6 h-6 text-green-400 shrink-0" />
        <XCircle v-else class="w-6 h-6 text-red-400 shrink-0" />
        
        <div v-if="status === 'available'" class="flex-1 flex-wrap items-center gap-2 flex">
          <span class="text-gray-200">دامنه <span class="font-bold text-white">{{ domain }}.com</span> آزاد است!</span>
          <button class="text-sm px-3 py-1 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition">ثبت دامنه</button>
        </div>
        <div v-else class="flex-1">
          <span class="text-gray-200">دامنه <span class="font-bold text-white">{{ domain }}.com</span> متاسفانه قبلاً ثبت شده است.</span>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>