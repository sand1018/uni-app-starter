import pageConfig from '@/pages.json'
import dayjs, { extend, locale } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
locale('zh-cn')
extend(relativeTime)
extend(duration)

/** 判断当前页面是否是tabbar页  */
export const getIsTabbar = () => {
  if (!pageConfig.tabBar) {
    return false
  }
  if (!pageConfig.tabBar.list.length) {
    // 通常有tabBar的话，list不能有空，且至少有2个元素，这里其实不用处理
    return false
  }
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  const lastPage = getCurrentPages().at(-1)
  const currPath = lastPage.route
  return !!pageConfig.tabBar.list.find((e) => e.pagePath === currPath)
}

/**
 * 获取当前页面路由的 path 路劲和 redirectPath 路径
 * path 如 ‘/pages/login/index’
 * redirectPath 如 ‘/pages/demo/base/route-interceptor’
 */
export const currRoute = () => {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  const lastPage = getCurrentPages().at(-1)
  const currRoute = (lastPage as any).$page
  // console.log('lastPage.$page:', currRoute)
  // console.log('lastPage.$page.fullpath:', currRoute.fullPath)
  // console.log('lastPage.$page.options:', currRoute.options)
  // console.log('lastPage.options:', (lastPage as any).options)
  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  const { fullPath } = currRoute as { fullPath: string }
  console.log(fullPath)
  // eg: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
  // eg: /pages/login/index?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
  return getUrlObj(fullPath)
}

const ensureDecodeURIComponent = (url: string) => {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/index, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export const getUrlObj = (url: string) => {
  if (url) {
    const [path, queryStr] = url.split('?')

    const query: Record<string, string> = {}

    if (queryStr) {
      queryStr.split('&').forEach((item) => {
        const [key, value] = item.split('=')
        query[key] = ensureDecodeURIComponent(value) // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
      })
    }

    return { path, query }
  } else {
    return { path: '', query: {} }
  }
}

/**
 * 拼接 url 与参数对象
 * @param url
 * @param query
 * @returns
 */
export function extendUrl(url: string, query: Record<string, any>): string {
  // 初始化一个数组来存储查询参数
  const queryParams: string[] = []

  // 遍历查询对象，构建查询参数
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      // 对象类型的值使用 JSON.stringify 序列化并进行编码
      queryParams.push(`${key}=${encodeURIComponent(JSON.stringify(value))}`)
    } else {
      // 其他类型直接转换为字符串并进行编码
      // #ifndef H5
      queryParams.push(`${key}=${value}`)
      // #endif
      // #ifdef H5
      queryParams.push(`${key}=${encodeURIComponent(value)}`)
      // #endif
    }
  })

  // 构建查询字符串
  const queryString = queryParams.join('&')

  // 检查 URL 中是否已经有查询字符串
  const separator = url.includes('?') ? '&' : '?'

  // 返回带有查询字符串的完整 URL
  return url + (queryString ? separator + queryString : '')
}

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 这里设计得通用一点，可以传递key作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = 'needLogin') => {
  // 这里处理主包
  const mainPages = [
    ...(pageConfig ? pageConfig.pages : [])
      .filter((page) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ]
  // 这里处理分包
  const subPages: any[] = []
  ;(pageConfig ? pageConfig.subPackages : []).forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj

    subPageObj.pages
      .filter((page) => !key || page[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  const result = [...mainPages, ...subPages]

  return result
}

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getNeedLoginPages = (): string[] => getAllPages('needLogin').map((page) => page.path)

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const needLoginPages: string[] = getAllPages('needLogin').map((page) => page.path)

/**
 * @description 生成 uuid
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 睡眠函数
 * @param ms number
 * @returns
 */
export function sleep(ms = 0) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean = false,
): (...args: Parameters<T>) => ReturnType<T> {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>): ReturnType<T> {
    // @ts-expect-error xxx
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this

    if (immediate && !timer) {
      fn.apply(context, args)
    }

    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(context, args)
      timer = null
    }, delay)

    // 由于 TypeScript 无法推断出 setTimeout 返回值的类型，因此需要显式返回 undefined
    return undefined as ReturnType<T>
  }
}

export function rpxToPx(rpx: number | undefined) {
  // 获取屏幕的宽度
  const windowWidth = uni.getSystemInfoSync().windowWidth
  // 750rpx等于屏幕宽度，计算一个rpx对应的px数量
  const pxPerRpx = windowWidth / 750
  // 返回转换后的px值
  return rpx * pxPerRpx
}

export function pxToRpx(px: number | undefined) {
  // 获取屏幕的宽度
  const windowWidth = uni.getSystemInfoSync().windowWidth
  // 750rpx等于屏幕宽度，计算一个rpx对应的px数量
  const pxPerRpx = windowWidth / 750
  // 返回转换后的rpx值
  return px / pxPerRpx
}

/**
 * 对象深拷贝
 * @param obj
 * @returns
 */
export function deepClone<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  const result: any = Array.isArray(obj) ? [] : {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone(obj[key])
    }
  }

  return result
}

/** 判断值是否为空 */
export function isEmpty(value: any): boolean {
  if (value == null) {
    // null or undefined
    return true
  }

  if (typeof value === 'string') {
    // Check if string is empty or only contains whitespace
    return value.trim().length === 0
  }

  if (Array.isArray(value)) {
    // Check if array is empty
    return value.length === 0
  }

  if (typeof value === 'object') {
    // Check if object has no own properties
    return Object.keys(value).length === 0
  }

  return false
}

export const isEmptyObject = (obj: object) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false
  return !Object.keys(obj).length
}

export type DateRangeType =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom'

/**
 * 获取时间范围
 * @param type
 * @returns
 */
