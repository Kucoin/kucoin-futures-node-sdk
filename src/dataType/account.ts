import { PageOffsetParams, PageSizeParams } from './common';

export type TransactionType =
  | 'RealisedPNL'
  | 'Deposit'
  | 'Withdrawal'
  | 'TransferIn'
  | 'TransferOut';

export interface TransactionHistoryParams extends PageOffsetParams {
  type?: TransactionType;
  currency?: string;
}

export interface SubApiParams {
  subName: string; // Sub-account name, create sub account name of API Key
  passphrase: string; // Password(Must contain 7-32 characters. Cannot contain any spaces.)
  permission?: string; // Permissions(Only "General" and "Trade" permissions can be set, such as "General, Trade". The default is "General")
  ipWhitelist?: string; // IP whitelist(You may add up to 20 IPs. Use a halfWidth comma to each IP)
  expire?: string; // API expiration time; Never expire(default)-1, 30Day30, 90Day90, 180Day180, 360Day360
}

export interface CreateSubApiParams extends SubApiParams {
  remark: string; // Remarks(1~24 characters)
}

export interface UpdateSubApiParams extends SubApiParams {
  apiKey: string; // API-Key(Sub-account APIKey)
}

export type TransferStatusType = 'PROCESSING' | 'SUCCESS' | 'FAILURE';

export interface TransferListParams extends PageSizeParams {
  status?: TransferStatusType;
  queryStatus?: TransferStatusType;
  currency?: string;
}
