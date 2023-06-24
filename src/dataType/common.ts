export interface MakeRequestParams {
    body?: object | string;
    method: string;
    endpoint: string;
    callback?: Function;
    isPrivate?: boolean;
  }
  
  export interface PageOffsetParams {
    startAt?: string;
    endAt?: string;
    offset?: number;
    forward?: boolean | true;
    maxCount?: number;
  }
  
  export interface PageSizeParams {
    startAt?: string;
    endAt?: string;
    pageSize?: number;
    currentPage?: number;
  }