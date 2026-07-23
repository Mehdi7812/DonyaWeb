<script setup>
import { reactive } from 'vue'
import { Globe, ShieldCheck, Lock, Unlock, RotateCcw, ArrowLeftRight, Plus, Server } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'مدیریت دامنه‌ها | دنیاوب'
})

const { getDomainServices, getDomainDetails } = useDashboard()

const domains = getDomainServices()

// وضعیت محلی سوییچ‌ها (تمدید خودکار / قفل / حریم خصوصی) — در نبود API واقعی به‌صورت نمایشی است
const localSettings = reactive(
  Object.fromEntries(domains.map((d) => [d.id, { ...getDomainDetails(d.identifier) }]))
)

function toggle(id, key) {
  localSettings[id][key] = !localSettings[id][key]
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <p class="text-gray-400 text-sm">مدیریت نیم‌سرورها، قفل انتقال، حریم‌خصوصی واتس و تمدید خودکار دامنه‌های خود را از اینجا انجام دهید.</p>
      <div class="flex gap-2 shrink-0">
        <NuxtLink
          to="/dashboard/domains/transfer"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 transition-all text-sm font-medium"
        >
          <ArrowLeftRight class="w-4 h-4" />
          انتقال دامنه
        </NuxtLink>
        <NuxtLink
          to="/domain"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm shadow-lg shadow-purple-500/30"
        >
          <Plus class="w-4 h-4" />
          ثبت دامنه جدید
        </NuxtLink>
      </div>
    </div>

    <div v-if="domains.length" class="space-y-4">
      <div v-for="d in domains" :key="d.id" class="glass-card rounded-2xl p-6 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-11 h-11 rounded-xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center shrink-0">
              <Globe class="w-5 h-5 text-white" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-bold" dir="ltr">{{ d.identifier }}</h3>
                <DashboardStatusBadge :status="d.status" />
              </div>
              <p class="text-gray-500 text-xs mt-1">تاریخ انقضا: {{ d.renewDate }}</p>
            </div>
          </div>

          <NuxtLink
            :to="`/dashboard/domains/renew?domain=${d.identifier}`"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all text-sm shrink-0"
          >
            <RotateCcw class="w-4 h-4" />
            تمدید دامنه
          </NuxtLink>
        </div>

        <div class="grid sm:grid-cols-3 gap-3">
          <button
            type="button"
            class="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm"
            @click="toggle(d.id, 'autoRenew')"
          >
            <span class="flex items-center gap-2 text-gray-300"><RotateCcw class="w-4 h-4" /> تمدید خودکار</span>
            <span
              dir="ltr"
              class="w-10 h-6 rounded-full relative transition-colors shrink-0"
              :class="localSettings[d.id].autoRenew ? 'bg-purple-600' : 'bg-white/20'"
            >
              <span
                class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                :class="localSettings[d.id].autoRenew ? 'translate-x-4' : 'translate-x-0'"
              />
            </span>
          </button>

          <button
            type="button"
            class="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm"
            @click="toggle(d.id, 'locked')"
          >
            <span class="flex items-center gap-2 text-gray-300">
              <component :is="localSettings[d.id].locked ? Lock : Unlock" class="w-4 h-4" />
              قفل انتقال
            </span>
            <span
              dir="ltr"
              class="w-10 h-6 rounded-full relative transition-colors shrink-0"
              :class="localSettings[d.id].locked ? 'bg-purple-600' : 'bg-white/20'"
            >
              <span
                class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                :class="localSettings[d.id].locked ? 'translate-x-4' : 'translate-x-0'"
              />
            </span>
          </button>

          <button
            type="button"
            class="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm"
            @click="toggle(d.id, 'privacy')"
          >
            <span class="flex items-center gap-2 text-gray-300"><ShieldCheck class="w-4 h-4" /> حریم خصوصی WHOIS</span>
            <span
              dir="ltr"
              class="w-10 h-6 rounded-full relative transition-colors shrink-0"
              :class="localSettings[d.id].privacy ? 'bg-purple-600' : 'bg-white/20'"
            >
              <span
                class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                :class="localSettings[d.id].privacy ? 'translate-x-4' : 'translate-x-0'"
              />
            </span>
          </button>
        </div>

        <div class="pt-4 border-t border-white/10">
          <p class="text-xs text-gray-500 mb-2 flex items-center gap-1.5"><Server class="w-3.5 h-3.5" /> نیم‌سرورها (DNS)</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="ns in localSettings[d.id].nameservers"
              :key="ns"
              class="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 font-mono"
              dir="ltr"
            >
              {{ ns }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="glass-card rounded-3xl p-12 text-center text-gray-400">
      هنوز دامنه‌ای در حساب شما ثبت نشده است.
      <NuxtLink to="/domain" class="text-purple-300 hover:text-purple-200 transition-colors block mt-2">ثبت اولین دامنه</NuxtLink>
    </div>
  </div>
</template>
