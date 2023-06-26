import { PageOffsetParams } from './common';

export interface klineParams {
  symbol: string;
  granularity: number;
  from?: string;
  to?: string;
}

export interface IndexListParams extends PageOffsetParams {
  symbol: string;
  reverse?: boolean | true;
}