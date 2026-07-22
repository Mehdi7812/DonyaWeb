<script setup>
import { Phone, Mail, MapPin, Instagram, Twitter, Linkedin } from 'lucide-vue-next'

const productLinks = [
  { label: 'هاست ابری', to: '/cloudhosting' },
  { label: 'VPS', to: '/vps' },
  { label: 'سرور اختصاصی', to: '/dedicatedserver' },
  { label: 'ثبت دامنه', to: '/domain' }
]
const supportLinks = [
  { label: 'درباره ما', to: '/about-us' },
  { label: 'ارتباط با ما', to: '/contact-us' },
  { label: 'مرکز آموزش', to: '#' },
  { label: 'وضعیت شبکه', to: '#' },
  { label: 'تماس با ما', to: '/support' },
  { label: 'قوانین خدمات', to: '/terms' }
]
</script>

<template>
  <footer class="border-t border-white/10 mt-20 glass">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <NuxtLink to="/" class="flex items-center gap-2 mb-4">
            <div class="flex items-center justify-center w-20">
              <NuxtImg src="/logo.png" cover />
            </div>
            <span class="text-xl font-bold">دنیاوب</span>
          </NuxtLink>
          <p class="text-gray-400 text-sm leading-relaxed">
            ارائه‌دهنده خدمات میزبانی ابری با تضمین uptime و امنیت بالا برای کسب‌وکارهای آنلاین.
          </p>
        </div>
        <div>
          <h4 class="font-bold mb-4">محصولات</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li v-for="l in productLinks" :key="l.label">
              <NuxtLink :to="l.to" class="hover:text-white transition-colors">{{ l.label }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">پشتیبانی</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li v-for="l in supportLinks" :key="l.label">
              <NuxtLink :to="l.to" class="hover:text-white transition-colors">{{ l.label }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">ارتباط با ما</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li class="flex items-center gap-2">
              <Phone class="w-4 h-4" />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </li>
            <li class="flex items-center gap-2">
              <Mail class="w-4 h-4" />
              support@donyaweb.ir
            </li>
            <li class="flex items-center gap-2">
              <MapPin class="w-4 h-4" />
              تهران، خیابان انقلاب
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-400 text-sm">© ۱۴۰۳ دنیاوب. تمامی حقوق محفوظ است.</p>
        <div class="flex gap-4">
          <a href="#" class="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all">
            <Instagram class="w-5 h-5" />
          </a>
          <a href="#" class="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all">
            <Twitter class="w-5 h-5" />
          </a>
          <a href="#" class="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all">
            <Linkedin class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>