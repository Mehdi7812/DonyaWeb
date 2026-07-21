<script setup>
import { ref } from 'vue'
import {
  Phone, Mail, MessageCircle, LifeBuoy, Clock, ChevronDown,
  Send, User, AtSign, CheckCircle2
} from 'lucide-vue-next'

useHead({
  title: 'پشتیبانی | دنیاوب'
})

// --- Contact channels ---
const channels = [
  {
    icon: MessageCircle,
    title: 'چت آنلاین',
    desc: 'سریع‌ترین راه ارتباط، پاسخ‌گویی معمولاً زیر ۵ دقیقه',
    action: 'شروع گفتگو'
  },
  {
    icon: Phone,
    title: 'تماس تلفنی',
    desc: 'پشتیبانی تلفنی ۲۴ ساعته، همه روزهای هفته',
    action: '۰۲۱-۱۲۳۴۵۶۷۸'
  },
  {
    icon: Mail,
    title: 'ایمیل',
    desc: 'برای درخواست‌های فنی و مستندات، پاسخ زیر ۲۴ ساعت',
    action: 'support@donyaweb.ir'
  }
]

// --- FAQ ---
const faqs = [
  {
    q: 'چطور می‌توانم دامنه خود را به دنیاوب منتقل کنم؟',
    a: 'از بخش «ثبت دامنه» گزینه انتقال دامنه را انتخاب کنید، کد انتقال (EPP) را از ثبت‌کننده فعلی دریافت کنید و در فرم وارد نمایید. فرآیند معمولاً بین ۲ تا ۷ روز کاری طول می‌کشد.'
  },
  {
    q: 'روش‌های پرداخت چه مواردی را شامل می‌شود؟',
    a: 'پرداخت از طریق درگاه بانکی، کیف پول داخلی حساب کاربری و کارت‌های شتاب پشتیبانی می‌شود.'
  },
  {
    q: 'آیا امکان بازگشت وجه وجود دارد؟',
    a: 'برای سرویس‌های هاست و VPS، تا ۷ روز پس از خرید امکان بازگشت وجه کامل وجود دارد، مشروط به عدم استفاده غیرمتعارف از منابع.'
  },
  {
    q: 'زمان راه‌اندازی سرویس بعد از پرداخت چقدر است؟',
    a: 'هاست ابری و VPS بلافاصله و به‌صورت خودکار فعال می‌شوند. سرور اختصاصی تا ۲۴ ساعت کاری زمان نیاز دارد.'
  },
  {
    q: 'چطور یک تیکت پشتیبانی جدید ثبت کنم؟',
    a: 'می‌توانید از فرم زیر همین صفحه یک تیکت جدید ارسال کنید یا از داخل پنل کاربری، بخش «تیکت‌ها» را باز کنید.'
  }
]

const openFaq = ref(null)
function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i
}

// --- Ticket form ---
const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const isSubmitting = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

