import { usePageStore } from '@/store/page'
import useRouter from '@/hooks/useRouter'
import { LoginPath } from '@/constants/index'
import { useUserStore } from '@/store/user'
import { getUrlObj, debounce } from '@/utils/index'

// 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
const navigateToInterceptor: UniApp.InterceptorOptions = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  invoke(result) {
    // console.log(url) // /pages/route-interceptor/index?name=feige&age=30
    // const path = url.split('?')[0]

    const { currentUrl, isTabBarPath, navigate, reLaunch } = useRouter()
    const { isLogined } = useUserStore()
    const { refreshCurrentPages } = usePageStore()

    const navigateToLogin = debounce((url: string) => {
      navigate({
        url: LoginPath,
        params: {
          redirect: encodeURIComponent(url),
        },
      })
    }, 10)

    const relaunchToLogin = debounce((url: string) => {
      reLaunch({
        url: LoginPath,
        params: {
          redirect: encodeURIComponent(url),
        },
      })
    }, 10)

    const targetRoute = getUrlObj(result.url).path

    if (!isLogined) {
      if (currentUrl.value !== LoginPath && targetRoute !== LoginPath) {
        if (!isTabBarPath.value) {
          navigateToLogin(result.url)
          return false
        } else {
          relaunchToLogin(result.url)
          return false
        }
      } else {
        refreshCurrentPages()
        return true
      }
    } else {
      if (targetRoute === LoginPath) {
        return false
      }
      // 刷新页面栈信息
      refreshCurrentPages()
      return true
    }
  },
}

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('switchTab', navigateToInterceptor)
    uni.addInterceptor('navigateBack', navigateToInterceptor)
  },
}
