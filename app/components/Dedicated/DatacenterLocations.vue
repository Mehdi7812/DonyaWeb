<script setup lang="ts">
import { Server, Shield, Zap, Globe, ArrowLeft } from "lucide-vue-next";

const requestNote = useDedicatedRequest();
const toast = useToast();

function selectLocation(item: { country: string; city: string; ping: string; network: string; protection: string }) {
  requestNote.value = `درخواست سرور اختصاصی در دیتاسنتر ${item.country} (${item.city})\nپینگ: ${item.ping}\nپورت شبکه: ${item.network}\nمحافظت DDoS: ${item.protection}`;
  toast.success(`دیتاسنتر ${item.country} انتخاب شد؛ فرم درخواست را تکمیل کنید.`);
  scrollToDedicatedConsultation();
}

const locations = [
  {
    country: "آلمان",
    city: "Frankfurt",
    flag: "🇩🇪",
    ping: "45 ms",
    network: "10 Gbps",
    protection: "Always On",
    description: "مناسب برای کاربران ایران و اروپا",
  },
  {
    country: "هلند",
    city: "Amsterdam",
    flag: "🇳🇱",
    ping: "58 ms",
    network: "10 Gbps",
    protection: "Always On",
    description: "بهترین انتخاب برای سرویس‌های بین‌المللی",
  },
  {
    country: "فنلاند",
    city: "Helsinki",
    flag: "🇫🇮",
    ping: "71 ms",
    network: "10 Gbps",
    protection: "Advanced",
    description: "پایداری بالا و مناسب سرویس‌های Enterprise",
  },
  {
    country: "آمریکا",
    city: "New York",
    flag: "🇺🇸",
    ping: "145 ms",
    network: "10 Gbps",
    protection: "Enterprise",
    description: "مناسب پروژه‌های جهانی",
  },
];
</script>

<template>
  <section class="py-24">
    <div class="container mx-auto px-4">
      <div class="text-center mb-14">
        <h2 class="text-4xl font-black">
          دیتاسنترهای
          <span class="gradient-text"> جهانی </span>
        </h2>

        <p class="text-gray-400 mt-4 max-w-2xl mx-auto">
          سرورهای اختصاصی در معتبرترین دیتاسنترهای اروپا و آمریکا با شبکه پرسرعت
          و محافظت دائمی در برابر حملات DDoS.
        </p>
      </div>

      <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
        <div
          v-for="item in locations"
          :key="item.city"
          class="glass-card flex flex-col justify-between rounded-3xl p-7 hover:-translate-y-2 transition-all duration-300 border border-white/10"
        >
          <div class="text-5xl mb-4">
            {{ item.flag }}
          </div>

          <h3 class="text-2xl font-bold">
            {{ item.country }}
          </h3>

          <div class="text-pink-400 mb-6">
            {{ item.city }}
          </div>

          <p class="text-gray-400 text-sm leading-7 mb-8">
            {{ item.description }}
          </p>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <Zap class="w-5 h-5 text-pink-500" />

                <span>Ping</span>
              </div>

              <span class="font-bold">
                {{ item.ping }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <Server class="w-5 h-5 text-pink-500" />

                <span>Port</span>
              </div>

              <span class="font-bold">
                {{ item.network }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <Shield class="w-5 h-5 text-pink-500" />

                <span>DDoS</span>
              </div>

              <span class="font-bold">
                {{ item.protection }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="mt-8 w-full bg-linear-to-r from-pink-600 to-purple-600 rounded-xl py-3 flex justify-center items-center gap-2 hover:scale-[1.02] transition"
            @click="selectLocation(item)"
          >
            انتخاب لوکیشن

            <ArrowLeft class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        class="mt-16 glass-card rounded-3xl p-8 flex flex-col lg:flex-row justify-between items-center gap-6"
      >
        <div>
          <h3 class="text-2xl font-bold mb-3">شبکه Enterprise</h3>

          <p class="text-gray-400">
            تمامی سرورها با پورت 10Gbps، IPv6، Anti DDoS، Private VLAN و
            مانیتورینگ ۲۴ ساعته ارائه می‌شوند.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="text-center">
            <div class="text-3xl font-black gradient-text">10Gbps</div>
            <div class="text-sm text-gray-400">Port Speed</div>
          </div>

          <div class="text-center">
            <div class="text-3xl font-black gradient-text">99.99%</div>
            <div class="text-sm text-gray-400">SLA</div>
          </div>

          <div class="text-center">
            <div class="text-3xl font-black gradient-text">24/7</div>
            <div class="text-sm text-gray-400">Monitoring</div>
          </div>

          <div class="text-center">
            <div class="text-3xl font-black gradient-text">IPv6</div>
            <div class="text-sm text-gray-400">Enabled</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>