export function getDateRange(
  type: DateRangeType,
  param1?: number | string,
  param2?: string,
): [string, string] | [] {
  const today = dayjs()
  let startDate: dayjs.Dayjs
  let endDate: dayjs.Dayjs
  let format: string = 'YYYY-MM-DD'
  let days: number | undefined

  // Determine if the second parameter is the format or days
  if (type === 'custom' && typeof param1 === 'number') {
    days = param1
    if (typeof param2 === 'string') {
      format = param2
    }
  } else {
    if (typeof param1 === 'string') {
      format = param1
    }
  }

  switch (type) {
    case 'today':
      startDate = today.subtract(0, 'day').startOf('day')
      endDate = today.subtract(0, 'day').endOf('day')
      break
    case 'yesterday':
      startDate = today.subtract(1, 'day').startOf('day')
      endDate = today.subtract(1, 'day').endOf('day')
      break
    case 'last7days':
      endDate = today.endOf('day')
      startDate = today.subtract(6, 'day').startOf('day')
      break
    case 'last30days':
      endDate = today.endOf('day')
      startDate = today.subtract(29, 'day').startOf('day')
      break
    case 'thisMonth':
      startDate = today.startOf('month')
      endDate = today.endOf('day')
      break
    case 'lastMonth':
      startDate = today.subtract(1, 'month').startOf('month')
      endDate = today.subtract(1, 'month').endOf('month')
      break
    case 'custom':
      if (days !== undefined && days >= 0) {
        endDate = today.endOf('day')
        startDate = today.subtract(days, 'day').startOf('day')
      } else {
        return []
      }
      break
    default:
      throw new Error('Invalid date range type')
  }

  return [startDate.format(format), endDate.format(format)]
}

/**
 * 判断对象是否有某个属性
 * @param obj
 * @param key
 * @returns
 */
export function hasOwnProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K,
): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * 格式化时间输出
 *
 * @param {number} seconds - 要格式化的秒数
 * @returns {string} 格式化后的时间字符串
 *
 * @description
 * 此函数接受秒数作为输入，并返回格式化的时间字符串。
 * 格式为 "xx小时xx分钟xx秒"，但当小时或分钟为 0 时，不会显示对应部分。
 *
 * @example
 * formatDuration(3661) // 返回 "1小时1分钟1秒"
 * formatDuration(3600) // 返回 "1小时"
 * formatDuration(70)   // 返回 "1分钟10秒"
 * formatDuration(30)   // 返回 "30秒"
 */
export function formatDuration(seconds: number) {
  const duration = dayjs.duration(seconds, 'seconds')
  const hours = duration.hours()
  const minutes = duration.minutes()
  const secs = duration.seconds()

  const result = []
  if (hours > 0) {
    result.push(`${hours}小时`)
  }
  if (minutes > 0) {
    result.push(`${minutes}分钟`)
  }
  result.push(`${secs}秒`)

  return result.join('')
}

/**
 * 计算给定时间与当前时间的差异，并返回格式化的字符串
 * @param {string|Date} date - 要计算的日期，可以是日期字符串或 Date 对象
 * @returns {string} 格式化的时间差字符串，如 "5分钟前"、"2小时前"、"3天前" 等
 */
export function getTimeFromNow(date: string | Date) {
  const now = dayjs()
  const inputDate = dayjs(date)
  const diffInHours = now.diff(inputDate, 'hour')

  if (diffInHours < 1) {
    return inputDate.fromNow() // 返回 "xx分钟前"
  } else if (diffInHours < 24) {
    return inputDate.fromNow() // 返回 "xx小时前"
  } else {
    return inputDate.fromNow() // 返回 "xx天前"
  }
}

/**
 * 给筛选区域配置每一项设置 id
 * @param node
 * @param map
 */
export const genLocationOptions = (
  location: LocationMap,
  map?: Map<string | number, { text: string; value: number }>,
) => {
  let id = 1
  const loop = (node: LocationMap) => {
    const result = []
    for (let i = 0; i < node.length; i++) {
      id = id + 1
      const city = {
        text: node[i].text,
        value: id,
        children: [],
      }
      if (map) {
        map.set(id, {
          text: city.text,
          value: city.value,
        })
      }
      if (node[i].children) {
        city.children = loop(node[i].children)
      }

      result.push(city)
    }
    return result
  }
  return loop(location)
}

/**
 * 格式化距离，将数值转换为 "x km" 或 "x m" 的字符串表示形式。
 *
 * @param x {number} - 距离值，单位为米 (m)。
 * @param decimalPlaces {number} - 可选参数，保留的小数位数，默认为 2。
 * @returns {string} - 格式化后的距离字符串：
 *                     - 如果距离大于等于 1000，则以 "km" 为单位，按指定小数位格式化；
 *                     - 如果距离小于 1000，则以 "m" 为单位，返回整数值。
 *                     - 无效的尾随零会被去除。
 *
 * @example
 * formatDistance(500);            // 返回 "500 m"
 * formatDistance(1500);           // 返回 "1.5 km"
 * formatDistance(12345, 3);       // 返回 "12.345 km"
 * formatDistance(12345, 0);       // 返回 "12 km"
 * formatDistance(1000);           // 返回 "1 km"
 * formatDistance(987654, 1);      // 返回 "987.7 km"
 */
export function formatDistance(x: number, decimalPlaces: number = 2): string {
  if (x >= 1000) {
    const km = (x / 1000).toFixed(decimalPlaces).replace(/\.?0+$/, '') // 转换为 km，保留指定小数位，去除无效零
    return `${km}km`
  } else {
    return `${x.toFixed(decimalPlaces).replace(/\.?0+$/, '')}m` // 小于 1000 的值以 m 为单位
  }
}
