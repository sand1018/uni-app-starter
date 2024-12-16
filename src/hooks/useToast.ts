import { toastInstance } from '@/layouts/reactive'
import type { ToastOptions } from 'wot-design-uni/components/wd-toast/types'

export default function useToast() {
  const showCommonToast = (
    options: UniApp.ShowToastOptions | string,
    delay: number = 2000,
    type: 'success' | 'error' | 'none' = 'none',
  ) => {
    try {
      let opt: any = {}
      if (options) {
        if (typeof options === 'string') {
          opt.title = options
        } else {
          opt = {
            ...options,
          }
        }
      }

      uni.showToast({
        mask: true,
        icon: type,
        duration: delay,
        ...opt,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const showToast = (options: UniApp.ShowToastOptions | string = '', delay: number = 2000) => {
    showCommonToast(options, delay, 'none')
  }

  const successToast = (options: UniApp.ShowToastOptions | string = '', delay: number = 2000) => {
    showCommonToast(options, delay, 'success')
  }

  const errorToast = (options: UniApp.ShowToastOptions | string = '', delay: number = 2000) => {
    showCommonToast(options, delay, 'error')
  }

  const hideToast = () => {
    uni.hideToast()
  }

  const toast: (typeof toastInstance)['value'] = {} as (typeof toastInstance)['value']

  Object.setPrototypeOf(toast, toastInstance.value)

  const customToast = new Proxy(toast, {
    get: function (target, prop) {
      return function (...args) {
        const options: ToastOptions = { zIndex: 10000 }
        if (typeof args[0] === 'string') {
          options.msg = args[0]
        } else {
          Object.assign(options, args[0] || {})
        }
        return toastInstance.value[prop](options)
      }
    },
  })

  return {
    showToast,
    hideToast,
    successToast,
    errorToast,
    customToast,
  }
}
