<script setup>
import { reactive, ref, computed } from 'vue'
import {
  ArrowRight, Server, Plus, Trash2, Pencil, X, Check, Loader2, Info
} from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const { getDomainServices, getDnsRecords, addDnsRecord, updateDnsRecord, deleteDnsRecord, dnsRecordTypes } = useDashboard()
const toast = useToast()

const domains = getDomainServices()
const domain = computed(() => (typeof route.query.domain === 'string' ? route.query.domain : domains[0]?.identifier || ''))
const dnsRecordTypeOptions = computed(() => dnsRecordTypes.map((type) => ({ label: type, value: type })))

if (!domain.value) {
  throw createError({ statusCode: 404, statusMessage: 'دامنه‌ای برای مدیریت DNS پیدا نشد' })
}

useHead({
  title: `مدیریت DNS ${domain.value} | دنیاوب`
})

// کپی محلی و واکنش‌گرا از رکوردهای این دامنه
const records = reactive([...getDnsRecords(domain.value)])

function refreshRecords() {
  records.splice(0, records.length, ...getDnsRecords(domain.value))
}

function switchDomain(d) {
  router.push({ path: '/dashboard/domains/dns', query: { domain: d } })
}

// --- افزودن رکورد جدید ---
const showForm = ref(false)
const isSubmitting = ref(false)
const editingId = ref(null)
const form = reactive({ type: 'A', name: '', value: '', ttl: 3600, priority: 10 })

function resetForm() {
  form.type = 'A'
  form.name = ''
  form.value = ''
  form.ttl = 3600
  form.priority = 10
  editingId.value = null
}

function openAddForm() {
  resetForm()
  showForm.value = true
}

function openEditForm(record) {
  editingId.value = record.id
  form.type = record.type
  form.name = record.name
  form.value = record.value
  form.ttl = record.ttl
  form.priority = record.priority || 10
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  resetForm()
}

async function submitForm() {
  if (!form.name.trim()) {
    toast.error('نام هاست (Host) را وارد کنید. برای رکورد ریشه از @ استفاده کنید.')
    return
  }
  if (!form.value.trim()) {
    toast.error('مقدار رکورد را وارد کنید')
    return
  }

  isSubmitting.value = true
  // TODO: اتصال به API واقعی مدیریت DNS ثبت‌کننده دامنه
  await new Promise((resolve) => setTimeout(resolve, 600))

  const payload = {
    type: form.type,
    name: form.name.trim(),
    value: form.value.trim(),
    ttl: Number(form.ttl) || 3600,
    ...(form.type === 'MX' ? { priority: Number(form.priority) || 10 } : {})
  }

  if (editingId.value) {
    updateDnsRecord(domain.value, editingId.value, payload)
    toast.success('رکورد DNS با موفقیت ویرایش شد')
  } else {
    addDnsRecord(domain.value, payload)
    toast.success('رکورد DNS جدید ثبت شد')
  }

  refreshRecords()
  isSubmitting.value = false
  closeForm()
}

const deletingId = ref(null)
async function removeRecord(record) {
  deletingId.value = record.id
  await new Promise((resolve) => setTimeout(resolve, 500))
  deleteDnsRecord(domain.value, record.id)
  refreshRecords()
  deletingId.value = null
  toast.success(`رکورد ${record.type} حذف شد`)
}

