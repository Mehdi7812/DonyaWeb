<script setup>
import { User, Mail, Phone, Lock, Eye, EyeOff, Check, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-vue-next'
import { ref, computed, onBeforeUnmount, nextTick } from 'vue'

useHead({
  title: 'ثبت‌نام | دنیاوب'
})

definePageMeta({
  layout: "auth",
});

// --- کد OTP موقت برای تست، چون فعلاً API واقعی وصل نیست ---
const MOCK_OTP = '12345'
const phoneRegex = /^09\d{9}$/

const step = ref(1) // 1: اطلاعات حساب, 2: تایید کد پیامکی, 3: موفقیت
const toast = useToast()

// --- Step 1: اطلاعات حساب ---
const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)
const isSendingOtp = ref(false)

const passwordStrength = computed(() => {
  const val = password.value
  if (!val) return { label: '', width: '0%', color: '' }
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++

  if (score <= 1) return { label: 'ضعیف', width: '25%', color: 'bg-red-500' }
  if (score === 2) return { label: 'متوسط', width: '50%', color: 'bg-yellow-500' }
  if (score === 3) return { label: 'خوب', width: '75%', color: 'bg-blue-500' }
  return { label: 'قوی', width: '100%', color: 'bg-green-500' }
})

async function handleRegister() {
  if (!fullName.value || !email.value || !phone.value || !password.value || !confirmPassword.value) {
    toast.error('لطفاً همه فیلدها را تکمیل کنید')
    return
  }
  if (!phoneRegex.test(phone.value.trim())) {
    toast.error('شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)')
    return
  }
  if (password.value !== confirmPassword.value) {
    toast.error('رمز عبور و تکرار آن یکسان نیستند')
    return
  }
  if (password.value.length < 8) {
    toast.error('رمز عبور باید حداقل ۸ کاراکتر باشد')
    return
  }
  if (!acceptTerms.value) {
    toast.error('برای ادامه باید قوانین و مقررات را بپذیرید')
    return
  }

  isSendingOtp.value = true
  try {
    // TODO: اتصال به API واقعی ثبت اطلاعات اولیه + ارسال پیامک کد تایید
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('کد تایید برای شماره شما پیامک شد.')
    step.value = 2
    startResendTimer()
    nextTick(() => focusOtpBox(0))
  } catch (err) {
    toast.error('مشکلی در ارسال کد پیش آمد، دوباره تلاش کنید')
  } finally {
    isSendingOtp.value = false
  }
}

// --- Step 2: تایید کد پیامکی ---
const otpDigits = ref(['', '', '', '', ''])
const isVerifyingOtp = ref(false)
const otpInputs = ref([])
const resendSeconds = ref(0)
let resendTimer = null

function startResendTimer() {
  resendSeconds.value = 60
  clearInterval(resendTimer)
  resendTimer = setInterval(() => {
    if (resendSeconds.value > 0) {
      resendSeconds.value--
    } else {
      clearInterval(resendTimer)
    }
  }, 1000)
}

onBeforeUnmount(() => clearInterval(resendTimer))

function focusOtpBox(index) {
  otpInputs.value[index]?.focus()
}

function handleOtpInput(index, event) {
  const value = event.target.value.replace(/[^0-9]/g, '').slice(-1)
  otpDigits.value[index] = value
  if (value && index < otpDigits.value.length - 1) {
    focusOtpBox(index + 1)
  }
}

function handleOtpKeydown(index, event) {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    focusOtpBox(index - 1)
  }
}

function handleOtpPaste(event) {
  const pasted = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, otpDigits.value.length)
  if (!pasted) return
  event.preventDefault()
  pasted.split('').forEach((digit, i) => {
    otpDigits.value[i] = digit
  })
  focusOtpBox(Math.min(pasted.length, otpDigits.value.length - 1))
}

const otpCode = computed(() => otpDigits.value.join(''))

