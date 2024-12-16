import { useMessage, useToast } from 'wot-design-uni'

type ToastInstance = ReturnType<typeof useToast>
type MessageInstance = ReturnType<typeof useMessage>

export const toastInstance = ref<ToastInstance>({} as ToastInstance)

export const messageInstance = ref<MessageInstance>({} as MessageInstance)
