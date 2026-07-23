<script setup>
import { Server, Cpu, HardDrive, CheckCircle } from 'lucide-vue-next'

const services = [
  {
    icon: Server,
    title: 'هاست ابری',
    desc: 'مناسب برای سایت‌های وردپرسی و فروشگاهی با سرعت NVMe و SSL رایگان',
    features: ['پنل مدیریت cPanel', 'بک‌آپ خودکار روزانه', 'پهنای باند نامحدود'],
    color: 'purple',
    button: 'مشاهده پلن‌ها',
    outline: true,
    to: '/cloudhosting'
  },
  {
    icon: Cpu,
    title: 'VPS ابری',
    desc: 'سرور مجازی با منابع اختصاصی و دسترسی روت کامل، مناسب برای پروژه‌های حرفه‌ای',
    features: ['CPU اختصاصی', 'دیسک NVMe', 'IP اختصاصی'],
    color: 'blue',
    button: 'شروع از ۲۹۰,۰۰۰ تومان',
    outline: false,
    badge: 'محبوب',
    to: '/vps'
  },
  {
    icon: HardDrive,
    title: 'سرور اختصاصی',
    desc: 'سخت‌افزار اختصاصی فیزیکی با بالاترین سطح امنیت و کنترل برای سازمان‌ها',
    features: ['دسترسی فیزیکی (IPMI)', 'RAID سخت‌افزاری', 'DDOS Protection'],
    color: 'pink',
    button: 'مشاوره رایگان',
    outline: true,
    to: '/dedicatedserver'
  }
]

const colorMap = {
  purple: {
    blob: 'bg-purple-500/20 group-hover:bg-purple-500/30',
    icon: 'from-purple-500 to-purple-700 shadow-purple-500/30',
    li: 'text-purple-400',
    btnOutline: 'border-purple-500/50 text-purple-300 hover:bg-purple-500/20'
  },
  blue: {
    blob: 'bg-blue-500/20 group-hover:bg-blue-500/30',
    icon: 'from-blue-500 to-blue-700 shadow-blue-500/30',
    li: 'text-blue-400',
    btnSolid: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/30'
  },
  pink: {
    blob: 'bg-pink-500/20 group-hover:bg-pink-500/30',
    icon: 'from-pink-500 to-pink-700 shadow-pink-500/30',
    li: 'text-pink-400',
    btnOutline: 'border-pink-500/50 text-pink-300 hover:bg-pink-500/20'
  }
}
</script>

<template>
  <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold mb-4">خدمات <span class="gradient-text">ابری</span> ما</h2>
      <p class="text-gray-400">راه‌حل‌های مقیاس‌پذیر برای هر نیازی</p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div
        v-for="service in services"
        :key="service.title"
        class="glass-card rounded-3xl p-8 hover-lift relative overflow-hidden group"
        :class="service.badge ? 'border-purple-500/30' : ''"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 transition-all"
          :class="colorMap[service.color].blob"
        ></div>

        <div v-if="service.badge" class="absolute top-4 left-4 px-3 py-1 rounded-full bg-linear-to-r from-purple-600 to-blue-600 text-xs font-bold">
          {{ service.badge }}
        </div>

        <div class="relative z-10">
          <div
            class="w-14 h-14 rounded-2xl bg-linear-to-br flex items-center justify-center mb-6 shadow-lg"
            :class="colorMap[service.color].icon"
          >
            <component :is="service.icon" class="w-7 h-7 text-white" />
          </div>
          <h3 class="text-2xl font-bold mb-3">{{ service.title }}</h3>
          <p class="text-gray-400 mb-6 leading-relaxed">{{ service.desc }}</p>
          <ul class="space-y-3 mb-8 text-gray-300">
            <li v-for="f in service.features" :key="f" class="flex items-center gap-2">
              <CheckCircle class="w-5 h-5" :class="colorMap[service.color].li" /> {{ f }}
            </li>
          </ul>
          <NuxtLink
            v-if="service.outline"
            :to="service.to"
            class="block text-center w-full py-3 rounded-xl border transition-all font-medium"
            :class="colorMap[service.color].btnOutline"
          >
            {{ service.button }}
          </NuxtLink>
          <NuxtLink
            v-else
            :to="service.to"
            class="block text-center w-full py-3 rounded-xl bg-linear-to-r transition-all font-medium shadow-lg"
            :class="colorMap[service.color].btnSolid"
          >
            {{ service.button }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>