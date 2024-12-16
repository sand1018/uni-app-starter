export default function useLoading() {
  const hideLoading = () => {
    uni.hideLoading()
  }

  const showLoading = (options?: UniApp.ShowLoadingOptions | string) => {
    let opt: any = {}
    if (options) {
      if (typeof options === 'string') {
        opt.title = options // 如果传入字符串，则将其作为标题
      } else {
        opt = {
          ...options,
        }
      }
    }

    uni.showLoading({
      mask: true,
      title: '加载中...',
      ...opt,
    })
  }

  return {
    hideLoading,
    showLoading,
  }
}
