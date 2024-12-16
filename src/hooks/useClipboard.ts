import { ref } from 'vue'

export default function useClipboard() {
  const clipboardData = ref('')

  const copyToClipboard = (text) => {
    return new Promise((resolve, reject) => {
      try {
        clipboardData.value = String(text)
        uni.setClipboardData({
          data: clipboardData.value,
          success: () => {
            resolve(true)
          },
          fail: (error) => {
            reject(error)
          },
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  const pasteFromClipboard = () => {
    return new Promise((resolve, reject) => {
      try {
        uni.getClipboardData({
          success: (res) => {
            clipboardData.value = res.data
            resolve(res.data)
          },
          fail: (error) => {
            reject(error)
          },
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    clipboardData,
    copyToClipboard,
    pasteFromClipboard,
  }
}
