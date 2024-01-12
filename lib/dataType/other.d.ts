import { PageOffsetParams } from './common';
export interface FundingHistoryParams extends PageOffsetParams {
    symbol: string;
    reverse?: boolean | true;
}
export interface FundingRatesParams {
    symbol: string;
    startAt: string;
    endAt: string;
}
