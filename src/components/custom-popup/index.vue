<template>
  <wd-popup
    v-model="visible"
    :position="position"
    @click-modal="handleModalClick"
    @enter="handleEnter"
    :custom-class="wrapperClass"
    :safe-area-inset-bottom="currentSafeArea"
    :z-index="zIndex"
    v-bind="$attrs"
    :lock-scroll="true"
  >
    <view class="relative">
      <view v-if="currentWithHeader" class="py-26 relative box-border">
        <view
          class="absolute-y-center w-50px h-50px left-0 xy-center"
          v-if="withBack"
          @click="handleBack"
        >
          <wd-icon
            @click="handleModalClick"
            name="thin-arrow-left"
            size="18px"
            custom-class="!text-black/60"
          />
        </view>

        <view class="text-36 fw-500 text-center px-80 truncate">
          <slot name="title">
            {{ title }}
          </slot>
        </view>
      </view>

      <view
        class="absolute top-0 right-0 h-50px w-50px xy-center"
        v-if="withClose"
        @click="handleClose"
      >
        <wd-icon name="close" size="18px" custom-class=" !text-black/60" />
      </view>

      <view class="min-w-600">
        <!-- content -->
        <view class="px-40 py-24 box-border" :class="contentClass">
          <slot />
        </view>

        <!-- footer -->
        <view :class="position === 'bottom' && !systemInfo?.safeAreaInsets?.bottom ? `pb-32` : ``">
          <slot name="footer">
            <view v-if="type === 'confirm'" class="mt-32">
              <view :class="confirmPlain ? `border-t border-t-solid border-t-[#eee]` : `px-24`">
                <wd-button
                  type="primary"
                  size="large"
                  block
                  :plain="confirmPlain"
                  :custom-class="confirmPlain ? `!border-none !rounded-none` : `!rounded-16`"
                  @click="handleConfirm"
                >
                  {{ confirmText }}
                </wd-button>
              </view>
            </view>
          </slot>
        </view>
      </view>

      <view class="hidden op-0 h-0 w-0" v-if="currentPageContainer && showContainer">
        <page-container :show="visible" @after-leave="handleClose" @afterleave="handleClose" />
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Position } from './types'

defineOptions({
  inheritAttrs: false,
})

const { systemInfo } = useSystemInfo()

interface ComponentProps {
  /** 使用 page-container 手势返回不会退出页面 */
  pageContainer?: boolean
  /** 展示 header */
  withHeader: boolean
  /** 弹窗弹出位置 */
  position?: Position
  /** iphonex机型底部安全占位 */
  safeAreaInsetBottom?: boolean | undefined
  /** 自定义 class */
  customClass?: string
  /** 弹窗标题 */
  title?: string
  /** 展示返回 icon */
  withBack?: boolean
  /** type=confirm 时会自动显示弹窗底部按钮 */
  type?: 'confirm' | 'normal'
  /** type=confirm 按钮文字 */
  confirmText?: string
  /** 展示关闭 icon */
  withClose?: boolean
  /** 弹窗中间内容 class */
  contentClass?: string
  /** type=confirm 按钮是否为纯色 */
  confirmPlain?: boolean
  zIndex?: number
  preventPageScroll?: boolean
}

const props = withDefaults(defineProps<ComponentProps>(), {
  pageContainer: false,
  withHeader: false,
  position: 'bottom',
  customClass: '',
  title: '',
  withBack: false,
  type: 'normal',
  confirmText: '确定',
  withClose: false,
  contentClass: '',
  confirmPlain: true,
  safeAreaInsetBottom: undefined,
  zIndex: 20,
  preventPageScroll: true,
})

const currentPageContainer = computed(() => {
  return gCurrentValue('pageContainer', props.position === 'bottom')
})

const currentSafeArea = computed(() => {
  return gCurrentValue('safeAreaInsetBottom', props.position === 'bottom')
})

const currentWithHeader = computed<boolean>(() => {
  return gCurrentValue('withHeader', props.title)
})

const gCurrentValue = <T extends keyof ComponentProps>(prop: T, defaultValue: any) => {
  if (Object.prototype.hasOwnProperty.call(props, prop) && props[prop] !== undefined) {
    return props[prop]
  } else {
    return defaultValue
  }
}

const wrapperClass = computed(() => {
  return props.position === 'bottom'
    ? `rounded-t-24 box-border overflow-hidden ${props.customClass}`
    : props.position === 'center'
      ? `rounded-24 overflow-hidden ${props.customClass}`
      : props.customClass
})

const emit = defineEmits<{
  /** 关闭弹窗触发事件 */
  (event: 'close'): void
  /** 点击返回按钮触发事件 */
  (event: 'back'): void
  /** 点击确定按钮触发事件 */
  (event: 'confirm'): void
}>()

const visible = defineModel({
  default: false,
})

watch(
  () => visible.value,
  (newVal) => {
    if (props.preventPageScroll) {
      // #ifdef MP-WEIXIN
      ;(wx as any).setPageStyle({
        style: {
          overflow: newVal ? 'hidden' : 'auto',
        },
      })
      // #endif
    }

    if (!newVal) {
      emit('close')
    }
  },
)

const showContainer = ref(false)

const handleBack = () => {
  visible.value = false
  emit('back')
}

const handleModalClick = () => {
  setTimeout(() => {
    // 解决未清除 page-container 导致页面无响应问题
    showContainer.value = false
  }, 0)
}

const handleEnter = () => {
  showContainer.value = true
}

const handleClose = () => {
  visible.value = false
}

const handleConfirm = () => {
  emit('confirm')
}
</script>
