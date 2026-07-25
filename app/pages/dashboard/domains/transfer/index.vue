<script setup>
import { ref } from 'vue'
import { ArrowRight, ArrowLeftRight, KeyRound, Globe, Check, Clock3 } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'انتقال دامنه | دنیاوب'
})

const { domainTransfers } = useDashboard()
const toast = useToast()

const domainName = ref('')
const authCode = ref('')
const agree = ref(false)
const isSubmitting = ref(false)
const isDone = ref(false)

async function handleSubmit() {
  if (!domainName.value || !authCode.value) {
    toast.error('لطفاً نام دامنه و کد انتقال (Auth/EPP Code) را وارد کنید')
    return
  }
  if (!agree.value) {
    toast.error('برای ادامه باید قوانین انتقال دامنه را بپذیرید')
    return
  }

  isSubmitting.value = true
  // TODO: اتصال به API واقعی ثبت درخواست انتقال دامنه
  await new Promise((resolve) => setTimeout(resolve, 900))
  isSubmitting.value = false
  isDone.value = true
  toast.success('درخواست انتقال دامنه با موفقیت ثبت شد.')
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <NuxtLink to="/dashboard/domains" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
      <ArrowRight class="w-4 h-4" />
      بازگشت به دامنه‌ها
    </NuxtLink>

    <div v-if="isDone" class="glass-card rounded-3xl p-10 text-center space-y-4">
      <div class="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
        <Check class="w-7 h-7 text-green-400" />
      </div>
      <h2 class="text-xl font-bold">درخواست انتقال ثبت شد</h2>
      <p class="text-gray-400 text-sm">
        درخواست انتقال دامنه <span dir="ltr">{{ domainName }}</span> ثبت شد. این فرآیند معمولاً بین ۵ تا ۷ روز کاری زمان می‌برد.
      </p>
      <NuxtLink to="/dashboard/domains" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30">
        بازگشت به دامنه‌ها
      </NuxtLink>
    </div>

    <template v-else>
      <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <ArrowLeftRight class="w-5 h-5 text-purple-400" />
          انتقال دامنه به دنیا وب
        </h2>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div>
            <label for="domain-name" class="block text-sm text-gray-300 mb-2">نام دامنه</label>
            <div class="relative">
              <Globe class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="domain-name"
                v-model="domainName"
                type="text"
                placeholder="example.com"
                dir="ltr"
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
            </div>
          </div>

          <div>
            <label for="auth-code" class="block text-sm text-gray-300 mb-2">کد انتقال (Auth / EPP Code)</label>
            <div class="relative">
              <KeyRound class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="auth-code"
                v-model="authCode"
                type="text"
                placeholder="کد انتقال دریافتی از ثبت‌کننده فعلی دامنه"
                dir="ltr"
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
            </div>
          </div>

          <label class="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
            <input v-model="agree" type="checkbox" class="mt-0.5 w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0 shrink-0">
            <span>تأیید می‌کنم دامنه قفل نیست، حداقل ۶۰ روز از ثبت/انتقال قبلی آن گذشته و کد انتقال معتبر است.</span>
          </label>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ArrowLeftRight class="w-4 h-4" />
            {{ isSubmitting ? 'در حال ثبت درخواست...' : 'شروع انتقال' }}
          </button>
        </form>
      </div>

      <div v-if="domainTransfers.length" class="glass-card rounded-3xl p-6">
        <h3 class="font-bold mb-4 flex items-center gap-2">
          <Clock3 class="w-5 h-5 text-yellow-400" />
          انتقال‌های در جریان
        </h3>
        <div class="space-y-3">
          <div
            v-for="t in domainTransfers"
            :key="t.id"
            class="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5"
          >
            <div class="min-w-0">
              <p class="font-medium text-sm truncate" dir="ltr">{{ t.domain }}</p>
              <p class="text-xs text-gray-500">ثبت‌شده در {{ t.date }}</p>
            </div>
            <DashboardStatusBadge :status="t.status" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
