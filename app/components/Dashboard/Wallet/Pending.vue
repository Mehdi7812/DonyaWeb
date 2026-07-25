<script setup lang="ts">
defineProps({
  items: Array
})
</script>

<template>
<div class="rounded-2xl border border-default bg-default">

<div class="border-b border-default p-5">

<h3 class="font-black">
درخواست‌های در انتظار
</h3>

</div>

<div class="p-5 space-y-4">

<div
v-for="item in items"
:key="item.title"
class="rounded-xl bg-default-2 p-4">

<div class="flex justify-between">

<div class="font-bold">
{{ item.title }}
</div>

<div
class="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-500">

{{ item.status }}

</div>

</div>

<div class="mt-3 text-secondary">

{{ item.amount }}

</div>

</div>

</div>

</div>
</template>