<script setup>
import { reactive, ref } from 'vue'
import { Wallet, CreditCard, Landmark, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'افزایش موجودی کیف پول | دنیاوب'
})

const { wallet } = useDashboard()

const state = reactive({
  balance: wallet.balance,
  history: [...wallet.history]
})

const quickAmounts = [100000, 200000, 500000, 1000000]
const amount = ref(200000)
const customAmount = ref('')
const method = ref('gateway')
const isSubmitting = ref(false)
const successMessage = ref('')

function selectQuick(a) {
  amount.value = a
  customAmount.value = ''
}

function formatNumber(n) {
  return n.toLocaleString('fa-IR')
}

async function handleTopup() {
  successMessage.value = ''
  const finalAmount = customAmount.value ? Number(customAmount.value) : amount.value
  if (!finalAmount || finalAmount < 10000) return

  isSubmitting.value = true
  // TODO: اتصال به درگاه پرداخت واقعی (زرین‌پال / کارت بانکی)
  await new Promise((resolve) => setTimeout(resolve, 900))

  state.balance += finalAmount
  state.history.unshift({
    id: `TXN-${Math.floor(2000 + Math.random() * 900)}`,
    type: 'topup',
    amount: finalAmount,
    date: 'همین الان',
    status: 'paid',
    method: method.value === 'gateway' ? 'درگاه زرین‌پال' : 'کارت بانکی'
  })

  isSubmitting.value = false
  successMessage.value = `مبلغ ${formatNumber(finalAmount)} تومان با موفقیت به کیف پول اضافه شد.`
  customAmount.value = ''
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="glass-card rounded-3xl p-6 sm:p-8 flex items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Wallet class="w-7 h-7 text-white" />
        </div>
        <div>
          <p class="text-gray-400 text-sm mb-1">موجودی کیف پول</p>
          <p class="text-2xl font-bold">{{ formatNumber(state.balance) }} <span class="text-sm font-normal text-gray-400">تومان</span></p>
        </div>
      </div>
    </div>

    <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
      <h2 class="text-lg font-bold">افزایش موجودی</h2>

      <div v-if="successMessage" class="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm text-center">
        {{ successMessage }}
      </div>

      <div>
        <label class="block text-sm text-gray-300 mb-3">مبلغ شارژ</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <button
            v-for="a in quickAmounts"
            :key="a"
            type="button"
            class="py-3 rounded-xl text-sm font-medium border transition-all"
            :class="amount === a && !customAmount
              ? 'bg-linear-to-r from-purple-600 to-blue-600 border-transparent shadow-lg shadow-purple-500/30'
              : 'glass border-white/10 text-gray-300 hover:text-white hover:border-purple-500/40'"
            @click="selectQuick(a)"
          >
            {{ formatNumber(a) }}
          </button>
        </div>
        <input
          v-model="customAmount"
          type="number"
          min="10000"
          placeholder="یا مبلغ دلخواه را وارد کنید (تومان)"
          class="w-full px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
        >
      </div>

      <div>
        <label class="block text-sm text-gray-300 mb-3">روش پرداخت</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="flex items-center gap-2 justify-center py-3 rounded-xl text-sm font-medium border transition-all"
            :class="method === 'gateway'
              ? 'bg-linear-to-r from-purple-600 to-blue-600 border-transparent shadow-lg shadow-purple-500/30'
              : 'glass border-white/10 text-gray-300 hover:text-white hover:border-purple-500/40'"
            @click="method = 'gateway'"
          >
            <Landmark class="w-4 h-4" />
            درگاه زرین‌پال
          </button>
          <button
            type="button"
            class="flex items-center gap-2 justify-center py-3 rounded-xl text-sm font-medium border transition-all"
            :class="method === 'card'
              ? 'bg-linear-to-r from-purple-600 to-blue-600 border-transparent shadow-lg shadow-purple-500/30'
              : 'glass border-white/10 text-gray-300 hover:text-white hover:border-purple-500/40'"
            @click="method = 'card'"
          >
            <CreditCard class="w-4 h-4" />
            کارت بانکی
          </button>
        </div>
      </div>

      <button
        type="button"
        :disabled="isSubmitting"
        class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        @click="handleTopup"
      >
        <Plus class="w-4 h-4" />
        {{ isSubmitting ? 'در حال انتقال به درگاه...' : 'افزایش موجودی' }}
      </button>
    </div>

    <div class="glass-card rounded-3xl overflow-hidden">
      <h2 class="text-lg font-bold p-6 pb-0">تاریخچه تراکنش‌ها</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm mt-4">
          <thead>
            <tr class="border-b border-white/10 text-gray-400 text-right">
              <th class="px-6 py-3 font-medium">شناسه</th>
              <th class="px-6 py-3 font-medium">نوع</th>
              <th class="px-6 py-3 font-medium">مبلغ (تومان)</th>
              <th class="px-6 py-3 font-medium">روش</th>
              <th class="px-6 py-3 font-medium">تاریخ</th>
              <th class="px-6 py-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in state.history" :key="t.id" class="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <td class="px-6 py-4 font-medium" dir="ltr">{{ t.id }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5" :class="t.type === 'topup' ? 'text-green-400' : 'text-red-400'">
                  <component :is="t.type === 'topup' ? ArrowDownLeft : ArrowUpRight" class="w-4 h-4" />
                  {{ t.type === 'topup' ? 'واریز' : 'برداشت' }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-300" dir="ltr">{{ formatNumber(Math.abs(t.amount)) }}</td>
              <td class="px-6 py-4 text-gray-400">{{ t.method }}</td>
              <td class="px-6 py-4 text-gray-400">{{ t.date }}</td>
              <td class="px-6 py-4"><DashboardStatusBadge :status="t.status" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
