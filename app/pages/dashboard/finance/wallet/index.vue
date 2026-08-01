<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import {
  Wallet, Plus, ArrowDownLeft, ArrowUpRight, Landmark, Gift, FileText,
  Clock, TrendingUp, TrendingDown, Search, X, Loader2, ShieldCheck, Copy
} from 'lucide-vue-next'

const { toJalaliDate } = useJalaliDate()

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'کیف پول | دنیاوب'
})

const userCookie = useCookie("user_donyaweb")

const config = useRuntimeConfig()
const headers = useApiHeaders()

const { data: walletData, refresh: refreshWallet, pending: walletPending } = await useFetch(`${config.public.apiBase}/wallets/getBalance`,
  {
    method: 'POST',
    headers,
    immediate: false,
  }
)

const { data: transactionsData, refresh: refreshTransactions, pending: transactionsPending } = await useFetch(`${config.public.apiBase}/wallets/showTransactions`,
  {
    method: 'POST',
    headers,
    immediate: false,
  }
)

onMounted(async () => {
  await Promise.all([
    refreshWallet(),
    refreshTransactions(),
  ])
})

const user = ref(userCookie.value)

const { wallet, requestWithdraw } = useDashboard()
const toast = useToast()

const tomanWallet = computed(() =>
  walletData.value?.Wallets?.find(w => w.currency_symbol === 'IRT')
)

const state = reactive({
  balance: 0,
  history: [...wallet.history]
})

watch(
  tomanWallet,
  (wallet) => {
    if (wallet) {
      state.balance = Number(wallet.balance)
    }
  },
  { immediate: true }
)

function formatNumber(n) {
  return Math.abs(n).toLocaleString('fa-IR')
}

// --- آمار کلی ---
const totalDeposited = computed(() =>
  state.history.filter((t) => t.type === 'topup' && t.status === 'paid').reduce((sum, t) => sum + t.amount, 0)
)
const totalSpent = computed(() =>
  state.history.filter((t) => t.type === 'usage' && t.status === 'paid').reduce((sum, t) => sum + Math.abs(t.amount), 0)
)
const pendingCount = computed(() => state.history.filter((t) => t.status === 'pending').length)
const pendingItems = computed(() => state.history.filter((t) => t.status === 'pending'))

const statCards = computed(() => [
  { icon: Wallet, label: 'موجودی قابل استفاده', value: `${formatNumber(state.balance)} تومان`, color: 'from-purple-500 to-blue-600' },
  { icon: TrendingUp, label: 'مجموع واریزی‌ها', value: `${formatNumber(totalDeposited.value)} تومان`, color: 'from-green-500 to-emerald-600' },
  { icon: TrendingDown, label: 'مجموع مصرف', value: `${formatNumber(totalSpent.value)} تومان`, color: 'from-orange-500 to-red-500' },
  { icon: Clock, label: 'در انتظار تسویه', value: `${pendingCount.value} تراکنش`, color: 'from-yellow-500 to-amber-600' }
])

// --- نمودار ساده‌ی روند ۷ روز اخیر (داده نمایشی، بدون نیاز به پکیج نمودار) ---
const weeklyTrend = [
  { day: 'شنبه', deposit: 120, usage: 80 },
  { day: 'یکشنبه', deposit: 180, usage: 90 },
  { day: 'دوشنبه', deposit: 90, usage: 110 },
  { day: 'سه‌شنبه', deposit: 280, usage: 60 },
  { day: 'چهارشنبه', deposit: 150, usage: 130 },
  { day: 'پنجشنبه', deposit: 320, usage: 170 },
  { day: 'جمعه', deposit: 210, usage: 95 }
]
const trendMax = Math.max(...weeklyTrend.flatMap((d) => [d.deposit, d.usage]))

// --- فرم درخواست برداشت ---
const showWithdrawForm = ref(false)
const withdrawAmount = ref('')
const withdrawDestination = ref('')
const isWithdrawing = ref(false)

function toggleWithdrawForm() {
  showWithdrawForm.value = !showWithdrawForm.value
}

