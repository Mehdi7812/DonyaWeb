<template>
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="c in channels" :key="c.title" class="glass-card rounded-3xl p-8 text-center hover-lift flex flex-col justify-between">
          <div class="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-500/30">
            <component :is="c.icon" class="w-7 h-7 text-white" />
          </div>

          <h3 class="text-lg font-bold mb-2">{{ c.title }}</h3>

          <p class="text-gray-400 text-sm leading-relaxed mb-5">{{ c.desc }}</p>

          <button type="button" class="w-full py-3 rounded-xl border border-purple-500/50 text-purple-300 hover:bg-purple-500/20 transition-all font-medium text-sm" dir="ltr">
            {{ c.action }}
          </button>
        </div>
      </div>
    </section>
</template>

<script setup>
import { Phone, Mail, MessageCircle } from 'lucide-vue-next'

    // --- Contact channels ---
const channels = [
  {
    icon: MessageCircle,
    title: 'چت آنلاین',
    desc: 'سریع‌ترین راه ارتباط، پاسخ‌گویی معمولاً زیر ۵ دقیقه',
    action: 'شروع گفتگو'
  },
  {
    icon: Phone,
    title: 'تماس تلفنی',
    desc: 'پشتیبانی تلفنی ۲۴ ساعته، همه روزهای هفته',
    action: '۰۲۱-۹۱۰۹۰۶۰۵'
  },
  {
    icon: Mail,
    title: 'ایمیل',
    desc: 'برای درخواست‌های فنی و مستندات، پاسخ زیر ۲۴ ساعت',
    action: 'support@donyaweb.com'
  }
]
</script>