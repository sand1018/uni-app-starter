<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

const { refreshCurrentPages } = usePageStore()

const updateManager = uni.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate)
})

updateManager.onUpdateReady(function (res) {
  uni.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success(res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    },
  })
})

updateManager.onUpdateFailed(function (res) {
  // 新的版本下载失败
})

onLaunch(() => {
  // @ts-expect-error 监听页面切换，更新页面栈信息
  uni.onAppRoute(() => {
    refreshCurrentPages()
  })
})
onShow((options) => {
  console.log('🚀 ~ onShow ~ options:', options)
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* stylelint-disable selector-type-no-unknown */
page {
  font-size: 28rpx;
  background-color: #f5f5f5;
  @apply text-black/85;
}

button::after {
  border: none;
}
</style>
