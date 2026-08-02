<script setup>
const sidebarOpen = useState('dashboardSidebarOpen', () => false)
const toast = useToast()

const tokenCookie = useCookie("donyaweb_auth_token")
const userCookie = useCookie("user_donyaweb")
const config = useRuntimeConfig();
const headers = useApiHeaders();

const user = ref(userCookie.value || null);

// دریافت اطلاعات کاربر از سرور
const { data, refresh, pending, error } = await useFetch(`${config.public.apiBase}/users/userInfo`, {
  method: "POST",
  headers,
});

if (error.value?.statusCode === 401) {
  toast.warning("لطفا دوباره وارد حساب کاربری شوید.");
  userCookie.value = null;
  tokenCookie.value = null;
  navigateTo("/login");
}

watch(data, (newData) => {
  if (newData?.User) {
    user.value = newData.User;
    userCookie.value = newData.User;
  }
}, { immediate: true });
</script>

<template>
  <div class="relative bg-slate-900 text-white min-h-screen">
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <BackgroundBlobs />
    </div>

    <DashboardSidebar />

    <div class="lg:mr-72 min-h-screen flex flex-col">
      <DashboardTopbar />
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/10 z-30 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
