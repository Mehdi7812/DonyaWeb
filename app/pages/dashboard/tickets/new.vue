<script setup>
import { computed, ref } from 'vue'
import { ArrowRight, Send } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'تیکت جدید | دنیاوب'
})

const departments = [
  { value: 'tech', label: 'پشتیبانی فنی' },
  { value: 'sales', label: 'فروش و سفارش‌ها' },
  { value: 'billing', label: 'مالی و صورت‌حساب' },
  { value: 'other', label: 'سایر موارد' }
]

const priorities = [
  { value: 'low', label: 'کم' },
  { value: 'normal', label: 'عادی' },
  { value: 'high', label: 'فوری' }
]

const departmentOptions = computed(() => departments)
const priorityOptions = computed(() => priorities)

const subject = ref('')
const department = ref('tech')
const priority = ref('normal')
const message = ref('')
const attachments = ref([])
const isSubmitting = ref(false)
const toast = useToast()
const { addTicket } = useDashboard()

async function handleSubmit() {
  if (!subject.value || !message.value) {
    toast.error('لطفاً موضوع و متن پیام را وارد کنید')
    return
  }

  isSubmitting.value = true
  try {
    // TODO: اتصال به API واقعی ثبت تیکت (شامل آپلود واقعی فایل‌های پیوستی)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const departmentLabel = departments.find((d) => d.value === department.value)?.label || department.value
    const created = addTicket({
      subject: subject.value.trim(),
      department: departmentLabel,
      priority: priority.value,
      message: message.value.trim(),
      attachments: [...attachments.value]
    })
    toast.success('تیکت شما با موفقیت ثبت شد.')
    await navigateTo(`/dashboard/tickets/${created.id}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <NuxtLink to="/dashboard/tickets" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
      <ArrowRight class="w-4 h-4" />
      بازگشت به تیکت‌ها
    </NuxtLink>

    <div class="glass-card rounded-3xl p-6 sm:p-8">
      <h2 class="text-xl font-bold mb-6">ثبت تیکت جدید</h2>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label for="subject" class="block text-sm text-gray-300 mb-2">موضوع</label>
          <input
            id="subject"
            v-model="subject"
            type="text"
            placeholder="مثلاً: مشکل در اتصال به سرور"
            class="w-full px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
          >
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="department" class="block text-sm text-gray-300 mb-2">بخش مربوطه</label>
            <StartCustomSelect
              id="department"
              v-model="department"
              :options="departmentOptions"
              placeholder="انتخاب بخش"
            />
          </div>
          <div>
            <label for="priority" class="block text-sm text-gray-300 mb-2">اولویت</label>
            <StartCustomSelect
              id="priority"
              v-model="priority"
              :options="priorityOptions"
              placeholder="انتخاب اولویت"
            />
          </div>
        </div>

        <div>
          <label for="message" class="block text-sm text-gray-300 mb-2">شرح مشکل</label>
          <textarea
            id="message"
            v-model="message"
            rows="6"
            placeholder="مشکل خود را با جزئیات شرح دهید..."
            class="w-full px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm text-gray-300 mb-2">پیوست فایل (اختیاری)</label>
          <DashboardFileAttachInput v-model="attachments" />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send class="w-4 h-4" />
          {{ isSubmitting ? 'در حال ارسال...' : 'ثبت تیکت' }}
        </button>
      </form>
    </div>
  </div>
</template>
