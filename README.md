# دنیا وب — پروژه Nuxt 4

نسخه‌ی تبدیل‌شده‌ی لندینگ‌پیج دنیا وب به **Nuxt 4.5 + Tailwind CSS** (کامپوننت‌محور، RTL، فونت وزیرمتن).

> از Nuxt 4 استفاده شده چون Nuxt 3 در تاریخ ۳۱ ژوئیه ۲۰۲۶ به پایان پشتیبانی (EOL) می‌رسد و Nuxt 4.5 نسخه‌ی پایدار فعلی است. مهم‌ترین تفاوت ساختاری Nuxt 4 نسبت به Nuxt 3، انتقال فایل‌های سورس (pages، components، app.vue، assets و ...) به داخل پوشه‌ی `app/` است.

## ساختار پروژه
```
donyaweb/
├── nuxt.config.ts
├── tailwind.config.js
├── package.json
└── app/                         # پوشه‌ی سورس اصلی در Nuxt 4
    ├── app.vue
    ├── assets/css/main.css      # کلاس‌های سفارشی (glass, gradient-text, blob و ...)
    ├── components/
    │   ├── NavBar.vue              # نوار ناوبری با افکت اسکرول
    │   ├── BackgroundBlobs.vue     # حباب‌های پس‌زمینه با انیمیشن float
    │   ├── HeroSection.vue         # بخش هیرو + جستجوی دامنه + آمار
    │   ├── ServicesSection.vue     # کارت‌های خدمات (هاست/VPS/سرور اختصاصی)
    │   ├── FeaturesSection.vue     # چرا دنیا وب + مینی‌ترمینال
    │   ├── PricingSection.vue      # پلن‌های قیمت‌گذاری
    │   └── SiteFooter.vue          # فوتر
    └── pages/index.vue          # صفحه اصلی که همه بخش‌ها را کنار هم می‌چیند
```

## نصب و اجرا

```bash
npm install
npm run dev
```

سپس آدرس `http://localhost:3000` را در مرورگر باز کنید.

## نکات فنی
- آیکون‌ها با `lucide-vue-next` (معادل Vue برای lucide) پیاده‌سازی شده‌اند به‌جای اسکریپت CDN.
- Tailwind از طریق ماژول رسمی `@nuxtjs/tailwindcss` تنظیم شده، نه از طریق CDN.
- افکت‌های شیشه‌ای (glassmorphism)، گرادینت متن و انیمیشن حباب‌ها در `assets/css/main.css` تعریف شده‌اند.
- جهت صفحه (`dir="rtl"`) و زبان (`lang="fa"`) در `nuxt.config.ts` تنظیم شده است.
- فونت وزیرمتن از طریق CDN جی‌ذلیور در `head` بارگذاری می‌شود؛ در صورت نیاز به عملکرد بهتر می‌توانید فونت را لوکال کرده و با `@font-face` در `main.css` اضافه کنید.
- ساخت نسخه‌ی production:
```bash
npm run build
npm run preview
```
