<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

useSeoMeta({
  title: "کیف پول",
});

const wallet = ref({
  balance: 12850000,
  pending: 2100000,
  deposited: 54320000,
  withdrawn: 41470000,
});

const accounts = ref([
  {
    title: "کیف پول ریالی",
    balance: "12,850,000 تومان",
    color: "emerald",
    icon: "solar:wallet-money-bold-duotone",
  },
  {
    title: "اعتبار هدیه",
    balance: "320,000 تومان",
    color: "amber",
    icon: "solar:gift-bold-duotone",
  },
]);

const pendingRequests = ref([
  {
    title: "برداشت وجه",
    status: "در حال بررسی",
    amount: "1,000,000 تومان",
  },
]);

const transactions = ref([
  {
    id: 1,
    type: "واریز",
    amount: "+250,000",
    status: "موفق",
    date: "امروز",
  },
  {
    id: 2,
    type: "برداشت",
    amount: "-1,000,000",
    status: "در انتظار",
    date: "دیروز",
  },
  {
    id: 3,
    type: "بازگشت وجه",
    amount: "+800,000",
    status: "موفق",
    date: "۲ روز پیش",
  },
]);
</script>

<template>
  <div class="space-y-6">
    <DashboardWalletHero :balance="wallet.balance" />

    <DashboardWalletQuickActions />

    <DashboardWalletStats :wallet="wallet" />

    <DashboardWalletChart />

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <DashboardWalletTransactions :transactions="transactions" />
      </div>

      <div class="space-y-6">
        <DashboardWalletAccounts :accounts="accounts" />

        <DashboardWalletPending :items="pendingRequests" />

        <DashboardWalletInfo />
      </div>
    </div>
  </div>
</template>
