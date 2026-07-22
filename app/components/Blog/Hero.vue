<script setup>
import { Search, Newspaper } from 'lucide-vue-next'

const search = defineModel({ type: String, default: '' })
</script>

<template>
  <section class="relative pt-40 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
    <div class="inline-block mb-4 px-4 py-1 rounded-full glass text-sm text-purple-300 border border-purple-500/30">
      <Newspaper class="inline w-4 h-4 -mt-1 ml-1" /> مقالات، آموزش‌ها و اخبار دنیاوب
    </div>

    <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
      وبلاگ <span class="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">دنیاوب</span>
    </h1>

    <p class="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
      از راهنمای انتخاب هاست تا نکات امنیتی و اخبار محصولات؛ هرچه برای مدیریت بهتر سایت‌تان نیاز دارید.
    </p>

    <div class="max-w-xl mx-auto relative">
      <Search class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
      <input
        v-model="search"
        type="text"
        placeholder="جستجو در مقالات..."
        class="w-full pr-12 pl-4 py-4 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
      >
    </div>
  </section>
</template>
