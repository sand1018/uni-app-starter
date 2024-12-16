import { ref, onUnmounted } from 'vue'

export default function useCountdown(initialSeconds: number) {
  const seconds = ref(initialSeconds)
  const isRunning = ref(false)
  let interval: NodeJS.Timeout

  const startCountdown = () => {
    if (interval) {
      clearInterval(interval)
    }
    isRunning.value = true
    interval = setInterval(() => {
      if (seconds.value > 0) {
        seconds.value -= 1
      } else {
        clearInterval(interval)
        isRunning.value = false
      }
    }, 1000)
  }

  const resetCountdown = () => {
    seconds.value = initialSeconds
    startCountdown()
  }

  const stopCountdown = () => {
    if (interval) {
      clearInterval(interval)
      isRunning.value = false
    }
  }

  onUnmounted(() => {
    if (interval) {
      clearInterval(interval)
    }
  })

  return {
    seconds,
    isRunning,
    startCountdown,
    resetCountdown,
    stopCountdown,
  }
}
