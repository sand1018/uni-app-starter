export default function useStorage() {
  const getStorageSync = (key: string) => {
    try {
      return uni.getStorageSync(key)
    } catch (error) {
      console.error('Error getting storage:', error)
      return null
    }
  }

  const setStorageSync = (key: string, value: any) => {
    try {
      uni.setStorageSync(key, value)
    } catch (error) {
      console.error('Error setting storage:', error)
    }
  }

  const removeStorageSync = (key: string) => {
    try {
      uni.removeStorageSync(key)
    } catch (error) {
      console.error('Error removing storage:', error)
    }
  }

  const clearStorageSync = () => {
    try {
      uni.clearStorageSync()
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }

  return {
    getStorageSync,
    setStorageSync,
    removeStorageSync,
    clearStorageSync,
  }
}
