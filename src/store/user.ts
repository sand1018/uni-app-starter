import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateUUID } from '@/utils/index'
import useStorage from '@/hooks/useStorage'
import type { IUserInfo } from '@/service/user'

const initState = { nickname: '', avatar: '' }

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...initState })

    const uuid = ref('')

    const { getStorageSync, setStorageSync } = useStorage()

    const getUUID = computed<string>(() => {
      if (uuid.value) {
        return uuid.value
      } else {
        const cacheUUID = getStorageSync('mx_uuid')
        if (cacheUUID) return (uuid.value = cacheUUID)
        const genUUID = generateUUID()
        setStorageSync('mx_uuid', genUUID)
        return (uuid.value = genUUID)
      }
    })

    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }

    const isLogined = computed(() => !!userInfo.value.mobile)

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      getUUID,
    }
  },
  {
    persist: true,
  },
)
