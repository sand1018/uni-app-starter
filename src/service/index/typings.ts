export interface IndexStatisticsTypes {
  device_stat: Devicestat
  order_stat: Orderstat
}

interface Orderstat {
  pay_amount: number
  my_amount: number
  wash_order_count: number
  wash_card_order_count: number
  coupon_order_count: number
}

interface Devicestat {
  total: number
  offline_count: number
  slot_count: number
  slot_err_count: number
}
