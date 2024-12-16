// uno.config.ts
import {
  type Preset,
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { presetApplet, presetRemRpx, transformerAttributify } from 'unocss-applet'

// @see https://unocss.dev/presets/legacy-compat
import { presetLegacyCompat } from '@unocss/preset-legacy-compat'

const isMp = process.env?.UNI_PLATFORM?.startsWith('mp') ?? false

const presets: Preset[] = []
if (isMp) {
  // 使用小程序预设
  presets.push(
    presetApplet(),
    presetRemRpx({
      mode: 'rem2rpx',
      baseFontSize: 4,
      screenWidth: 750,
    }),
  )
} else {
  presets.push(
    // 非小程序用官方预设
    presetUno(),
    // 支持css class属性化
    presetAttributify(),
  )
}
export default defineConfig({
  presets: [
    ...presets,
    // 支持图标，需要搭配图标库，eg: @iconify-json/carbon, 使用 `<button class="i-carbon-sun dark:i-carbon-moon" />`
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    // 将颜色函数 (rgb()和hsl()) 从空格分隔转换为逗号分隔，更好的兼容性app端，example：
    // `rgb(255 0 0)` -> `rgb(255, 0, 0)`
    // `rgba(255 0 0 / 0.5)` -> `rgba(255, 0, 0, 0.5)`
    presetLegacyCompat({
      commaStyleColorFunction: true,
    }) as Preset,
  ],
  /**
   * 自定义快捷语句
   * @see https://github.com/unocss/unocss#shortcuts
   */
  shortcuts: {
    'click-hover': 'op-60',
    'reset-button':
      'm-0 p-0 rounded-0 border-none text-[1em] bg-transparent leading-1em after:border-none',
    'cu-button': 'active:(op-60)',
    'xy-center': 'flex items-center justify-center',
    'btn-primary':
      ' bg-primary !xy-center !h-100  !text-32 fw-bold text-white tracking-5 !rounded-16',
    'btn-disabled': '!pointer-events-none active:!scale-100 !opacity-70',
    'absolute-x-center': 'absolute left-[50%] translate-x-[-50%]',
    'absolute-y-center': 'absolute top-[50%] translate-y-[-50%]',
    'absolute-xy-center': 'absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
    'bb-solid': 'border-b border-b-solid border-[#eee]',
    'tt-solid': 'border-t border-t-solid border-[#eee]',
    'text-error': 'text-[#fa4350]',
    'text-warning': 'text-[#f0883a]',
    'text-success': 'text-[#34d19d]',
  },
  transformers: [
    // 启用 @apply 功能
    transformerDirectives(),
    // 启用 () 分组功能
    // 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
    transformerVariantGroup(),
    // Don't change the following order
    transformerAttributify({
      // 解决与第三方框架样式冲突问题
      prefixedOnly: true,
      prefix: 'fg',
    }),
  ],
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    [
      /^text-last-(\w+)$/,
      ([, value]) => {
        return { 'text-align-last': value }
      },
    ],
    [
      'text-primary',
      {
        '--un-text-opacity': 1,
        color: 'rgb(64 158 255 / var(--un-text-opacity))',
      },
    ],
    [
      'bg-primary',
      {
        '--un-bg-opacity': 1,
        'background-color': 'rgb(64 158 255 / var(--un-bg-opacity))',
      },
    ],
    [
      'border-primary',
      {
        '--un-border-opacity': 1,
        'border-color': 'rgb(64 158 255 / var(--un-border-opacity))',
      },
    ],
    [
      'h-tabbar',
      {
        height: 'var(--wot-tabbar-height, 50px);',
      },
    ],
    [
      /^text-primary\/(\d+)$/,
      ([, d]) => {
        return { color: `rgba(64,158,255,${Number(d) / 100})` }
      },
    ],
    [
      /^bg-primary\/(\d+)$/,
      ([, d]) => {
        return { 'background-color': `rgba(64,158,255,${Number(d) / 100})` }
      },
    ],
    [
      /^ellipsis-(\d+)$/,
      ([, d]) => {
        return {
          display: '-webkit-box',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          '-webkit-line-clamp': `${d}`,
          '-webkit-box-orient': 'vertical',
        }
      },
    ],
  ],
})

/**
 * 最终这一套组合下来会得到：
 * mp 里面：mt-4 => margin-top: 32rpx  == 16px
 * h5 里面：mt-4 => margin-top: 1rem == 16px
 *
 * 另外，我们还可以推算出 UnoCSS 单位与设计稿差别4倍。
 * 375 * 4 = 1500，把设计稿设置为1500，那么设计稿里多少px，unocss就写多少述职。
 * 举个例子，设计稿显示某元素宽度100px，就写w-100即可。
 *
 * 如果是传统方式写样式，则推荐设计稿设置为 750，这样设计稿1px，代码写1rpx。
 * rpx是响应式的，可以让不同设备的屏幕显示效果保持一致。
 */
