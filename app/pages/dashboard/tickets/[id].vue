<script setup>
import { ref } from 'vue'
import { ArrowRight, Send } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { getTicketById, user } = useDashboard()

const ticket = getTicketById(route.params.id)

if (!ticket) {
  throw createError({ statusCode: 404, statusMessage: 'تیکت مورد نظر پیدا نشد' })
}

useHead({
  title: `${ticket.subject} | دنیاوب`
})

const localMessages = ref([...ticket.messages])
const reply = ref('')
const isSending = ref(false)

async function sendReply() {
  if (!reply.value.trim()) return
  isSending.value = true

  // TODO: اتصال به API واقعی ثبت پاسخ تیکت
  await new Promise((resolve) => setTimeout(resolve, 600))

  localMessages.value.push({
    from: 'user',
    name: user.name,
    text: reply.value.trim(),
    date: 'همین الان'
  })
  reply.value = ''
  isSending.value = false
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <NuxtLink to="/dashboard/tickets" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowRight class="w-4 h-4" />
        بازگشت به تیکت‌ها
      </NuxtLink>
      <DashboardStatusBadge :status="ticket.status" />
    </div>

    <div class="glass-card rounded-3xl p-6 sm:p-8">
      <h1 class="text-xl sm:text-2xl font-bold mb-2">{{ ticket.subject }}</h1>
      <p class="text-sm text-gray-500">
        <span dir="ltr">{{ ticket.id }}</span> · {{ ticket.department }} · ثبت شده در {{ ticket.date }}
      </p>
    </div>

    <div class="space-y-4">
      <div
        v-for="(m, i) in localMessages"
        :key="i"
        class="flex gap-4"
        :class="m.from === 'user' ? 'flex-row-reverse' : ''"
      >
        <div
          class="w-10 h-10 rounded-full bg-linear-to-br flex items-center justify-center text-xs font-bold flex-shrink-0"
          :class="m.from === 'user' ? 'from-purple-500 to-blue-600' : 'from-pink-500 to-purple-600'"
        >
          {{ m.name.split(' ').map(w => w[0]).join('') }}
        </div>
        <div class="glass-card rounded-2xl p-5 max-w-[80%]" :class="m.from === 'user' ? 'rounded-tl-sm' : 'rounded-tr-sm'">
          <div class="flex items-center justify-between gap-4 mb-2">
            <span class="font-medium text-sm">{{ m.name }}</span>
            <span class="text-xs text-gray-500">{{ m.date }}</span>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed">{{ m.text }}</p>
        </div>
      </div>
    </div>

    <div v-if="ticket.status !== 'closed'" class="glass-card rounded-3xl p-6">
      <label for="reply" class="block text-sm text-gray-300 mb-2">پاسخ شما</label>
      <textarea
        id="reply"
        v-model="reply"
        rows="4"
        placeholder="پاسخ خود را بنویسید..."
        class="w-full px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none resize-none mb-4"
      ></textarea>
      <button
        type="button"
        :disabled="isSending || !reply.trim()"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
        @click="sendReply"
      >
        <Send class="w-4 h-4" />
        {{ isSending ? 'در حال ارسال...' : 'ارسال پاسخ' }}
      </button>
    </div>
    <div v-else class="text-center text-gray-500 text-sm py-4">
      این تیکت بسته شده است. برای پیگیری، یک تیکت جدید ثبت کنید.
    </div>
  </div>
</template>
