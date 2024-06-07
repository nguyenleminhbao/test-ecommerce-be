export interface IZALOPAY_ORDER {
  app_id: string;
  app_trans_id: string;
  app_time: string;
  app_user: string;
  amount: number;
  item: string;
  embed_data: string;
}

export interface IZALOPAY_ITEM {
  service: string;
  user_id: string;
  products?: [];
}

export interface IZALOPAY_STATUS_ORDER {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  is_processing: boolean;
  amount: number;
  zp_trans_id: number;
  discount_amount: number;
}
