// app/middleware/auth.global.js
// جلوگیری از دسترسی به صفحات داشبورد بدون ورود. کاربر واردنشده به صفحه‌ی ورود
// هدایت می‌شود و آدرس مقصد در query نگه‌داشته می‌شود تا بعد از ورود موفق به همان‌جا برگردد.
// در طرف مقابل، کاربر واردشده نمی‌تواند دوباره به صفحات ورود/ثبت‌نام برود.
// TODO: وقتی احراز هویت واقعی (JWT/سشن سرور) وصل شد، بررسی isLoggedIn باید از طریق آن انجام شود.

export default defineNuxtRouteMiddleware((to) => {
  const isLoggedIn = useCookie('donyaweb_auth_token', { default: () => false })

  const isDashboardRoute = to.path.startsWith('/dashboard')
  const isGuestOnlyRoute = to.path === '/login' || to.path === '/register'

  if (isDashboardRoute && !isLoggedIn.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (isGuestOnlyRoute && isLoggedIn.value) {
    return navigateTo('/dashboard')
  }
})
