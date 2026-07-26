<template>
    <section class="relative pt-40 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      <div class="inline-flex items-center gap-1 mb-4 px-4 py-1 rounded-full glass text-sm text-purple-300 border border-purple-500/30">
        <Gauge class="inline w-4 h-4 -mt-1 ml-1" /> تعهد رسمی دنیاوب به کیفیت خدمات
      </div>

      <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
        تعهدنامه سطح <span class="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">خدمات (SLA)</span>
      </h1>

      <p class="text-gray-400 max-w-2xl mx-auto mb-4">
        شفاف‌ترین تعهد ممکن درباره‌ی آپتایم، زمان پاسخ‌گویی پشتیبانی و جبران خسارت در صورت قطعی سرویس.
      </p>

      <p class="flex items-center justify-center gap-1.5 text-gray-400 text-sm">
        <Clock class="w-4 h-4" /> آخرین به‌روزرسانی: {{ lastUpdated }}
      </p>
    </section>
</template>

<script setup>
import { Clock, Gauge } from 'lucide-vue-next';

const lastUpdated = '۱۵ تیر ۱۴۰۳'
</script>
