<script setup>
import {
  HardDrive,
  ShieldAlert,
  Cpu,
  Network,
  Server,
  Phone,
  User,
  Mail,
  MessageSquare,
  Zap,
  Activity,
  Settings,
  Globe,
  CheckCircle,
} from "lucide-vue-next";

import { ref } from "vue";

useHead({
  title: "سرور اختصاصی | دنیاوب",
  meta: [
    {
      name: "description",
      content:
        "خرید سرور اختصاصی قدرتمند با سخت‌افزار اختصاصی، پورت پرسرعت، امنیت بالا و امکان سفارشی‌سازی کامل برای کسب‌وکارها",
    },
  ],
});

const features = [
  {
    icon: Server,
    title: "دسترسی فیزیکی IPMI",
    desc: "مدیریت کامل سرور از راه دور حتی در زمان خاموش بودن سیستم‌عامل.",
  },
  {
    icon: HardDrive,
    title: "RAID سخت‌افزاری",
    desc: "افزایش سرعت و امنیت اطلاعات با پیکربندی حرفه‌ای RAID.",
  },
  {
    icon: ShieldAlert,
    title: "محافظت پیشرفته DDoS",
    desc: "جلوگیری از حملات مخرب با سیستم‌های امنیتی چندلایه.",
  },
  {
    icon: Network,
    title: "پورت اختصاصی ۱۰Gbps",
    desc: "انتقال سریع داده برای پروژه‌های پرترافیک و سازمانی.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "قدرت پردازشی بالا",
    desc: "تمام منابع سخت‌افزاری فقط در اختیار شماست و هیچ اشتراک منابعی وجود ندارد.",
  },
  {
    icon: Activity,
    title: "پایداری و آپ‌تایم بالا",
    desc: "زیرساخت پایدار برای سرویس‌های حساس و حیاتی.",
  },
  {
    icon: Settings,
    title: "کاملاً قابل سفارشی‌سازی",
    desc: "انتخاب CPU، RAM، فضای ذخیره‌سازی و سیستم‌عامل مطابق نیاز شما.",
  },
  {
    icon: Globe,
    title: "مناسب کسب‌وکارهای بزرگ",
    desc: "راهکاری ایده‌آل برای سایت‌های پرترافیک، نرم‌افزارها و سرویس‌های آنلاین.",
  },
];

const usages = [
  "میزبانی وب‌سایت‌های پرترافیک",
  "اپلیکیشن‌های سازمانی",
  "سرور بازی و استریم",
  "پایگاه داده‌های حجیم",
  "سیستم‌های مالی و حساس",
  "ماشین‌های مجازی اختصاصی",
];

const configs = [
  {
    name: "Entry Server",
    cpu: "Intel Xeon E-2288G",
    ram: "۳۲ GB DDR4",
    storage: "۲×۵۱۲GB NVMe",
  },
  {
    name: "Business Server",
    cpu: "۲× Intel Xeon Silver 4210",
    ram: "۶۴ GB DDR4",
    storage: "۴×۹۶۰GB SSD RAID10",
  },
  {
    name: "Enterprise Server",
    cpu: "۲× Intel Xeon Gold 6248",
    ram: "۱۲۸ GB DDR4",
    storage: "۸×۱.۹TB NVMe RAID10",
  },
];

const form = ref({
  name: "",
  phone: "",
  email: "",
  message: "",
});

const submitted = ref(false);
const isSubmitting = ref(false);
const toast = useToast();

