import { emitter, OPEN_MODAL, AUTH_PHONE_CALLBACK } from '@/components/auth-popup/constant'
import { ref, onUnmounted } from 'vue'
export default function useAuth() {
  const { isLogined } = useUserStore()

  const cb = ref()

  emitter.on(AUTH_PHONE_CALLBACK, () => {
    cb.value && cb.value()
  })

  const detectPhone = (callback: () => void) => {
    if (isLogined) {
      callback && callback()
      return
    }

    emitter.emit(OPEN_MODAL)
    cb.value = callback
  }

  onUnmounted(() => {
    emitter.off(AUTH_PHONE_CALLBACK)
  })

  return {
    detectPhone,
  }
}
