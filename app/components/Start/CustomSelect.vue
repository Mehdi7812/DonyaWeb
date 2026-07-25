<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  // آرایه‌ای از رشته‌ها یا آبجکت‌های { label, value }
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'انتخاب کنید'
  }
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const triggerEl = ref(null)
const panelEl = ref(null)
const panelStyle = ref({})

const normalizedOptions = computed(() =>
  props.options.map((o) => (typeof o === 'object' ? o : { label: o, value: o }))
)

const hasOptions = computed(() => normalizedOptions.value.length > 0)

const selectedLabel = computed(() => {
  const found = normalizedOptions.value.find((o) => o.value === props.modelValue)
  return found ? found.label : ''
})

// موقعیت پنل رو با مختصات واقعی دکمه محاسبه می‌کنیم (نسبت به viewport، چون position: fixed هست)
function updatePosition() {
  if (!triggerEl.value) return
  const rect = triggerEl.value.getBoundingClientRect()
  panelStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 8}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`
  }
}

async function toggle() {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    updatePosition()
    // اندازه‌گیری دوباره توی فریم بعد، چون بار اول ممکنه فونت/تصویر هنوز لود نشده باشه
    // و موقعیت واقعی کمی جابه‌جا بشه (باعث میشه دفعه‌ی اول کمی پایین‌تر باز بشه)
    requestAnimationFrame(updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
  } else {
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
  }
}

function close() {
  if (!open.value) return
  open.value = false
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
}

function select(option) {
  emit('update:modelValue', option.value)
  close()
}

// چون پنل با Teleport بیرون از این کامپوننت رندر می‌شه، باید کلیک بیرون رو
// روی خودِ trigger و خودِ پنل (هر دو) چک کنیم
function handleClickOutside(event) {
  if (triggerEl.value?.contains(event.target)) return
  if (panelEl.value?.contains(event.target)) return
  close()
}

function handleKeydown(event) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})
</script>

<template>
  <div class="relative">
    <button
      ref="triggerEl"
      type="button"
      class="input-glass w-full rounded-xl px-4 py-3 flex items-center justify-between gap-2 text-right"
      :aria-expanded="open"
      @click="toggle"
    >
      <span :class="selectedLabel ? 'text-white' : 'text-gray-500'">
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronDown
        class="w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0"
        :class="open ? 'rotate-180' : ''"
      />
    </button>

    <!-- با Teleport به body می‌ره بیرون از هر کارتی که backdrop-filter داره، تا استکینگ‌کانتکست جداش نکنه -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        leave-active-class="transition-all duration-100 ease-in"
        enter-from-class="opacity-0 scale-95"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="open"
          ref="panelEl"
          class="z-50 origin-top"
          :style="panelStyle"
        >
          <ul class="glass-strong bg-[#12305c]! rounded-xl p-1.5 max-h-60 overflow-y-auto scrollbar-thin border border-white/10 shadow-2xl shadow-black/40 space-y-0.5">
            <li v-if="!hasOptions">
              <button
                type="button"
                class="w-full cursor-default px-3.5 py-2.5 rounded-lg text-sm text-right text-gray-400"
                disabled
              >
                هیچ ایتمی وجود ندارد
              </button>
            </li>
            <li v-for="opt in normalizedOptions" :key="opt.value">
              <button
                type="button"
                class="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm text-right transition-colors"
                :class="opt.value === modelValue
                  ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'"
                @click="select(opt)"
              >
                <span>{{ opt.label }}</span>
                <Check v-if="opt.value === modelValue" class="w-4 h-4 shrink-0" />
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>