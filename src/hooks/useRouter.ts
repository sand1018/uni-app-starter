import type { AppJson } from '@dcloudio/uni-cli-shared'
import { computed } from 'vue'
import { extendUrl, getUrlObj } from '@/utils/index'
import pageConfig from '@/pages.json'

interface WithParams {
  params?: Record<string, any>
}

type OptionsWithParams = WithParams & NavigateToOptions

type UniTabBarItem = Exclude<AppJson['tabBar'], undefined>['list'][number]

type TabBarItem = RequiredOnly<UniTabBarItem, 'pagePath'>

export interface UseRouterOptions {
  /**
   * 是否尝试跳转 tabBar 开启后，使用 navigate / redirect 将会先尝试 tabBar
   *
   * @default true
   */
  tryTabBar?: boolean
  /** pages.json 里的 tabBar list 配置 tryTabBar 开启时，会判断跳转页面 全局配置，仅需要配置一次 */
  tabBarList?: TabBarItem[]
}

/**
 * 路由操作的封装
 *
 * UNIAPP 官方文档 @see https://uniapp.dcloud.net.cn/api/router.html
 */
export default function useRouter(options: UseRouterOptions = {}) {
  const pageStore = usePageStore()

  /** 获取当前页面栈信息 */
  const pages = computed(() => pageStore.pages)
  const pageLength = computed(() => pages.value.length) // 使用 computed 可触发依赖项更新

  /** 获取当前页信息 */
  // at is not supported
  const current = computed(() => pages.value?.[pageLength.value - 1])
  /** 获取前一页信息 */
  const prev = computed(() => (pageLength.value > 1 ? pages.value[pageLength.value - 2] : null))

  /** 获取当前页路由信息 */
  const currentUrl = computed(() => (`/${current.value?.route}` || '/') as NavigateToOptions['url'])

  /** 获取前一页路由信息 */
  const prevUrl = computed(
    () => (prev.value ? `/${prev.value.route}` : '') as NavigateToOptions['url'],
  )

  const tabBarList: TabBarItem[] = pageConfig.tabBar ? pageConfig.tabBar.list : []

  function warpOptions<T = any>(opts: T) {
    let { fail, success, complete, url, params = {} } = opts as any

    fail = fail || ((err: any) => err)
    success = success || ((res: any) => res)
    complete = complete || (() => {})

    const { query, path } = getUrlObj(url)

    return {
      ...opts,
      url: extendUrl(path, {
        ...params,
        ...query,
      }),
      success: (res: any) => success(res),
      fail: (err: any) => fail(err),
      complete,
    }
  }

  type SwitchTabOptions = UniNamespace.SwitchTabOptions & NavigateToOptions
  /** 切换 tabbar 页面 */
  function switchTab(options: SwitchTabOptions) {
    uni.switchTab(
      warpOptions({
        url: options.url,
        complete: options.complete,
        success: options.success,
        fail: options.fail,
      }),
    )
  }

  function navigateTo(options: UniNamespace.NavigateToOptions & OptionsWithParams) {
    uni.navigateTo(warpOptions(options))
  }

  function redirectTo(options: UniNamespace.RedirectToOptions & OptionsWithParams) {
    uni.redirectTo(warpOptions(options))
  }

  /** 重定向，并清空当前页面栈 */
  function reLaunch(options: UniNamespace.ReLaunchOptions & OptionsWithParams) {
    uni.reLaunch(warpOptions(options))
  }

  /** 后退 */
  function back(options?: UniNamespace.NavigateBackOptions) {
    uni.navigateBack(options)
  }

  const isTabBarPath = computed(() => {
    return checkTabBarPath(currentUrl.value)
  })

  const checkTabBarPath = (url: string) => {
    return tabBarList.some((t) => `/${t.pagePath}` === url)
  }

  const { tryTabBar = true } = options

  /** 路由跳转 */
  function navigate(options: UniNamespace.NavigateToOptions & OptionsWithParams) {
    navigateTo(options)
  }

  /** 路由重定向 */
  function redirect(options: UniNamespace.RedirectToOptions & OptionsWithParams) {
    redirectTo(options)
  }

  return {
    /** 获取当前页面栈信息 */
    pages,
    /** 获取当前页信息 */
    current,
    /** 获取当前页路由信息 */
    currentUrl,
    /** 获取前一页信息 */
    prev,
    /** 获取前一页路由信息 */
    prevUrl,
    /** 当前页面是否tabbar */
    isTabBarPath,
    /** 切换 tabbar 页面。 */
    switchTab,
    /** 路由跳转 */
    navigate,
    /** 路由重定向 */
    redirect,
    /** 重定向，并清空当前页面栈 */
    reLaunch,
    /** 后退 */
    back,
  }
}
