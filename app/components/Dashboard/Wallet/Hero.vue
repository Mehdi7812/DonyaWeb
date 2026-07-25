<script setup lang="ts">
const props = defineProps<{
  balance: number;
}>();

const formattedBalance = computed(() =>
  new Intl.NumberFormat("fa-IR").format(props.balance),
);
</script>

<template>
  <div
    class="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-primary-600 via-primary-700 to-indigo-900 text-white shadow-xl"
  >
    <div
      class="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
    />
    <div
      class="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl"
    />

    <div class="relative p-8 lg:flex lg:items-center lg:justify-between">
      <div>
        <div
          class="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm"
        >
          <Icon name="solar:wallet-money-bold-duotone" size="18" />

          کیف پول دنیاوب
        </div>

        <p class="text-white/70">موجودی قابل استفاده</p>

        <h2 class="mt-3 text-4xl font-black">
          {{ formattedBalance }}

          <span class="mr-2 text-lg font-medium text-white/70"> تومان </span>
        </h2>

        <div class="mt-6 flex flex-wrap gap-3">
          <button
            class="rounded-xl bg-white px-6 py-3 font-bold text-primary-700 transition hover:scale-105"
          >
            افزایش موجودی
          </button>

          <button
            class="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-bold backdrop-blur transition hover:bg-white/20"
          >
            برداشت
          </button>

          <button
            class="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-bold backdrop-blur transition hover:bg-white/20"
          >
            انتقال وجه
          </button>
        </div>
      </div>

      <div class="mt-8 lg:mt-0">
        <div
          class="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur"
        >
          <Icon name="solar:card-bold-duotone" size="120" class="opacity-80" />
        </div>
      </div>

      <div class="mt-8 grid grid-cols-3 gap-5">
        <div>
          <div class="text-white/60 text-sm">آخرین تراکنش</div>

          <div class="mt-2 font-bold">امروز</div>
        </div>

        <div>
          <div class="text-white/60 text-sm">وضعیت حساب</div>

          <div class="mt-2 text-emerald-300 font-bold">فعال</div>
        </div>

        <div>
          <div class="text-white/60 text-sm">احراز هویت</div>

          <div class="mt-2 text-emerald-300 font-bold">تکمیل شده</div>
        </div>
      </div>
    </div>
  </div>
</template>
