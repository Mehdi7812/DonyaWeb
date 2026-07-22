<script setup>
import { ref } from 'vue'
import { Repeat, Server, AtSign, Check, AlertTriangle } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'انتقال مالکیت سرویس | دنیاوب'
})

const { services } = useDashboard()

const selectedId = ref(services[0]?.id || '')
const recipientEmail = ref('')
const confirmTransfer = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)
const isDone = ref(false)

async function handleSubmit() {
  errorMessage.value = ''

  if (!selectedId.value) {
    errorMessage.value = 'لطفاً سرویس مورد نظر را انتخاب کنید'
    return
  }
  if (!recipientEmail.value || !recipientEmail.value.includes('@')) {
    errorMessage.value = 'لطفاً ایمیل معتبر دریافت‌کننده را وارد کنید'
    return
  }
  if (!confirmTransfer.value) {
    errorMessage.value = 'برای ادامه باید انتقال مالکیت را تأیید کنید'
    return
  }

  isSubmitting.value = true
  // TODO: اتصال به API واقعی ثبت درخواست انتقال مالکیت (نیازمند تأیید دو طرف)
  await new Promise((resolve) => setTimeout(resolve, 900))
  isSubmitting.value = false
  isDone.value = true
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div v-if="isDone" class="glass-card rounded-3xl p-10 text-center space-y-4">
      <div class="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
        <Check class="w-7 h-7 text-green-400" />
      </div>
      <h2 class="text-xl font-bold">درخواست انتقال ارسال شد</h2>
      <p class="text-gray-400 text-sm">
        ایمیل تأییدیه برای <span dir="ltr">{{ recipientEmail }}</span> ارسال شد. پس از تأیید ایشان، مالکیت سرویس منتقل خواهد شد.
      </p>
      <NuxtLink to="/dashboard/services" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30">
        بازگشت به سرویس‌ها
      </NuxtLink>
    </div>

    <div v-else class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <Repeat class="w-5 h-5 text-purple-400" />
        انتقال مالکیت سرویس
      </h2>

      <div class="px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm flex items-start gap-2">
        <AlertTriangle class="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>پس از انتقال مالکیت، دسترسی شما به سرویس و امکان مدیریت آن قطع خواهد شد. این عملیات غیرقابل بازگشت است.</span>
      </div>

      <div v-if="errorMessage" class="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
        {{ errorMessage }}
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label for="service" class="block text-sm text-gray-300 mb-2">انتخاب سرویس</label>
          <div class="relative">
            <Server class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
            <select id="service" v-model="selectedId" class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white outline-none">
              <option v-for="s in services" :key="s.id" :value="s.id" class="bg-slate-800">{{ s.name }} — {{ s.identifier }}</option>
            </select>
          </div>
        </div>

        <div>
          <label for="recipient" class="block text-sm text-gray-300 mb-2">ایمیل دریافت‌کننده</label>
          <div class="relative">
            <AtSign class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
            <input
              id="recipient"
              v-model="recipientEmail"
              type="email"
              placeholder="user@example.com"
              dir="ltr"
              class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
            >
          </div>
        </div>

        <label class="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
          <input v-model="confirmTransfer" type="checkbox" class="mt-0.5 w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0 flex-shrink-0">
          <span>متوجه هستم که با انتقال مالکیت، دسترسی من به این سرویس قطع می‌شود و این عملیات قابل بازگشت نیست.</span>
        </label>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Repeat class="w-4 h-4" />
          {{ isSubmitting ? 'در حال ارسال درخواست...' : 'ارسال درخواست انتقال' }}
        </button>
      </form>
    </div>
  </div>
</template>
