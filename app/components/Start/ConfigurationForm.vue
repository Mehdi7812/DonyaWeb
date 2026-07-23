<script setup>
import {
  Globe,
  Monitor,
  ShieldCheck,
  ServerCog,
  KeyRound,
  Network,
  Clock3
} from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  domain: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const config = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const locations = ['آلمان 🇩🇪', 'فنلاند 🇫🇮', 'هلند 🇳🇱', 'فرانسه 🇫🇷', 'ترکیه 🇹🇷']

const operatingSystems = [
  'Ubuntu 24.04',
  'Debian 12',
  'Rocky Linux 9',
  'AlmaLinux 9',
  'CentOS Stream',
  'Windows Server 2025'
]

const panels = ['بدون کنترل پنل', 'DirectAdmin', 'cPanel', 'Plesk']

const backups = ['بدون بکاپ', 'روزانه', 'هفتگی']

const billingCycles = ['ماهانه', 'سه ماهه', 'شش ماهه', 'سالانه']
</script>

<template>
  <section class="space-y-10">
    <div>
      <h2 class="text-3xl font-bold mb-3">تنظیمات سرویس</h2>
      <p class="text-gray-400">تنظیمات دلخواه خود را انتخاب کنید.</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Location -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-5">
          <Globe class="w-6 h-6 text-blue-400" />
          <h3 class="font-semibold">دیتاسنتر</h3>
        </div>
        <StartCustomSelect v-model="config.location" :options="locations" placeholder="انتخاب لوکیشن" />
      </div>

      <!-- OS -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-5">
          <Monitor class="w-6 h-6 text-purple-400" />
          <h3 class="font-semibold">سیستم عامل</h3>
        </div>
        <StartCustomSelect v-model="config.os" :options="operatingSystems" placeholder="انتخاب سیستم عامل" />
      </div>

      <!-- Control Panel -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-5">
          <ServerCog class="w-6 h-6 text-pink-400" />
          <h3 class="font-semibold">کنترل پنل</h3>
        </div>
        <StartCustomSelect v-model="config.controlPanel" :options="panels" />
      </div>

      <!-- Backup -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-5">
          <ShieldCheck class="w-6 h-6 text-green-400" />
          <h3 class="font-semibold">نسخه پشتیبان</h3>
        </div>
        <StartCustomSelect v-model="config.backup" :options="backups" />
      </div>

      <!-- IPv4 -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-5">
          <Network class="w-6 h-6 text-cyan-400" />
          <h3 class="font-semibold">تعداد IPv4</h3>
        </div>

        <input
          v-model.number="config.ipv4"
          type="range"
          min="1"
          max="8"
          class="w-full accent-purple-500"
        >

        <div class="flex justify-between mt-3">
          <span class="text-gray-400">1</span>
          <span class="font-bold text-purple-400">{{ config.ipv4 }}</span>
          <span class="text-gray-400">8</span>
        </div>
      </div>

      <!-- Billing -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-5">
          <Clock3 class="w-6 h-6 text-yellow-400" />
          <h3 class="font-semibold">دوره پرداخت</h3>
        </div>
        <StartCustomSelect v-model="config.billing" :options="billingCycles" />
      </div>
    </div>

    <!-- Hostname -->
    <div class="glass-card rounded-2xl p-6">
      <div class="flex items-center justify-between mb-3">
        <label class="font-semibold">Hostname</label>
        <button
          v-if="domain"
          type="button"
          class="text-xs text-purple-300 hover:text-purple-200 transition"
          @click="config.hostname = `server.${domain}`"
        >
          استفاده از دامنه انتخابی
        </button>
      </div>

      <input
        v-model="config.hostname"
        type="text"
        dir="ltr"
        placeholder="server01.donyaweb.com"
        class="input-glass w-full rounded-xl px-4 py-3"
      >
    </div>

    <!-- Password -->
    <div class="glass-card rounded-2xl p-6">
      <div class="flex items-center gap-3 mb-5">
        <KeyRound class="w-5 h-5 text-red-400" />
        <label class="font-semibold">رمز عبور Root</label>
      </div>

      <input
        v-model="config.password"
        type="password"
        placeholder="حداقل 8 کاراکتر"
        class="input-glass w-full rounded-xl px-4 py-3"
      >

      <p class="text-xs text-gray-500 mt-3">
        این رمز برای ورود اولیه به سرور استفاده خواهد شد.
      </p>
    </div>

    <!-- Extra -->
    <div class="glass rounded-3xl p-8 border border-purple-500/20">
      <h3 class="font-bold text-xl mb-6">امکانات اضافی</h3>

      <div class="grid md:grid-cols-2 gap-5">
        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="config.monitoring" type="checkbox" class="accent-purple-600">
          مانیتورینگ 24 ساعته
        </label>

        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="config.firewall" type="checkbox" class="accent-purple-600">
          فایروال اختصاصی
        </label>

        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="config.snapshot" type="checkbox" class="accent-purple-600">
          Snapshot روزانه
        </label>

        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="config.prioritySupport" type="checkbox" class="accent-purple-600">
          پشتیبانی ویژه
        </label>
      </div>
    </div>
  </section>
</template>