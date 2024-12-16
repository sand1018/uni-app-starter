<template>
  <wd-config-provider :themeVars="themeVars">
    <!-- 页面内容 -->
    <slot />

    <!-- 底部 Tabbar -->
    <tabbar />

    <!-- 自定义弹窗 -->
    <wd-message-box />

    <!-- 自定义 Toast -->
    <wd-toast />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import { messageInstance, toastInstance } from './reactive'
import type { ConfigProviderThemeVars } from 'wot-design-uni'
import Tabbar from './components/tabbar.vue'
import { LoginPath, COLOR_PRIMARY } from '@/constants/index'
import { useMessage, useToast } from 'wot-design-uni'
import WdMessageBox from 'wot-design-uni/components/wd-message-box/wd-message-box.vue'
import WdToast from 'wot-design-uni/components/wd-toast/wd-toast.vue'

const toast = useToast()
const message = useMessage()

messageInstance.value = message
toastInstance.value = toast

const themeVars: ConfigProviderThemeVars = {
  colorTheme: COLOR_PRIMARY,
  buttonPrimaryBgColor: COLOR_PRIMARY,
  buttonPrimaryColor: 'white',
  tabbarHeight: '50px',
  radioButtonRadius: '10px',
  cellTitleFs: '30rpx',
  inputCellPadding: '26rpx',
  cellWrapperPadding: '26rpx',
  cellGroupTitleFs: '36rpx',
  buttonLargeRadius: '16rpx',
  buttonSmallRadius: '12rpx',
  tabsNavColor: 'rgba(0,0,0,0.6)',
  checkboxButtonRadius: '16rpx',
  segmentedItemAcitveBg: '#fff',
  tabsNavFs: '30rpx',
  inputNumberInputWidth: '60px',
}

const { isLogined } = useUserStore()
const { currentUrl, isTabBarPath, reLaunch } = useRouter()

const loginIntercept = (options: Record<string, any>) => {
  if (isLogined || currentUrl.value === LoginPath) {
    return
  }

  if (isTabBarPath.value) {
    reLaunch({
      url: LoginPath,
      params: options,
    })
  }
}

onShow(() => {
  // 重新赋值弹窗实例，防止 tabbar 页面弹窗错乱
  messageInstance.value = message
  toastInstance.value = toast
})

onLoad(async (options) => {
  // 等待页面栈更新
  setTimeout(() => {
    loginIntercept(options)
  }, 0)
})

onMounted(() => {
  messageInstance.value = message
  toastInstance.value = toast
})
</script>
