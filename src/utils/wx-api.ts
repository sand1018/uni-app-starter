const { errorToast } = useToast()

/**
 * 预览pdf
 * @param url pdf链接
 */
// 预览 PDF 文件的函数
export function previewPDF(url: string) {
  uni.showLoading()
  uni.downloadFile({
    url, // PDF 文件的 URL
    success(res) {
      const filePath = res.tempFilePath
      uni.openDocument({
        filePath,
        fileType: 'pdf',
        success() {
          console.log('打开 PDF 文件成功')
        },
        fail(error) {
          console.error('打开 PDF 文件失败', error)
          uni.showToast({
            title: '打开 PDF 文件失败',
            icon: 'none',
          })
        },
      })
    },
    fail(error) {
      console.error('文件下载失败', error)
      uni.showToast({
        title: '打开 PDF 文件失败',
        icon: 'none',
      })
    },
    complete() {
      uni.hideLoading()
    },
  })
}

/**
 * 拨打电话
 * @param phone 电话
 */
export function makePhoneCall(phone: string) {
  uni
    .makePhoneCall({
      phoneNumber: phone,
    })
    .catch((err) => {
      console.error(err)
    })
}

/**
 * 使用内置地图查看位置
 * @param options
 */
export function openLocation(options: UniApp.OpenLocationOptions) {
  // 显示加载效果
  uni.showLoading({
    title: '加载中',
  })

  // 调用 uni.openLocation 方法
  uni.openLocation({
    success: function () {
      // 成功后关闭加载效果
      uni.hideLoading()
    },
    fail: function () {
      // 失败后也关闭加载效果，并提示错误
      uni.hideLoading()
      uni.showToast({
        title: '打开位置失败',
        icon: 'none',
      })
    },
    ...options,
    // #ifdef MP-ALIPAY
    address: options.address || options.name,
    // #endif
  })
}

/**
 * 获取登录小程序登录 code
 * @returns
 */
export const getLoginCode = (): Promise<IResData<any>> => {
  return new Promise((resolve) => {
    uni.login({
      success({ code }) {
        if (!code) {
          resolve({
            code: 1,
            data: { relaunch: true },
            msg: '获取登录信息失败，请重试~',
          })
        } else {
          resolve({
            code: 0,
            data: code,
            msg: '',
          })
        }
      },
      fail(err) {
        resolve({
          code: 1,
          data: { relaunch: true },
          msg: err.errMsg || '出错啦~请退出重新扫二维码进入~',
        })
      },
    })
  })
}

/**
 * 选择位置
 * @param geo
 * @returns
 */
export const chooseLocation = (geo?: {
  latitude: any
  longitude: any
}): Promise<UniApp.ChooseLocationSuccess> => {
  return new Promise((resolve, reject) => {
    uni.chooseLocation({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      ...(geo || {}),
    })
  })
}

export const scanCode = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.scanCode({
      success(result) {
        resolve(result.result)
      },
      fail(err) {
        errorToast('解析失败')
        reject(err)
      },
    })
  })
}
