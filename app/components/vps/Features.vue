<template>
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
</template>

<script setup>
import { HardDrive, KeyRound, RotateCcw, Layers } from 'lucide-vue-next'

const features = [
  { icon: KeyRound, title: 'دسترسی روت کامل', desc: 'کنترل کامل روی سرور، نصب هر نرم‌افزار یا تنظیمات دلخواه' },
  { icon: HardDrive, title: 'دیسک NVMe اختصاصی', desc: 'فضای ذخیره‌سازی پرسرعت و کاملاً اختصاصی برای هر سرور مجازی' },
  { icon: RotateCcw, title: 'اسنپ‌شات و بازیابی', desc: 'گرفتن نسخه پشتیبان لحظه‌ای و بازگردانی سریع در صورت نیاز' },
  { icon: Layers, title: 'انتخاب سیستم‌عامل', desc: 'اوبونتو، دبیان، سنت‌او‌اس، ویندوز و بسیاری دیگر با نصب یک‌کلیکه' }
]
</script>