async function submitWithdraw() {
  const amount = Number(withdrawAmount.value)
  if (!amount || amount < 50000) {
    toast.error('حداقل مبلغ قابل برداشت ۵۰,۰۰۰ تومان است')
    return
  }
  if (amount > state.balance) {
    toast.error('مبلغ درخواستی بیشتر از موجودی کیف پول است')
    return
  }
  if (!withdrawDestination.value.trim()) {
    toast.error('لطفاً شماره کارت یا شبا مقصد را وارد کنید')
    return
  }

  isWithdrawing.value = true
  // TODO: اتصال به API واقعی ثبت درخواست برداشت (نیاز به تایید ادمین/بانک)
  await new Promise((resolve) => setTimeout(resolve, 900))

  const ok = requestWithdraw(amount, `کارت ${withdrawDestination.value.trim()}`)
  if (ok) {
    state.balance = wallet.balance
    state.history = [...wallet.history]
    toast.success('درخواست برداشت شما ثبت شد و پس از بررسی طی ۲۴ ساعت کاری واریز می‌شود.')
    withdrawAmount.value = ''
    withdrawDestination.value = ''
    showWithdrawForm.value = false
  } else {
    toast.error('ثبت درخواست برداشت با خطا مواجه شد')
  }
  isWithdrawing.value = false
}

// --- فیلتر و جستجوی تراکنش‌ها ---
const activeFilter = ref('all')
const searchQuery = ref('')

const filters = [
  { id: 'all', label: 'همه' },
  { id: 'topup', label: 'واریز' },
  { id: 'usage', label: 'مصرف' },
  { id: 'withdraw', label: 'برداشت' }
]

const typeMeta = {
  deposit: {
    label: 'واریز',
    color: 'text-green-400',
    icon: ArrowDownLeft,
  },

  purchase: {
    label: 'خرید',
    color: 'text-red-400',
    icon: ArrowUpRight,
  },

  withdraw: {
    label: 'برداشت',
    color: 'text-orange-400',
    icon: Landmark,
  },

  transfer: {
    label: 'انتقال',
    color: 'text-blue-400',
    icon: ArrowUpRight,
  },

  award: {
    label: 'پاداش',
    color: 'text-yellow-400',
    icon: Gift,
  },
}

const filteredHistory = computed(() => {
  const transactions = transactionsData.value?.WalletTransactions ?? []

  return transactions
    .map((t) => ({
      id: t.wallet_transactions_id,
      type: t.kind_text,
      amount: Number(t.amount),
      method: t.payment_procedure_title || t.gateway_title || '-',
      date: t.document_date,
      status: t.status_text,
      trackingCode: t.tracking_code,
    }))
    .filter((t) => {
      const matchesFilter =
        activeFilter.value === 'all' || t.type === activeFilter.value

      const q = searchQuery.value.trim().toLowerCase()

      const matchesSearch =
        !q ||
        String(t.id).includes(q) ||
        t.method.toLowerCase().includes(q)

      return matchesFilter && matchesSearch
    })
})

