<script setup>
import { ref } from 'vue'
import { Users, Copy, Check, Wallet, Clock3, Percent } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'همکاری در فروش | دنیاوب'
})

const { affiliate } = useDashboard()

const copied = ref(false)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(affiliate.link)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // خطای کپی (مثلاً عدم دسترسی به clipboard) نادیده گرفته می‌شود
  }
}

function formatNumber(n) {
  return n.toLocaleString('fa-IR')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Referral link -->
    <div class="glass-card rounded-3xl p-6 sm:p-8">
      <h2 class="text-lg font-bold mb-2 flex items-center gap-2">
        <Users class="w-5 h-5 text-purple-400" />
        لینک اختصاصی همکاری در فروش
      </h2>
      <p class="text-gray-400 text-sm mb-5">
        این لینک را با دوستان و مخاطبان خود به اشتراک بگذارید و به ازای هر خرید موفق، {{ affiliate.commissionRate }}٪ پورسانت دریافت کنید.
      </p>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 px-4 py-3 rounded-xl bg-white/5 text-sm text-gray-300 truncate" dir="ltr">
          {{ affiliate.link }}
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm shadow-lg shadow-purple-500/30 flex-shrink-0"
          @click="copyLink"
        >
          <component :is="copied ? Check : Copy" class="w-4 h-4" />
          {{ copied ? 'کپی شد!' : 'کپی لینک' }}
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-3">کد معرف شما: <span class="text-gray-300" dir="ltr">{{ affiliate.code }}</span></p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <DashboardStatCard :icon="Users" label="افراد معرفی‌شده" :value="affiliate.stats.referred" color="from-purple-500 to-blue-600" />
      <DashboardStatCard :icon="Wallet" label="درآمد کسب‌شده (تومان)" :value="formatNumber(affiliate.stats.earned)" color="from-green-500 to-emerald-600" />
      <DashboardStatCard :icon="Clock3" label="در انتظار تسویه (تومان)" :value="formatNumber(affiliate.stats.pending)" color="from-yellow-500 to-orange-500" />
      <DashboardStatCard :icon="Percent" label="نرخ پورسانت" :value="`${affiliate.commissionRate}٪`" color="from-pink-500 to-purple-600" />
    </div>

    <!-- Referrals table -->
    <div class="glass-card rounded-3xl overflow-hidden">
      <h3 class="font-bold p-6 pb-4">آخرین معرفی‌ها</h3>
      <div v-if="affiliate.referrals.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/10 text-gray-400 text-right">
              <th class="px-6 py-3 font-medium">نام</th>
              <th class="px-6 py-3 font-medium">سرویس خریداری‌شده</th>
              <th class="px-6 py-3 font-medium">پورسانت (تومان)</th>
              <th class="px-6 py-3 font-medium">تاریخ</th>
              <th class="px-6 py-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in affiliate.referrals" :key="i" class="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <td class="px-6 py-4 font-medium">{{ r.name }}</td>
              <td class="px-6 py-4 text-gray-300">{{ r.service }}</td>
              <td class="px-6 py-4 text-gray-300">{{ r.commission }}</td>
              <td class="px-6 py-4 text-gray-400">{{ r.date }}</td>
              <td class="px-6 py-4"><DashboardStatusBadge :status="r.status" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-gray-400 text-sm text-center py-10">هنوز کسی از طریق لینک شما ثبت‌نام نکرده است.</p>
    </div>
  </div>
</template>
