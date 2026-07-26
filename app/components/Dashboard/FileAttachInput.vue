<script setup>
import { ref } from 'vue'
import { Paperclip, X, FileText, Image as ImageIcon, File as FileIcon } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  max: { type: Number, default: 5 },
  maxSizeMb: { type: Number, default: 5 }
})
const emit = defineEmits(['update:modelValue'])

const toast = useToast()
const inputRef = ref(null)
const isDragging = ref(false)

function triggerPick() {
  inputRef.value?.click()
}

function onFilesSelected(e) {
  addFiles(Array.from(e.target.files || []))
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  addFiles(Array.from(e.dataTransfer?.files || []))
}

function addFiles(files) {
  if (!files.length) return
  const current = [...props.modelValue]
  for (const file of files) {
    if (current.length >= props.max) {
      toast.error(`حداکثر ${props.max} فایل می‌توانید پیوست کنید`)
      break
    }
    if (file.size > props.maxSizeMb * 1024 * 1024) {
      toast.error(`حجم فایل «${file.name}» بیشتر از ${props.maxSizeMb} مگابایت است`)
      continue
    }
    current.push(file)
  }
  emit('update:modelValue', current)
}

function removeFile(index) {
  const current = [...props.modelValue]
  current.splice(index, 1)
  emit('update:modelValue', current)
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} بایت`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} کیلوبایت`
  return `${(bytes / (1024 * 1024)).toFixed(1)} مگابایت`
}

function iconFor(file) {
  if (file.type?.startsWith('image/')) return ImageIcon
  if (file.type === 'application/pdf' || file.type?.startsWith('text/')) return FileText
  return FileIcon
}
</script>

<template>
  <div>
    <input ref="inputRef" type="file" multiple class="hidden" @change="onFilesSelected">

    <div
      class="rounded-xl border border-dashed p-4 text-center cursor-pointer transition-all"
      :class="isDragging ? 'border-purple-500/60 bg-purple-500/5' : 'border-white/15 hover:border-purple-500/40'"
      @click="triggerPick"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <Paperclip class="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
      <p class="text-sm text-gray-400">
        برای پیوست فایل کلیک کنید یا فایل را اینجا رها کنید
        <span class="block text-xs text-gray-500 mt-1">حداکثر {{ max }} فایل، هر کدام تا {{ maxSizeMb }} مگابایت</span>
      </p>
    </div>

    <div v-if="modelValue.length" class="mt-3 space-y-2">
      <div
        v-for="(file, i) in modelValue"
        :key="`${file.name}-${i}`"
        class="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
      >
        <component :is="iconFor(file)" class="w-4 h-4 text-purple-400 shrink-0" />
        <span class="flex-1 truncate">{{ file.name }}</span>
        <span class="text-xs text-gray-500 shrink-0" dir="ltr">{{ formatSize(file.size) }}</span>
        <button type="button" class="text-gray-500 hover:text-red-400 transition-colors shrink-0" @click.stop="removeFile(i)">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
