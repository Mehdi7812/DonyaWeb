<script setup>
import { computed, ref } from 'vue'

useHead({
  title: 'وبلاگ | دنیاوب'
})

const { posts, categories, categoryLabels, getFeaturedPost } = useBlogPosts()

const search = ref('')
const activeCategory = ref('all')

const featuredPost = getFeaturedPost()

const filteredPosts = computed(() => {
  return posts.filter((p) => {
    if (p.slug === featuredPost.slug && activeCategory.value === 'all' && !search.value) return false
    const matchesCategory = activeCategory.value === 'all' || p.category === activeCategory.value
    const matchesSearch = !search.value || p.title.includes(search.value) || p.excerpt.includes(search.value)
    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <div>
    <!-- Hero + search -->
    <BlogHero v-model="search" />

    <!-- Category filter -->
    <BlogCategories v-model="activeCategory" :categories="categories" />

    <!-- Featured post (only shown with no active filter/search) -->
    <BlogFeaturedPost
      v-if="activeCategory === 'all' && !search"
      :post="featuredPost"
      :category-label="categoryLabels[featuredPost.category]"
    />

    <!-- Post grid -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <div v-if="filteredPosts.length" class="grid md:grid-cols-3 gap-6">
        <BlogPostCard
          v-for="post in filteredPosts"
          :key="post.slug"
          :post="post"
          :category-label="categoryLabels[post.category]"
        />
      </div>
      <div v-else class="text-center text-gray-400 py-16">
        مطلبی با این مشخصات پیدا نشد.
      </div>
    </section>

    <!-- Newsletter -->
    <BlogNewsletter />
  </div>
</template>
