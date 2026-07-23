<script setup>
import { CheckCircle2, Check, Globe } from 'lucide-vue-next'

defineProps({
  domain: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change'])

const planModel = defineModel({ type: String, default: 'pro' })

const plans = [
  {
    id: 'basic',
    name: 'هاست پایه',
    price: '۴۹,۰۰۰',
    rawPrice: 49000,
    desc: 'مناسب برای سایت‌های شخصی',
    features: ['۱۰ GB فضای NVMe', 'پهنای باند نامحدود', '۱۰ دیتابیس', 'SSL رایگان']
  },
  {
    id: 'pro',
    name: 'هاست حرفه‌ای',
    price: '۱۲۹,۰۰۰',
    rawPrice: 129000,
    desc: 'مناسب برای فروشگاه‌های آنلاین',
    features: ['۵۰ GB فضای NVMe', 'پهنای باند نامحدود', 'دیتابیس نامحدود', 'بک‌آپ روزانه', 'پشتیبانی اولویت‌دار'],
    badge: 'پیشنهاد ویژه'
  },
  {
    id: 'business',
    name: 'هاست سازمانی',
    price: '۳۴۹,۰۰۰',
    rawPrice: 349000,
    desc: 'مناسب برای سازمان‌های بزرگ',
    features: ['۲۰۰ GB فضای NVMe', 'منابع اختصاصی', 'LiteSpeed Enterprise', 'پشتیبانی تلفنی']
  }
]

function choose(id) {
  planModel.value = id
  emit('change', id)
}
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
    <div class="text-center mb-4">
      <h2 class="text-3xl font-bold mb-3">یک پلن <span class="gradient-text">انتخاب کنید</span></h2>
      <p class="text-gray-400">هر زمان می‌توانید پلن خود را ارتقا دهید</p>
    </div>

    <div v-if="domain" class="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8">
      <Globe class="w-4 h-4 text-purple-400" />
      دامنه انتخابی: <span class="text-purple-300 font-medium" dir="ltr">{{ domain }}</span>
    </div>
    <div v-else class="mb-10" />

    <div class="grid md:grid-cols-3 gap-8 items-start">
      <button
        v-for="plan in plans"
        :key="plan.id"
        type="button"
        class="text-right glass rounded-3xl p-8 border-2 transition-all duration-300 relative"
        :class="planModel === plan.id
          ? 'border-purple-500 shadow-2xl shadow-purple-500/20 -translate-y-2'
          : 'border-white/10 hover:border-purple-500/40 hover:-translate-y-1'"
        @click="choose(plan.id)"
      >
        <div
          v-if="plan.badge"
          class="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-linear-to-r from-purple-600 to-blue-600 text-sm font-bold whitespace-nowrap shadow-lg"
        >
          {{ plan.badge }}
        </div>

        <div
          class="absolute top-6 left-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
          :class="planModel === plan.id ? 'border-purple-500 bg-purple-500' : 'border-white/30'"
        >
          <Check v-if="planModel === plan.id" class="w-4 h-4 text-white" />
        </div>

        <h3 class="text-xl font-bold mb-2" :class="planModel === plan.id ? 'text-purple-300' : ''">{{ plan.name }}</h3>
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
</template>
