<script setup>
import { Menu, Bell, ChevronDown, CheckCheck, CreditCard, Server, MessageSquare } from 'lucide-vue-next'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

const sidebarOpen = useState('dashboardSidebarOpen', () => false)
const route = useRoute()
const { user } = useDashboard()

const menuOpen = ref(false)
const notifOpen = ref(false)

const menuRef = ref(null)
const notifRef = ref(null)

// ---- اعلانات ----
const notifications = ref([
  {
    id: 1,
    icon: CreditCard,
    color: 'text-emerald-400 bg-emerald-500/10',
    title: 'پرداخت موفق',
    text: 'فاکتور #INV-1042 با موفقیت پرداخت شد.',
    time: '۱۰ دقیقه پیش',
    read: false,
    to: '/dashboard/invoices'
  },
  {
    id: 2,
    icon: Server,
    color: 'text-amber-400 bg-amber-500/10',
    title: 'انقضای سرویس',
    text: 'سرویس هاست شما ۳ روز دیگر منقضی می‌شود.',
    time: '۲ ساعت پیش',
    read: false,
    to: '/dashboard/services'
  },
  {
    id: 3,
    icon: MessageSquare,
    color: 'text-blue-400 bg-blue-500/10',
    title: 'پاسخ تیکت',
    text: 'تیکت #4521 توسط پشتیبانی پاسخ داده شد.',
    time: 'دیروز',
    read: true,
    to: '/dashboard/tickets'
  }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function toggleNotif() {
  notifOpen.value = !notifOpen.value
  if (notifOpen.value) menuOpen.value = false
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) notifOpen.value = false
}

function markAllRead() {
  notifications.value.forEach(n => (n.read = true))
}

function openNotification(notif) {
  notif.read = true
  notifOpen.value = false
  if (notif.to) navigateTo(notif.to)
}

// ---- بستن با کلیک بیرون ----
function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) menuOpen.value = false
  if (notifRef.value && !notifRef.value.contains(e.target)) notifOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// ---- عنوان صفحه ----
const titleMap = {
  '/dashboard': 'داشبورد',
  '/dashboard/services': 'سرویس‌های من',
  '/dashboard/invoices': 'صورت‌حساب‌ها',
  '/dashboard/tickets': 'تیکت‌های پشتیبانی',
  '/dashboard/tickets/new': 'ثبت تیکت جدید',
  '/dashboard/account': 'حساب کاربری',
  '/dashboard/domains': 'مدیریت دامنه‌ها',
  '/dashboard/domains/renew': 'تمدید دامنه',
  '/dashboard/domains/transfer': 'انتقال دامنه',
  '/dashboard/cdn': 'شبکه توزیع محتوا (CDN)',
  '/dashboard/finance/topup': 'افزایش موجودی کیف پول',
  '/dashboard/finance/gift-card': 'کارت هدیه',
  '/dashboard/affiliate': 'همکاری در فروش',
  '/dashboard/transfer-ownership': 'انتقال مالکیت سرویس'
}

const pageTitle = computed(() => {
  if (titleMap[route.path]) return titleMap[route.path]
  const base = '/' + route.path.split('/').slice(1, 3).join('/')
  return titleMap[base] || 'پنل کاربری'
})
</script>

<template>
  <header class="h-20 glass border-b border-white/10 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
    <div class="flex items-center gap-4">
      <button type="button" class="lg:hidden text-gray-300 hover:text-white transition-colors" @click="sidebarOpen = true">
        <Menu class="w-6 h-6" />
      </button>
      <h1 class="text-lg sm:text-xl font-bold">{{ pageTitle }}</h1>
    </div>

    <div class="flex items-center gap-3 sm:gap-4">
      <!-- اعلانات -->
      <div ref="notifRef" class="relative">
        <button
          type="button"
          class="relative w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all"
          @click="toggleNotif"
        >
          <Bell class="w-5 h-5" />
          <span v-if="unreadCount > 0" class="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
        </button>

        <Transition name="fade">
          <div
            v-if="notifOpen"
            class="dropdown-panel absolute left-0 mt-2 w-80 sm:w-88 rounded-xl overflow-hidden text-sm"
          >
            <!-- هدر پنل -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span class="font-bold">اعلانات</span>
              <button
                v-if="unreadCount > 0"
                type="button"
                class="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                @click="markAllRead"
              >
                <CheckCheck class="w-3.5 h-3.5" />
                خواندن همه
              </button>
            </div>

            <!-- لیست اعلانات -->
            <div class="max-h-80 overflow-y-auto">
              <template v-if="notifications.length">
                <button
                  v-for="notif in notifications"
                  :key="notif.id"
                  type="button"
                  class="w-full flex items-start gap-3 px-4 py-3 text-right hover:bg-white/10 transition-all"
                  :class="{ 'opacity-60': notif.read }"
                  @click="openNotification(notif)"
                >
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="notif.color">
                    <component :is="notif.icon" class="w-4.5 h-4.5" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-white">{{ notif.title }}</span>
                      <span v-if="!notif.read" class="w-1.5 h-1.5 rounded-full bg-pink-500shrink-0" />
                    </div>
                    <p class="text-gray-400 text-xs mt-0.5 truncate">{{ notif.text }}</p>
                    <span class="text-gray-500 text-[11px] mt-1 block">{{ notif.time }}</span>
                  </div>
                </button>
              </template>
              <div v-else class="py-10 text-center text-gray-500">
                <Bell class="w-8 h-8 mx-auto mb-2 opacity-40" />
                اعلان جدیدی ندارید
              </div>
            </div>

            <!-- فوتر پنل -->
            <div class="border-t border-white/10 p-2">
              <NuxtLink
                to="/dashboard/notifications"
                class="block text-center px-4 py-2 rounded-lg hover:bg-white/10 text-purple-400 transition-all"
                @click="notifOpen = false"
              >
                مشاهده همه اعلانات
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>

      <!-- منوی کاربر -->
      <div ref="menuRef" class="relative">
        <button type="button" class="flex items-center gap-2" @click="toggleMenu">
          <div class="w-9 h-9 rounded-full bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
            {{ user.initials }}
          </div>
          <span class="hidden sm:block text-sm">{{ user.name }}</span>
          <ChevronDown class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': menuOpen }" />
        </button>

        <Transition name="fade">
          <div
            v-if="menuOpen"
            class="dropdown-panel absolute left-0 mt-2 w-48 rounded-xl p-2 text-sm"
            @click="menuOpen = false"
          >
            <NuxtLink to="/dashboard/account" class="block px-4 py-2 rounded-lg hover:bg-white/10 transition-all">حساب کاربری</NuxtLink>
            <NuxtLink to="/" class="block px-4 py-2 rounded-lg hover:bg-white/10 transition-all">بازگشت به سایت</NuxtLink>
            <button type="button" class="w-full text-right px-4 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-all">خروج</button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* پنل دراپ‌داون با بکگراند و بلور صریح */
.dropdown-panel {
  background: rgba(31, 31, 61, 0.897);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 50;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>