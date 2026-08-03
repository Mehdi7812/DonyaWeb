// app/plugins/user-info.client.js
// همان لحظه‌ی بالا آمدن اپ سمت کلاینت، اطلاعات کاربر را از localStorage
// می‌خواند و در state مشترک useUserInfo قرار می‌دهد.

export default defineNuxtPlugin(() => {
  const { load } = useUserInfo()
  load()
})