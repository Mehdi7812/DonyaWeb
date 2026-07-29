<script setup>
import { ref } from 'vue'
import { User, AtSign, Phone, Building2, Lock, Save } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase
const headers = useApiHeaders()

useHead({
  title: 'حساب کاربری | دنیاوب'
})

const userCookie = useCookie("user_donyaweb")

const user = ref(userCookie.value)

// const { user } = useDashboard()

const profile = ref({
  name: user.value.full_name,
  email: user.value.email,
  phone: user.value.mobile,
  company: user.value.register_platform
})

const passwords = ref({
  current: '',
  next: '',
  confirm: ''
})

const notifications = ref({
  renewalReminders: true,
  invoiceEmails: true,
  ticketUpdates: true,
  marketing: false
})

const isSavingProfile = ref(false)
const isSavingPassword = ref(false)
const toast = useToast()

async function saveProfile() {
  isSavingProfile.value = true
  try {
    await $fetch(`${baseUrl}/users/update`, {
      method: 'POST',
      headers: headers.value,
      body: {
        full_name: profile.value.name,
        email: profile.value.email,
        phone: profile.value.phone,
        company: profile.value.company
      }
    })
    toast.success('اطلاعات پروفایل با موفقیت ذخیره شد.')
  } catch (err) {
    const message = err?.data?.message || err?.data?.error || 'ذخیره اطلاعات پروفایل با خطا مواجه شد.'
    toast.error(message)
  } finally {
    isSavingProfile.value = false
  }
}

async function savePassword() {
  if (!passwords.value.current || !passwords.value.next || !passwords.value.confirm) {
    toast.error('لطفاً همه فیلدها را تکمیل کنید')
    return
  }
  if (passwords.value.next !== passwords.value.confirm) {
    toast.error('رمز عبور جدید و تکرار آن یکسان نیستند')
    return
  }
  if (passwords.value.next.length < 4) {
    toast.error('رمز عبور جدید باید حداقل 4 کاراکتر باشد')
    return
  }

  isSavingPassword.value = true
  try {
    const res = await $fetch(`${baseUrl}/users/updatePassword`, {
      method: 'POST',
      headers: headers.value,
      body: {
        oldPassword: passwords.value.current,
        password: passwords.value.next,
      }
    })

    if(res.code === 2000) {
      toast.success('رمز عبور با موفقیت تغییر کرد.')
      passwords.value = { current: '', next: '', confirm: '' }
    } else {
      toast.success('خطایی رخ داده. دوباره امتحان کنید')
    }
  } catch (err) {
    console.log(err)
    const message = err?.data?.message || err?.data?.error || 'تغییر رمز عبور با خطا مواجه شد. لطفاً رمز فعلی را بررسی کنید.'
    toast.error(message)
  } finally {
    isSavingPassword.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Profile -->
    <div class="glass-card rounded-3xl p-6 sm:p-8">
      <h2 class="text-lg font-bold mb-6">اطلاعات پروفایل</h2>

      <form class="space-y-5" @submit.prevent="saveProfile">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm text-gray-300 mb-2">نام و نام خانوادگی</label>
            <div class="relative">
              <User class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input id="name" v-model="profile.name" type="text" class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white outline-none">
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm text-gray-300 mb-2">ایمیل</label>
            <div class="relative">
              <AtSign class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input id="email" v-model="profile.email" type="email" class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white outline-none">
            </div>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="phone" class="block text-sm text-gray-300 mb-2">شماره تماس</label>
            <div class="relative">
              <Phone class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input id="phone" v-model="profile.phone" type="tel" class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white outline-none">
            </div>
          </div>
          <div>
            <label for="company" class="block text-sm text-gray-300 mb-2">نام شرکت (اختیاری)</label>
            <div class="relative">
              <Building2 class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input id="company" v-model="profile.company" type="text" class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white outline-none">
            </div>
          </div>
        </div>

        <!-- <button
          type="submit"
          :disabled="isSavingProfile"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60"
        >
          <Save class="w-4 h-4" />
          {{ isSavingProfile ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
        </button> -->
      </form>
    </div>

    <!-- Password -->
    <div class="glass-card rounded-3xl p-6 sm:p-8">
      <h2 class="text-lg font-bold mb-6">تغییر رمز عبور</h2>

      <form class="space-y-5" @submit.prevent="savePassword">
        <div>
          <label for="current-password" class="block text-sm text-gray-300 mb-2">رمز عبور فعلی</label>
          <div class="relative">
            <Lock class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
            <input id="current-password" v-model="passwords.current" type="password" class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white outline-none">
          </div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="new-password" class="block text-sm text-gray-300 mb-2">رمز عبور جدید</label>
            <div class="relative">
              <Lock class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input id="new-password" v-model="passwords.next" type="password" class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white outline-none">
            </div>
          </div>
          <div>
            <label for="confirm-password" class="block text-sm text-gray-300 mb-2">تکرار رمز جدید</label>
            <div class="relative">
              <Lock class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input id="confirm-password" v-model="passwords.confirm" type="password" class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white outline-none">
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSavingPassword"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all font-medium disabled:opacity-60"
        >
          <Save class="w-4 h-4" />
          {{ isSavingPassword ? 'در حال ذخیره...' : 'تغییر رمز عبور' }}
        </button>
      </form>
    </div>

    <!-- Notifications -->
    <div class="glass-card rounded-3xl p-6 sm:p-8">
      <h2 class="text-lg font-bold mb-6">تنظیمات اعلان‌ها</h2>

      <div class="space-y-4">
        <label class="flex items-center justify-between gap-4 cursor-pointer">
          <span class="text-sm text-gray-300">یادآوری تمدید سرویس‌ها</span>
          <input v-model="notifications.renewalReminders" type="checkbox" class="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0">
        </label>
        <label class="flex items-center justify-between gap-4 cursor-pointer">
          <span class="text-sm text-gray-300">ایمیل صدور فاکتور</span>
          <input v-model="notifications.invoiceEmails" type="checkbox" class="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0">
        </label>
        <label class="flex items-center justify-between gap-4 cursor-pointer">
          <span class="text-sm text-gray-300">اطلاع‌رسانی پاسخ تیکت‌ها</span>
          <input v-model="notifications.ticketUpdates" type="checkbox" class="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0">
        </label>
        <label class="flex items-center justify-between gap-4 cursor-pointer">
          <span class="text-sm text-gray-300">ایمیل‌های تبلیغاتی و پیشنهادات ویژه</span>
          <input v-model="notifications.marketing" type="checkbox" class="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0">
        </label>
      </div>
    </div>
  </div>
</template>
