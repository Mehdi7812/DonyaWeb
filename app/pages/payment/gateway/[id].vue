<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Lock, ShieldCheck, Building2, CreditCard, Loader2,
  CheckCircle2, XCircle, AlertTriangle
} from 'lucide-vue-next'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const router = useRouter()
const { getOrder, confirmGatewaySuccess, confirmGatewayFailure } = useCheckout()

useHead({
  title: 'درگاه پرداخت | دنیاوب'
})

const order = ref(null)
// connecting: در حال اتصال به بانک (شبیه‌سازی) | ready: منتظر کلیک کاربر | processing: در حال پردازش نتیجه
const stage = ref('connecting')

onMounted(() => {
  order.value = getOrder(route.params.id)
  if (!order.value) return
  // شبیه‌سازی زمان اتصال به درگاه بانک
  setTimeout(() => {
    stage.value = 'ready'
  }, 1100)
})

function formatPrice(n) {
  return Math.round(n).toLocaleString('fa-IR')
}

const cardNumber = ref('')
const cardMasked = computed(() => 'XXXX-XXXX-XXXX-' + (cardNumber.value.slice(-4) || '۱۲۳۴'))

async function pay(success) {
  if (!order.value || stage.value === 'processing') return
  stage.value = 'processing'
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (success) {
    confirmGatewaySuccess(order.value.id)
    router.push({ path: '/payment/result', query: { order: order.value.id, status: 'success' } })
  } else {
    confirmGatewayFailure(order.value.id, 'user_cancelled')
    router.push({ path: '/payment/result', query: { order: order.value.id, status: 'failed' } })
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16">
    <!-- سفارش پیدا نشد -->
    <div v-if="order === null && stage !== 'connecting'" class="max-w-md w-full glass-card rounded-3xl p-8 text-center">
      <AlertTriangle class="w-14 h-14 text-yellow-400 mx-auto mb-4" />
      <h1 class="text-xl font-bold mb-2">سفارش پیدا نشد</h1>
      <p class="text-gray-400 text-sm mb-6">
        این سفارش منقضی شده یا نامعتبر است. لطفاً دوباره از فروشگاه اقدام کنید.
      </p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 font-medium"
      >
        بازگشت به صفحه اصلی
      </NuxtLink>
    </div>

    <!-- در حال اتصال به بانک -->
    <div v-else-if="!order" class="max-w-md w-full text-center">
      <Loader2 class="w-10 h-10 text-blue-400 mx-auto mb-4 animate-spin" />
      <p class="text-gray-400 text-sm">در حال بارگذاری سفارش...</p>
    </div>

    <div v-else class="max-w-md w-full">
      <!-- بنر شبیه‌سازی -->
      <div class="mb-4 px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs text-center">
        این یک درگاه پرداخت <b>شبیه‌سازی‌شده</b> برای محیط تست است و به بانک واقعی متصل نیست.
      </div>

      <div class="glass-card rounded-3xl p-8">
        <!-- هدر بانک -->
        <div class="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
          <div class="flex items-center gap-2">
            <Building2 class="w-6 h-6 text-blue-300" />
            <div>
              <p class="font-bold text-sm">درگاه پرداخت دنیاوب</p>
              <p class="text-gray-500 text-xs">شبکه پرداخت شتاب (نمایشی)</p>
            </div>
          </div>
          <Lock class="w-5 h-5 text-green-400" />
        </div>

        <!-- در حال اتصال -->
        <div v-if="stage === 'connecting'" class="py-10 text-center">
          <Loader2 class="w-10 h-10 text-blue-400 mx-auto mb-4 animate-spin" />
          <p class="text-gray-400 text-sm">در حال اتصال امن به بانک...</p>
        </div>

        <!-- در حال پردازش نتیجه -->
        <div v-else-if="stage === 'processing'" class="py-10 text-center">
          <Loader2 class="w-10 h-10 text-blue-400 mx-auto mb-4 animate-spin" />
          <p class="text-gray-400 text-sm">در حال تایید تراکنش...</p>
        </div>

        <!-- فرم پرداخت -->
        <template v-else>
          <div class="mb-6">
            <p class="text-gray-400 text-sm mb-1">مبلغ قابل پرداخت</p>
            <p class="text-3xl font-bold">{{ formatPrice(order.amount) }} <span class="text-base font-normal text-gray-400">تومان</span></p>
          </div>

          <div class="rounded-xl bg-white/5 border border-white/10 p-4 mb-6 text-sm space-y-1.5">
            <div class="flex justify-between text-gray-400">
              <span>شرح سفارش</span>
              <span class="text-gray-200">{{ order.title }}</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>شماره پیگیری</span>
              <span class="text-gray-200 font-mono" dir="ltr">{{ order.id }}</span>
            </div>
          </div>

          <div class="mb-6">
            <label for="gw-card" class="block text-sm text-gray-300 mb-2">شماره کارت (نمایشی)</label>
            <div class="relative">
              <CreditCard class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="gw-card"
                v-model="cardNumber"
                type="text"
                inputmode="numeric"
                dir="ltr"
                maxlength="16"
                placeholder="۶۲۱۹ ۸۶۱۹ ۰۰۰۰ ۰۰۰۰"
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none text-left"
              >
            </div>
            <p class="text-gray-500 text-xs mt-2" dir="ltr">{{ cardMasked }}</p>
          </div>

          <div class="space-y-3">
            <button
              type="button"
              class="w-full py-3 rounded-xl bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all font-bold flex items-center justify-center gap-2"
              @click="pay(true)"
            >
              <CheckCircle2 class="w-5 h-5" />
              پرداخت (دمو موفق)
            </button>
            <button
              type="button"
              class="w-full py-3 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-all font-medium flex items-center justify-center gap-2"
              @click="pay(false)"
            >
              <XCircle class="w-5 h-5" />
              انصراف از پرداخت (دمو ناموفق)
            </button>
          </div>

          <p class="flex items-center justify-center gap-1.5 text-xs text-gray-500 mt-6">
            <ShieldCheck class="w-4 h-4" /> اتصال شما به این صفحه رمزنگاری‌شده است
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
