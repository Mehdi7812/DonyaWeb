<script setup>
import { SlidersHorizontal, ChevronDown } from 'lucide-vue-next'

useHead({
  title: 'شروع کنید | دنیاوب'
})

// --- state shared across the flow ---
const selectedDomain = ref('')
const selectedPlan = ref('pro')
const planTouched = ref(false)
const showConfig = ref(false)

const config = ref({
  location: '',
  os: '',
  controlPanel: 'بدون کنترل پنل',
  backup: 'بدون بکاپ',
  billing: 'ماهانه',
  ipv4: 1,
  hostname: '',
  password: '',
  monitoring: false,
  firewall: false,
  snapshot: false,
  prioritySupport: false
})

// lightweight lookup mirroring Start/PlanSelection.vue, only used for the summary bar
const plans = {
  basic: { name: 'هاست پایه', price: 49000 },
  pro: { name: 'هاست حرفه‌ای', price: 129000 },
  business: { name: 'هاست سازمانی', price: 349000 }
}

const activePlan = computed(() => plans[selectedPlan.value])

const currentStep = computed(() => {
  if (!selectedDomain.value) return 1
  if (!planTouched.value) return 2
  return 3
})

function handlePlanChange() {
  planTouched.value = true
}

function onDomainSelected() {
  nextTick(() => {
    const el = document.getElementById('step-plan')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
</script>

<template>
  <div class="pb-32 md:pb-28">
    <!-- Hero -->
    <StartHero />

    <!-- Steps -->
    <StartSteps :current-step="currentStep" />

    <!-- Domain check -->
    <div id="step-domain">
      <StartDomain v-model="selectedDomain" @select="onDomainSelected" />
    </div>

    <!-- Plan selection -->
    <div id="step-plan">
      <StartPlanSelection v-model="selectedPlan" :domain="selectedDomain" @change="handlePlanChange" />
    </div>

    <!-- Optional advanced configuration -->
    <section id="step-launch" class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <button
        type="button"
        class="w-full flex items-center justify-between gap-3 glass-card rounded-2xl px-6 py-5 hover:bg-white/5 transition-colors"
        :aria-expanded="showConfig"
        @click="showConfig = !showConfig"
      >
        <span class="flex items-center gap-3 font-bold">
          <span class="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center shrink-0">
            <SlidersHorizontal class="w-5 h-5 text-purple-300" />
          </span>
          تنظیمات اختصاصی سرویس
          <span class="text-sm font-normal text-gray-400">(اختیاری)</span>
        </span>
        <ChevronDown
          class="w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0"
          :class="showConfig ? 'rotate-180' : ''"
        />
      </button>

      <!-- انیمیشن نرم بازشدن آکاردئون با تکنیک grid-template-rows (بدون جهش ارتفاع) -->
      <div
        class="grid transition-all duration-300 ease-in-out"
        :class="showConfig ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
      >
        <div class="overflow-hidden">
          <div class="mt-6 glass rounded-3xl p-6 md:p-8 border border-purple-500/10">
            <StartConfigurationForm v-model="config" :domain="selectedDomain" />
          </div>
        </div>
      </div>
    </section>

    <StartFaqSection />

    <!-- Sticky order summary -->
    <StartOrderSummary
      :domain="selectedDomain"
      :plan-id="selectedPlan"
      :plan-name="activePlan.name"
      :plan-price="activePlan.price"
    />
  </div>
</template>