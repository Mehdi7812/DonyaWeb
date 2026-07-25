<script setup>
import { computed, reactive, ref } from 'vue'
import {
  ArrowRight, RotateCcw, CheckCircle2, Power, PowerOff, Terminal,
  Cpu, HardDrive, Wifi, Database, Mail, Archive, Key, Eye, EyeOff, Copy,
  ShieldAlert, ExternalLink, Plus, Loader2, X, TrendingUp, Globe2, RefreshCcw
} from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const {
  getServiceById, getVpsDetails, getHostingDetails, vpsOsOptions, vpsPlanOptions,
  setVpsPower, reinstallVpsOs, resetVpsRootPassword, upgradeServicePlan,
  createHostingBackup, addHostingDatabase, addHostingEmail
} = useDashboard()

const service = getServiceById(route.params.id)

if (!service) {
  throw createError({ statusCode: 404, statusMessage: 'سرویس مورد نظر پیدا نشد' })
}

// دامنه‌ها صفحه‌ی مدیریت اختصاصی خودشون رو دارن
if (service.type === 'domain') {
  await navigateTo('/dashboard/domains')
}

const isRenewMode = computed(() => route.query.action === 'renew')
const isProcessing = ref(false)
const toast = useToast()

useHead({
  title: `${service.name} | مدیریت سرویس | دنیاوب`
})

function goBack() {
  router.push({ path: '/dashboard/services', query: route.query.type ? { type: route.query.type } : {} })
}

function startRenew() {
  router.replace({ query: { action: 'renew' } })
}

async function handleRenew() {
  if (isProcessing.value) return
  isProcessing.value = true
  await new Promise((resolve) => setTimeout(resolve, 900))
  isProcessing.value = false
  toast.success(`درخواست تمدید ${service.type === 'hosting' ? 'هاست' : 'VPS'} «${service.name}» با موفقیت ثبت شد.`)
}

// ================= VPS =================
const vps = service.type === 'vps' ? reactive({ ...getVpsDetails(service.id) }) : null

function syncVps() {
  Object.assign(vps, getVpsDetails(service.id))
}

