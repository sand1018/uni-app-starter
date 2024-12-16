import { DEFAULT_GPS } from '@/constants/index'
import { hasOwnProperty } from '@/utils/index'

type Gps = typeof DEFAULT_GPS

const getErrorMsg = (errMsg: string) => {
  let msg = '定位失败'
  if (errMsg.indexOf('频繁调用') !== -1) {
    msg = '调用定位太过频繁，请稍后重试~'
  } else if (errMsg.indexOf('ERROR_SERVER_NOT_LOCATION') !== -1) {
    msg = '请检查是否开启手机定位~'
  } else if (errMsg.indexOf('fail auth deny') !== -1) {
    msg = '获取定位失败，请授权~'
  }

  return msg
}

const getGpsCache = {
  get() {
    const cache = getApp().gpsCache
    if (!cache) return null

    if (+new Date() > cache.expire) return null

    return getApp().gpsCache
  },
  set(data: any) {
    if (data) getApp().gpsCache = { ...data, expire: +new Date() + 2 * 60 * 1000 }
  },
  remove() {
    getApp().gpsCache = null
  },
}

export const setGps = (gps: Gps) => {
  // 自定义gps
  const { userGps } = getApp().userSetGps || {}
  if (userGps) gps = userGps

  const { setGps } = useUserStore()
  setGps(gps)

  getGpsCache.set(gps)
}

const getLocation = (isHighAccuracy = true): Promise<Gps> => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      isHighAccuracy,
      success: ({ errMsg, latitude, longitude }) => {
        if (errMsg === 'getLocation:ok') {
          resolve({ latitude, longitude })
        } else {
          reject(new Error('获取定位失败'))
        }
      },
      fail: (err) => {
        console.error(err)
        reject(err)
      },
    })
  })
}

const userAcceptLocation = () => {
  return new Promise((resolve) => {
    uni.getSetting({
      success(res) {
        resolve(
          hasOwnProperty(res.authSetting, 'scope.userLocation') ||
            hasOwnProperty(res.authSetting, 'location'),
        )
      },
      fail() {
        resolve(false)
      },
    })
  })
}

/**
 * 获取位置信息
 * @param useRealGps 真实位置
 * @param force 强制获取
 * @returns
 */
export const getGps = async (useRealGps = true, force = false): Promise<Gps> => {
  try {
    if (!useRealGps) {
      const cache = getGpsCache.get()
      return cache || DEFAULT_GPS
    }

    const accept = await userAcceptLocation()

    let resolved = false

    if (accept) {
      const timeoutPromise = async (): Promise<Gps> =>
        await new Promise((resolve) => {
          setTimeout(() => {
            if (!resolved) {
              uni.showToast({
                title: '获取定位超时～',
                icon: 'none',
              })
            }
            resolve(DEFAULT_GPS)
          }, 5000)
        })
      const result = await Promise.race([timeoutPromise(), getLocation(true)])
      resolved = true

      const response = result
      setGps(response)

      return response
    } else {
      const gps = await getLocation(true)
      setGps(gps)
      return gps
    }
  } catch (err) {
    const gps = DEFAULT_GPS
    setGps(gps)
    if (force) {
      await showGpsFailModal()
      return await getGps(useRealGps, force)
    } else {
      return gps
    }
  }
}

export const showGpsFailModal = () => {
  return new Promise((resolve) => {
    uni.showModal({
      content: '检测到您没打开获取位置功能权限，是否去设置打开？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.openSetting({
            complete() {
              resolve(true)
            },
          })
        } else {
          uni.showToast({
            title: '获取地理位置授权失败',
            icon: 'none',
            success: function () {},
          })
          resolve(true)
        }
      },
      fail() {
        resolve(true)
      },
    })
  })
}

export default getGps
