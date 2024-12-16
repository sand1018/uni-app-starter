import { http } from '@/utils/http'
import { IndexStatisticsTypes } from './typings'
export type * from './typings'

/** 数据看板 请求 */
export const getIndexStatistics = (query: {
  station_id?: string
  cabinet_id?: string
  start_date: string
  end_date: string
}) => {
  return http.get<IndexStatisticsTypes>(`/index/statistics`, { query })
}
