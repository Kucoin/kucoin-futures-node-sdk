import { PageOffsetParams } from './common';
export interface FundingHistoryParams extends PageOffsetParams {
    symbol: string;
    reverse?: boolean | true;
}