async function handleSubmit() {
  isSubmitting.value = true;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  isSubmitting.value = false;
  submitted.value = true;
  toast.success('درخواست مشاوره شما با موفقیت ثبت شد.');
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section
      class="relative pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center"
    >
      <div
        class="inline-block mb-4 px-4 py-1 rounded-full glass text-sm text-pink-300 border border-pink-500/30"
      >
        سخت‌افزار فیزیکی، بدون اشتراک‌گذاری منابع
      </div>
      <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        سرور
        <span
          class="bg-linear-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
          >اختصاصی</span
        >
      </h1>
      <p class="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
        بالاترین سطح کنترل، امنیت و کارایی برای سازمان‌ها و پروژه‌های حساس؛ روی
        سخت‌افزار کاملاً اختصاصی و بدون هم‌سایگی با کاربران دیگر.
      </p>
    </section>

    <!-- Features -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <div class="grid md:grid-cols-4 gap-6">
        <div
          v-for="f in features"
          :key="f.title"
          class="glass-card rounded-2xl p-6 hover-lift"
        >
          <div
            class="w-12 h-12 rounded-xl bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30"
          >
            <component :is="f.icon" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-base font-bold mb-2">{{ f.title }}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 pb-20">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold mb-3">
          چرا <span class="gradient-text">سرور اختصاصی؟</span>
        </h2>

        <p class="text-gray-400">
          زمانی که سرعت، امنیت و کنترل کامل اهمیت دارد، سرور اختصاصی بهترین
          انتخاب است.
        </p>
      </div>

      <div class="grid md:grid-cols-4 gap-6">
        <div
          v-for="item in benefits"
          :key="item.title"
          class="glass-card rounded-2xl p-6 hover-lift"
        >
          <component :is="item.icon" class="w-10 h-10 text-pink-400 mb-5" />

          <h3 class="font-bold mb-2">
            {{ item.title }}
          </h3>

          <p class="text-gray-400 text-sm leading-relaxed">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-4 pb-20">
      <div class="glass rounded-3xl p-8">
        <h2 class="text-2xl font-bold mb-6 text-center">
          کاربردهای سرور اختصاصی
        </h2>

        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="item in usages"
            :key="item"
            class="flex items-center gap-3 text-gray-300"
          >
            <CheckCircle class="w-5 h-5 text-pink-400" />

            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Hardware configs -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold mb-3">
          نمونه <span class="gradient-text">پیکربندی‌ها</span>
        </h2>
        <p class="text-gray-400">
          پیکربندی نهایی کاملاً بر اساس نیاز شما سفارشی‌سازی می‌شود
        </p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="c in configs"
          :key="c.name"
          class="glass rounded-3xl p-8 border border-white/10 hover:border-pink-500/40 transition-all"
        >
          <div
            class="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6"
          >
            <Cpu class="w-6 h-6 text-pink-400" />
          </div>
          <h3 class="text-xl font-bold mb-4">{{ c.name }}</h3>
          <ul class="space-y-3 text-gray-300 text-sm">
            <li><span class="text-gray-500">پردازنده: </span>{{ c.cpu }}</li>
            <li><span class="text-gray-500">حافظه: </span>{{ c.ram }}</li>
            <li>
              <span class="text-gray-500">فضای ذخیره: </span>{{ c.storage }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Consultation form -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto pb-24">
      <div class="glass-card rounded-3xl p-8 md:p-10">
        <h2 class="text-2xl font-bold mb-2 text-center">
          درخواست مشاوره رایگان
        </h2>
        <p class="text-gray-400 text-sm text-center mb-8">
          کارشناسان ما در کمتر از ۲۴ ساعت با شما تماس می‌گیرند
        </p>

        <div
          v-if="submitted"
          class="px-4 py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-center"
        >
          درخواست شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.
        </div>

        <form v-else class="space-y-5" @submit.prevent="handleSubmit">
          <div>
            <label for="name" class="block text-sm text-gray-300 mb-2"
              >نام و نام خانوادگی</label
            >
            <div class="relative">
              <User
                class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4"
              />
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
                placeholder="نام کامل"
              />
            </div>
          </div>
          <div>
            <label for="phone" class="block text-sm text-gray-300 mb-2"
              >شماره تماس</label
            >
            <div class="relative">
              <Phone
                class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4"
              />
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
                placeholder="۰۹1۲۳۴۵۶۷۸۹"
              />
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm text-gray-300 mb-2"
              >ایمیل</label
            >
            <div class="relative">
              <Mail
                class="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4"
              />
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none"
                placeholder="example@email.com"
              />
            </div>
          </div>
          <div>
            <label for="message" class="block text-sm text-gray-300 mb-2"
              >نیاز شما چیست؟</label
            >
            <div class="relative">
              <MessageSquare
                class="w-5 h-5 text-gray-400 absolute top-4 right-4"
              />
              <textarea
                id="message"
                v-model="form.message"
                rows="3"
                class="w-full pr-12 pl-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none resize-none"
                placeholder="مثلاً: سرور برای میزبانی اپلیکیشن با ترافیک بالا"
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3 rounded-xl bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-all font-bold shadow-lg shadow-pink-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? "در حال ارسال..." : "ارسال درخواست" }}
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
