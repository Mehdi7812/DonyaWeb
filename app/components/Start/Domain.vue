<template>
    <section class="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-16">
      <div class="glass-strong rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl">
        <input
          v-model="domain"
          type="text"
          placeholder="نام دامنه مورد نظر خود را وارد کنید..."
          class="flex-1 px-6 py-4 rounded-xl input-glass text-white placeholder-gray-400 outline-none text-lg"
        >
        <button class="px-8 py-4 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2">
          <Search class="w-5 h-5" />
          بررسی دامنه
        </button>
      </div>
    </section>
</template>

<script setup>
import { Search } from 'lucide-vue-next'

const domain = ref('')
</script>