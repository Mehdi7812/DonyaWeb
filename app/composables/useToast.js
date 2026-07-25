import { toast } from 'vue-sonner'

export function useToast() {
  return {
    success: (message, opts) => toast.success(message, opts),
    error: (message, opts) => toast.error(message, opts),
    info: (message, opts) => toast(message, opts),
    warning: (message, opts) => toast.warning(message, opts),
    promise: (promise, opts) => toast.promise(promise, opts)
  }
}