<template>
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          class="glass-card rounded-2xl p-6 relative hover-lift"
        >
          <div class="absolute top-4 left-4 text-5xl font-bold text-white/5">{{ index + 1 }}</div>
          <div class="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <component :is="step.icon" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-bold mb-2">{{ step.title }}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </section>
</template>

<script setup>
import { Rocket, Search, Settings } from 'lucide-vue-next'

const steps = [
  {
    icon: Search,
    title: 'انتخاب دامنه',
    desc: 'نام دامنه مورد نظرتان را جستجو و ثبت کنید'
  },
  {
    icon: Settings,
    title: 'انتخاب پلن',
    desc: 'یکی از پلن‌های هاست را متناسب با نیازتان انتخاب کنید'
  },
  {
    icon: Rocket,
    title: 'راه‌اندازی',
    desc: 'در کمتر از چند دقیقه سایت شما آماده و آنلاین می‌شود'
  }
]
</script>