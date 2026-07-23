<script setup>
import { ChevronLeft } from 'lucide-vue-next'

const { posts, categoryLabels } = useBlogPosts()

const latestPosts = posts.slice(0, 3)
</script>

<template>
  <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-16 text-center sm:text-right">
      <div>
        <h2 class="text-4xl font-bold mb-4">آخرین مطالب <span class="gradient-text">وبلاگ</span></h2>
        <p class="text-gray-400">آموزش، نکات فنی و اخبار دنیای میزبانی وب</p>
      </div>
      <NuxtLink
        to="/blog"
        class="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 transition font-medium shrink-0"
      >
        مشاهده همه مطالب
        <ChevronLeft class="w-4 h-4" />
      </NuxtLink>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <BlogPostCard
        v-for="post in latestPosts"
        :key="post.slug"
        :post="post"
        :category-label="categoryLabels[post.category]"
      />
    </div>

    <div class="flex justify-center mt-10 sm:hidden">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 transition font-medium"
      >
        مشاهده همه مطالب
        <ChevronLeft class="w-4 h-4" />
      </NuxtLink>
    </div>
  </section>
</template>