// 全局要用的类型放到这里

type IResData<T> = {
  code: number
  msg: string
  data: T
}

type ResponseList<T> = {
  code: number
  msg: string
  data: {
    list?: T[]
    total?: number
  }
}

type ApiResponse<T> = IResData<T> & ResponseList<T>

type Pagination = {
  page: number
  size: number
}

interface UploadFileResult {
  filename: string
  bucket: string
  key: string
  url: string
}

// uni.uploadFile文件上传参数
type IUniUploadFileOptions = {
  file?: File
  files?: UniApp.UploadFileOptionFiles[]
  filePath?: string
  name?: string
  formData?: any
}

type RequiredProperty<T, K extends keyof T> = T & { [P in K]-?: T[P] }

type RequiredOnly<T, K extends keyof T> = RequiredProperty<Partial<T>, K>

enum TestEnum {
  A = 'a',
  B = 'b',
}

/** 账号类型 */
type PartnerType = 'agent' | 'channel' | 'property' | 'staff'
