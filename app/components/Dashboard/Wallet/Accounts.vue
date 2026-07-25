<script setup lang="ts">
defineProps({
  accounts: {
    type: Array,
    default: () => [],
  },
})

const colorClasses = {
  emerald: "bg-emerald-500/10 text-emerald-500",
  amber: "bg-amber-500/10 text-amber-500",
  sky: "bg-sky-500/10 text-sky-500",
  primary: "bg-primary/10 text-primary",
}
</script>

<template>
  <div class="rounded-2xl border border-default bg-default">

    <div class="border-b border-default p-5">
      <h3 class="font-black text-lg">
        حساب‌های کیف پول
      </h3>
    </div>

    <div class="space-y-4 p-5">

      <div
        v-for="item in accounts"
        :key="item.title"
        class="flex items-center justify-between rounded-xl border border-default p-4 hover:border-primary transition">

        <div class="flex items-center gap-4">

          <div
            class="h-12 w-12 rounded-xl flex items-center justify-center"
            :class="colorClasses[item.color]">

            <Icon
              :name="item.icon"
              size="24" />

          </div>

          <div>

            <div class="font-bold">
              {{ item.title }}
            </div>

            <div class="text-sm text-secondary">
              {{ item.balance }}
            </div>

          </div>

        </div>

        <Icon
          name="solar:alt-arrow-left-linear"
          size="20"
          class="text-secondary" />

      </div>

    </div>

  </div>
</template>