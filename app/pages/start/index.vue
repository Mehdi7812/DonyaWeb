<script setup>
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-vue-next'

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
        class="w-full flex items-center justify-between gap-3 glass-card rounded-2xl px-6 py-5 hover:bg-white/5 transition"
        @click="showConfig = !showConfig"
      >
        <span class="flex items-center gap-3 font-bold">
          <SlidersHorizontal class="w-5 h-5 text-purple-400" />
          تنظیمات اختصاصی سرویس
          <span class="text-sm font-normal text-gray-400">(اختیاری)</span>
        </span>
        <ChevronUp v-if="showConfig" class="w-5 h-5 text-gray-400" />
        <ChevronDown v-else class="w-5 h-5 text-gray-400" />
      </button>

      <Transition
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showConfig" class="mt-6 glass rounded-3xl p-6 md:p-8 border border-purple-500/10">
          <StartConfigurationForm v-model="config" :domain="selectedDomain" />
        </div>
      </Transition>
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
