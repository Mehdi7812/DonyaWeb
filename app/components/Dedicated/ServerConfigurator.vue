<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  MapPin,
  Monitor,
  Globe,
  ShieldCheck,
} from "lucide-vue-next";

interface Option {
  name: string
  price: number
}

interface IpOption {
  count: number
  price: number
}

const cpus: Option[] = [
  { name: "Intel Xeon E-2388G", price: 0 },
  { name: "AMD EPYC 7313P", price: 1800000 },
  { name: "Dual Xeon Gold 6248", price: 4500000 },
];

const cpuOptions = computed(() => cpus.map((cpu) => ({ label: cpu.name, value: cpu.name })));

const rams: Option[] = [
  { name: "32GB ECC", price: 0 },
  { name: "64GB ECC", price: 900000 },
  { name: "128GB ECC", price: 2200000 },
];

const storages: Option[] = [
  { name: "2×960GB NVMe", price: 0 },
  { name: "2×1.92TB NVMe", price: 1300000 },
  { name: "4×1.92TB NVMe RAID10", price: 3200000 },
];

const ramOptions = computed(() => rams.map((ram) => ({ label: ram.name, value: ram.name })));
const storageOptions = computed(() => storages.map((storage) => ({ label: storage.name, value: storage.name })));

const locations: Option[] = [
  { name: "🇩🇪 Germany", price: 0 },
  { name: "🇳🇱 Netherlands", price: 300000 },
  { name: "🇫🇮 Finland", price: 450000 },
];

const locationOptions = computed(() => locations.map((location) => ({ label: location.name, value: location.name })));

const operatingSystems: Option[] = [
  { name: "Ubuntu 24.04", price: 0 },
  { name: "Debian 12", price: 0 },
  { name: "AlmaLinux 9", price: 0 },
  { name: "Rocky Linux 9", price: 0 },
  { name: "Windows Server 2025", price: 850000 },
];

const osOptions = computed(() => operatingSystems.map((os) => ({ label: os.name, value: os.name })));

const ips: IpOption[] = [
  { count: 1, price: 0 },
  { count: 2, price: 180000 },
  { count: 4, price: 420000 },
  { count: 8, price: 890000 },
];

const ipOptions = computed(() => ips.map((ip) => ({ label: `${ip.count} IP`, value: ip.count })));

const selectedCpuName = ref<string>(cpus[1]!.name);
const selectedRamName = ref<string>(rams[1]!.name);
const selectedStorageName = ref<string>(storages[1]!.name);
const selectedLocationName = ref<string>(locations[0]!.name);
const selectedOSName = ref<string>(operatingSystems[0]!.name);
const selectedIPCount = ref<string>(ips[0]!.count.toString());

const selectedCpu = computed<Option>(() => cpus.find((cpu) => cpu.name === selectedCpuName.value) ?? cpus[0]!);
const selectedRam = computed<Option>(() => rams.find((ram) => ram.name === selectedRamName.value) ?? rams[0]!);
const selectedStorage = computed<Option>(() => storages.find((storage) => storage.name === selectedStorageName.value) ?? storages[0]!);
const selectedLocation = computed<Option>(() => locations.find((location) => location.name === selectedLocationName.value) ?? locations[0]!);
const selectedOS = computed<Option>(() => operatingSystems.find((os) => os.name === selectedOSName.value) ?? operatingSystems[0]!);
const selectedIP = computed<IpOption>(() => ips.find((ip) => ip.count.toString() === selectedIPCount.value) ?? ips[0]!);

const backup = ref(true);

const basePrice = 8900000;

