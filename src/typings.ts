// 全局要用的类型放到这里

type IResData<T> = {
  code: number
  msg: string
  data: T
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
