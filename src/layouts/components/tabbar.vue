<template>
  <wd-tabbar
    v-if="userStore.isLogined && isTabBarPath"
    :modelValue="currentTab"
    @change="handleTabChange"
    :fixed="true"
    :placeholder="true"
    :safeAreaInsetBottom="true"
    :activeColor="COLOR_PRIMARY"
    inactiveColor="#707070"
    :zIndex="500"
  >
    <wd-tabbar-item v-for="(item, index) in Tabbar" :key="item.pagePath" :title="item.text">
      <template #icon>
        <image
          class="w-28px h-28px"
          :src="index === currentTab ? item.activeIconPath : item.iconPath"
          mode="scaleToFill"
        />
      </template>
    </wd-tabbar-item>
  </wd-tabbar>
</template>

<script lang="ts" setup>
import useRouter from '@/hooks/useRouter'
import { COLOR_PRIMARY, Tabbars } from '@/constants/index'

const userStore = useUserStore()
const tabbarList = userStore.tabbars

const { currentUrl, isTabBarPath } = useRouter()

const currentTab = ref(0)

const handleTabChange = ({ value }) => {
  currentTab.value = value
  uni.switchTab({
    url: `${tabbarList[value].pagePath}`,
  })
}

watch(
  () => currentUrl.value,
  () => {
    const currentIndex = tabbarList?.findIndex((item) => item.pagePath === currentUrl.value)
    currentTab.value = currentIndex
  },
)
</script>
