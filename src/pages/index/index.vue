<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view
    class="bg-white overflow-hidden pt-2 px-4"
    :style="{ marginTop: safeAreaInsets?.top + 'px' }"
  >
    <view class="mt-12">
      <wd-img custom-class="mx-auto w-28 h-28" :src="userStore.userInfo.avatar" />
    </view>
    <view class="text-center text-4xl main-title-color mt-4">
      {{ userStore.userInfo.nickname }}
    </view>
    <view class="text-center text-2xl mt-2 mb-8">最好用的 uniapp 开发模板</view>

    <view class="text-justify max-w-100 m-auto text-4 indent mb-2">{{ description }}</view>
    <view class="text-center mt-8">
      当前平台是：
      <text class="text-green-500">{{ PLATFORM.platform }}</text>
    </view>
    <wd-button @click="handleGo">关于</wd-button>
    <view class="text-center mt-4" @click="handleClick">
      模板分支是：
      <text class="text-green-500">base</text>
    </view>

    <message-modal />
  </view>
</template>

<script lang="ts" setup>
import PLATFORM from '@/utils/platform'
import { useMessage } from 'wot-design-uni'
import { useRouter } from '@/hooks/useRouter'
import MessageModal from './components/message-modal.vue'

const message = useMessage()

const { navigate, current, currentUrl } = useRouter()

const handleGo = () => {
  console.log(current, currentUrl)
  navigate({
    url: '/pages/test/index',
    params: {
      a: 1,
      b: true,
      c: '发烧',
      d: false,
      e: null,
      f: undefined,
      g: {},
      h: [1, 2, 3],
    },
  })
}

const handleClick = () => {
  // 顺便测试 message 的使用
  message.show('显示隐藏切换')
}

const userStore = useUserStore()

// userStore.setUserInfo({
//   nickname: 'Journey',
//   avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
// })

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const description = ref(
  'unibest 是一个集成了多种工具和技术的 uniapp 开发模板，由 uniapp + Vue3 + Ts + Vite4 + UnoCss + UniUI + VSCode 构建，模板具有代码提示、自动格式化、统一配置、代码片段等功能，并内置了许多常用的基本组件和基本功能，让你编写 uniapp 拥有 best 体验。',
)

onLoad(() => {})
</script>

<style>
.main-title-color {
  color: #d14328;
}
</style>
