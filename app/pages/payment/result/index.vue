<script setup>
import { computed } from 'vue'
import {
  CheckCircle2, XCircle, ChevronLeft, Download, LifeBuoy,
  RefreshCcw, LayoutDashboard, Copy
} from 'lucide-vue-next'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { getOrder } = useCheckout()

const orderId = computed(() => (typeof route.query.order === 'string' ? route.query.order : ''))
const order = computed(() => getOrder(orderId.value))

// وضعیت نهایی نمایش داده‌شده: اول از خودِ سفارش ذخیره‌شده می‌خوانیم، اگر پیدا نشد از query
const status = computed(() => order.value?.status === 'paid'
  ? 'success'
  : order.value?.status === 'failed'
    ? 'failed'
    : (route.query.status === 'success' ? 'success' : route.query.status === 'failed' ? 'failed' : 'not_found'))

useHead({
  title: status.value === 'success' ? 'پرداخت موفق | دنیاوب' : 'نتیجه پرداخت | دنیاوب'
})

function formatPrice(n) {
  return Math.round(n).toLocaleString('fa-IR')
}

const dashboardLink = computed(() => {
  if (!order.value) return '/dashboard'
  if (order.value.type === 'domain') return '/dashboard/domains'
  if (order.value.type === 'invoice') return `/dashboard/invoices/${order.value.invoiceId}`
  return '/dashboard/services'
})

// برای تلاش مجدد، کاربر را به همان فرم checkout با پلن انتخابی قبلی برمی‌گردانیم
const retryLink = computed(() => {
  if (!order.value) return '/'
  const map = { vps: '/checkout-vps', hosting: '/checkout-host', domain: '/checkout-domain', cart: '/cart' }
  return map[order.value.type] || '/'
})

function copyOrderId() {
  if (order.value && import.meta.client) {
    navigator.clipboard?.writeText(order.value.id)
  }
}
</script>

<template>
  <div>
    <section class="relative pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <!-- سفارش پیدا نشد -->
      <div v-if="status === 'not_found'" class="glass-card rounded-3xl p-10 text-center">
        <XCircle class="w-16 h-16 text-yellow-400 mx-auto mb-5" />
        <h1 class="text-2xl font-bold mb-2">اطلاعاتی از این پرداخت پیدا نشد</h1>
        <p class="text-gray-400 mb-8">
          ممکن است لینک نامعتبر باشد یا مدت اعتبار آن (طول این جلسه‌ی مرورگر) به پایان رسیده باشد.
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold"
        >
          بازگشت به صفحه اصلی
          <ChevronLeft class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- پرداخت موفق -->
      <div v-else-if="status === 'success'" class="glass-card rounded-3xl p-8 sm:p-10 text-center">
        <CheckCircle2 class="w-16 h-16 text-green-400 mx-auto mb-5" />
        <h1 class="text-2xl font-bold mb-2">پرداخت با موفقیت انجام شد</h1>
        <p class="text-gray-400 mb-6">
          سفارش «{{ order?.title }}» ثبت و فعال‌سازی آن آغاز شد.
          <span v-if="order?.customer?.email">جزئیات فاکتور به {{ order.customer.email }} ارسال می‌شود.</span>
        </p>

        <div class="rounded-2xl bg-white/5 border border-white/10 p-5 mb-8 text-sm text-right space-y-2.5">
          <div class="flex justify-between">
            <span class="text-gray-400">شماره پیگیری</span>
            <button type="button" class="flex items-center gap-1.5 text-gray-200 font-mono" dir="ltr" @click="copyOrderId">
              {{ order?.id }}
              <Copy class="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
          <div v-if="order?.cycleLabel" class="flex justify-between">
            <span class="text-gray-400">دوره</span>
            <span class="text-gray-200">{{ order.cycleLabel }}</span>
          </div>
          <div v-for="s in order?.summary || []" :key="s.label" class="flex justify-between">
            <span class="text-gray-400">{{ s.label }}</span>
            <span class="text-gray-200" dir="ltr">{{ s.value }}</span>
          </div>
          <div class="flex justify-between pt-2.5 border-t border-white/10 font-bold">
            <span>مبلغ پرداخت‌شده</span>
            <span>{{ formatPrice(order?.amount || 0) }} تومان</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink
            :to="dashboardLink"
            class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold"
          >
            <LayoutDashboard class="w-4 h-4" />
            مشاهده در پنل کاربری
          </NuxtLink>
          <NuxtLink
            v-if="order?.type !== 'invoice'"
            :to="`/dashboard/invoices/INV-${order?.id}`"
            class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all font-medium"
          >
            <Download class="w-4 h-4" />
            مشاهده فاکتور
          </NuxtLink>
        </div>
      </div>

      <!-- پرداخت ناموفق -->
      <div v-else class="glass-card rounded-3xl p-8 sm:p-10 text-center">
        <XCircle class="w-16 h-16 text-red-400 mx-auto mb-5" />
        <h1 class="text-2xl font-bold mb-2">پرداخت انجام نشد</h1>
        <p class="text-gray-400 mb-2">
          تراکنش برای سفارش «{{ order?.title }}» تکمیل نشد. مبلغی از حساب شما کسر نشده است.
        </p>
        <p v-if="order?.id" class="text-sm text-gray-500 mb-8">
          شماره پیگیری: <span class="text-red-300 font-mono" dir="ltr">{{ order.id }}</span>
        </p>
        <p v-else class="mb-8" />

        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink
            v-if="order?.id"
            :to="`/payment/gateway/${order.id}`"
            class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold"
          >
            <RefreshCcw class="w-4 h-4" />
            تلاش مجدد برای پرداخت
          </NuxtLink>
          <NuxtLink
            :to="retryLink"
            class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all font-medium"
          >
            بازگشت به {{ order?.type === 'cart' ? 'سبد خرید' : 'فرم سفارش' }}
          </NuxtLink>
        </div>
        <NuxtLink to="/support" class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mt-6">
          <LifeBuoy class="w-4 h-4" />
          نیاز به کمک دارید؟ تماس با پشتیبانی
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
