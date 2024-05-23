/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  /** 网站标题，应用名称 */
  readonly VITE_APP_TITLE: string
  /** 服务端口号 */
  readonly VITE_SERVER_PORT: string
  /** 后台接口地址 */
  readonly VITE_SERVER_BASEURL: string
  /** 上传图片地址 */
  readonly VITE_UPLOAD_BASEURL: string
  /** 是否清除console */
  readonly VITE_DELETE_CONSOLE: string
  /** 微信小程序 appid */
  readonly VITE_WX_APPID: string
  /** 支付宝小程序 appid */
  readonly VITE_ALIPAY_APPID: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
