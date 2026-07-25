<script setup lang="ts">
import { ref } from "vue";
import { CheckCircle2, Monitor, Server } from "lucide-vue-next";

const selected = ref("Ubuntu 24.04");
const requestNote = useDedicatedRequest();
const toast = useToast();

function changeVersion() {
  // برگشت به بالای گرید سیستم‌عامل‌ها برای انتخاب مجدد
  if (typeof document === "undefined") return;
  document.getElementById("os-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function continueOrder() {
  requestNote.value = `درخواست سرور اختصاصی با سیستم‌عامل ${selected.value}`;
  toast.success(`سیستم‌عامل ${selected.value} انتخاب شد؛ فرم درخواست را تکمیل کنید.`);
  scrollToDedicatedConsultation();
}

const systems = [
  {
    name: "Ubuntu 24.04",
    icon: "🐧",
    description: "بهترین انتخاب برای Docker، Node.js و Laravel",
    badge: "Recommended",
  },
  {
    name: "Debian 12",
    icon: "🌀",
    description: "پایدار، سریع و مناسب سرویس‌های Production",
    badge: "",
  },
  {
    name: "AlmaLinux 9",
    icon: "💠",
    description: "جایگزین CentOS برای میزبانی وب",
    badge: "",
  },
  {
    name: "Rocky Linux",
    icon: "🪨",
    description: "Enterprise Linux با پایداری بالا",
    badge: "",
  },
  {
    name: "Windows Server",
    icon: "🪟",
    description: "مناسب MSSQL، ASP.NET و Remote Desktop",
    badge: "License",
  },
  {
    name: "Proxmox VE",
    icon: "📦",
    description: "Virtualization Platform",
    badge: "",
  },
  {
    name: "VMware ESXi",
    icon: "☁️",
    description: "Enterprise Hypervisor",
    badge: "",
  },
  {
    name: "Custom ISO",
    icon: "💿",
    description: "نصب ISO اختصاصی",
    badge: "",
  },
];
</script>

<template>
  <section class="py-24">
    <div class="container mx-auto px-4">
      <div class="text-center mb-14">
        <h2 class="text-4xl font-black">
          سیستم عامل های

          <span class="gradient-text"> قابل نصب </span>
        </h2>

        <p class="text-gray-400 mt-4">
          در کمتر از چند دقیقه سیستم عامل دلخواه شما نصب خواهد شد.
        </p>
      </div>

      <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-7" id="os-grid">
        <div
          v-for="os in systems"
          :key="os.name"
          @click="selected = os.name"
          class="relative cursor-pointer rounded-3xl p-7 transition-all duration-300 border"
          :class="
            selected === os.name
              ? 'glass-card border-pink-500 scale-[1.03]'
              : 'glass-card border-white/10 hover:border-pink-500/40 hover:-translate-y-2'
          "
        >
          <div
            v-if="os.badge"
            class="absolute left-5 top-5 text-xs bg-pink-600 rounded-full px-3 py-1"
          >
            {{ os.badge }}
          </div>

          <div class="text-5xl mb-6">
            {{ os.icon }}
          </div>

          <h3 class="text-xl font-bold mb-3">
            {{ os.name }}
          </h3>

          <p class="text-gray-400 text-sm leading-7">
            {{ os.description }}
          </p>

          <div class="mt-8 flex items-center justify-between">
            <div class="flex items-center gap-2 text-pink-400">
              <Server class="w-5 h-5" />

              <span class="text-sm"> Deploy in 5 min </span>
            </div>

            <CheckCircle2
              v-if="selected === os.name"
              class="w-6 h-6 text-green-400"
            />
          </div>
        </div>
      </div>

      <div
        class="glass-card rounded-3xl mt-12 p-8 flex flex-col lg:flex-row justify-between items-center gap-6"
      >
        <div>
          <h3 class="text-2xl font-bold">سیستم عامل انتخاب شده</h3>

          <p class="text-gray-400 mt-2">
            {{ selected }}
          </p>
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            class="px-8 py-3 rounded-xl border border-white/10 hover:border-pink-500 transition"
            @click="changeVersion"
          >
            تغییر نسخه
          </button>

          <button
            type="button"
            class="px-8 py-3 rounded-xl bg-linear-to-r from-pink-600 to-purple-600 font-bold hover:scale-[1.03] transition"
            @click="continueOrder"
          >
            ادامه سفارش
          </button>
        </div>
      </div>
    </div>
  </section>
</template>