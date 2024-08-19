import { PageLimitParams, PageOffsetParams } from './common';
export interface FundingHistoryParams extends PageOffsetParams {
    symbol: string;
    reverse?: boolean | true;
}
export interface FundingRatesParams {
    symbol: string;
    from: string;
    to: string;
}
export interface HistoryPositionsParams extends PageLimitParams {
    symbol?: string;
}
