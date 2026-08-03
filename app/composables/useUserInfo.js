// app/composables/useUserInfo.js
// نگهداری اطلاعات کاربر (User) در localStorage به‌جای کوکی.
// چون localStorage فقط سمت کلاینت در دسترسه، از useState برای state مشترکِ
// reactive استفاده شده و مقدار واقعی فقط بعد از mount (سمت کلاینت) از
// localStorage خونده می‌شه — قبل از اون null/خالیه (بدون mismatch در هیدریشن).

const STORAGE_KEY = 'user_donyaweb'

export function useUserInfo() {
  const user = useState('user-info', () => null)

  // خواندن مقدار از localStorage و پرکردن state — فقط سمت کلاینت معنا دارد
  function load() {
    if (!import.meta.client) return user.value
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      user.value = raw ? JSON.parse(raw) : null
    } catch {
      user.value = null
    }
    return user.value
  }

  // نوشتن/به‌روزرسانی اطلاعات کاربر
  function setUser(value) {
    user.value = value
    if (!import.meta.client) return
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // localStorage در دسترس نبود (مثلاً حالت خصوصی مرورگر) — بی‌خیال می‌شویم
    }
  }

  function clearUser() {
    setUser(null)
  }

  return { user, load, setUser, clearUser }
}