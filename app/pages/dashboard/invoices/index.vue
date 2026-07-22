<script setup>
import { Eye } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'صورت‌حساب‌ها | دنیاوب'
})

const { invoices } = useDashboard()
</script>

<template>
  <div class="glass-card rounded-3xl overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/10 text-gray-400 text-right">
            <th class="px-6 py-4 font-medium">شماره فاکتور</th>
            <th class="px-6 py-4 font-medium">سرویس</th>
            <th class="px-6 py-4 font-medium">مبلغ (تومان)</th>
            <th class="px-6 py-4 font-medium">تاریخ</th>
            <th class="px-6 py-4 font-medium">وضعیت</th>
            <th class="px-6 py-4 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="inv in invoices"
            :key="inv.id"
            class="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
          >
            <td class="px-6 py-4 font-medium" dir="ltr">{{ inv.id }}</td>
            <td class="px-6 py-4 text-gray-300">{{ inv.service }}</td>
            <td class="px-6 py-4 text-gray-300">{{ inv.amount }}</td>
            <td class="px-6 py-4 text-gray-400">{{ inv.date }}</td>
            <td class="px-6 py-4"><DashboardStatusBadge :status="inv.status" /></td>
            <td class="px-6 py-4">
              <NuxtLink
                :to="`/dashboard/invoices/${inv.id}`"
                class="inline-flex items-center gap-1.5 text-purple-300 hover:text-purple-200 transition-colors"
              >
                <Eye class="w-4 h-4" />
                مشاهده
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
