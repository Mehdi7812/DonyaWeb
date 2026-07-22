<script setup>
import { HeartHandshake, Eye, Lightbulb, Users } from 'lucide-vue-next'

const values = [
  { icon: HeartHandshake, title: 'اعتماد', desc: 'قول‌هایی که می‌دهیم را عملی می‌کنیم؛ بدون تبلیغات اغراق‌آمیز یا شرایط پنهان' },
  { icon: Eye, title: 'شفافیت', desc: 'قیمت‌گذاری روشن، وضعیت سرویس‌ها در دسترس عموم، بدون هزینه‌های غافلگیرکننده' },
  { icon: Lightbulb, title: 'نوآوری', desc: 'به‌روزرسانی مداوم زیرساخت با جدیدترین فناوری‌های سخت‌افزاری و نرم‌افزاری' },
  { icon: Users, title: 'مشتری‌مداری', desc: 'هر تصمیم ما با این سوال شروع می‌شود: این برای مشتری چه فایده‌ای دارد؟' }
]
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold mb-3">ارزش‌هایی که <span class="gradient-text">باور داریم</span></h2>
      <p class="text-gray-400">اصولی که هر تصمیم ما را در دنیاوب شکل می‌دهند</p>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
      <div v-for="v in values" :key="v.title" class="glass-card rounded-2xl p-6 hover-lift">
        <div class="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
          <component :is="v.icon" class="w-6 h-6 text-white" />
        </div>
        <h3 class="text-lg font-bold mb-2">{{ v.title }}</h3>
        <p class="text-gray-400 text-sm leading-relaxed">{{ v.desc }}</p>
      </div>
    </div>
  </section>
</template>
