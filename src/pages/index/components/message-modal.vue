<template>
  <view class="">
    <wd-button @click="handleClick">测试测试 {{ num }}</wd-button>
  </view>
</template>

<script lang="ts" setup>
import { useMessage } from 'wot-design-uni'

const { detectPhone } = useAuth()
const { showToast } = useToast()

const message = useMessage()

const num = ref(0)

const handleClick = () => {
  detectPhone(() => {
    showToast('登录成功')
    num.value++
  })
}
</script>

<style lang="scss" scoped>
//
</style>
