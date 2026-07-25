// وقتی کاربر روی یکی از دکمه‌های «سفارش/انتخاب» در صفحه‌ی سرور اختصاصی کلیک می‌کنه،
// این state پیام پیش‌فرض فرم «درخواست مشاوره رایگان» پایین صفحه رو پر می‌کنه.
// چون سرور اختصاصی معمولاً بر اساس نیاز سفارشی قیمت‌گذاری می‌شه، به‌جای چک‌اوت آنی،
// انتخاب کاربر مستقیم به همون فرم مشاوره‌ی موجود توی صفحه هدایت می‌شه.
export function useDedicatedRequest() {
  return useState('dedicatedServerRequestNote', () => '')
}

// اسکرول نرم به فرم مشاوره با در نظر گرفتن ارتفاع نوبار ثابت (هدر fixed)
export function scrollToDedicatedConsultation() {
  if (typeof document === 'undefined') return
  document.getElementById('consultation-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}