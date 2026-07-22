<script setup>
import { computed, ref } from 'vue'
import { ArrowRight, RotateCcw, Globe, Check } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'تمدید دامنه | دنیاوب'
})

const route = useRoute()
const { getDomainServices } = useDashboard()

const domains = getDomainServices()

const selectedId = ref(
  domains.find((d) => d.identifier === route.query.domain)?.id || domains[0]?.id || ''
)

const periods = [
  { years: 1, label: '۱ سال' },
  { years: 2, label: '۲ سال' },
  { years: 3, label: '۳ سال' }
]
const selectedYears = ref(1)

const selectedDomain = computed(() => domains.find((d) => d.id === selectedId.value) || null)

const basePrice = computed(() => {
  if (!selectedDomain.value) return 0
  return Number(selectedDomain.value.price.replace(/[^\d]/g, ''))
})

const totalPrice = computed(() => basePrice.value * selectedYears.value)

function formatNumber(n) {
  return n.toLocaleString('fa-IR')
}

const isSubmitting = ref(false)
const isDone = ref(false)

async function handleRenew() {
  if (!selectedDomain.value) return
  isSubmitting.value = true
  // TODO: اتصال به API واقعی تمدید دامنه / درگاه پرداخت
  await new Promise((resolve) => setTimeout(resolve, 900))
  isSubmitting.value = false
  isDone.value = true
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <NuxtLink to="/dashboard/domains" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
      <ArrowRight class="w-4 h-4" />
      بازگشت به دامنه‌ها
    </NuxtLink>

    <div v-if="isDone" class="glass-card rounded-3xl p-10 text-center space-y-4">
      <div class="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
        <Check class="w-7 h-7 text-green-400" />
      </div>
      <h2 class="text-xl font-bold">تمدید با موفقیت ثبت شد</h2>
      <p class="text-gray-400 text-sm">
        دامنه <span dir="ltr">{{ selectedDomain?.identifier }}</span> برای {{ selectedYears }} سال تمدید شد و فاکتور آن در بخش صورت‌حساب‌ها موجود است.
      </p>
      <NuxtLink to="/dashboard/domains" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30">
        بازگشت به دامنه‌ها
      </NuxtLink>
    </div>

    <div v-else class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <RotateCcw class="w-5 h-5 text-purple-400" />
        تمدید دامنه
      </h2>

      <div v-if="domains.length">
        <div>
          <label for="domain" class="block text-sm text-gray-300 mb-2">انتخاب دامنه</label>
          <div class="relative">
            <Globe class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
            <select id="domain" v-model="selectedId" class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white outline-none" dir="ltr">
              <option v-for="d in domains" :key="d.id" :value="d.id" class="bg-slate-800">{{ d.identifier }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-300 mb-2 mt-5">مدت تمدید</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="p in periods"
              :key="p.years"
              type="button"
              class="py-3 rounded-xl text-sm font-medium border transition-all"
              :class="selectedYears === p.years
                ? 'bg-linear-to-r from-purple-600 to-blue-600 border-transparent shadow-lg shadow-purple-500/30'
                : 'glass border-white/10 text-gray-300 hover:text-white hover:border-purple-500/40'"
              @click="selectedYears = p.years"
            >
              {{ p.label }}
            </button>
          </div>
        </div>

        <div class="rounded-2xl bg-white/5 p-5 space-y-2 text-sm mt-5">
          <div class="flex justify-between text-gray-400">
            <span>قیمت سالانه</span>
            <span>{{ formatNumber(basePrice) }} تومان</span>
          </div>
          <div class="flex justify-between text-gray-400">
            <span>مدت</span>
            <span>{{ selectedYears }} سال</span>
          </div>
          <div class="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
            <span>مبلغ قابل پرداخت</span>
            <span>{{ formatNumber(totalPrice) }} تومان</span>
          </div>
        </div>

        <button
          type="button"
          :disabled="isSubmitting"
          class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5"
          @click="handleRenew"
        >
          <RotateCcw class="w-4 h-4" />
          {{ isSubmitting ? 'در حال پردازش...' : 'تمدید و پرداخت' }}
        </button>
      </div>

      <p v-else class="text-gray-400 text-sm text-center py-6">دامنه‌ای برای تمدید در حساب شما یافت نشد.</p>
    </div>
  </div>
</template>
