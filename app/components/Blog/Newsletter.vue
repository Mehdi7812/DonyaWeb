<script setup>
import { ref } from 'vue'
import { Mail } from 'lucide-vue-next'

const email = ref('')
const subscribed = ref(false)

function handleSubscribe() {
  if (!email.value) return
  // TODO: اتصال به API واقعی خبرنامه
  subscribed.value = true
}
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24">
    <div class="glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-linear-to-r from-purple-900/20 to-blue-900/20" />
      <div class="relative z-10">
        <div class="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-500/30">
          <Mail class="w-7 h-7 text-white" />
        </div>
        <h2 class="text-2xl md:text-3xl font-bold mb-3">در خبرنامه دنیاوب عضو شوید</h2>
        <p class="text-gray-400 mb-8">مقالات جدید و اخبار محصولات را مستقیم در ایمیل‌تان دریافت کنید</p>

        <div v-if="subscribed" class="max-w-xl mx-auto px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
          عضویت شما با موفقیت ثبت شد!
        </div>

        <form v-else class="max-w-xl mx-auto flex flex-col sm:flex-row gap-3" @submit.prevent="handleSubscribe">
          <input
            v-model="email"
            type="email"
            required
            placeholder="ایمیل خود را وارد کنید"
            class="flex-1 px-5 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
          >
          <button
            type="submit"
            class="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30"
          >
            عضویت
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
