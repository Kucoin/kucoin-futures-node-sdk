import { PageSizeParams } from './common';

export type BaseOrderType = 'limit' | 'market';
export type OrderType = 'limit' | 'market' | 'limit_stop' | 'market_stop';

export type OrderOptionalParamsType =
  | 'type'
  | 'remark'
  | 'stop'
  | 'stopPriceType'
  | 'stopPrice'
  | 'reduceOnly'
  | 'closeOrder'
  | 'forceHold'
  | 'timeInForce'
  | 'postOnly'
  | 'hidden'
  | 'iceberg'
  | 'visibleSize';

export type OptionalParamsObject<T extends keyof any> = {
  [P in T]?: any;
};

export interface BaseOrderBody {
  symbol: string;
  size: number;
  leverage?: number;
  clientOid?: string;
  optional?: OptionalParamsObject<OrderOptionalParamsType>;
}

export interface OrderBody extends BaseOrderBody {
  side: string;
  price?: number | string;
}

export interface MultiOrderBody {
  clientOid: string;
  side: string;
  symbol: string;
  leverage: string;
  price?: number | string;
  size?: number;
  type?: string;
  remark?: string;
  stop?: string;
  stopPriceType?: string;
  stopPrice?: string;
  reduceOnly?: string;
  closeOrder?: string;
  forceHold?: string;
  timeInForce?: string;
  postOnly?: string;
  hidden?: string;
  iceberg?: string;
  visibleSize?: string;
}

export type OpenOrderStatusType = 'active' | 'done';
export interface OpenOrderListParams extends PageSizeParams {
  status?: OpenOrderStatusType;
  symbol?: string;
  side?: string;
  type?: OrderType;
}

export interface StopOrderListParams extends PageSizeParams {
  symbol?: string;
  side?: string;
  type?: BaseOrderType;
}

export interface FillsParams extends PageSizeParams {
  orderId?: string; // List fills for a specific order only (If you specify orderId, other parameters can be ignored)
  symbol?: string;
  side?: string;
  type?: OrderType;
}