async function verifyOtp() {
  if (otpCode.value.length < otpDigits.value.length) {
    toast.error('لطفاً کد را کامل وارد کنید')
    return
  }

  isVerifyingOtp.value = true
  // TODO: اتصال به API واقعی تایید کد پیامکی و تکمیل ثبت‌نام
  await new Promise((resolve) => setTimeout(resolve, 800))
  isVerifyingOtp.value = false

  if (otpCode.value !== MOCK_OTP) {
    toast.error('کد وارد شده صحیح نیست')
    return
  }

  toast.success('ثبت‌نام با موفقیت تکمیل شد.')
  step.value = 3
}

async function resendOtp() {
  if (resendSeconds.value > 0) return
  otpDigits.value = ['', '', '', '', '']
  // TODO: اتصال به API واقعی ارسال مجدد پیامک
  await new Promise((resolve) => setTimeout(resolve, 500))
  toast.info('کد تایید جدید پیامک شد.')
  startResendTimer()
  nextTick(() => focusOtpBox(0))
}

function goBackToForm() {
  step.value = 1
  clearInterval(resendTimer)
  otpDigits.value = ['', '', '', '', '']
}

const stepLabels = ['اطلاعات حساب', 'تایید شماره موبایل']
</script>

<template>
  <section class="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-center">
    <div class="w-full max-w-md relative z-10">
      <div class="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
        <div class="flex flex-col items-center mb-8">
          <NuxtLink to="/" class="flex items-center justify-center mb-4 w-30">
            <NuxtImg src="/logo.png" cover />
          </NuxtLink>

          <h1 class="text-2xl font-bold mb-1">ساخت حساب کاربری</h1>
          <p class="text-gray-400 text-sm text-center">
            {{ step === 1 ? 'به جمع مشتریان دنیاوب بپیوندید' : step === 2 ? 'کد ارسال‌شده به موبایل خود را وارد کنید' : 'حساب شما با موفقیت ساخته شد' }}
          </p>
        </div>

        <!-- Step indicator -->
        <div v-if="step <= 2" class="flex items-center justify-center gap-2 mb-8">
          <template v-for="(label, i) in stepLabels" :key="label">
            <div class="flex flex-col items-center gap-1.5">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                :class="step > i + 1
                  ? 'bg-linear-to-br from-purple-500 to-blue-600 text-white'
                  : step === i + 1
                    ? 'bg-linear-to-br from-purple-500 to-blue-600 text-white ring-4 ring-purple-500/20'
                    : 'bg-white/10 text-gray-500'"
              >
                <CheckCircle2 v-if="step > i + 1" class="w-4 h-4" />
                <span v-else>{{ i + 1 }}</span>
              </div>
            </div>
            <div v-if="i < stepLabels.length - 1" class="w-8 h-0.5 rounded-full" :class="step > i + 1 ? 'bg-purple-500' : 'bg-white/10'" />
          </template>
        </div>

        <!-- Step 1: اطلاعات حساب -->
        <form v-if="step === 1" class="space-y-5" @submit.prevent="handleRegister">
          <div>
            <label for="fullName" class="block text-sm text-gray-300 mb-2">نام و نام خانوادگی</label>
            <div class="relative">
              <User class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="fullName"
                v-model="fullName"
                type="text"
                autocomplete="name"
                placeholder="نام کامل خود را وارد کنید"
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm text-gray-300 mb-2">ایمیل</label>
            <div class="relative">
              <Mail class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="example@email.com"
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm text-gray-300 mb-2">شماره موبایل</label>
            <div class="relative">
              <Phone class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="phone"
                v-model="phone"
                type="tel"
                dir="ltr"
                autocomplete="tel"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none text-left"
              >
            </div>
            <p class="text-xs text-gray-500 mt-1.5">کد تایید برای این شماره پیامک می‌شود.</p>
          </div>

          <div>
            <label for="password" class="block text-sm text-gray-300 mb-2">رمز عبور</label>
            <div class="relative">
              <Lock class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="حداقل ۸ کاراکتر"
                class="w-full pr-12 pl-12 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
              <button
                type="button"
                class="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-gray-200 transition-colors"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
            <div v-if="password" class="mt-2">
              <div class="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="passwordStrength.color"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">قدرت رمز عبور: {{ passwordStrength.label }}</p>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm text-gray-300 mb-2">تکرار رمز عبور</label>
            <div class="relative">
              <Lock class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="رمز عبور را دوباره وارد کنید"
                class="w-full pr-12 pl-12 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
              <button
                type="button"
                class="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-gray-200 transition-colors"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <EyeOff v-if="showConfirmPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <label class="flex items-start gap-2 text-sm text-gray-400 cursor-pointer select-none">
            <input
              v-model="acceptTerms"
              type="checkbox"
              class="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0"
            >
            <span>
              <NuxtLink to="/terms" class="text-purple-300 hover:text-purple-200 transition-colors">قوانین و مقررات</NuxtLink>
              و
              <NuxtLink to="/privacy" class="text-purple-300 hover:text-purple-200 transition-colors">حریم خصوصی</NuxtLink>
              را می‌پذیرم
            </span>
          </label>

          <button
            type="submit"
            :disabled="isSendingOtp"
            class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check v-if="!isSendingOtp" class="w-5 h-5" />
            {{ isSendingOtp ? 'در حال ارسال کد...' : 'ادامه و دریافت کد تایید' }}
          </button>
        </form>

        <!-- Step 2: تایید کد پیامکی -->
        <form v-else-if="step === 2" class="space-y-5" @submit.prevent="verifyOtp">
          <p class="text-sm text-gray-400 text-center">
            کد ۵ رقمی پیامک‌شده به <span class="text-white font-medium" dir="ltr">{{ phone }}</span> را وارد کنید
          </p>

          <div class="flex justify-center gap-3" dir="ltr" @paste="handleOtpPaste">
            <input
              v-for="(digit, i) in otpDigits"
              :key="i"
              :ref="el => (otpInputs[i] = el)"
              v-model="otpDigits[i]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="w-12 h-14 text-center text-xl font-bold rounded-xl input-glass text-white outline-none"
              @input="handleOtpInput(i, $event)"
              @keydown="handleOtpKeydown(i, $event)"
            >
          </div>

          <p class="text-xs text-gray-500 text-center">
            برای تست، کد نمایشی: <span dir="ltr" class="text-gray-300 font-mono">{{ MOCK_OTP }}</span>
          </p>

          <button
            type="submit"
            :disabled="isVerifyingOtp"
            class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ isVerifyingOtp ? 'در حال بررسی...' : 'تایید و تکمیل ثبت‌نام' }}
          </button>

          <div class="flex items-center justify-between text-sm pt-2">
            <button type="button" class="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors" @click="goBackToForm">
              <ArrowRight class="w-4 h-4" />
              ویرایش اطلاعات
            </button>
            <button
              type="button"
              class="flex items-center gap-1.5 transition-colors"
              :class="resendSeconds > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-purple-300 hover:text-purple-200'"
              :disabled="resendSeconds > 0"
              @click="resendOtp"
            >
              <RotateCcw class="w-4 h-4" />
              {{ resendSeconds > 0 ? `ارسال مجدد (${resendSeconds})` : 'ارسال مجدد کد' }}
            </button>
          </div>
        </form>

        <!-- Step 3: موفقیت -->
        <div v-else class="flex flex-col items-center text-center py-4">
          <div class="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-5">
            <CheckCircle2 class="w-8 h-8 text-green-400" />
          </div>
          <h3 class="text-lg font-bold mb-2">حساب کاربری شما ساخته شد</h3>
          <p class="text-gray-400 text-sm mb-8">حالا می‌توانید با ایمیل و رمز عبوری که وارد کردید وارد حساب کاربری‌تان شوید.</p>
          <NuxtLink
            to="/login"
            class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 text-center"
          >
            ورود به حساب کاربری
          </NuxtLink>
        </div>

        <div v-if="step < 3" class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-white/10"></div>
          <span class="text-xs text-gray-500">یا</span>
          <div class="flex-1 h-px bg-white/10"></div>
        </div>

        <p v-if="step < 3" class="text-center text-sm text-gray-400">
          قبلاً ثبت‌نام کرده‌اید؟
          <NuxtLink to="/login" class="text-purple-300 hover:text-purple-200 font-medium transition-colors">وارد شوید</NuxtLink>
        </p>
      </div>
    </div>
  </section>
</template>