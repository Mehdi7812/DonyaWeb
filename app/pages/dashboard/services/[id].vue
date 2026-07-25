<script setup>
import { computed, ref } from 'vue'
import { ArrowRight, RotateCcw, Settings, CheckCircle2 } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const { getServiceById } = useDashboard()

const service = getServiceById(route.params.id)

if (!service) {
  throw createError({ statusCode: 404, statusMessage: 'سرویس مورد نظر پیدا نشد' })
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
  if (service.type === 'domain') {
    router.push({ path: '/dashboard/domains/renew', query: { domain: service.identifier } })
    return
  }
  router.replace({ query: { action: 'renew' } })
}

async function handleRenew() {
  if (isProcessing.value) return
  isProcessing.value = true
  await new Promise((resolve) => setTimeout(resolve, 900))
  isProcessing.value = false
  toast.success(`درخواست تمدید ${service.type === 'hosting' ? 'هاست' : 'VPS'} «${service.name}» با موفقیت ثبت شد.`)
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <button
          type="button"
          @click="goBack"
          class="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <ArrowRight class="w-4 h-4 rotate-180" />
          بازگشت به سرویس‌ها
        </button>
        <h1 class="text-2xl font-bold mt-4">مدیریت سرویس «{{ service.name }}»</h1>
        <p class="text-gray-400 mt-2">نوع سرویس: {{ service.typeLabel }} · وضعیت: {{ service.status }}</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-sm hover:bg-white/10 transition-all"
          @click="startRenew"
        >
          <RotateCcw class="w-4 h-4" />
          تمدید
        </button>
        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 text-sm"
          ><Settings class="w-4 h-4" /> مدیریت</span>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <section class="glass-card rounded-3xl p-6 space-y-5">
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold">جزئیات سرویس</h2>
              <p class="text-sm text-gray-400">شناسه: <span dir="ltr" class="font-medium">{{ service.id }}</span></p>
            </div>
            <span class="rounded-full px-3 py-1 text-xs font-semibold text-white bg-white/10">{{ service.cycle }}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p class="text-gray-400 text-xs">نام سرویس</p>
              <p class="font-medium">{{ service.name }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs">دوره پرداخت</p>
              <p class="font-medium">{{ service.cycle }}</p>
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
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-semibold">روند مدیریت</h3>
          <p class="text-gray-400 text-sm leading-relaxed">
            در این صفحه می‌توانید وضعیت سرویس را بررسی کنید، تغییرات لازم را ببینید و در صورت نیاز فرایند تمدید را آغاز کنید.
          </p>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="glass-card rounded-2xl p-4">
              <p class="text-gray-400 text-xs">وضعیت فعلی</p>
              <p class="mt-2 font-medium capitalize">{{ service.status }}</p>
            </div>
            <div class="glass-card rounded-2xl p-4">
              <p class="text-gray-400 text-xs">شناسه سرویس</p>
              <p class="mt-2 font-medium" dir="ltr">{{ service.identifier }}</p>
            </div>
          </div>
        </div>

        <template v-if="isRenewMode">
          <div class="glass-card rounded-3xl border border-purple-500/30 p-6 bg-purple-500/5">
            <div class="flex items-start gap-3">
              <CheckCircle2 class="w-6 h-6 text-purple-300 shrink-0" />
              <div>
                <h4 class="text-lg font-semibold">تمدید سرویس</h4>
                <p class="text-gray-400 mt-2 text-sm leading-relaxed">
                  برای تمدید سرویس، روی دکمه زیر کلیک کنید تا درخواست شما ثبت شود. اگر سرویس دامنه باشد، به صفحه اختصاصی تمدید دامنه منتقل می‌شوید.
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
        </template>
      </section>

      <aside class="space-y-6">
        <div class="glass-card rounded-3xl p-6">
          <h2 class="text-lg font-semibold mb-3">عملیات سریع</h2>
          <div class="space-y-3">
            <button
              type="button"
              @click="startRenew"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 text-sm font-medium hover:bg-white/20 transition-all"
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

        <div class="glass-card rounded-3xl p-6 bg-slate-900/40">
          <h2 class="text-lg font-semibold mb-3">نکات مهم</h2>
          <ul class="space-y-3 text-sm text-gray-400">
            <li>اگر دامنه باشد، دکمه تمدید شما را به صفحه تمدید دامنه انتقال می‌دهد.</li>
            <li>برای پیگیری تغییرات دقیق‌تر، به زودی می‌توانیم مدیریت سرویس را با فرم‌های اختصاصی گسترش دهیم.</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>