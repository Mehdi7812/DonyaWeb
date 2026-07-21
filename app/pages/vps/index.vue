<script setup>
import { Cpu, HardDrive, Wifi, KeyRound, RotateCcw, Layers, Check } from 'lucide-vue-next'
import { ref } from 'vue'

useHead({
  title: 'VPS ابری | کلودینو'
})

const features = [
  { icon: KeyRound, title: 'دسترسی روت کامل', desc: 'کنترل کامل روی سرور، نصب هر نرم‌افزار یا تنظیمات دلخواه' },
  { icon: HardDrive, title: 'دیسک NVMe اختصاصی', desc: 'فضای ذخیره‌سازی پرسرعت و کاملاً اختصاصی برای هر سرور مجازی' },
  { icon: RotateCcw, title: 'اسنپ‌شات و بازیابی', desc: 'گرفتن نسخه پشتیبان لحظه‌ای و بازگردانی سریع در صورت نیاز' },
  { icon: Layers, title: 'انتخاب سیستم‌عامل', desc: 'اوبونتو، دبیان، سنت‌او‌اس، ویندوز و بسیاری دیگر با نصب یک‌کلیکه' }
]

const plans = [
  { id: 'vps1', name: 'VPS 1', cpu: '۱ هسته', ram: '۲ GB', disk: '۴۰ GB NVMe', bandwidth: '۱ TB', price: '۲۹۰,۰۰۰' },
  { id: 'vps2', name: 'VPS 2', cpu: '۲ هسته', ram: '۴ GB', disk: '۸۰ GB NVMe', bandwidth: '۲ TB', price: '۴۹۰,۰۰۰', badge: 'محبوب' },
  { id: 'vps3', name: 'VPS 3', cpu: '۴ هسته', ram: '۸ GB', disk: '۱۶۰ GB NVMe', bandwidth: '۴ TB', price: '۸۹۰,۰۰۰' },
  { id: 'vps4', name: 'VPS 4', cpu: '۶ هسته', ram: '۱۶ GB', disk: '۳۲۰ GB NVMe', bandwidth: '۸ TB', price: '۱,۴۹۰,۰۰۰' }
]

const selectedPlan = ref('vps2')
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      <div class="inline-block mb-4 px-4 py-1 rounded-full glass text-sm text-blue-300 border border-blue-500/30">
        منابع اختصاصی، بدون اشتراک‌گذاری با دیگران
      </div>
      <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        سرور مجازی <span class="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">VPS</span> ابری
      </h1>
      <p class="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
        قدرت و انعطاف یک سرور اختصاصی با قیمتی مقرون‌به‌صرفه؛ مناسب برای پروژه‌های حرفه‌ای، اپلیکیشن‌ها و سایت‌های پرترافیک.
      </p>
    </section>

    <!-- Features -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <div class="grid md:grid-cols-4 gap-6">
        <div v-for="f in features" :key="f.title" class="glass-card rounded-2xl p-6 hover-lift">
          <div class="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <component :is="f.icon" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-base font-bold mb-2">{{ f.title }}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Plans -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold mb-3">پلن‌های <span class="gradient-text">VPS</span></h2>
        <p class="text-gray-400">با رشد پروژه‌تان، پلن را هر زمان ارتقا دهید</p>
      </div>

      <div class="grid md:grid-cols-4 gap-6">
        <button
          v-for="plan in plans"
          :key="plan.id"
          type="button"
          class="text-right glass rounded-3xl p-6 border-2 transition-all relative"
          :class="selectedPlan === plan.id
            ? 'border-blue-500 shadow-2xl shadow-blue-500/20 -translate-y-2'
            : 'border-white/10 hover:border-blue-500/40'"
          @click="selectedPlan = plan.id"
        >
          <div
            v-if="plan.badge"
            class="absolute -top-4 right-1/2 translate-x-1/2 px-3 py-1 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-xs font-bold whitespace-nowrap"
          >
            {{ plan.badge }}
          </div>

          <div
            class="absolute top-5 left-5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
            :class="selectedPlan === plan.id ? 'border-blue-500 bg-blue-500' : 'border-white/30'"
          >
            <Check v-if="selectedPlan === plan.id" class="w-3 h-3 text-white" />
          </div>

          <h3 class="text-lg font-bold mb-3" :class="selectedPlan === plan.id ? 'text-blue-300' : ''">{{ plan.name }}</h3>
          <div class="text-2xl font-bold mb-4">
            {{ plan.price }} <span class="text-xs font-normal text-gray-400">تومان/ماهانه</span>
          </div>
          <ul class="space-y-2 text-gray-300 text-sm">
            <li class="flex items-center gap-2"><Cpu class="w-4 h-4 text-blue-400 shrink-0" /> {{ plan.cpu }}</li>
            <li class="flex items-center gap-2"><Layers class="w-4 h-4 text-blue-400 shrink-0" /> {{ plan.ram }} رم</li>
            <li class="flex items-center gap-2"><HardDrive class="w-4 h-4 text-blue-400 shrink-0" /> {{ plan.disk }}</li>
            <li class="flex items-center gap-2"><Wifi class="w-4 h-4 text-blue-400 shrink-0" /> {{ plan.bandwidth }} ترافیک</li>
          </ul>
        </button>
      </div>

      <div class="text-center mt-10">
        <NuxtLink
          :to="`/checkout-vps?plan=${selectedPlan}`"
          class="inline-flex px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg shadow-blue-500/30"
        >
          سفارش {{ plans.find(p => p.id === selectedPlan)?.name }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>