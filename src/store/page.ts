import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePageStore = defineStore('page', () => {
  const pages = ref<Page.PageInstance[]>(getCurrentPages())

  const refreshCurrentPages = () => {
    pages.value = getCurrentPages()
  }

  const currentPage = computed(() =>
    pages.value.length > 0 ? `/${pages[pages.value.length - 1].route}` : undefined,
  )

  return {
    pages,
    currentPage,
    refreshCurrentPages,
  }
})
