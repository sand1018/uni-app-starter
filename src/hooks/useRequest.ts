type IUseRequestOptions<T> = {
  /** 是否立即执行，如果是则在onLoad执行 */
  immediate?: boolean
  /** 初始化数据 */
  initialData?: T
}

/**
 * useRequest是一个定制化的请求钩子，用于处理异步请求和响应。
 * @param func 一个执行异步请求的函数，返回一个包含响应数据的Promise。
 * @param options 包含请求选项的对象 {immediate, initialData}。
 * @param options.immediate 是否立即执行请求，默认为true。
 * @param options.initialData 初始化数据，默认为undefined。
 * @returns 返回一个对象{loading, error, data, run}，包含请求的加载状态、错误信息、响应数据和手动触发请求的函数。
 */
export default function useRequest<T>(
  func: () => Promise<IResData<T>>,
  options: IUseRequestOptions<T> = { immediate: true },
) {
  const loading = ref(false)
  const error = ref(false)
  const data = ref<T>()
  const msg = ref('')
  const run = () => {
    loading.value = true

    return new Promise((resolve, reject) => {
      func()
        .then((res) => {
          msg.value = res.msg
          if (res.code === 0) {
            data.value = res.data
            error.value = false
          } else {
            error.value = true
          }
          resolve(res)
        })
        .catch((err) => {
          error.value = true
          reject(err)
        })
        .finally(() => {
          loading.value = false
        })
    })
  }

  onLoad(() => {
    options.immediate && run()
  })
  return { loading, error, data, run, msg }
}
