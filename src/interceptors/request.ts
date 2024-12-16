/* eslint-disable no-param-reassign */
import { stringify } from 'qs'
import { useUserStore } from '@/store'
import { platform } from '@/utils/platform'

const getAppId = () => {
  switch (platform) {
    case 'mp-weixin':
      return import.meta.env.VITE_WX_APPID
    case 'mp-alipay':
      return import.meta.env.VITE_ALIPAY_APPID
    default:
      return ''
  }
}

export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

// 请求基准地址
const baseUrl = import.meta.env.VITE_SERVER_BASEURL

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 接口请求支持通过 query 参数配置 queryString
    const userStore = useUserStore()

    const query = {
      ...(options.query ? options.query : {}),
      lat: userStore.gps.latitude,
      lng: userStore.gps.longitude,
    }

    const queryStr = stringify(query, {
      indices: false,
    })

    if (options.url.includes('?')) {
      options.url += `&${queryStr}`
    } else {
      options.url += `?${queryStr}`
    }

    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseUrl + options.url
      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }
    // 1. 请求超时
    options.timeout = 10000 // 10s
    // 2. （可选）添加小程序端请求头标识
    options.header = {
      'content-type': 'application/json; charset=UTF-8',
      'mx-uuid': userStore.uuid,
      'mx-platform': platform,
      'mx-appid': getAppId(),
      ...options.header,
    }
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