const powerLabel = {
  running: { label: 'در حال اجرا', class: 'text-green-400 bg-green-500/10 border-green-500/30' },
  stopped: { label: 'متوقف‌شده', class: 'text-red-400 bg-red-500/10 border-red-500/30' },
  rebooting: { label: 'در حال راه‌اندازی مجدد', class: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' }
}

const vpsActionLoading = ref('')
async function runPowerAction(action) {
  vpsActionLoading.value = action
  if (action === 'reboot') setVpsPower(service.id, 'rebooting')
  syncVps()
  // TODO: اتصال به API واقعی هایپروایزر برای عملیات روشن/خاموش/ری‌استارت
  await new Promise((resolve) => setTimeout(resolve, 1400))

  if (action === 'reboot') setVpsPower(service.id, 'running')
  else if (action === 'stop') setVpsPower(service.id, 'stopped')
  else if (action === 'start') setVpsPower(service.id, 'running')
  syncVps()
  vpsActionLoading.value = ''
  const messages = { reboot: 'سرور با موفقیت ری‌استارت شد', stop: 'سرور خاموش شد', start: 'سرور روشن شد' }
  toast.success(messages[action])
}

const showReinstall = ref(false)
const selectedOs = ref(vps?.os)
const isReinstalling = ref(false)
const vpsOsSelectOptions = computed(() => vpsOsOptions.map((os) => ({ label: os, value: os })))
async function confirmReinstall() {
  isReinstalling.value = true
  setVpsPower(service.id, 'rebooting')
  syncVps()
  // TODO: اتصال به API واقعی نصب مجدد سیستم‌عامل
  await new Promise((resolve) => setTimeout(resolve, 1800))
  reinstallVpsOs(service.id, selectedOs.value)
  syncVps()
  isReinstalling.value = false
  showReinstall.value = false
  toast.success(`سیستم‌عامل با موفقیت روی ${selectedOs.value} نصب شد. تمام اطلاعات قبلی سرور پاک شد.`)
}

const showPassword = ref(false)
const isResettingPassword = ref(false)
async function handleResetPassword() {
  isResettingPassword.value = true
  await new Promise((resolve) => setTimeout(resolve, 800))
  resetVpsRootPassword(service.id)
  syncVps()
  showPassword.value = true
  isResettingPassword.value = false
  toast.success('رمز روت جدید صادر شد')
}
function copyPassword() {
  if (import.meta.client) {
    navigator.clipboard?.writeText(vps.rootPassword)
    toast.success('رمز عبور کپی شد')
  }
}

const showConsole = ref(false)
const consoleLines = ref([])
function openConsole() {
  showConsole.value = true
  consoleLines.value = ['در حال اتصال به کنسول سرور...']
  const steps = [
    'Connected to 185.231.45.12:5900 (VNC over SSL)',
    `Booting ${vps.os} ...`,
    '[  OK  ] Started Network Manager',
    '[  OK  ] Started SSH Daemon',
    `donyaweb-vps login: _`
  ]
  steps.forEach((line, i) => {
    setTimeout(() => consoleLines.value.push(line), (i + 1) * 500)
  })
}

const showUpgrade = ref(false)
const selectedPlanId = ref('')
const isUpgrading = ref(false)
async function confirmUpgrade() {
  const plan = vpsPlanOptions.find((p) => p.id === selectedPlanId.value)
  if (!plan) {
    toast.error('یک پلن را انتخاب کنید')
    return
  }
  isUpgrading.value = true
  // TODO: اتصال به API واقعی تغییر پلن + محاسبه مابه‌التفاوت فاکتور
  await new Promise((resolve) => setTimeout(resolve, 1200))
  upgradeServicePlan(service.id, plan)
  syncVps()
  service.name = plan.name
  service.price = plan.price
  isUpgrading.value = false
  showUpgrade.value = false
  toast.success(`سرویس با موفقیت به «${plan.name}» ارتقا یافت`)
}

// ================= Hosting =================
const hosting = service.type === 'hosting' ? reactive({ ...getHostingDetails(service.id) }) : null

function syncHosting() {
  Object.assign(hosting, getHostingDetails(service.id))
}

function openControlPanel() {
  toast.info('در محیط دمو، اتصال مستقیم به کنترل‌پنل واقعی فعال نیست.')
}

const isBackingUp = ref(false)
async function handleCreateBackup() {
  isBackingUp.value = true
  // TODO: اتصال به API واقعی بک‌آپ‌گیری
  await new Promise((resolve) => setTimeout(resolve, 1300))
  createHostingBackup(service.id)
  syncHosting()
  isBackingUp.value = false
  toast.success('بک‌آپ جدید با موفقیت ایجاد شد')
}

function handleRestoreBackup(backup) {
  toast.info(`درخواست بازگردانی بک‌آپ ${backup.date} ثبت شد و طی چند دقیقه انجام می‌شود.`)
}

const showDbForm = ref(false)
const newDbName = ref('')
function handleAddDatabase() {
  if (!newDbName.value.trim()) {
    toast.error('نام دیتابیس را وارد کنید')
    return
  }
  addHostingDatabase(service.id, newDbName.value.trim())
  syncHosting()
  toast.success('دیتابیس جدید ایجاد شد')
  newDbName.value = ''
  showDbForm.value = false
}

const showEmailForm = ref(false)
const newEmailLocal = ref('')
function handleAddEmail() {
  if (!newEmailLocal.value.trim()) {
    toast.error('نام کاربری ایمیل را وارد کنید')
    return
  }
  addHostingEmail(service.id, `${newEmailLocal.value.trim()}@${service.identifier}`)
  syncHosting()
  toast.success('ایمیل سازمانی جدید ایجاد شد')
  newEmailLocal.value = ''
  showEmailForm.value = false
}

function pct(used, total) {
  return Math.min(100, Math.round((used / total) * 100))
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <button
          type="button"
          class="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          @click="goBack"
        >
          <ArrowRight class="w-4 h-4 rotate-180" />
          بازگشت به سرویس‌ها
        </button>
        <h1 class="text-2xl font-bold mt-4">مدیریت سرویس «{{ service.name }}»</h1>
        <p class="text-gray-400 mt-2 flex items-center gap-2 flex-wrap">
          نوع سرویس: {{ service.typeLabel }}
          <DashboardStatusBadge :status="service.status" />
          <span v-if="vps" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border" :class="powerLabel[vps.powerStatus].class">
            {{ powerLabel[vps.powerStatus].label }}
          </span>
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-sm hover:bg-white/10 transition-all shrink-0"
        @click="startRenew"
      >
        <RotateCcw class="w-4 h-4" />
        تمدید سرویس
      </button>
    </div>

    <!-- بلاک تمدید -->
    <div v-if="isRenewMode" class="glass-card rounded-3xl border border-purple-500/30 p-6 bg-purple-500/5">
      <div class="flex items-start gap-3">
        <CheckCircle2 class="w-6 h-6 text-purple-300 shrink-0" />
        <div>
          <h4 class="text-lg font-semibold">تمدید سرویس</h4>
          <p class="text-gray-400 mt-2 text-sm leading-relaxed">
            برای تمدید سرویس، روی دکمه زیر کلیک کنید تا درخواست شما ثبت شود.
          </p>
        </div>
      </div>
      <div class="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="isProcessing"
          @click="handleRenew"
        >
          <RotateCcw class="w-4 h-4" />
          {{ isProcessing ? 'در حال ثبت درخواست...' : 'ثبت درخواست تمدید' }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-sm hover:bg-white/10 transition-all"
          @click="router.replace({ query: {} })"
        >
          بازگشت به مدیریت
        </button>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div class="space-y-6">
        <!-- جزئیات کلی -->
        <section class="glass-card rounded-3xl p-6 space-y-4">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-xl font-semibold">جزئیات سرویس</h2>
            <span class="rounded-full px-3 py-1 text-xs font-semibold text-white bg-white/10">{{ service.cycle }}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p class="text-gray-400 text-xs">شناسه سرویس</p>
              <p class="font-medium" dir="ltr">{{ service.id }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs">{{ service.type === 'vps' ? 'آدرس IP' : 'دامنه اصلی' }}</p>
              <p class="font-medium" dir="ltr">{{ service.identifier }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs">تاریخ تمدید</p>
              <p class="font-medium">{{ service.renewDate }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs">هزینه</p>
              <p class="font-medium">{{ service.price }} تومان</p>
            </div>
          </div>
        </section>

        <!-- ================= VPS ================= -->
        <template v-if="vps">
          <section class="glass-card rounded-3xl p-6 space-y-5">
            <h2 class="text-lg font-semibold">مصرف منابع</h2>
            <div class="grid sm:grid-cols-3 gap-4">
              <div>
                <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span class="flex items-center gap-1.5"><Cpu class="w-3.5 h-3.5" /> پردازنده</span>
                  <span dir="ltr">{{ vps.cpu.used }}%</span>
                </div>
                <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div class="h-full bg-linear-to-r from-purple-500 to-blue-500" :style="{ width: `${vps.cpu.used}%` }" />
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ vps.cpu.cores }} هسته</p>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span class="flex items-center gap-1.5"><HardDrive class="w-3.5 h-3.5" /> رم</span>
                  <span dir="ltr">{{ vps.ram.used }} / {{ vps.ram.total }} GB</span>
                </div>
                <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div class="h-full bg-linear-to-r from-purple-500 to-blue-500" :style="{ width: `${pct(vps.ram.used, vps.ram.total)}%` }" />
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span class="flex items-center gap-1.5"><Archive class="w-3.5 h-3.5" /> دیسک</span>
                  <span dir="ltr">{{ vps.disk.used }} / {{ vps.disk.total }} GB</span>
                </div>
                <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div class="h-full bg-linear-to-r from-purple-500 to-blue-500" :style="{ width: `${pct(vps.disk.used, vps.disk.total)}%` }" />
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
              <span class="flex items-center gap-1.5"><Wifi class="w-3.5 h-3.5" /> ترافیک ماهانه</span>
              <span dir="ltr">{{ vps.bandwidth.used }} / {{ vps.bandwidth.total }} GB</span>
            </div>
          </section>

          <section class="glass-card rounded-3xl p-6 space-y-4">
            <h2 class="text-lg font-semibold">عملیات سرور</h2>
            <div class="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                :disabled="!!vpsActionLoading"
                class="flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10 hover:border-purple-500/40 transition-all text-sm font-medium disabled:opacity-60"
                @click="runPowerAction('reboot')"
              >
                <Loader2 v-if="vpsActionLoading === 'reboot'" class="w-4 h-4 animate-spin" />
                <RefreshCcw v-else class="w-4 h-4" />
                ری‌استارت سرور
              </button>
              <button
                v-if="vps.powerStatus !== 'stopped'"
                type="button"
                :disabled="!!vpsActionLoading"
                class="flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10 hover:border-red-500/40 transition-all text-sm font-medium disabled:opacity-60"
                @click="runPowerAction('stop')"
              >
                <Loader2 v-if="vpsActionLoading === 'stop'" class="w-4 h-4 animate-spin" />
                <PowerOff v-else class="w-4 h-4" />
                خاموش کردن
              </button>
              <button
                v-else
                type="button"
                :disabled="!!vpsActionLoading"
                class="flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10 hover:border-green-500/40 transition-all text-sm font-medium disabled:opacity-60"
                @click="runPowerAction('start')"
              >
                <Loader2 v-if="vpsActionLoading === 'start'" class="w-4 h-4 animate-spin" />
                <Power v-else class="w-4 h-4" />
                روشن کردن
              </button>
              <button
                type="button"
                class="flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10 hover:border-purple-500/40 transition-all text-sm font-medium"
                @click="openConsole"
              >
                <Terminal class="w-4 h-4" />
                کنسول سرور
              </button>
              <button
                type="button"
                class="flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10 hover:border-purple-500/40 transition-all text-sm font-medium sm:col-span-2"
                @click="showUpgrade = true"
              >
                <TrendingUp class="w-4 h-4" />
                ارتقا پلن سرور
              </button>
            </div>

            <div class="pt-4 border-t border-white/10">
              <p class="text-xs text-gray-500 mb-3 flex items-center gap-1.5"><ShieldAlert class="w-3.5 h-3.5 text-red-400" /> عملیات حساس</p>
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-all text-sm font-medium"
                @click="showReinstall = true; selectedOs = vps.os"
              >
                <RotateCcw class="w-4 h-4" />
                نصب مجدد سیستم‌عامل
              </button>
            </div>
          </section>

          <!-- کنسول -->
          <section v-if="showConsole" class="glass-card rounded-3xl p-6 space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold flex items-center gap-2"><Terminal class="w-4 h-4" /> کنسول سرور (نمایشی)</h2>
              <button type="button" class="text-gray-500 hover:text-white transition-colors" @click="showConsole = false">
                <X class="w-5 h-5" />
              </button>
            </div>
            <div class="bg-black/60 rounded-xl p-4 font-mono text-xs text-green-400 space-y-1 h-48 overflow-y-auto" dir="ltr">
              <p v-for="(line, i) in consoleLines" :key="i">{{ line }}</p>
            </div>
          </section>

          <!-- نصب مجدد OS -->
          <section v-if="showReinstall" class="glass-card rounded-3xl border border-red-500/30 p-6 space-y-4 bg-red-500/5">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold flex items-center gap-2 text-red-300"><ShieldAlert class="w-5 h-5" /> نصب مجدد سیستم‌عامل</h2>
              <button type="button" class="text-gray-500 hover:text-white transition-colors" @click="showReinstall = false">
                <X class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-gray-400">با نصب مجدد، تمام اطلاعات و فایل‌های فعلی سرور برای همیشه پاک می‌شود.</p>
            <StartCustomSelect
              v-model="selectedOs"
              :options="vpsOsSelectOptions"
              placeholder="انتخاب سیستم‌عامل"
            />
            <button
              type="button"
              :disabled="isReinstalling"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all text-sm font-bold disabled:opacity-60"
              @click="confirmReinstall"
            >
              <Loader2 v-if="isReinstalling" class="w-4 h-4 animate-spin" />
              <RotateCcw v-else class="w-4 h-4" />
              {{ isReinstalling ? 'در حال نصب...' : 'تایید و نصب مجدد' }}
            </button>
          </section>

          <!-- ارتقا پلن -->
          <section v-if="showUpgrade" class="glass-card rounded-3xl p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">ارتقا پلن سرور</h2>
              <button type="button" class="text-gray-500 hover:text-white transition-colors" @click="showUpgrade = false">
                <X class="w-5 h-5" />
              </button>
            </div>
            <div class="grid sm:grid-cols-2 gap-3">
              <button
                v-for="plan in vpsPlanOptions"
                :key="plan.id"
                type="button"
                class="text-right p-4 rounded-xl border transition-all"
                :class="selectedPlanId === plan.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-purple-500/40'"
                @click="selectedPlanId = plan.id"
              >
                <p class="font-bold mb-1">{{ plan.name }}</p>
                <p class="text-xs text-gray-400" dir="ltr">{{ plan.cpu }} Core · {{ plan.ram }}GB RAM · {{ plan.disk }}GB SSD</p>
                <p class="text-sm mt-2 text-purple-300">{{ plan.price }} تومان / ماه</p>
              </button>
            </div>
            <button
              type="button"
              :disabled="isUpgrading"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-bold disabled:opacity-60"
              @click="confirmUpgrade"
            >
              <Loader2 v-if="isUpgrading" class="w-4 h-4 animate-spin" />
              <TrendingUp v-else class="w-4 h-4" />
              {{ isUpgrading ? 'در حال ارتقا...' : 'تایید ارتقا' }}
            </button>
          </section>
        </template>

        <!-- ================= Hosting ================= -->
        <template v-if="hosting">
          <section class="glass-card rounded-3xl p-6 space-y-5">
            <h2 class="text-lg font-semibold">فضا و ترافیک</h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span class="flex items-center gap-1.5"><Archive class="w-3.5 h-3.5" /> فضای دیسک</span>
                  <span dir="ltr">{{ hosting.disk.used }} / {{ hosting.disk.total }} GB</span>
                </div>
                <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div class="h-full bg-linear-to-r from-purple-500 to-blue-500" :style="{ width: `${pct(hosting.disk.used, hosting.disk.total)}%` }" />
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span class="flex items-center gap-1.5"><Wifi class="w-3.5 h-3.5" /> پهنای‌باند ماهانه</span>
                  <span dir="ltr">{{ hosting.bandwidth.used }} / {{ hosting.bandwidth.total }} GB</span>
                </div>
                <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div class="h-full bg-linear-to-r from-purple-500 to-blue-500" :style="{ width: `${pct(hosting.bandwidth.used, hosting.bandwidth.total)}%` }" />
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
                @click="openControlPanel"
              >
                <ExternalLink class="w-4 h-4" />
                ورود به کنترل‌پنل
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 hover:border-purple-500/40 transition-all text-sm font-medium"
                @click="openControlPanel"
              >
                <Archive class="w-4 h-4" />
                فایل‌منیجر
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 hover:border-purple-500/40 transition-all text-sm font-medium"
                @click="showUpgrade = true"
              >
                <TrendingUp class="w-4 h-4" />
                ارتقا پلن
              </button>
            </div>
          </section>

          <!-- دیتابیس‌ها -->
          <section class="glass-card rounded-3xl overflow-hidden">
            <div class="p-6 pb-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold flex items-center gap-2"><Database class="w-4 h-4 text-purple-400" /> دیتابیس‌ها</h2>
              <button type="button" class="text-sm text-purple-300 hover:text-purple-200 flex items-center gap-1.5" @click="showDbForm = !showDbForm">
                <Plus class="w-4 h-4" />
                افزودن
              </button>
            </div>
            <div v-if="showDbForm" class="px-6 pb-4 flex gap-2">
              <input
                v-model="newDbName"
                type="text"
                dir="ltr"
                placeholder="نام دیتابیس"
                class="flex-1 px-3 py-2 rounded-lg input-glass text-white placeholder-gray-500 outline-none text-sm"
              >
              <button type="button" class="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all text-sm" @click="handleAddDatabase">ایجاد</button>
            </div>
            <div class="divide-y divide-white/5">
              <div v-for="db in hosting.databases" :key="db.name" class="px-6 py-3 flex items-center justify-between text-sm">
                <span class="font-mono" dir="ltr">{{ db.name }}</span>
                <span class="text-gray-400">{{ db.size }}</span>
              </div>
              <div v-if="!hosting.databases.length" class="px-6 py-6 text-center text-gray-500 text-sm">هنوز دیتابیسی ایجاد نشده است.</div>
            </div>
          </section>

          <!-- ایمیل سازمانی -->
          <section class="glass-card rounded-3xl overflow-hidden">
            <div class="p-6 pb-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold flex items-center gap-2"><Mail class="w-4 h-4 text-purple-400" /> ایمیل‌های سازمانی</h2>
              <button type="button" class="text-sm text-purple-300 hover:text-purple-200 flex items-center gap-1.5" @click="showEmailForm = !showEmailForm">
                <Plus class="w-4 h-4" />
                افزودن
              </button>
            </div>
            <div v-if="showEmailForm" class="px-6 pb-4 flex items-center gap-2">
              <input
                v-model="newEmailLocal"
                type="text"
                dir="ltr"
                placeholder="info"
                class="w-28 px-3 py-2 rounded-lg input-glass text-white placeholder-gray-500 outline-none text-sm text-left"
              >
              <span class="text-gray-500 text-sm" dir="ltr">@{{ service.identifier }}</span>
              <button type="button" class="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all text-sm mr-auto" @click="handleAddEmail">ایجاد</button>
            </div>
            <div class="divide-y divide-white/5">
              <div v-for="mail in hosting.emailAccounts" :key="mail.address" class="px-6 py-3 flex items-center justify-between text-sm">
                <span class="font-mono" dir="ltr">{{ mail.address }}</span>
                <span class="text-gray-400 text-xs">{{ mail.usage }}</span>
              </div>
              <div v-if="!hosting.emailAccounts.length" class="px-6 py-6 text-center text-gray-500 text-sm">هنوز ایمیلی ایجاد نشده است.</div>
            </div>
          </section>

          <!-- بک‌آپ‌ها -->
          <section class="glass-card rounded-3xl overflow-hidden">
            <div class="p-6 pb-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold flex items-center gap-2"><Archive class="w-4 h-4 text-purple-400" /> بک‌آپ‌ها</h2>
              <button
                type="button"
                :disabled="isBackingUp"
                class="inline-flex items-center gap-1.5 text-sm text-purple-300 hover:text-purple-200 disabled:opacity-60"
                @click="handleCreateBackup"
              >
                <Loader2 v-if="isBackingUp" class="w-4 h-4 animate-spin" />
                <Plus v-else class="w-4 h-4" />
                ایجاد بک‌آپ جدید
              </button>
            </div>
            <div class="divide-y divide-white/5">
              <div v-for="b in hosting.backups" :key="b.id" class="px-6 py-3 flex items-center justify-between text-sm">
                <div>
                  <p class="font-medium">{{ b.date }}</p>
                  <p class="text-gray-500 text-xs">{{ b.size }}</p>
                </div>
                <button type="button" class="text-purple-300 hover:text-purple-200 text-xs font-medium" @click="handleRestoreBackup(b)">
                  بازگردانی
                </button>
              </div>
              <div v-if="!hosting.backups.length" class="px-6 py-6 text-center text-gray-500 text-sm">هنوز بک‌آپی ثبت نشده است.</div>
            </div>
          </section>

          <!-- ارتقا پلن هاست -->
          <section v-if="showUpgrade" class="glass-card rounded-3xl p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">ارتقا پلن میزبانی</h2>
              <button type="button" class="text-gray-500 hover:text-white transition-colors" @click="showUpgrade = false">
                <X class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-gray-400">برای ارتقا به پلن بالاتر با پشتیبانی در تماس باشید یا از فروشگاه سرویس جدید سفارش دهید.</p>
            <NuxtLink
              to="/cloudhosting"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-bold"
            >
              <TrendingUp class="w-4 h-4" />
              مشاهده پلن‌های هاست
            </NuxtLink>
          </section>
        </template>
      </div>

      <aside class="space-y-6">
        <!-- دسترسی VPS -->
        <div v-if="vps" class="glass-card rounded-3xl p-6 space-y-4">
          <h2 class="text-lg font-semibold">اطلاعات دسترسی</h2>
          <div class="text-sm space-y-3">
            <div>
              <p class="text-gray-400 text-xs mb-1">آدرس IP</p>
              <p class="font-mono" dir="ltr">{{ vps.ip }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs mb-1">سیستم‌عامل</p>
              <p class="font-medium">{{ vps.os }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs mb-1">رمز روت</p>
              <div class="flex items-center gap-2">
                <p class="font-mono flex-1 truncate" dir="ltr">{{ showPassword ? vps.rootPassword : '••••••••••••' }}</p>
                <button type="button" class="text-gray-400 hover:text-white transition-colors shrink-0" @click="showPassword = !showPassword">
                  <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
                </button>
                <button v-if="showPassword" type="button" class="text-gray-400 hover:text-white transition-colors shrink-0" @click="copyPassword">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                :disabled="isResettingPassword"
                class="mt-2 text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1.5 disabled:opacity-60"
                @click="handleResetPassword"
              >
                <Loader2 v-if="isResettingPassword" class="w-3.5 h-3.5 animate-spin" />
                <Key v-else class="w-3.5 h-3.5" />
                صدور رمز جدید
              </button>
            </div>
          </div>
        </div>

        <!-- دسترسی هاست -->
        <div v-if="hosting" class="glass-card rounded-3xl p-6 space-y-3">
          <h2 class="text-lg font-semibold mb-1">دسترسی سریع</h2>
          <button type="button" class="w-full flex items-center gap-3 rounded-xl p-3 hover:bg-white/5 transition-colors text-sm" @click="openControlPanel">
            <div class="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <Globe2 class="w-4 h-4 text-purple-400" />
            </div>
            کنترل‌پنل هاست
          </button>
        </div>

        <div class="glass-card rounded-3xl p-6">
          <h2 class="text-lg font-semibold mb-3">عملیات سریع</h2>
          <div class="space-y-3">
            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 text-sm font-medium hover:bg-white/20 transition-all"
              @click="startRenew"
            >
              <RotateCcw class="w-4 h-4" />
              شروع تمدید
            </button>
            <NuxtLink
              to="/dashboard/services"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/10 text-sm font-medium hover:border-purple-500/30 transition-all"
            >
              <ArrowRight class="w-4 h-4 rotate-180" />
              بازگشت به لیست سرویس‌ها
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
