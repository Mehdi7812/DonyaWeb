<script setup>
import { ref } from "vue";
import { ChevronDown } from "lucide-vue-next";

const faqs = ref([
  {
    question: "تحویل سرویس چقدر زمان می‌برد؟",
    answer:
      "پس از پرداخت موفق، سرویس‌های هاست، VPS و ثبت دامنه در اکثر موارد به صورت خودکار و در کمتر از چند دقیقه فعال می‌شوند. در برخی سرویس‌های اختصاصی ممکن است فرآیند آماده‌سازی تا چند ساعت زمان ببرد.",
  },
  {
    question: "آیا امکان ارتقاء سرویس وجود دارد؟",
    answer:
      "بله، در هر زمان می‌توانید منابع سرویس خود مانند CPU، RAM، فضای ذخیره‌سازی و پهنای باند را بدون از دست رفتن اطلاعات ارتقاء دهید.",
  },
  {
    question: "آیا از اطلاعات من نسخه پشتیبان تهیه می‌شود؟",
    answer:
      "بله، بسته به سرویس انتخابی، نسخه‌های پشتیبان روزانه یا هفتگی تهیه می‌شود. همچنین امکان خرید سرویس Backup اختصاصی نیز وجود دارد.",
  },
  {
    question: "در صورت نیاز به راهنمایی چگونه با پشتیبانی ارتباط بگیرم؟",
    answer:
      "تیم پشتیبانی دنیاوب به صورت ۲۴ ساعته و ۷ روز هفته از طریق تیکت، چت آنلاین و تماس تلفنی آماده پاسخگویی به شماست.",
  },
  {
    question: "آیا امکان لغو سفارش و بازگشت وجه وجود دارد؟",
    answer:
      "در صورت رعایت شرایط مندرج در قوانین و مقررات، امکان لغو سفارش و استفاده از ضمانت بازگشت وجه برای برخی سرویس‌ها فراهم است.",
  },
  {
    question: "کدام سیستم‌عامل‌ها قابل نصب هستند؟",
    answer:
      "Ubuntu، Debian، CentOS، AlmaLinux، Rocky Linux، Windows Server و سایر سیستم‌عامل‌های رایج قابل نصب هستند.",
  },
]);

const opened = ref(0);

function toggle(index) {
  opened.value = opened.value === index ? -1 : index;
}
</script>

<template>
  <section class="py-24">

    <div class="max-w-4xl mx-auto">

      <div class="text-center mb-14">

        <span
          class="inline-flex px-4 py-2 rounded-full glass text-purple-300 text-sm mb-5"
        >
          سوالات متداول
        </span>

        <h2 class="text-4xl font-bold mb-4">
          پاسخ به
          <span
            class="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            سوالات رایج
          </span>
        </h2>

        <p class="text-gray-400 max-w-2xl mx-auto leading-8">
          اگر پاسخ سوال خود را پیدا نکردید، کارشناسان دنیاوب به صورت ۲۴ ساعته
          آماده پاسخگویی به شما هستند.
        </p>

      </div>

      <div class="space-y-5">

        <div
          v-for="(item,index) in faqs"
          :key="index"
          class="glass-card rounded-2xl overflow-hidden transition-all duration-300"
        >

          <button
            @click="toggle(index)"
            class="w-full flex items-center justify-between px-7 py-6 text-right hover:bg-white/5 transition"
          >

            <h3 class="font-bold text-lg">
              {{ item.question }}
            </h3>

            <ChevronDown
              class="w-6 h-6 transition-transform duration-300"
              :class="opened===index ? 'rotate-180 text-purple-400' : 'text-gray-400'"
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

            <div
              v-if="opened===index"
              class="px-7 pb-7 text-gray-400 leading-8 border-t border-white/10"
            >

              {{ item.answer }}

            </div>

          </Transition>

        </div>

      </div>

      <!-- CTA -->

      <div
        class="glass rounded-3xl mt-16 p-10 text-center border border-purple-500/20"
      >

        <h3 class="text-3xl font-bold mb-4">
          هنوز سوالی دارید؟
        </h3>

        <p class="text-gray-400 mb-8 leading-8">
          کارشناسان ما آماده‌اند تا بهترین سرویس را متناسب با نیاز شما پیشنهاد
          دهند.
        </p>

        <div
          class="flex flex-col sm:flex-row gap-4 justify-center"
        >

          <NuxtLink
            to="/support"
            class="px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition font-semibold shadow-lg shadow-purple-500/30"
          >
            ارتباط با پشتیبانی
          </NuxtLink>

          <NuxtLink
            to="/contact-us"
            class="px-8 py-3 rounded-xl glass hover:bg-white/10 transition font-semibold"
          >
            تماس با ما
          </NuxtLink>

        </div>

      </div>

    </div>

  </section>
</template>