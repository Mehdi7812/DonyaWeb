<script setup>
defineProps({
  icon: { type: [Object, Function], required: true },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  color: { type: String, default: 'from-purple-500 to-blue-600' }
})
</script>

<template>
  <div class="glass-card rounded-2xl p-6">
    <div class="w-12 h-12 rounded-xl bg-linear-to-br flex items-center justify-center mb-4" :class="color">
      <component :is="icon" class="w-6 h-6 text-white" />
    </div>
    <div class="text-2xl font-bold mb-1">{{ value }}</div>
    <div class="text-gray-400 text-sm">{{ label }}</div>
  </div>
</template>
