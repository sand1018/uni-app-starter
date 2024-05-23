export default function useToast() {
  const showToast = (options: UniApp.ShowToastOptions | string, delay: number = 2000) => {
    if (typeof options === 'string') {
      options = {
        title: options,
      }
    }
    uni.showToast({
      mask: true,
      icon: 'none',
      duration: delay,
      ...options,
    })
  }

  const hideToast = () => {
    uni.hideToast()
  }

  return {
    showToast,
    hideToast,
  }
}
