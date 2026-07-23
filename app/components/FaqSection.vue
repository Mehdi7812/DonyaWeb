<script setup>
import { ChevronDown } from 'lucide-vue-next'

const faqs = ref([
  {
    question: 'کدام سرویس برای شروع مناسب من است؟',
    answer:
      'برای سایت‌های شخصی و شرکتی معمولی، هاست ابری کافی است. اگر به منابع اختصاصی و دسترسی روت نیاز دارید، VPS گزینه مناسب‌تری است و برای پروژه‌های حجیم و سازمانی، سرور اختصاصی بهترین عملکرد را ارائه می‌دهد.'
  },
  {
    question: 'آیا امکان بازگشت وجه وجود دارد؟',
    answer:
      'بله، بیشتر سرویس‌های دنیاوب دارای ضمانت بازگشت وجه تا ۷ روز پس از خرید هستند. جزئیات کامل هر سرویس در صفحه پرداخت آن نمایش داده می‌شود.'
  },
  {
    question: 'آیا انتقال سایت از هاست فعلی رایگان است؟',
    answer:
      'بله، تیم فنی دنیاوب سایت شما را به‌صورت کامل و بدون قطعی محسوس از هاست قبلی منتقل می‌کند. کافی است پس از خرید، درخواست انتقال را از طریق تیکت پشتیبانی ثبت کنید.'
  },
  {
    question: 'روش‌های پرداخت چیست؟',
    answer:
      'پرداخت از طریق درگاه بانکی و همچنین کیف پول داخلی دنیاوب امکان‌پذیر است. برای مشتریان سازمانی نیز امکان صدور فاکتور رسمی وجود دارد.'
  },
  {
    question: 'در صورت بروز مشکل چقدر سریع پاسخ می‌گیرم؟',
    answer:
      'تیم پشتیبانی دنیاوب به‌صورت ۲۴ ساعته و ۷ روز هفته از طریق تیکت، چت آنلاین و تماس تلفنی در دسترس است و اکثر درخواست‌ها در کمتر از چند دقیقه پاسخ داده می‌شوند.'
  }
])

const opened = ref(0)

function toggle(index) {
  opened.value = opened.value === index ? -1 : index
}
</script>

<template>
  <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div class="text-center mb-14">
      <h2 class="text-4xl font-bold mb-4">
        سوالات <span class="gradient-text">متداول</span>
      </h2>
      <p class="text-gray-400">پاسخ پرتکرارترین سوالات درباره خدمات دنیاوب</p>
    </div>

    <div class="space-y-5">
      <div
        v-for="(item, index) in faqs"
        :key="item.question"
        class="glass-card rounded-2xl overflow-hidden transition-all duration-300"
      >
        <button
          type="button"
          class="w-full flex items-center justify-between px-7 py-6 text-right hover:bg-white/5 transition"
          @click="toggle(index)"
        >
          <h3 class="font-bold text-lg">{{ item.question }}</h3>
          <ChevronDown
            class="w-6 h-6 transition-transform duration-300 shrink-0"
            :class="opened === index ? 'rotate-180 text-purple-400' : 'text-gray-400'"
          />
        </button>

        <Transition
          enter-active-class="transition-all duration-300"
          leave-active-class="transition-all duration-300"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-96 opacity-100"
          leave-from-class="max-h-96 opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-if="opened === index" class="px-7 pb-7 text-gray-400 leading-8 border-t border-white/10">
            {{ item.answer }}
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>