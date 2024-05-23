## 页面配置

`type:'home' | 'page'` ,默认值 `page` 表示是一个普通页面，`home` 表示当前页面是首页，自动生成 `pages.json` 会把 `type = 'home'` 的页面放到第一个,所以保证 type = 'home' 只在一个页面设置

```json
<route lang="json5" type = "home" >
{
  layout: 'default', // 在 layouts 文件夹内定义 布局方式，弹窗或者登录可以放到 layout 中，以便复用
  needLogin: true, // 是否需要登录，设置为 true， 会在页面跳转的时候执行路由拦截，如果没有登录，会自动跳转登录页面
  style: {
    navigationStyle: 'custom', // 自定义导航栏目
    navigationBarTitleText: '首页', // 页面标题
    //...其他页面设置，参考 uni-app 官网 pages.json设置
  },
}
< /route>

```

## ⚙️ 环境

- node>=18
- pnpm>=7.30

## &#x1F4C2; 快速开始

执行 `pnpm i` 安装依赖

执行 `pnpm dev` 运行 `H5`

## 📦 运行（支持热更新）

- web平台： `pnpm dev:h5`, 然后打开 [http://localhost:9000/](http://localhost:9000/)。
- weixin平台：`pnpm dev:mp-weixin` 然后打开微信开发者工具，导入本地文件夹，选择本项目的 `dist/dev/mp-weixin` 文件。
- APP平台：`pnpm dev:app`, 然后打开 `HBuilderX`，导入刚刚生成的 `dist/dev/app` 文件夹，选择运行到模拟器(开发时优先使用)，或者运行的安卓/ios基座。

## 🔗 发布

- web平台： `pnpm build:h5`，打包后的文件在 `dist/build/h5`，可以放到web服务器，如nginx运行。如果最终不是放在根目录，可以在 `manifest.config.ts` 文件的 `h5.router.base` 属性进行修改。
- weixin平台：`pnpm build:mp-weixin`, 打包后的文件在 `dist/build/mp-weixin`，然后通过微信开发者工具导入，并点击右上角的“上传”按钮进行上传。
- APP平台：`pnpm build:app`, 然后打开 `HBuilderX`，导入刚刚生成的 `dist/build/app` 文件夹，选择发行 - APP云打包。
