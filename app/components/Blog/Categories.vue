<script setup>
defineProps({
  categories: { type: Array, required: true }
})

const active = defineModel({ type: String, default: 'all' })
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-10">
    <div class="flex flex-wrap justify-center gap-3">
      <button
        v-for="c in categories"
        :key="c.value"
        type="button"
        class="px-5 py-2 rounded-full text-sm font-medium transition-all border"
        :class="active === c.value
          ? 'bg-linear-to-r from-purple-600 to-blue-600 border-transparent shadow-lg shadow-purple-500/30'
          : 'glass border-white/10 text-gray-300 hover:text-white hover:border-purple-500/40'"
        @click="active = c.value"
      >
        {{ c.label }}
      </button>
    </div>
  </section>
</template>
