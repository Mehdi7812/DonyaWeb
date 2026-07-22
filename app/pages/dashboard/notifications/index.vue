<script setup>
import {
  Bell,
  CheckCheck,
  Trash2,
  Search,
  CreditCard,
  Server,
  MessageSquare,
  AlertTriangle,
  Gift,
  Circle,
  ExternalLink
} from 'lucide-vue-next'
import { computed, ref } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

const search = ref('')
const activeFilter = ref('all')

const notifications = ref([
  {
    id: 1,
    title: 'پرداخت موفق',
    message: 'فاکتور شماره INV-1042 با موفقیت پرداخت شد و سرویس شما فعال گردید.',
    time: '۱۰ دقیقه پیش',
    date: 'امروز',
    type: 'payment',
    read: false,
    important: false,
    to: '/dashboard/invoices',
    icon: CreditCard,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 2,
    title: 'انقضای سرویس',
    message: 'سرویس هاست لینوکس شما تا ۳ روز دیگر منقضی می‌شود. برای جلوگیری از قطع سرویس، آن را تمدید کنید.',
    time: '۲ ساعت پیش',
    date: 'امروز',
    type: 'service',
    read: false,
    important: true,
    to: '/dashboard/services',
    icon: Server,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 3,
    title: 'پاسخ تیکت پشتیبانی',
    message: 'تیکت شما با موضوع «مشکل اتصال دامنه» توسط تیم پشتیبانی پاسخ داده شد.',
    time: 'دیروز',
    date: 'دیروز',
    type: 'ticket',
    read: true,
    important: false,
    to: '/dashboard/tickets',
    icon: MessageSquare,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  },
  {
    id: 4,
    title: 'هشدار امنیتی',
    message: 'ورود جدیدی به حساب کاربری شما شناسایی شد. اگر این ورود توسط شما نبوده، رمز عبور خود را تغییر دهید.',
    time: '۲ روز پیش',
    date: 'این هفته',
    type: 'security',
    read: false,
    important: true,
    to: '/dashboard/account',
    icon: AlertTriangle,
    color: 'text-red-400 bg-red-500/10 border-red-500/20'
  },
  {
    id: 5,
    title: 'کارت هدیه جدید',
    message: 'یک کارت هدیه جدید برای حساب شما فعال شده است. می‌توانید از بخش مالی آن را مشاهده کنید.',
    time: '۳ روز پیش',
    date: 'این هفته',
    type: 'gift',
    read: true,
    important: false,
    to: '/dashboard/finance/gift-card',
    icon: Gift,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  }
])

const filters = computed(() => [
  {
    key: 'all',
    label: 'همه',
    count: notifications.value.length
  },
  {
    key: 'unread',
    label: 'خوانده‌نشده',
    count: notifications.value.filter(item => !item.read).length
  },
  {
    key: 'important',
    label: 'مهم',
    count: notifications.value.filter(item => item.important).length
  },
  {
    key: 'read',
    label: 'خوانده‌شده',
    count: notifications.value.filter(item => item.read).length
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(item => !item.read).length
})

const filteredNotifications = computed(() => {
  let list = [...notifications.value]

  if (activeFilter.value === 'unread') {
    list = list.filter(item => !item.read)
  }

  if (activeFilter.value === 'read') {
    list = list.filter(item => item.read)
  }

  if (activeFilter.value === 'important') {
    list = list.filter(item => item.important)
  }

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()

    list = list.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      )
    })
  }

  return list
})

function markAllAsRead() {
  notifications.value.forEach(item => {
    item.read = true
  })
}

function toggleRead(item) {
  item.read = !item.read
}

function openNotification(item) {
  item.read = true

  if (item.to) {
    navigateTo(item.to)
  }
}

function removeNotification(id) {
  notifications.value = notifications.value.filter(item => item.id !== id)
}

