<template>
  <wd-popup v-model="show" position="bottom" custom-style="height: 200px;" @close="handleClose">
    <wd-button @click="handleLogin">登录</wd-button>
  </wd-popup>
</template>

<script lang="ts" setup>
import { emitter, OPEN_MODAL, AUTH_PHONE_CALLBACK } from './constant'

emitter.on(OPEN_MODAL, () => {
  show.value = true
})

const show = ref(false)

const handleLogin = () => {
  show.value = false
  emitter.emit(AUTH_PHONE_CALLBACK)
}

const handleClose = () => {
  show.value = false
}

onUnmounted(() => {
  emitter.off(OPEN_MODAL)
})
</script>
