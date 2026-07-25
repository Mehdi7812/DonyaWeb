<script setup>
import { reactive, ref } from 'vue'
import { Gift, Ticket, Check } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'کارت هدیه | دنیاوب'
})

const { giftCards } = useDashboard()
const toast = useToast()

const cards = reactive([...giftCards])

const code = ref('')
const isSubmitting = ref(false)

function formatNumber(n) {
  return n.toLocaleString('fa-IR')
}

async function redeem() {
  if (!code.value.trim()) {
    toast.error('لطفاً کد کارت هدیه را وارد کنید')
    return
  }

  isSubmitting.value = true
  // TODO: اتصال به API واقعی اعتبارسنجی و فعال‌سازی کارت هدیه
  await new Promise((resolve) => setTimeout(resolve, 800))
  isSubmitting.value = false

  const exists = cards.some((c) => c.code.toLowerCase() === code.value.trim().toLowerCase())
  if (exists) {
    toast.error('این کارت هدیه قبلاً ثبت شده است')
    return
  }

  cards.unshift({
    code: code.value.trim(),
    amount: 100000,
    status: 'active',
    issuedDate: 'همین الان'
  })
  toast.success('کارت هدیه با موفقیت به حساب شما اضافه شد.')
  code.value = ''
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
      <h2 class="text-lg font-bold flex items-center gap-2">
        <Gift class="w-5 h-5 text-purple-400" />
        فعال‌سازی کارت هدیه
      </h2>

      <form class="flex flex-col sm:flex-row gap-3" @submit.prevent="redeem">
        <input
          v-model="code"
          type="text"
          placeholder="DWGIFT-XXXX-XXXX"
          dir="ltr"
          class="flex-1 px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
        >
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
        >
          <Check class="w-4 h-4" />
          {{ isSubmitting ? 'در حال بررسی...' : 'فعال‌سازی' }}
        </button>
      </form>
    </div>

    <div>
      <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
        <Ticket class="w-5 h-5 text-purple-400" />
        کارت‌های هدیه من
      </h2>

      <div v-if="cards.length" class="space-y-3">
        <div
          v-for="c in cards"
          :key="c.code"
          class="glass-card rounded-2xl p-5 flex items-center justify-between gap-4"
        >
          <div class="min-w-0">
            <p class="font-mono font-medium text-sm truncate" dir="ltr">{{ c.code }}</p>
            <p class="text-gray-500 text-xs mt-1">صادر شده در {{ c.issuedDate }}</p>
          </div>
          <div class="flex items-center gap-4 shrink-0">
            <span class="font-bold text-sm">{{ formatNumber(c.amount) }} تومان</span>
            <DashboardStatusBadge :status="c.status" />
          </div>
        </div>
      </div>
      <div v-else class="glass-card rounded-3xl p-12 text-center text-gray-400">
        هنوز کارت هدیه‌ای در حساب شما ثبت نشده است.
      </div>
    </div>
  </div>
</template>
