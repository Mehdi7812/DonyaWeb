<script setup>
import { computed, reactive, ref } from 'vue'
import { Network, Activity, Gauge, ShieldCheck, Plus, Globe } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'شبکه توزیع محتوا (CDN) | دنیاوب'
})

const { cdnZones, getDomainServices } = useDashboard()

const zones = reactive(cdnZones.map((z) => ({ ...z })))
const domains = getDomainServices()

function toggleZone(zone) {
  zone.status = zone.status === 'active' ? 'inactive' : 'active'
  if (zone.status === 'inactive') {
    zone.sslStatus = 'inactive'
  }
}

const showAddForm = ref(false)
const newDomain = ref('')

const availableDomains = computed(() =>
  domains.filter((d) => !zones.some((z) => z.domain === d.identifier))
)

const availableDomainOptions = computed(() =>
  availableDomains.value.map((d) => ({ label: d.identifier, value: d.identifier }))
)

function addZone() {
  if (!newDomain.value) return
  zones.push({
    id: `cdn-${zones.length + 1}`,
    domain: newDomain.value,
    status: 'active',
    plan: 'رایگان',
    traffic: '۰ مگابایت',
    requests: '۰',
    cacheHitRatio: 0,
    sslStatus: 'active'
  })
  newDomain.value = ''
  showAddForm.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <p class="text-gray-400 text-sm">با فعال‌سازی CDN، سرعت بارگذاری سایت افزایش می‌یابد و بار سرور اصلی کاهش پیدا می‌کند.</p>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm shadow-lg shadow-purple-500/30 shrink-0"
        @click="showAddForm = !showAddForm"
      >
        <Plus class="w-4 h-4" />
        افزودن دامنه به CDN
      </button>
    </div>

    <div v-if="showAddForm" class="glass-card rounded-2xl p-6 flex flex-col sm:flex-row gap-3 sm:items-end">
      <div class="flex-1">
        <label for="new-domain" class="block text-sm text-gray-300 mb-2">انتخاب دامنه</label>
        <StartCustomSelect
          id="new-domain"
          v-model="newDomain"
          :options="availableDomainOptions"
          placeholder="یک دامنه را انتخاب کنید"
        />
      </div>
      <button
        type="button"
        :disabled="!newDomain"
        class="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="addZone"
      >
        فعال‌سازی
      </button>
    </div>

    <div v-if="zones.length" class="space-y-4">
      <div v-for="z in zones" :key="z.id" class="glass-card rounded-2xl p-6 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-11 h-11 rounded-xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center shrink-0">
              <Network class="w-5 h-5 text-white" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-bold" dir="ltr">{{ z.domain }}</h3>
                <DashboardStatusBadge :status="z.status" />
              </div>
              <p class="text-gray-500 text-xs mt-1">پلن: {{ z.plan }}</p>
            </div>
          </div>

          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-medium border transition-all shrink-0"
            :class="z.status === 'active'
              ? 'border-red-500/30 text-red-300 hover:bg-red-500/10'
              : 'bg-linear-to-r from-purple-600 to-blue-600 border-transparent hover:from-purple-700 hover:to-blue-700'"
            @click="toggleZone(z)"
          >
            {{ z.status === 'active' ? 'غیرفعال‌سازی' : 'فعال‌سازی' }}
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="rounded-xl bg-white/5 p-4">
            <p class="text-xs text-gray-500 flex items-center gap-1.5 mb-1"><Activity class="w-3.5 h-3.5" /> ترافیک ماهانه</p>
            <p class="font-bold text-sm">{{ z.traffic }}</p>
          </div>
          <div class="rounded-xl bg-white/5 p-4">
            <p class="text-xs text-gray-500 flex items-center gap-1.5 mb-1"><Globe class="w-3.5 h-3.5" /> درخواست‌ها</p>
            <p class="font-bold text-sm">{{ z.requests }}</p>
          </div>
          <div class="rounded-xl bg-white/5 p-4 col-span-2 sm:col-span-1">
            <p class="text-xs text-gray-500 flex items-center gap-1.5 mb-2"><Gauge class="w-3.5 h-3.5" /> نرخ کش (Cache Hit)</p>
            <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full bg-linear-to-r from-purple-500 to-blue-500" :style="{ width: z.cacheHitRatio + '%' }" />
            </div>
            <p class="text-xs text-gray-400 mt-1">{{ z.cacheHitRatio }}٪</p>
          </div>
          <div class="rounded-xl bg-white/5 p-4">
            <p class="text-xs text-gray-500 flex items-center gap-1.5 mb-1"><ShieldCheck class="w-3.5 h-3.5" /> گواهی SSL</p>
            <DashboardStatusBadge :status="z.sslStatus" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="glass-card rounded-3xl p-12 text-center text-gray-400">
      هنوز هیچ دامنه‌ای به CDN متصل نشده است.
    </div>
  </div>
</template>