function removeReadNotifications() {
  notifications.value = notifications.value.filter(item => !item.read)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="panel rounded-2xl p-5 sm:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bell class="w-5 h-5" />
            </div>

            <div>
              <h2 class="text-xl sm:text-2xl font-bold">
                اعلانات
              </h2>
              <p class="text-sm text-gray-400 mt-1">
                مدیریت و مشاهده آخرین اعلان‌های حساب کاربری شما
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="btn-secondary"
            :disabled="unreadCount === 0"
            :class="{ 'opacity-50 cursor-not-allowed': unreadCount === 0 }"
            @click="markAllAsRead"
          >
            <CheckCheck class="w-4 h-4" />
            خواندن همه
          </button>

          <button
            type="button"
            class="btn-danger"
            @click="removeReadNotifications"
          >
            <Trash2 class="w-4 h-4" />
            حذف خوانده‌شده‌ها
          </button>
        </div>
      </div>
    </div>

    <!-- Stats / Filters -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <button
        v-for="filter in filters"
        :key="filter.key"
        type="button"
        class="panel rounded-2xl p-4 text-right transition-all hover:bg-white/10"
        :class="activeFilter === filter.key ? 'ring-1 ring-purple-500/50 bg-purple-500/10' : ''"
        @click="activeFilter = filter.key"
      >
        <span class="text-sm text-gray-400">
          {{ filter.label }}
        </span>

        <div class="text-2xl font-bold mt-2">
          {{ filter.count }}
        </div>
      </button>
    </div>

    <!-- Search -->
    <div class="panel rounded-2xl p-4">
      <div class="relative">
        <Search class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

        <input
          v-model="search"
          type="text"
          placeholder="جستجو در اعلانات..."
          class="w-full h-12 rounded-xl bg-white/5 border border-white/10 pr-12 pl-4 text-sm outline-none transition-all focus:border-purple-500/50 focus:bg-white/10"
        >
      </div>
    </div>

    <!-- Notifications List -->
    <div class="panel rounded-2xl overflow-hidden">
      <template v-if="filteredNotifications.length">
        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          class="notification-item"
          :class="[
            !item.read ? 'bg-white/4.5' : '',
            item.important ? 'border-r-2 border-r-red-500/70' : ''
          ]"
        >
          <button
            type="button"
            class="flex-1 flex items-start gap-4 text-right min-w-0"
            @click="openNotification(item)"
          >
            <div
              class="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0"
              :class="item.color"
            >
              <component :is="item.icon" class="w-5 h-5" />
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="font-bold text-white">
                  {{ item.title }}
                </h3>

                <span
                  v-if="!item.read"
                  class="inline-flex items-center gap-1 text-[11px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full"
                >
                  <Circle class="w-2 h-2 fill-current" />
                  جدید
                </span>

                <span
                  v-if="item.important"
                  class="text-[11px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full"
                >
                  مهم
                </span>
              </div>

              <p class="text-sm text-gray-400 mt-1 leading-7">
                {{ item.message }}
              </p>

              <div class="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                <span>{{ item.time }}</span>
                <span class="w-1 h-1 rounded-full bg-gray-600" />
                <span>{{ item.date }}</span>
              </div>
            </div>
          </button>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="action-btn hover:text-purple-400 hover:bg-purple-500/10"
              :title="item.read ? 'علامت‌گذاری به عنوان خوانده‌نشده' : 'علامت‌گذاری به عنوان خوانده‌شده'"
              @click.stop="toggleRead(item)"
            >
              <CheckCheck v-if="!item.read" class="w-4 h-4" />
              <Bell v-else class="w-4 h-4" />
            </button>

            <NuxtLink
              v-if="item.to"
              :to="item.to"
              class="action-btn hover:text-blue-400 hover:bg-blue-500/10"
              title="باز کردن"
              @click.stop
            >
              <ExternalLink class="w-4 h-4" />
            </NuxtLink>

            <button
              type="button"
              class="action-btn hover:text-red-400 hover:bg-red-500/10"
              title="حذف اعلان"
              @click.stop="removeNotification(item.id)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div
        v-else
        class="py-16 px-4 text-center"
      >
        <div class="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
          <Bell class="w-8 h-8" />
        </div>

        <h3 class="font-bold mt-4">
          اعلانی پیدا نشد
        </h3>

        <p class="text-sm text-gray-500 mt-2">
          با فیلتر یا عبارت جستجوی فعلی، هیچ اعلانی وجود ندارد.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  background: rgba(17, 17, 27, 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.btn-secondary {
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
}

.btn-danger {
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.16);
  color: #f87171;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.14);
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.notification-item:last-child {
  border-bottom: 0;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: #9ca3af;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

@media (max-width: 640px) {
  .notification-item {
    flex-direction: column;
  }

  .notification-item > button:first-child {
    width: 100%;
  }

  .notification-item > div:last-child {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>