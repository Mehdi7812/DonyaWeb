<script setup lang="ts">
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  ShieldCheck,
  ArrowLeft,
} from "lucide-vue-next";

const plans = [
  {
    name: "Starter",
    price: "4,900,000",
    cpu: "Intel Xeon E-2388G",
    ram: "32GB DDR4 ECC",
    storage: "2×960GB NVMe",
    port: "1Gbps",
    ddos: true,
    recommended: false,
  },
  {
    name: "Business",
    price: "8,900,000",
    cpu: "AMD EPYC 7313P",
    ram: "64GB DDR4 ECC",
    storage: "2×1.92TB NVMe",
    port: "10Gbps",
    ddos: true,
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "14,900,000",
    cpu: "Dual Xeon Gold 6248",
    ram: "128GB DDR4 ECC",
    storage: "4×1.92TB NVMe RAID10",
    port: "10Gbps",
    ddos: true,
    recommended: false,
  },
];
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 py-20">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold">
        پلن‌های
        <span class="gradient-text"> سرور اختصاصی </span>
      </h2>

      <p class="text-gray-400 mt-4">پلن مناسب کسب‌وکار خود را انتخاب کنید.</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <div
        v-for="plan in plans"
        :key="plan.name"
        class="relative glass-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-pink-500/40 border border-white/10"
      >
        <div
          v-if="plan.recommended"
          class="absolute -top-3 right-6 bg-pink-600 text-white text-xs px-4 py-1 rounded-full"
        >
          پیشنهاد ویژه
        </div>

        <h3 class="text-2xl font-bold mb-2">
          {{ plan.name }}
        </h3>

        <div class="mb-8">
          <span class="text-4xl font-black gradient-text">
            {{ plan.price }}
          </span>

          <span class="text-gray-400 mr-2"> تومان / ماه </span>
        </div>

        <div class="space-y-5">
          <div class="flex items-center gap-3">
            <Cpu class="w-5 h-5 text-pink-400" />

            <span>{{ plan.cpu }}</span>
          </div>

          <div class="flex items-center gap-3">
            <MemoryStick class="w-5 h-5 text-pink-400" />

            <span>{{ plan.ram }}</span>
          </div>

          <div class="flex items-center gap-3">
            <HardDrive class="w-5 h-5 text-pink-400" />

            <span>{{ plan.storage }}</span>
          </div>

          <div class="flex items-center gap-3">
            <Network class="w-5 h-5 text-pink-400" />

            <span>{{ plan.port }}</span>
          </div>

          <div class="flex items-center gap-3">
            <ShieldCheck class="w-5 h-5 text-pink-400" />

            <span>Anti DDoS Protection</span>
          </div>
        </div>

        <button
          class="mt-10 w-full rounded-xl bg-linear-to-r from-pink-600 to-purple-600 py-3 font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          سفارش سرور

          <ArrowLeft class="w-5 h-5" />
        </button>
      </div>
    </div>
  </section>
</template>
