export default function useLoading() {
  const hideLoading = () => {
    uni.hideLoading()
  }

  const showLoading = (options: UniApp.ShowLoadingOptions | string) => {
    if (typeof options === 'string') {
      options = { title: options } // 如果传入字符串，则将其作为标题
    }

    uni.showLoading({
      mask: true,
      ...options,
    })
    return hideLoading
  }

  return {
    hideLoading,
    showLoading,
  }
}
