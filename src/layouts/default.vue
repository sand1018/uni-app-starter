<template>
  <!-- page-meta 只能是页面内的第一个节点 -->
  <!-- <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`"></page-meta> -->

  <wd-config-provider :themeVars="themeVars">
    <slot />
    <wd-toast />
    <wd-message-box />
    <auth-popup />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderThemeVars } from 'wot-design-uni'

const themeVars: ConfigProviderThemeVars = {
  colorTheme: 'red',
  buttonPrimaryBgColor: '#07c160',
  buttonPrimaryColor: 'white',
}

const show = ref(false)
</script>
