<script setup lang="ts">
const actions = [
  {
    title: "افزایش موجودی",
    icon: "solar:add-circle-bold-duotone",
    to: "/dashboard/finance/deposit",
  },
  {
    title: "برداشت",
    icon: "solar:card-transfer-bold-duotone",
    to: "/dashboard/finance/withdraw",
  },
  {
    title: "تاریخچه",
    icon: "solar:history-bold-duotone",
    to: "/dashboard/finance/history",
  },
  {
    title: "گزارش",
    icon: "solar:download-bold-duotone",
    to: "/dashboard/finance/report",
  },
];
</script>

<template>
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <NuxtLink
      v-for="item in actions"
      :key="item.title"
      :to="item.to"
      class="group rounded-2xl border border-default bg-default p-6 transition hover:-translate-y-1 hover:border-primary"
    >
      <Icon
        :name="item.icon"
        size="34"
        class="mx-auto text-primary transition group-hover:scale-110"
      />

      <div class="mt-4 font-bold">
        {{ item.title }}
      </div>
    </NuxtLink>
  </div>
</template>
