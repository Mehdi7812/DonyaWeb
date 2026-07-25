<script setup lang="ts">
interface Wallet {
  balance: number
  pending: number
  deposited: number
  withdrawn: number
}

const props = defineProps<{
  wallet: Wallet
}>()

const cards = computed(() => [
  {
    title: "موجودی قابل برداشت",
    value: props.wallet.balance,
    icon: "solar:wallet-money-bold-duotone",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "در انتظار تسویه",
    value: props.wallet.pending,
    icon: "solar:clock-circle-bold-duotone",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "کل واریزی",
    value: props.wallet.deposited,
    icon: "solar:arrow-down-bold-duotone",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    title: "کل برداشت",
    value: props.wallet.withdrawn,
    icon: "solar:arrow-up-bold-duotone",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
])
</script>

<template>
  <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="card in cards"
      :key="card.title"
      class="rounded-2xl border border-default bg-default p-6">

      <div class="flex items-center justify-between">

        <div>

          <p class="text-sm text-secondary">
            {{ card.title }}
          </p>

          <h3 class="mt-3 text-2xl font-black">

            {{ card.value.toLocaleString("fa-IR") }}

            <span class="text-sm font-normal text-secondary">
              تومان
            </span>

          </h3>

        </div>

        <div
          class="flex h-14 w-14 items-center justify-center rounded-xl"
          :class="card.bg">

          <Icon
            :name="card.icon"
            size="30"
            :class="card.color" />

        </div>

      </div>

    </div>
  </div>
</template>