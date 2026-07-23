<script setup>
import { TicketPlus, ChevronLeft } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'تیکت‌های پشتیبانی | دنیاوب'
})

const priorityLabels = {
  high: { label: 'فوری', class: 'text-red-400' },
  normal: { label: 'عادی', class: 'text-yellow-400' },
  low: { label: 'کم', class: 'text-gray-400' }
}

const { tickets } = useDashboard()
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-end">
      <NuxtLink
        to="/dashboard/tickets/new"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm shadow-lg shadow-purple-500/30"
      >
        <TicketPlus class="w-4 h-4" />
        تیکت جدید
      </NuxtLink>
    </div>

    <div class="space-y-3">
      <NuxtLink
        v-for="t in tickets"
        :key="t.id"
        :to="`/dashboard/tickets/${t.id}`"
        class="glass-card rounded-2xl p-5 sm:p-6 flex items-center gap-4 hover-lift"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="text-xs text-gray-500" dir="ltr">{{ t.id }}</span>
            <span class="text-xs text-gray-600">·</span>
            <span class="text-xs text-gray-500">{{ t.department }}</span>
          </div>
          <h3 class="font-bold truncate">{{ t.subject }}</h3>
          <p class="text-gray-500 text-xs mt-1">{{ t.date }}</p>
        </div>

        <div class="hidden sm:flex items-center gap-2 text-xs font-medium" :class="priorityLabels[t.priority].class">
          اولویت: {{ priorityLabels[t.priority].label }}
        </div>

        <DashboardStatusBadge :status="t.status" />
        <ChevronLeft class="w-5 h-5 text-gray-500 shrink-0" />
      </NuxtLink>
    </div>
  </div>
</template>
