<template>
  <div class="rounded-2xl border border-default bg-default">
    <div class="flex items-center justify-between border-b border-default p-5">
      <h3 class="font-black">آخرین تراکنش‌ها</h3>

      <button class="text-primary">مشاهده همه</button>
    </div>

    <table class="w-full">
      <thead>
        <tr class="border-b border-default text-secondary">
          <th class="p-4 text-right">نوع</th>
          <th class="p-4 text-right">مبلغ</th>
          <th class="p-4 text-right">وضعیت</th>
          <th class="p-4 text-right">تاریخ</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in transactions"
          :key="item.id"
          class="border-b border-default hover:bg-default-2"
        >
          <td class="p-4">{{ item.type }}</td>

          <td class="p-4 font-bold">
            {{ item.amount }}
          </td>

          <td class="p-5">
            <span
              :class="[
                'rounded-full px-3 py-1 text-xs',

                item.status == 'موفق'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : item.status == 'در انتظار'
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-red-500/10 text-red-500',
              ]"
            >
              {{ item.status }}
            </span>
          </td>

          <td class="p-4">
            {{ item.date }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
