<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav
    class="fixed w-full z-50 top-0 border-b border-white/10 transition-all"
    :class="scrolled ? 'glass-strong' : 'glass'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-20 flex items-center justify-center">
            <NuxtImg src="/logo.png" cover />
          </div>
          <span class="text-2xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">دنیا وب</span>
        </NuxtLink>

        <div class="hidden md:flex items-center gap-8">
          <NuxtLink to="/cloudhosting" class="text-gray-300 hover:text-white transition-colors">هاست ابری</NuxtLink>
          <NuxtLink to="/vps" class="text-gray-300 hover:text-white transition-colors">VPS</NuxtLink>
          <NuxtLink to="/dedicatedserver" class="text-gray-300 hover:text-white transition-colors">سرور اختصاصی</NuxtLink>
          <NuxtLink to="/domain" class="text-gray-300 hover:text-white transition-colors">دامنه</NuxtLink>
          <NuxtLink to="/support" class="text-gray-300 hover:text-white transition-colors">پشتیبانی</NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink to="/login" class="hidden md:block px-6 py-2 rounded-full glass hover:bg-white/20 transition-all">
            ورود
          </NuxtLink>
          <NuxtLink to="/start" class="px-6 py-2 rounded-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/30">
            شروع کنید
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>
