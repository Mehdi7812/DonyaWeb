<script setup>
const team = [
  { name: 'بهروز عبدالهی فرد', role: 'بنیان‌گذار و مدیرعامل', initials: 'ب.ع', color: 'from-purple-500 to-blue-600' },
  { name: 'سارا احمدی', role: 'مدیر فنی زیرساخت', initials: 'س.ا', color: 'from-blue-500 to-purple-600' },
  { name: 'رضا کریمی', role: 'مدیر پشتیبانی مشتریان', initials: 'ر.ک', color: 'from-pink-500 to-purple-600' },
  { name: 'مریم رضایی', role: 'مدیر محصول', initials: 'م.ر', color: 'from-purple-500 to-pink-600' }
]
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold mb-3">با <span class="gradient-text">تیم دنیاوب</span> آشنا شوید</h2>
      <p class="text-gray-400">افرادی که هر روز پشت صحنه‌ی زیرساخت شما در حال کار هستند</p>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
      <div v-for="member in team" :key="member.name" class="glass-card rounded-2xl p-6 text-center hover-lift">
        <div
          class="w-20 h-20 rounded-full bg-linear-to-br mx-auto mb-4 flex items-center justify-center text-xl font-bold shadow-lg"
          :class="member.color"
        >
          {{ member.initials }}
        </div>
        <h3 class="font-bold mb-1">{{ member.name }}</h3>
        <p class="text-gray-400 text-sm">{{ member.role }}</p>
      </div>
    </div>
  </section>
</template>