const totalPrice = computed(() => {
  return (
    basePrice +
    selectedCpu.value.price +
    selectedRam.value.price +
    selectedStorage.value.price +
    selectedLocation.value.price +
    selectedOS.value.price +
    selectedIP.value.price +
    (backup.value ? 350000 : 0)
  );
});

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price);
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 py-20">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-black">
        پیکربندی
        <span class="gradient-text">سرور اختصاصی</span>
      </h2>

      <p class="text-gray-400 mt-4">
        سخت‌افزار مورد نیاز خود را انتخاب کنید و قیمت را به صورت لحظه‌ای مشاهده
        کنید.
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Configurator -->

      <div class="lg:col-span-2 glass-card rounded-3xl p-8">
        <div class="grid md:grid-cols-2 gap-6">
          <!-- CPU -->

          <div>
            <label class="flex items-center gap-2 mb-3 font-semibold">
              <Cpu class="w-5 h-5 text-pink-500" />
              پردازنده
            </label>

            <StartCustomSelect
              v-model="selectedCpuName"
              :options="cpuOptions"
              placeholder="انتخاب پردازنده"
            />
          </div>

          <!-- RAM -->

          <div>
            <label class="flex items-center gap-2 mb-3 font-semibold">
              <MemoryStick class="w-5 h-5 text-pink-500" />
              حافظه RAM
            </label>

            <StartCustomSelect
              v-model="selectedRamName"
              :options="ramOptions"
              placeholder="انتخاب RAM"
            />
          </div>

          <!-- Storage -->

          <div>
            <label class="flex items-center gap-2 mb-3 font-semibold">
              <HardDrive class="w-5 h-5 text-pink-500" />
              فضای ذخیره‌سازی
            </label>

            <StartCustomSelect
              v-model="selectedStorageName"
              :options="storageOptions"
              placeholder="انتخاب فضای ذخیره‌سازی"
            />
          </div>

          <!-- Location -->

          <div>
            <label class="flex items-center gap-2 mb-3 font-semibold">
              <MapPin class="w-5 h-5 text-pink-500" />
              دیتاسنتر
            </label>

            <StartCustomSelect
              v-model="selectedLocationName"
              :options="locationOptions"
              placeholder="انتخاب دیتاسنتر"
            />
          </div>

          <!-- OS -->

          <div>
            <label class="flex items-center gap-2 mb-3 font-semibold">
              <Monitor class="w-5 h-5 text-pink-500" />
              سیستم عامل
            </label>

            <StartCustomSelect
              v-model="selectedOSName"
              :options="osOptions"
              placeholder="انتخاب سیستم‌عامل"
            />
          </div>

          <!-- IP -->

          <div>
            <label class="flex items-center gap-2 mb-3 font-semibold">
              <Globe class="w-5 h-5 text-pink-500" />
              تعداد IPv4
            </label>

            <StartCustomSelect
              v-model="selectedIPCount"
              :options="ipOptions"
              placeholder="انتخاب تعداد IPv4"
            />
          </div>
        </div>

        <!-- Backup -->

        <div class="mt-8">
          <label
            class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <ShieldCheck class="w-6 h-6 text-green-400" />

              <div>
                <h4 class="font-semibold">بکاپ روزانه</h4>

                <p class="text-sm text-gray-400">+۳۵۰ هزار تومان</p>
              </div>
            </div>

            <input v-model="backup" type="checkbox" class="w-5 h-5" />
          </label>
        </div>
      </div>

      <!-- Price -->

      <div class="glass-card rounded-3xl p-8 sticky top-28 h-fit">
        <h3 class="text-2xl font-bold mb-6">خلاصه سفارش</h3>

        <div class="space-y-4 text-sm">
          <div class="flex justify-between">
            <span>پردازنده</span>
            <span>{{ selectedCpu.name }}</span>
          </div>

          <div class="flex justify-between">
            <span>RAM</span>
            <span>{{ selectedRam.name }}</span>
          </div>

          <div class="flex justify-between">
            <span>Storage</span>
            <span>{{ selectedStorage.name }}</span>
          </div>

          <div class="flex justify-between">
            <span>Location</span>
            <span>{{ selectedLocation.name }}</span>
          </div>

          <div class="flex justify-between">
            <span>OS</span>
            <span>{{ selectedOS.name }}</span>
          </div>

          <div class="flex justify-between">
            <span>IPv4</span>
            <span>{{ selectedIP.count }}</span>
          </div>

          <div class="border-t border-white/10 pt-6">
            <div class="text-gray-400">مبلغ ماهانه</div>

            <div class="text-4xl font-black gradient-text mt-2">
              {{ formatPrice(totalPrice) }}
            </div>

            <div class="text-gray-400 mt-1">تومان / ماه</div>
          </div>

          <button
            class="mt-8 w-full rounded-xl bg-linear-to-r from-pink-600 to-purple-600 py-4 font-bold transition hover:scale-[1.02]"
          >
            ثبت سفارش
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