const typeColor = {
  A: 'text-green-400 bg-green-500/10 border-green-500/30',
  AAAA: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
  CNAME: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  MX: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  TXT: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  NS: 'text-gray-300 bg-gray-500/10 border-gray-500/30'
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div>
      <NuxtLink to="/dashboard/domains" class="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
        <ArrowRight class="w-4 h-4 rotate-180" />
        بازگشت به دامنه‌ها
      </NuxtLink>
      <h1 class="text-2xl font-bold mt-4 flex items-center gap-2">
        <Server class="w-6 h-6 text-purple-400" />
        مدیریت DNS
        <span class="text-purple-300" dir="ltr">{{ domain }}</span>
      </h1>
      <p class="text-gray-400 mt-2 text-sm">
        رکوردهای A، CNAME، MX، TXT و NS دامنه‌ی خود را از اینجا مدیریت کنید. اعمال تغییرات DNS ممکن است تا ۲۴ ساعت طول بکشد.
      </p>
    </div>

    <div v-if="domains.length > 1" class="flex flex-wrap gap-2">
      <button
        v-for="d in domains"
        :key="d.id"
        type="button"
        class="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
        :class="d.identifier === domain
          ? 'bg-linear-to-r from-purple-600 to-blue-600 border-transparent'
          : 'glass border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40'"
        dir="ltr"
        @click="switchDomain(d.identifier)"
      >
        {{ d.identifier }}
      </button>
    </div>

    <div class="flex items-start gap-2 text-xs text-gray-500 bg-white/5 border border-white/10 rounded-xl p-4">
      <Info class="w-4 h-4 shrink-0 mt-0.5" />
      برای رکورد مربوط به خودِ دامنه (بدون ساب‌دامین) در فیلد «نام» از <span class="font-mono text-gray-300 mx-1">@</span> استفاده کنید.
    </div>

    <!-- فرم افزودن/ویرایش رکورد -->
    <div v-if="showForm" class="glass-card rounded-3xl p-6 space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">{{ editingId ? 'ویرایش رکورد DNS' : 'افزودن رکورد DNS جدید' }}</h2>
        <button type="button" class="text-gray-500 hover:text-white transition-colors" @click="closeForm">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-300 mb-2">نوع رکورد</label>
          <StartCustomSelect
            v-model="form.type"
            :options="dnsRecordTypeOptions"
            placeholder="انتخاب نوع رکورد"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-300 mb-2">نام هاست (Host)</label>
          <input
            v-model="form.name"
            type="text"
            dir="ltr"
            placeholder="@ یا www یا mail"
            class="w-full px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none text-left"
          >
        </div>
        <div class="sm:col-span-2">
          <label class="block text-sm text-gray-300 mb-2">مقدار (Value)</label>
          <input
            v-model="form.value"
            type="text"
            dir="ltr"
            placeholder="مثلاً 185.231.45.12"
            class="w-full px-4 py-3 rounded-xl input-glass text-white placeholder-gray-500 outline-none text-left"
          >
        </div>
        <div>
          <label class="block text-sm text-gray-300 mb-2">TTL (ثانیه)</label>
          <input
            v-model="form.ttl"
            type="number"
            min="60"
            dir="ltr"
            class="w-full px-4 py-3 rounded-xl input-glass text-white outline-none text-left"
          >
        </div>
        <div v-if="form.type === 'MX'">
          <label class="block text-sm text-gray-300 mb-2">اولویت (Priority)</label>
          <input
            v-model="form.priority"
            type="number"
            min="0"
            dir="ltr"
            class="w-full px-4 py-3 rounded-xl input-glass text-white outline-none text-left"
          >
        </div>
      </div>

      <button
        type="button"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
        @click="submitForm"
      >
        <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
        <Check v-else class="w-4 h-4" />
        {{ isSubmitting ? 'در حال ذخیره...' : editingId ? 'ذخیره تغییرات' : 'افزودن رکورد' }}
      </button>
    </div>

    <!-- جدول رکوردها -->
    <div class="glass-card rounded-3xl overflow-hidden">
      <div class="p-6 pb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold">رکوردهای DNS ({{ records.length }})</h2>
        <button
          v-if="!showForm"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
          @click="openAddForm"
        >
          <Plus class="w-4 h-4" />
          رکورد جدید
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-y border-white/10 text-gray-400 text-right">
              <th class="px-6 py-3 font-medium">نوع</th>
              <th class="px-6 py-3 font-medium">نام</th>
              <th class="px-6 py-3 font-medium">مقدار</th>
              <th class="px-6 py-3 font-medium">TTL</th>
              <th class="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in records" :key="r.id" class="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <td class="px-6 py-4">
                <span class="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border" :class="typeColor[r.type]">{{ r.type }}</span>
              </td>
              <td class="px-6 py-4 font-mono" dir="ltr">{{ r.name }}</td>
              <td class="px-6 py-4 font-mono text-gray-300 max-w-xs truncate" dir="ltr">
                {{ r.value }}<span v-if="r.type === 'MX'" class="text-gray-500"> (اولویت {{ r.priority }})</span>
              </td>
              <td class="px-6 py-4 text-gray-400" dir="ltr">{{ r.ttl }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-1.5">
                  <button type="button" class="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" @click="openEditForm(r)">
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    :disabled="deletingId === r.id"
                    class="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    @click="removeRecord(r)"
                  >
                    <Loader2 v-if="deletingId === r.id" class="w-4 h-4 animate-spin" />
                    <Trash2 v-else class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!records.length">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">هنوز رکورد DNS ثبت نشده است.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
