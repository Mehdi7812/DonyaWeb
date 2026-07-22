<script setup>
defineProps({
  content: { type: Array, required: true }
})
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
    <div class="glass-card rounded-3xl p-8 md:p-10">
      <template v-for="(block, i) in content" :key="i">
        <h2 v-if="block.type === 'h2'" class="text-2xl font-bold mt-8 mb-4 first:mt-0">
          {{ block.text }}
        </h2>
        <p v-else-if="block.type === 'p'" class="text-gray-300 leading-8 mb-5">
          {{ block.text }}
        </p>
        <ul v-else-if="block.type === 'ul'" class="space-y-2 mb-5 text-gray-300">
          <li v-for="(item, j) in block.items" :key="j" class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 shrink-0" />
            <span class="leading-7">{{ item }}</span>
          </li>
        </ul>
      </template>
    </div>
  </section>
</template>
