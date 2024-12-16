import { reactive } from 'vue'

export default function useSystemInfo() {
  const systemInfo = reactive<Partial<UniApp.GetSystemInfoResult>>({})

  const info = uni.getSystemInfoSync()
  Object.assign(systemInfo, info)

  return {
    systemInfo,
  }
}
