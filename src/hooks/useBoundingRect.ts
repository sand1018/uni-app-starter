export default function useBoundingRect() {
  const context = getCurrentInstance()

  const rect = ref<UniApp.NodeInfo>({})

  const nodes = ref<UniApp.NodeInfo[]>([])

  const getBoundingRect = (target: string): Promise<UniApp.NodeInfo | UniApp.NodeInfo[]> => {
    const resolveFn = (result: UniApp.NodeInfo | UniApp.NodeInfo[], resolve: (v: any) => void) => {
      if (Array.isArray(result)) {
        nodes.value = result
        if (result.length) rect.value = result[0]
      } else {
        if (result) nodes.value = [result]
        rect.value = result || {}
      }
      resolve(result)
    }

    return new Promise((resolve) => {
      // #ifndef MP-ALIPAY
      uni
        .createSelectorQuery()
        .in(context)
        .select(target)
        .boundingClientRect((node) => {
          resolveFn(node, resolve)
        })
        .exec()
      // #endif
      // #ifdef MP-ALIPAY
      uni
        .createSelectorQuery()
        .select(target)
        .boundingClientRect((node) => {
          resolveFn(node, resolve)
        })
        .exec()
      // #endif
    })
  }

  return {
    getBoundingRect,
    rect,
    nodes,
  }
}
