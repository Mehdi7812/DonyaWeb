<script setup>
defineProps({
  author: { type: Object, required: true }
})
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
    <div class="glass-card rounded-3xl p-8 flex items-center gap-5">
      <div
        class="w-16 h-16 rounded-full bg-linear-to-br flex items-center justify-center text-lg font-bold text-white shrink-0"
        :class="author.color"
      >
        {{ author.initials }}
      </div>
      <div>
        <h3 class="font-bold text-lg">{{ author.name }}</h3>
        <p class="text-gray-400 text-sm">{{ author.role }}</p>
      </div>
    </div>
  </section>
</template>
