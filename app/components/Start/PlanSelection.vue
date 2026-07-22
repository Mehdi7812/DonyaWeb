<script setup>
import { CheckCircle2, Check, ChevronLeft } from 'lucide-vue-next'

const plans = [
  {
    id: 'basic',
    name: 'هاست پایه',
    price: '۴۹,۰۰۰',
    desc: 'مناسب برای سایت‌های شخصی',
    features: ['۱۰ GB فضای NVMe', 'پهنای باند نامحدود', '۱۰ دیتابیس', 'SSL رایگان']
  },
  {
    id: 'pro',
    name: 'هاست حرفه‌ای',
    price: '۱۲۹,۰۰۰',
    desc: 'مناسب برای فروشگاه‌های آنلاین',
    features: ['۵۰ GBفضای NVMe', 'پهنای باند نامحدود', 'دیتابیس نامحدود', 'بک‌آپ روزانه', 'پشتیبانی اولویت‌دار'],
    badge: 'پیشنهاد ویژه'
  },
  {
    id: 'business',
    name: 'هاست سازمانی',
    price: '۳۴۹,۰۰۰',
    desc: 'مناسب برای سازمان‌های بزرگ',
    features: ['۲۰۰ GB فضای NVMe', 'منابع اختصاصی', 'LiteSpeed Enterprise', 'پشتیبانی تلفنی']
  }
]

const selectedPlan = ref('pro')

const selectedPlanName = computed(() => plans.find(p => p.id === selectedPlan.value)?.name)
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold mb-3">یک پلن <span class="gradient-text">انتخاب کنید</span></h2>
      <p class="text-gray-400">هر زمان می‌توانید پلن خود را ارتقا دهید</p>
    </div>

    <div class="grid md:grid-cols-3 gap-8 items-start">
      <button
        v-for="plan in plans"
        :key="plan.id"
        type="button"
        class="text-right glass rounded-3xl p-8 border-2 transition-all duration-300 relative"
        :class="selectedPlan === plan.id
          ? 'border-purple-500 shadow-2xl shadow-purple-500/20 -translate-y-2'
          : 'border-white/10 hover:border-purple-500/40 hover:-translate-y-1'"
        @click="selectedPlan = plan.id"
      >
        <div
          v-if="plan.badge"
          class="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-linear-to-r from-purple-600 to-blue-600 text-sm font-bold whitespace-nowrap shadow-lg"
        >
          {{ plan.badge }}
        </div>

        <div
          class="absolute top-6 left-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
          :class="selectedPlan === plan.id ? 'border-purple-500 bg-purple-500' : 'border-white/30'"
        >
          <Check v-if="selectedPlan === plan.id" class="w-4 h-4 text-white" />
        </div>

        <h3 class="text-xl font-bold mb-2" :class="selectedPlan === plan.id ? 'text-purple-300' : ''">{{ plan.name }}</h3>
        <div class="text-3xl font-bold mb-1">
          {{ plan.price }} <span class="text-sm font-normal text-gray-400">تومان/ماهانه</span>
        </div>
        <p class="text-gray-400 text-sm mb-6">{{ plan.desc }}</p>
        <ul class="space-y-3 text-gray-300 text-sm">
          <li v-for="f in plan.features" :key="f" class="flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-green-400 shrink-0" /> {{ f }}
          </li>
        </ul>
      </button>
    </div>
  </section>

  <!-- <section class="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-24">
    <div class="glass-card rounded-3xl p-8 text-center">
      <p class="text-gray-400 mb-6">
        پلن انتخابی شما: <span class="text-purple-300 font-bold">{{ selectedPlanName }}</span>
      </p>
      <NuxtLink
        :to="`/register?plan=${selectedPlan}`"
        class="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg shadow-purple-500/30"
      >
        ادامه و ساخت حساب کاربری
        <ChevronLeft class="w-5 h-5" />
      </NuxtLink>
    </div>
  </section> -->

  <section class="fixed bottom-0 left-0 right-0 p-4 sm:p-6 z-50 pointer-events-none">
      <div class="max-w-4xl mx-auto pointer-events-auto">
        <div class="glass-strong rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-purple-500/20 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] animate-fade-in-up animation-delay-500">
          <div>
            <span class="text-gray-400 text-sm block mb-1">پلن انتخابی شما:</span>
            <div class="text-xl font-bold text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {{ plans.find(p => p.id === selectedPlan)?.name }}
            </div>
          </div>
          
          <NuxtLink
            to="/register"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-bold text-white shadow-lg shadow-purple-500/30 group"
          >
            ادامه و ساخت حساب
            <ChevronLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </NuxtLink>
        </div>
      </div>
    </section>
</template>