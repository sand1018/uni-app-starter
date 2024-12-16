import { messageInstance } from '@/layouts/reactive'
import type { MessageOptions } from 'wot-design-uni/components/wd-message-box/types'

export function useCustomMessage() {
  const message: (typeof messageInstance)['value'] = {} as (typeof messageInstance)['value']

  Object.setPrototypeOf(message, messageInstance.value)

  const messageProxy = new Proxy(message, {
    get: function (target, prop) {
      return function (...args) {
        const options: MessageOptions = { zIndex: 9999, lazyRender: false }
        if (typeof args[0] === 'string') {
          options.title = args[0]
        } else {
          Object.assign(options, args[0] || {})
        }

        return messageInstance.value[prop](options)
      }
    },
  })

  return {
    message: messageProxy,
  }
}
