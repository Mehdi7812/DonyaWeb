<script setup>
import { Rocket, Search, Settings, CheckCircle2, ChevronLeft, Check } from 'lucide-vue-next'
import { ref } from 'vue'

useHead({
  title: 'شروع کنید | دنیاوب'
})

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
    features: ['۵۰ GB فضای NVMe', 'پهنای باند نامحدود', 'دیتابیس نامحدود', 'بک‌آپ روزانه', 'پشتیبانی اولویت‌دار'],
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
const domain = ref('')
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      <div class="inline-block mb-4 px-4 py-1 rounded-full glass text-sm text-purple-300 border border-purple-500/30">
        فقط ۳ قدم تا آنلاین شدن سایت شما
      </div>
      <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        بیایید <span class="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">شروع</span> کنیم
      </h1>
      <p class="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
        دامنه‌تان را انتخاب کنید، پلن مناسب را بردارید و در چند دقیقه سایت‌تان را راه‌اندازی کنید.
      </p>
    </section>

    <!-- Steps -->
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

    <!-- Domain check -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-16">
      <div class="glass-strong rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl">
        <input
          v-model="domain"
          type="text"
          placeholder="نام دامنه مورد نظر خود را وارد کنید..."
          class="flex-1 px-6 py-4 rounded-xl input-glass text-white placeholder-gray-400 outline-none text-lg"
        >
        <button class="px-8 py-4 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2">
          <Search class="w-5 h-5" />
          بررسی دامنه
        </button>
      </div>
    </section>

    <!-- Plan selection -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold mb-3">یک پلن <span class="gradient-text">انتخاب کنید</span></h2>
        <p class="text-gray-400">هر زمان می‌توانید پلن خود را ارتقا دهید</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <button
          v-for="plan in plans"
          :key="plan.id"
          type="button"
          class="text-right glass rounded-3xl p-8 border-2 transition-all relative"
          :class="selectedPlan === plan.id
            ? 'border-purple-500 shadow-2xl shadow-purple-500/20 -translate-y-2'
            : 'border-white/10 hover:border-purple-500/40'"
          @click="selectedPlan = plan.id"
        >
          <div
            v-if="plan.badge"
            class="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-linear-to-r from-purple-600 to-blue-600 text-sm font-bold whitespace-nowrap"
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

    <!-- CTA -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-24">
      <div class="glass-card rounded-3xl p-8 text-center">
        <p class="text-gray-400 mb-6">
          پلن انتخابی شما: <span class="text-purple-300 font-bold">{{ plans.find(p => p.id === selectedPlan)?.name }}</span>
        </p>
        <NuxtLink
          to="/register"
          class="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg shadow-purple-500/30"
        >
          ادامه و ساخت حساب کاربری
          <ChevronLeft class="w-5 h-5" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>