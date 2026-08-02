<script setup>
const infos = [
  {
    title: "شماره مشتری",
    value: "#248596",
  },
  {
    title: "تاریخ عضویت",
    value: "1404/02/18",
  },
  {
    title: "آخرین ورود",
    value: "امروز ساعت 10:42",
  },
  {
    title: "احراز هویت",
    value: "تایید شده",
  },
  {
    title: "سطح کاربری",
    value: "طلایی",
  },
  {
    title: "کش بک",
    value: "5%",
  },
];
</script>

<template>
  <div class="rounded-2xl border border-default bg-default">
    <div class="border-b border-default p-5">
      <h3 class="font-black">اطلاعات حساب</h3>
    </div>

    <div class="divide-y divide-default">
      <div
        v-for="item in infos"
        :key="item.title"
        class="flex justify-between p-5"
      >
        <div class="text-secondary">
          {{ item.title }}
        </div>

        <div class="font-bold">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>
