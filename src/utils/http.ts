import { CustomRequestOptions } from '@/interceptors/request'
import useRouter from '@/hooks/useRouter'
import { useUserStore } from '@/store/user'
import { LoginPath } from '@/constants/index'
import { debounce } from '@/utils/index'

export const http = <T>(options: CustomRequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<ApiResponse<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if ((res.data as any).code === 2) {
            const { clearUserInfo } = useUserStore()
            const { navigate, currentUrl, reLaunch, isTabBarPath } = useRouter()

            const routeToLogin = debounce(() => {
              if (isTabBarPath) {
                reLaunch({
                  url: LoginPath,
                })
              } else {
                navigate({
                  url: LoginPath,
                })
              }
            }, 10)

            //  清理用户信息，跳转到登录页
            clearUserInfo()
            if (currentUrl.value !== LoginPath) {
              // 解决重复跳转登录页问题
              routeToLogin()
            }
            reject(res)
          }
          // 2.1 提取核心数据 res.data
          resolve(res.data as ApiResponse<T>)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: (res.data as ApiResponse<T>).msg || '请求错误',
            })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @returns
 */
export const httpGet = <T>(
  url: string,
  options: {
    query?: Record<string, any>
  } = {},
) => {
  return http<T>({
    url,
    query: options.query,
    method: 'GET',
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @returns
 */
export const httpPost = <T>(
  url: string,
  options: {
    data?: Record<string, any>
    query?: Record<string, any>
  } = {},
) => {
  return http<T>({
    url,
    data: options.data,
    method: 'POST',
  })
}

http.get = httpGet
http.post = httpPost
