import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { Tabbars } from './src/constants/index'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
      '^uni-(.*)': '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue',
    },
  },
  tabBar: {
    custom: true,
    color: '#707070',
    selectedColor: '#409EFF',
    backgroundColor: '#f5f5f5',
    borderStyle: 'white',
    position: 'bottom',
    list: Tabbars.map((item) => {
      return {
        pagePath: item.pagePath.substring(1),
      }
    }) as any,
  },
})
