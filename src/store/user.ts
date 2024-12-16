import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateUUID } from '@/utils/index'
import useStorage from '@/hooks/useStorage'
import { DEFAULT_GPS } from '@/constants/index'

type Gps = typeof DEFAULT_GPS

const InitialUserInfo = {
  id: '',
  account_id: '',
  type: '',
  type_show: '',
  name: '',
  mobile: '',
  avatar: {
    filename: '',
    bucket: '',
    key: '',
    url: '',
  },
  status: '',
  created_at: '',
  share_ratio: undefined,
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref({ ...InitialUserInfo })
    const gps = ref<Gps>(DEFAULT_GPS)

    const _uuid = ref('')

    const { getStorageSync, setStorageSync } = useStorage()

    const uuid = computed<string>(() => {
      if (_uuid.value) {
        return _uuid.value
      } else {
        const cacheUUID = getStorageSync('mx_uuid')
        if (cacheUUID) return (_uuid.value = cacheUUID)
        const genUUID = generateUUID()
        setStorageSync('mx_uuid', genUUID)
        return (_uuid.value = genUUID)
      }
    })

    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
    }

    const clearUserInfo = () => {
      userInfo.value = { ...InitialUserInfo }
    }

    const setGps = (gpsValue: Gps) => {
      gps.value = gpsValue
    }

    const isLogined = computed(() => !!userInfo.value.mobile)
    const tabbars = computed(() => userInfo.value.tabbars)
    const userType = computed(() => userInfo.value?.partner?.type)
    const isAgentAccount = computed(
      () => userInfo.value?.partner?.type === 'agent' || userInfo.value?.partner?.type === 'staff',
    )

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      uuid,
      setGps,
      gps,
      tabbars,
      userType,
      isAgentAccount,
    }
  },
  {
    persist: true,
  },
)
