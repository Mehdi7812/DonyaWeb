<script setup>
import { Search, Settings, Rocket, Check } from 'lucide-vue-next'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 1
  }
})

const steps = [
  {
    step: 1,
    icon: Search,
    title: 'انتخاب دامنه',
    desc: 'نام دامنه مورد نظرتان را جستجو و ثبت کنید',
    anchor: 'step-domain'
  },
  {
    step: 2,
    icon: Settings,
    title: 'انتخاب پلن',
    desc: 'یکی از پلن‌های هاست را متناسب با نیازتان انتخاب کنید',
    anchor: 'step-plan'
  },
  {
    step: 3,
    icon: Rocket,
    title: 'راه‌اندازی',
    desc: 'در کمتر از چند دقیقه سایت شما آماده و آنلاین می‌شود',
    anchor: 'step-launch'
  }
]

function goTo(anchor) {
  const el = document.getElementById(anchor)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20">
    <div class="grid md:grid-cols-3 gap-6 relative">
      <!-- Connector line (desktop only) -->
      <div class="hidden md:block absolute top-10 right-[16.66%] left-[16.66%] h-0.5 bg-white/10 z-0">
        <div
          class="h-full bg-linear-to-l from-purple-500 to-blue-500 transition-all duration-500"
          :style="{ width: currentStep >= 3 ? '100%' : currentStep === 2 ? '50%' : '0%' }"
        />
      </div>

      <button
        v-for="step in steps"
        :key="step.title"
        type="button"
        class="text-right glass-card rounded-2xl p-6 relative hover-lift group transition-all duration-300"
        :class="currentStep === step.step ? 'border border-purple-500/50 shadow-lg shadow-purple-500/10' : ''"
        @click="goTo(step.anchor)"
      >
        <div class="absolute top-4 left-4 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
          {{ step.step }}
        </div>

        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg transition-all"
          :class="currentStep > step.step
            ? 'bg-linear-to-br from-green-500 to-emerald-600 shadow-green-500/30'
            : currentStep === step.step
              ? 'bg-linear-to-br from-purple-500 to-blue-600 shadow-purple-500/30 group-hover:scale-110'
              : 'bg-white/10 shadow-none'"
        >
          <Check v-if="currentStep > step.step" class="w-6 h-6 text-white" />
          <component :is="step.icon" v-else class="w-6 h-6 text-white" />
        </div>

        <h3 class="text-lg font-bold mb-2" :class="currentStep === step.step ? 'text-purple-300' : ''">
          {{ step.title }}
        </h3>
        <p class="text-gray-400 text-sm leading-relaxed">{{ step.desc }}</p>

        <span
          v-if="currentStep === step.step"
          class="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-purple-500 animate-pulse"
        />
      </button>
    </div>
  </section>
</template>
