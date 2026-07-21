<script setup>
import { ref } from 'vue'
import {
  Search, Check, Globe, ShieldCheck, Lock, RotateCcw, Loader2
} from 'lucide-vue-next'

useHead({
  title: 'ثبت دامنه | کلودینو'
})

// --- TLD price list ---
const tlds = [
  { ext: '.com', price: '۸۹,۰۰۰' },
  { ext: '.ir', price: '۴۵,۰۰۰' },
  { ext: '.net', price: '۹۵,۰۰۰' },
  { ext: '.org', price: '۹۹,۰۰۰' },
  { ext: '.io', price: '۳۹۰,۰۰۰' },
  { ext: '.co', price: '۲۱۰,۰۰۰' }
]

// --- Domain search (client-side mock availability, replace with real API) ---
const query = ref('')
const isSearching = ref(false)
const results = ref(null)

function searchDomain() {
  const name = query.value.trim().replace(/\s+/g, '-')
  if (!name) return

  isSearching.value = true
  results.value = null

  setTimeout(() => {
    results.value = tlds.map((t, i) => {
      const seed = (name.length + i * 7) % 5
      return {
        domain: `${name}${t.ext}`,
        available: seed !== 0,
        price: t.price
      }
    })
    isSearching.value = false
  }, 700)
}

// --- Why register with us ---
const features = [
  { icon: ShieldCheck, title: 'حریم خصوصی رایگان', desc: 'با ثبت WHOIS Privacy، اطلاعات هویتی شما از دید عموم پنهان می‌ماند' },
  { icon: Lock, title: 'قفل امنیتی دامنه', desc: 'جلوگیری از انتقال یا تغییرات غیرمجاز روی دامنه با یک کلیک' },
  { icon: RotateCcw, title: 'تمدید خودکار', desc: 'هیچ‌وقت دامنه‌تان را از دست نمی‌دهید؛ تمدید خودکار پیش از انقضا' }
]
</script>

<template>
  <div>
    <!-- Hero + Search -->
    <section class="relative pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      <div class="inline-block mb-4 px-4 py-1 rounded-full glass text-sm text-purple-300 border border-purple-500/30">
        <Globe class="inline w-4 h-4 -mt-1 ml-1" /> بیش از ۲۰۰ پسوند دامنه
      </div>

      <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        دامنه‌ی <span class="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">رویایی‌ات</span> را همین حالا پیدا کن
      </h1>

      <p class="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
        نام دامنه مورد نظرت را جستجو کن، در دسترس بودنش را ببین و در چند ثانیه ثبتش کن.
      </p>

      <div class="max-w-3xl mx-auto mb-6">
        <form class="glass-strong rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl" @submit.prevent="searchDomain">
          <input
            v-model="query"
            type="text"
            placeholder="نام دامنه مورد نظر خود را وارد کنید..."
            class="flex-1 px-6 py-4 rounded-xl input-glass text-white placeholder-gray-400 text-lg"
          >
          <button
            type="submit"
            :disabled="isSearching"
            class="px-8 py-4 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Loader2 v-if="isSearching" class="w-5 h-5 animate-spin" />
            <Search v-else class="w-5 h-5" />
            {{ isSearching ? 'در حال جستجو...' : 'جستجو دامنه' }}
          </button>
        </form>

        <div class="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-400">
          <span v-for="t in tlds" :key="t.ext" class="flex items-center gap-1">
            <Check class="w-4 h-4 text-green-400" /> {{ t.ext }} {{ t.price }} تومان
          </span>
        </div>
      </div>

      <!-- Search Results -->
      <Transition name="fade">
        <div v-if="results" class="max-w-3xl mx-auto grid gap-3 mt-8">
          <div
            v-for="r in results"
            :key="r.domain"
            class="glass-card rounded-2xl px-6 py-4 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full" :class="r.available ? 'bg-green-400' : 'bg-red-400'" />
              <span class="text-lg font-medium" dir="ltr">{{ r.domain }}</span>
            </div>

            <div class="flex items-center gap-4">
              <span class="text-sm" :class="r.available ? 'text-green-400' : 'text-red-400'">
                {{ r.available ? 'در دسترس' : 'قبلاً ثبت شده' }}
              </span>
              <span v-if="r.available" class="text-gray-300 text-sm hidden sm:block">{{ r.price }} تومان</span>
              <NuxtLink
                v-if="r.available"
                :to="`/checkout-domain?domain=${r.domain}`"
                class="px-4 py-2 rounded-lg bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
              >
                ثبت دامنه
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </section>

    <!-- Why register with us -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <div class="glass rounded-3xl p-8 md:p-16 relative overflow-hidden">
        <div class="absolute inset-0 bg-linear-to-r from-purple-900/20 to-blue-900/20" />
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-bold mb-10 text-center">
            چرا دامنه‌ات را از <span class="text-purple-400">کلودینو</span> بگیری؟
          </h2>

          <div class="grid md:grid-cols-3 gap-8">
            <div v-for="f in features" :key="f.title" class="text-center">
              <div class="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
                <component :is="f.icon" class="w-7 h-7" />
              </div>
              <h4 class="font-bold text-lg mb-2">{{ f.title }}</h4>
              <p class="text-gray-400 leading-relaxed">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TLD Pricing Grid -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold mb-3">قیمت <span class="gradient-text">پسوندهای</span> محبوب</h2>
        <p class="text-gray-400">ثبت، انتقال و تمدید دامنه با بهترین نرخ بازار</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div v-for="t in tlds" :key="t.ext" class="glass-card rounded-2xl p-6 text-center hover-lift">
          <div class="text-2xl font-bold text-purple-400 mb-2" dir="ltr">{{ t.ext }}</div>
          <div class="text-gray-300 text-sm">{{ t.price }} تومان</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>