// app/middleware/auth.global.js
// جلوگیری از دسترسی به صفحات داشبورد بدون ورود. کاربر واردنشده به صفحه‌ی ورود
// هدایت می‌شود و آدرس مقصد در query نگه‌داشته می‌شود تا بعد از ورود موفق به همان‌جا برگردد.
// در طرف مقابل، کاربر واردشده نمی‌تواند دوباره به صفحات ورود/ثبت‌نام برود.
// TODO: وقتی احراز هویت واقعی (JWT/سشن سرور) وصل شد، بررسی isLoggedIn باید از طریق آن انجام شود.

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp()

  // توکن ورود همچنان کوکی می‌ماند (برای این‌که ریدایرکت سمت سرور هم کار کند)
  const isLoggedIn = useCookie('donyaweb_auth_token', { default: () => false })
  const { user: userInfo, load: loadUserInfo, setUser: setUserInfo, clearUser: clearUserInfo } = useUserInfo()

  const isDashboardRoute = to.path.startsWith('/dashboard')
  const isGuestOnlyRoute = to.path === '/login' || to.path === '/register'

  if (isDashboardRoute && !isLoggedIn.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  // localStorage فقط سمت کلاینت در دسترس است؛ پس این بخش فقط آنجا اجرا می‌شود
  if (isDashboardRoute && isLoggedIn.value && import.meta.client) {
    loadUserInfo()

    if (!userInfo.value) {
      const config = useRuntimeConfig()
      const headers = useApiHeaders()

      const { data, error } = await useFetch(`${config.public.apiBase}/users/userInfo`, {
        method: 'POST',
        headers,
      })

      // بعد از await، کانتکست Nuxt گم می‌شود؛ برای این‌که navigateTo/composableها
      // اینجا درست کار کنند باید داخل runWithContext اجرا شوند.
      return nuxtApp.runWithContext(() => {
        if (error.value?.statusCode === 401) {
          isLoggedIn.value = null
          clearUserInfo()
          return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
        }

        if (data.value?.User) {
          setUserInfo(data.value.User)
        }
      })
    }
  }

  if (isGuestOnlyRoute && isLoggedIn.value) {
    return navigateTo('/dashboard')
  }
})