function copyBalance() {
  if (import.meta.client) {
    navigator.clipboard?.writeText(String(state.balance))
    toast.success('موجودی در کلیپ‌بورد کپی شد')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Hero: موجودی + اکشن‌های سریع -->
    <div class="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-8">
      <div class="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl" />
      <div class="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl" />

      <div class="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/30">
            <Wallet class="w-8 h-8 text-white" />
          </div>
          <div>
            <p class="text-gray-400 text-sm mb-1">موجودی قابل استفاده</p>
            <div class="flex items-center gap-2">
              <p class="text-3xl sm:text-4xl font-black">{{ formatNumber(state.balance) }}</p>
              <span class="text-base font-normal text-gray-400">تومان</span>
              <button type="button" class="text-gray-500 hover:text-white transition-colors" @click="copyBalance">
                <Copy class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <NuxtLink
            to="/dashboard/finance/topup"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30"
          >
            <Plus class="w-4 h-4" />
            افزایش موجودی
          </NuxtLink>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 hover:border-purple-500/40 transition-all font-bold"
            @click="toggleWithdrawForm"
          >
            <Landmark class="w-4 h-4" />
            برداشت وجه
          </button>
          <NuxtLink
            to="/dashboard/finance/gift-card"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 hover:border-purple-500/40 transition-all font-bold"
          >
            <Gift class="w-4 h-4" />
            کارت هدیه
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- فرم درخواست برداشت -->
    <div v-if="showWithdrawForm" class="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold flex items-center gap-2">
          <Landmark class="w-5 h-5 text-purple-400" />
          درخواست برداشت وجه
        </h2>
        <button type="button" class="text-gray-500 hover:text-white transition-colors" @click="showWithdrawForm = false">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-300 mb-2">مبلغ برداشت (تومان)</label>
          <input
            v-model="withdrawAmount"
            type="number"
            min="50000"
            placeholder="حداقل ۵۰,۰۰۰"
            class="w-full px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
          >
        </div>
        <div>
          <label class="block text-sm text-gray-300 mb-2">شماره کارت مقصد</label>
          <input
            v-model="withdrawDestination"
            type="text"
            dir="ltr"
            maxlength="16"
            placeholder="6037XXXXXXXXXXXX"
            class="w-full px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none text-left"
          >
        </div>
      </div>

      <div class="flex items-center gap-2 text-xs text-gray-500">
        <ShieldCheck class="w-4 h-4 shrink-0" />
        درخواست‌های برداشت پس از بررسی، طی حداکثر ۲۴ ساعت کاری به حساب اعلام‌شده واریز می‌شوند.
      </div>

      <button
        type="button"
        :disabled="isWithdrawing"
        class="w-full sm:w-auto px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        @click="submitWithdraw"
      >
        <Loader2 v-if="isWithdrawing" class="w-4 h-4 animate-spin" />
        <ArrowUpRight v-else class="w-4 h-4" />
        {{ isWithdrawing ? 'در حال ثبت درخواست...' : 'ثبت درخواست برداشت' }}
      </button>
    </div>

    <!-- آمار کلی -->
    <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <DashboardStatCard
        v-for="card in statCards"
        :key="card.label"
        :icon="card.icon"
        :label="card.label"
        :value="card.value"
        :color="card.color"
      />
    </div>

    <!-- نمودار روند هفتگی (SVG سبک، بدون نیاز به پکیج جانبی) -->
    <div class="glass-card rounded-3xl p-6 sm:p-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold">روند واریز و مصرف (۷ روز اخیر)</h2>
        <div class="flex items-center gap-4 text-xs text-gray-400">
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-500" /> واریز</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-400/60" /> مصرف</span>
        </div>
      </div>
      <div class="flex items-end justify-between gap-2 sm:gap-4 h-40">
        <div v-for="d in weeklyTrend" :key="d.day" class="flex-1 flex flex-col items-center gap-2">
          <div class="w-full flex items-end justify-center gap-1 h-32">
            <div
              class="w-1/2 max-w-3.5 rounded-t-md bg-linear-to-t from-purple-600 to-purple-400"
              :style="{ height: `${(d.deposit / trendMax) * 100}%` }"
            />
            <div
              class="w-1/2 max-w-3.5 rounded-t-md bg-linear-to-t from-blue-600/50 to-blue-400/50"
              :style="{ height: `${(d.usage / trendMax) * 100}%` }"
            />
          </div>
          <span class="text-[11px] text-gray-500">{{ d.day }}</span>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- جدول تراکنش‌ها -->
      <div class="lg:col-span-2 glass-card rounded-3xl overflow-hidden">
        <div class="p-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 class="text-lg font-bold">تاریخچه تراکنش‌ها</h2>
          <div class="flex items-center gap-3">
            <div class="relative">
              <Search class="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 right-3" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجوی شناسه یا روش..."
                class="w-full sm:w-56 pr-9 pl-3 py-2 rounded-lg input-glass text-sm text-white placeholder-gray-500 outline-none"
              >
            </div>
          </div>
        </div>

        <div class="px-6 flex items-center gap-2 overflow-x-auto pb-4">
          <button
            v-for="f in filters"
            :key="f.id"
            type="button"
            class="px-4 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap"
            :class="activeFilter === f.id
              ? 'bg-linear-to-r from-purple-600 to-blue-600 border-transparent'
              : 'glass border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40'"
            @click="activeFilter = f.id"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-y border-white/10 text-gray-400 text-right">
                <th class="px-6 py-3 font-medium">شناسه</th>
                <th class="px-6 py-3 font-medium">نوع</th>
                <th class="px-6 py-3 font-medium">مبلغ (تومان)</th>
                <th class="px-6 py-3 font-medium">روش</th>
                <th class="px-6 py-3 font-medium">تاریخ</th>
                <th class="px-6 py-3 font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="transactionsPending"
              >
                <td
                  colspan="6"
                  class="px-6 py-12 text-center text-gray-500"
                >
                  در حال دریافت تراکنش‌ها...
                </td>
              </tr>

              <tr
                v-else
                v-for="t in filteredHistory"
                :key="t.id"
                class="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <td class="px-6 py-4 font-medium" dir="ltr">
                  {{ t.id }}
                </td>

                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5"
                    :class="typeMeta[t.type]?.color"
                  >
                    <component
                      :is="typeMeta[t.type]?.icon"
                      class="w-4 h-4"
                    />
                    {{ typeMeta[t.type]?.label || t.type }}
                  </span>
                </td>

                <td class="px-6 py-4 text-gray-300" dir="ltr">
                  {{ formatNumber(t.amount) }}
                </td>

                <td class="px-6 py-4 text-gray-400">
                  {{ t.method }}
                </td>

                <td class="px-6 py-4 text-gray-400">
                  {{ t.date }}
                </td>

                <td class="px-6 py-4">
                  <DashboardStatusBadge :status="t.status" />
                </td>
              </tr>

              <tr
                v-if="!transactionsPending && !filteredHistory.length"
              >
                <td
                  colspan="6"
                  class="px-6 py-12 text-center text-gray-500"
                >
                  تراکنشی یافت نشد.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ستون کناری -->
      <div class="space-y-6">
        <!-- درخواست‌های در انتظار -->
        <div class="glass-card rounded-3xl overflow-hidden">
          <div class="p-5 border-b border-white/10">
            <h3 class="font-bold flex items-center gap-2">
              <Clock class="w-4 h-4 text-yellow-400" />
              درخواست‌های در انتظار
            </h3>
          </div>
          <div v-if="pendingItems.length" class="p-5 space-y-3">
            <div v-for="p in pendingItems" :key="p.id" class="rounded-xl bg-white/5 border border-white/10 p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-sm">{{ typeMeta[p.type]?.label || p.type }}</span>
                <DashboardStatusBadge :status="p.status" />
              </div>
              <p class="text-gray-400 text-sm" dir="ltr">{{ formatNumber(p.amount) }} تومان</p>
            </div>
          </div>
          <div v-else class="p-5 text-sm text-gray-500 text-center">
            درخواست در انتظاری وجود ندارد.
          </div>
        </div>

        <!-- دسترسی سریع -->
        <div class="glass-card rounded-3xl p-5 space-y-3">
          <h3 class="font-bold mb-1">دسترسی سریع</h3>
          <NuxtLink to="/dashboard/invoices" class="flex items-center gap-3 rounded-xl p-3 hover:bg-white/5 transition-colors">
            <div class="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <FileText class="w-4 h-4 text-purple-400" />
            </div>
            <span class="text-sm">فاکتورهای پرداخت‌نشده</span>
          </NuxtLink>
          <NuxtLink to="/dashboard/finance/gift-card" class="flex items-center gap-3 rounded-xl p-3 hover:bg-white/5 transition-colors">
            <div class="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Gift class="w-4 h-4 text-amber-400" />
            </div>
            <span class="text-sm">فعال‌سازی کارت هدیه</span>
          </NuxtLink>
        </div>

        <!-- اطلاعات حساب -->
        <div class="glass-card rounded-3xl overflow-hidden">
          <div class="p-5 border-b border-white/10">
            <h3 class="font-bold">اطلاعات حساب</h3>
          </div>
          <div class="divide-y divide-white/5 text-sm">
            <div class="flex justify-between p-4">
              <span class="text-gray-400">نام کاربر</span>
              <span class="font-medium">{{ user.full_name }}</span>
            </div>
            <div class="flex justify-between p-4">
              <span class="text-gray-400">ایمیل</span>
              <span class="font-medium" dir="ltr">{{ user.email }}</span>
            </div>
            <div class="flex justify-between p-4">
              <span class="text-gray-400">تاریخ عضویت</span>
              <span class="font-medium">{{ toJalaliDate(user.register_date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
