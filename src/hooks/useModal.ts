import { ref } from 'vue'

interface ModalOptions {
  title?: string
  content?: string
  showCancel?: boolean
  cancelText?: string
  confirmText?: string
}

interface ModalResult {
  confirm: boolean
  cancel: boolean
}

export function useModal(options: { isSingleton: boolean } = { isSingleton: true }) {
  const { isSingleton } = options

  const isVisible = ref(false)
  const modalOptions = ref<ModalOptions>({})
  const modalResult = ref<ModalResult | null>(null)
  let isShowing = false // 用于控制单例

  const showModal = async (options: ModalOptions): Promise<ModalResult> => {
    if (isSingleton && isShowing) {
      return Promise.reject(new Error('Modal is already showing'))
    }

    isShowing = true

    return new Promise((resolve, reject) => {
      isVisible.value = true
      modalOptions.value = options

      uni.showModal({
        title: options.title || '提示',
        content: options.content || '',
        showCancel: options.showCancel !== undefined ? options.showCancel : true,
        cancelText: options.cancelText || '取消',
        confirmText: options.confirmText || '确定',
        success: (res) => {
          isVisible.value = false
          isShowing = false
          modalResult.value = {
            confirm: res.confirm,
            cancel: res.cancel,
          }
          resolve(modalResult.value)
        },
        fail: (err) => {
          isVisible.value = false
          isShowing = false
          modalResult.value = null
          reject(err)
        },
      })
    })
  }

  return {
    isVisible,
    modalOptions,
    modalResult,
    showModal,
  }
}