async function submitTicket() {
  errorMessage.value = ''

  if (!name.value || !email.value || !subject.value || !message.value) {
    errorMessage.value = 'لطفاً همه فیلدها را تکمیل کنید'
    return
  }

  isSubmitting.value = true
  try {
    // TODO: اتصال به API واقعی ثبت تیکت
    await new Promise((resolve) => setTimeout(resolve, 1000))
    submitted.value = true
    name.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
  } catch (err) {
    errorMessage.value = 'ارسال تیکت با خطا مواجه شد، دوباره تلاش کنید'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      <div class="inline-block mb-4 px-4 py-1 rounded-full glass text-sm text-purple-300 border border-purple-500/30">
        <Clock class="inline w-4 h-4 -mt-1 ml-1" /> پشتیبانی ۲۴ ساعته، هفت روز هفته
      </div>

      <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        چطور می‌توانیم <span class="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">کمکتان</span> کنیم؟
      </h1>

      <p class="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
        تیم فنی دنیاوب در تمام ساعات شبانه‌روز آماده پاسخ‌گویی است؛ از طریق چت، تلفن یا ثبت تیکت با ما در ارتباط باشید.
      </p>
    </section>

    <!-- Contact Channels -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="c in channels" :key="c.title" class="glass-card rounded-3xl p-8 text-center hover-lift flex flex-col justify-between">
          <div class="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-500/30">
            <component :is="c.icon" class="w-7 h-7 text-white" />
          </div>

          <h3 class="text-lg font-bold mb-2">{{ c.title }}</h3>

          <p class="text-gray-400 text-sm leading-relaxed mb-5">{{ c.desc }}</p>

          <button type="button" class="w-full py-3 rounded-xl border border-purple-500/50 text-purple-300 hover:bg-purple-500/20 transition-all font-medium text-sm" dir="ltr">
            {{ c.action }}
          </button>
        </div>
      </div>
    </section>

    <!-- Ticket Form + FAQ -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20">
      <div class="grid lg:grid-cols-2 gap-10">
        <!-- Ticket Form -->
        <div class="glass-card rounded-3xl p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <LifeBuoy class="w-6 h-6 text-blue-400" />
            </div>
            <h2 class="text-xl font-bold">ثبت تیکت پشتیبانی</h2>
          </div>

          <div v-if="submitted" class="flex flex-col items-center text-center py-10">
            <CheckCircle2 class="w-14 h-14 text-green-400 mb-4" />
            <h3 class="text-lg font-bold mb-2">تیکت شما ثبت شد</h3>
            <p class="text-gray-400 text-sm mb-6">تیم پشتیبانی به‌زودی از طریق ایمیل با شما تماس می‌گیرد.</p>
            <button
              type="button"
              class="px-6 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all text-sm"
              @click="submitted = false"
            >
              ثبت تیکت جدید
            </button>
          </div>

          <form v-else class="space-y-5" @submit.prevent="submitTicket">
            <div
              v-if="errorMessage"
              class="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center"
            >
              {{ errorMessage }}
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label for="name" class="block text-sm text-gray-300 mb-2">نام و نام خانوادگی</label>
                <div class="relative">
                  <User class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
                  <input
                    id="name"
                    v-model="name"
                    type="text"
                    placeholder="نام شما"
                    class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
                  >
                </div>
              </div>

              <div>
                <label for="ticket-email" class="block text-sm text-gray-300 mb-2">ایمیل</label>
                <div class="relative">
                  <AtSign class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
                  <input
                    id="ticket-email"
                    v-model="email"
                    type="email"
                    placeholder="example@email.com"
                    class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
                  >
                </div>
              </div>
            </div>

            <div>
              <label for="subject" class="block text-sm text-gray-300 mb-2">موضوع</label>
              <input
                id="subject"
                v-model="subject"
                type="text"
                placeholder="موضوع درخواست خود را بنویسید"
                class="w-full px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
              >
            </div>

            <div>
              <label for="message" class="block text-sm text-gray-300 mb-2">توضیحات</label>
              <textarea
                id="message"
                v-model="message"
                rows="5"
                placeholder="مشکل یا درخواست خود را با جزئیات شرح دهید..."
                class="w-full px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send class="w-4 h-4" />
              {{ isSubmitting ? 'در حال ارسال...' : 'ارسال تیکت' }}
            </button>
          </form>
        </div>

        <!-- FAQ -->
        <div>
          <h2 class="text-xl font-bold mb-6">سوالات <span class="gradient-text">متداول</span></h2>

          <div class="space-y-3">
            <div
              v-for="(f, i) in faqs"
              :key="f.q"
              class="glass rounded-2xl overflow-hidden border border-white/10"
            >
              <button
                type="button"
                class="w-full flex items-center justify-between gap-4 px-6 py-4 text-right"
                @click="toggleFaq(i)"
              >
                <span class="font-medium">{{ f.q }}</span>
                <ChevronDown
                  class="w-5 h-5 text-gray-400 shrink-0 transition-transform"
                  :class="openFaq === i ? 'rotate-180' : ''"
                />
              </button>
              <div
                class="grid transition-all duration-300"
                :class="openFaq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
              >
                <div class="overflow-hidden">
                  <p class="px-6 pb-4 text-gray-400 text-sm leading-relaxed">{{ f.a }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>