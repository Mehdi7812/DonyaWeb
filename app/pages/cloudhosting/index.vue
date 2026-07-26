<script setup>
import { Zap, ShieldCheck, RefreshCw, Database, Globe, Headphones } from 'lucide-vue-next'

useHead({
  title: 'هاست ابری | دنیاوب'
})

const features = [
  { icon: Zap, title: 'دیسک NVMe', desc: 'سرعت خواندن و نوشتن چند برابر هارد‌های معمولی برای بارگذاری سریع‌تر سایت' },
  { icon: ShieldCheck, title: 'SSL رایگان', desc: 'گواهی امنیتی Let’s Encrypt به‌صورت خودکار و رایگان روی همه دامنه‌ها نصب می‌شود' },
  { icon: RefreshCw, title: 'بک‌آپ خودکار', desc: 'پشتیبان‌گیری روزانه از فایل‌ها و دیتابیس با امکان بازگردانی یک‌کلیکه' },
  { icon: Database, title: 'دیتابیس نامحدود', desc: 'ساخت هر تعداد دیتابیس MySQL که پروژه‌تان نیاز دارد، بدون محدودیت' },
  { icon: Globe, title: 'پهنای باند نامحدود', desc: 'بدون نگرانی از ترافیک بازدیدکنندگان، حتی در روزهای پرترافیک' },
  { icon: Headphones, title: 'پشتیبانی ۲۴/۷', desc: 'تیم فنی متخصص در تمام ساعات شبانه‌روز پاسخگوی شماست' }
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      <div class="inline-flex items-center gap-1 mb-4 px-4 py-1 rounded-full glass text-sm text-purple-300 border border-purple-500/30">
        مناسب وردپرس، فروشگاه و سایت‌های شخصی
      </div>
      <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        هاست <span class="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">ابری</span> دنیاوب
      </h1>
      <p class="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
        میزبانی سریع، امن و مقیاس‌پذیر روی زیرساخت NVMe با پنل مدیریت cPanel، مناسب برای هر نوع سایتی از وبلاگ شخصی تا فروشگاه آنلاین پرترافیک.
      </p>
      <NuxtLink
        to="/start"
        class="inline-flex px-8 py-4 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg shadow-purple-500/30"
      >
        شروع کنید
      </NuxtLink>
    </section>

    <!-- Features -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20">
      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="f in features" :key="f.title" class="glass-card rounded-2xl p-6 hover-lift">
          <div class="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <component :is="f.icon" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-bold mb-2">{{ f.title }}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Pricing (shared component) -->
    <PricingSection />
  </div>
</template>