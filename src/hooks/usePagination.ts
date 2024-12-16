import { ref, computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'

type ApiFunc = (...args: any) => Promise<ApiResponse<any>>

interface Params {
  api: ApiFunc | ComputedRef<ApiFunc> | Ref<ApiFunc>
  initialPage?: number
  initialSize?: number
  processDataCallback?: undefined | ((data: { list?: any[]; total?: number }) => any[])
  withLoading?: boolean
  withErrorToast?: boolean
}

export default function usePagination<T>(params: Params) {
  const { showToast } = useToast()

  const {
    api,
    initialPage = 1,
    initialSize = 20,
    processDataCallback = undefined,
    withLoading = true,
    withErrorToast = true,
  } = params

  const page = ref(initialPage)
  const size = ref(initialSize)
  const loading = ref(false)
  const data = ref<T[]>([])
  const hasMore = ref(true)

  const fetchData = async (additionalParams = {}) => {
    if (loading.value || !hasMore.value) {
      return
    }

    loading.value = true

    try {
      if (withLoading) {
        uni.showLoading()
      }

      const {
        data: response,
        code,
        msg,
      } = await unref(api)({
        page: page.value,
        size: size.value,
        ...additionalParams,
      })
      if (withLoading) {
        uni.hideLoading()
      }

      if (code === 0) {
        // 请求成功

        const list = processDataCallback ? await processDataCallback(response) : response.list || []
        data.value = page.value === 1 ? list : [...data.value, ...list]

        hasMore.value = !(page.value * size.value >= response.total) // 判断是否全部加载完

        if (hasMore.value) {
          page.value++
        }
      } else {
        if (withErrorToast) {
          showToast(msg)
        }
      }
    } catch (error) {
      if (page.value === 1) {
        data.value = []
      }
      console.error('Error fetching data:', error)
      if (withLoading) {
        uni.hideLoading()
      }
    } finally {
      loading.value = false
    }
  }

  const refreshData = async (additionalParams = {}) => {
    page.value = 1
    hasMore.value = true
    await fetchData(additionalParams)
  }

  const status = computed(() => {
    if (!hasMore.value) {
      return 'noMore'
    } else {
      if (loading.value) {
        return 'loading'
      } else {
        return 'more'
      }
    }
  })

  return {
    page,
    size,
    loading,
    data,
    hasMore,
    fetchData,
    status,
    refreshData,
  }
}
