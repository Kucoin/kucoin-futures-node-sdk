import { PageOffsetParams, PageSizeParams } from './common';
export type TransactionType = 'RealisedPNL' | 'Deposit' | 'Withdrawal' | 'TransferIn' | 'TransferOut';
export interface TransactionHistoryParams extends PageOffsetParams {
    type?: TransactionType;
    currency?: string;
}
export interface SubApiParams {
    subName: string;
    passphrase: string;
    permission?: string;
    ipWhitelist?: string;
    expire?: string;
}
export interface CreateSubApiParams extends SubApiParams {
    remark: string;
}
export interface UpdateSubApiParams extends SubApiParams {
    apiKey: string;
}
export type TransferStatusType = 'PROCESSING' | 'SUCCESS' | 'FAILURE';
export interface TransferListParams extends PageSizeParams {
    status?: TransferStatusType;
    queryStatus?: TransferStatusType;
    currency?: string;
}
