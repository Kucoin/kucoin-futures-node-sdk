import { CreateSubApiParams, FillsParams, FundingHistoryParams, OpenOrderListParams, StopOrderListParams, TransactionHistoryParams, TransferListParams, UpdateSubApiParams, IndexListParams, klineParams, Callback, FundingRatesParams } from './dataType';
import { WebSocketClient } from './websocket';
export default class KuCoinFutures {
    private request;
    private socketInstanceCache;
    constructor(props: {
        key: string | number;
        secret: string | number;
        passphrase: string | number;
        axiosProps: object;
    });
    private makeRequest;
    futuresAccount: (currency?: string, callback?: Function) => Promise<any>;
    futuresAccountOverview: (currency?: string, callback?: Function) => Promise<any>;
    /**
     * search to transaction history
     * @param params.type string  -- 'RealisedPNL' | 'Deposit' | 'Withdrawal' | 'TransferIn' | 'TransferOut'
     * @param params.currency -- string
     * @param params.startAt -- timestamp
     * @param params.endAt -- timestamp
     * @param params.offset -- long
     * @param params.maxCount -- default 50
     * @param params.forward -- default true
     * @param callback -- callback function
     */
    futuresTransactionHistory: (params?: TransactionHistoryParams, callback?: Function) => Promise<any>;
    futuresSubApi: (params: {
        subName: string;
        apiKey?: string;
    }, callback?: Function) => Promise<any>;
    futuresCreateSubApi: (params: CreateSubApiParams, callback?: Function) => Promise<any>;
    futuresUpdateSubApi: (params: UpdateSubApiParams, callback?: Function) => Promise<any>;
    futureDeleteSubApi: (params: {
        subName: string;
        apiKey: string;
        passphrase: string;
    }, callback?: Function) => Promise<any>;
    futureTransferOut: (params: {
        amount: number;
        currency: string;
        recAccountType: string;
    }, callback?: Function) => Promise<any>;
    futureTransferIn: (params: {
        amount: number;
        currency: string;
        payAccountType: string;
    }, callback?: Function) => Promise<any>;
    /**
     * search to transfer list
     * @param params.startAt -- timestamp
     * @param params.endAt -- timestamp
     * @param params.status -- string -- 'PROCESSING' | 'SUCCESS' | 'FAILURE'
     * @param params.queryStatus -- array -- 'PROCESSING' | 'SUCCESS' | 'FAILURE'
     * @param params.currency -- string
     * @param params.currentPage -- default 1
     * @param params.pageSize -- default 50 | max 100
     * @param callback -- callback function
     */
    futureTransfers: (params?: TransferListParams, callback?: Function) => Promise<any>;
    private order;
    private stopOrder;
    futuresBuy: (params: {
        symbol: string;
        size: string | number;
        price: string | number;
        leverage?: number | undefined;
        clientOid?: string | undefined;
        optional?: object | undefined;
    }, callback?: Function) => Promise<any>;
    futuresSell: (params: {
        symbol: string;
        size: string | number;
        price: string | number;
        leverage?: number | undefined;
        clientOid?: string | undefined;
        optional?: object | undefined;
    }, callback?: Function) => Promise<any>;
    futuresCancel: (orderId: string, callback?: Function) => Promise<any>;
    futuresCancelAllOpenOrders: (symbol?: string, callback?: Function) => Promise<any>;
    futuresCancelAllStopOrders: (symbol?: string, callback?: Function) => Promise<any>;
    futuresCancelAll: (symbol?: string, callback?: Function) => Promise<[any, any]>;
    futuresCancelOrderByClientOid: (symbol: string, clientOid: string, callback?: Function) => Promise<any>;
    /**
     * search to open orders list
     * @param params.status --'active'|'done' default 'active'
     * @param params.symbol -- string symbol
     * @param params.side --'buy'|'sell'
     * @param params.type -- 'limit'|'market'|'limit_stop'|'market_stop'
     * @param params.startAt -- timestamp
     * @param params.endAt -- timestamp
     * @param params.currentPage -- default 1
     * @param params.pageSize -- default 50 | max 1000
     * @param callback -- callback function
     */
    futuresOpenOrders: (params: OpenOrderListParams, callback?: Function) => Promise<any>;
    /**
     * search to stop orders list
     * @param params.symbol -- string symbol
     * @param params.side --'buy'|'sell'
     * @param params.type -- 'limit'|'market'
     * @param params.startAt -- timestamp
     * @param params.endAt -- timestamp
     * @param params.currentPage -- default 1
     * @param params.pageSize -- default 50 | max 1000
     * @param callback -- callback function
     */
    futuresStopOrders: (params: StopOrderListParams, callback?: Function) => Promise<any>;
    futuresRecentDoneOrders: (symbol?: string, callback?: Function) => Promise<any>;
    /**
     * search to order detail
     * @param params -- string orderId || object { clientOid }
     * @param callback -- callback function
     */
    futuresOrderDetail: (params: string | object, callback?: Function) => Promise<any>;
    /**
     * search to stop orders list
     * @param params.orderId -- string
     * @param params.symbol -- string symbol
     * @param params.side --'buy'|'sell'
     * @param params.type -- 'limit'|'market'|'limit_stop'|'market_stop'
     * @param params.startAt -- timestamp
     * @param params.endAt -- timestamp
     * @param params.currentPage -- default 1
     * @param params.pageSize -- default 50 | max 100
     * @param callback -- callback function
     */
    futuresFills: (params?: FillsParams, callback?: Function) => Promise<any>;
    futuresRecentFills: (symbol?: string, callback?: Function) => Promise<any>;
    futuresMarginOpenOrders: (symbol: string, callback?: Function) => Promise<any>;
    futuresPositionDetail: (symbol?: string, callback?: Function) => Promise<any>;
    futuresPositions: (currency?: string, callback?: Function) => Promise<any>;
    futuresPositionAutoDeposit: (params: {
        symbol: string;
        status: boolean;
    }, callback?: Function) => Promise<any>;
    futuresPositionMargin: (params: {
        symbol: string;
        margin: number;
        bizNo?: string | undefined;
    }, callback?: Function) => Promise<any>;
    futuresRiskLimit: (symbol?: string, callback?: Function) => Promise<any>;
    futuresChangeRiskLimit: (params: {
        symbol: string;
        level: number;
    }, callback?: Function) => Promise<any>;
    /**
     * search to stop orders list
     * @param params.symbol -- string symbol
     * @param params.startAt -- timestamp
     * @param params.endAt -- timestamp
     * @param params.reverse -- boolean
     * @param params.offset -- long
     * @param params.forward -- default true
     * @param params.maxCount -- default 10
     * @param callback -- callback function
     */
    futuresFundingHistory: (params?: FundingHistoryParams, callback?: Function) => Promise<any>;
    /**
     * search to stop orders list
     * @param params.symbol -- string symbol
     * @param params.startAt -- timestamp
     * @param params.endAt -- timestamp
     * @param callback -- callback function
     */
    futuresFundingRates: (params?: FundingRatesParams, callback?: Function) => Promise<any>;
    futuresFundingRate: (symbol: string, callback?: Function) => Promise<any>;
    futuresContractsActive: (callback?: Function) => Promise<any>;
    futuresContractDetail: (symbol: string, callback?: Function) => Promise<any>;
    futuresTicker: (symbol: string, callback?: Function) => Promise<any>;
    futuresLevel2: (symbol: string, callback?: Function) => Promise<any>;
    futuresLevel2Depth20: (symbol: string, callback?: Function) => Promise<any>;
    futuresLevel2Depth100: (symbol: string, callback?: Function) => Promise<any>;
    futuresTradeHistory: (symbol: string, callback?: Function) => Promise<any>;
    futuresTimestamp: (callback?: Function) => Promise<any>;
    futuresStatus: (callback?: Function) => Promise<any>;
    /**
     * search to kline
     * @param params.symbol -- string symbol
     * @param params.granularity -- number
     * @param params.form -- timestamp
     * @param params.to -- boolean
     */
    futuresKline: (params: klineParams, callback?: Function) => Promise<any>;
    futuresTradeStatistics: (callback?: Function) => Promise<any>;
    /**
     * search to interest list
     * @param params.symbol -- string symbol
     * @param params.reverse -- boolean default true
     * @param params.startAt -- timestamp
     * @param params.endAt -- timestamp
     * @param params.offset -- long
     * @param params.forward -- boolean default true
     * @param params.maxCount -- number default 10 | max 100
     * @param callback -- callback function
     */
    futuresInterests: (params?: IndexListParams, callback?: Function) => Promise<any>;
    /**
     * search to index list
     * @param params.symbol -- string symbol
     * @param params.reverse -- boolean default true
     * @param params.startAt -- timestamp
     * @param params.endAt -- timestamp
     * @param params.offset -- long
     * @param params.forward -- boolean default true
     * @param params.maxCount -- number default 10 | max 100
     * @param callback -- callback function
     */
    futuresIndexList: (params?: IndexListParams, callback?: Function) => Promise<any>;
    futuresMarkPrice: (symbol: string, callback?: Function) => Promise<any>;
    /**
     * search to premium list
     * @param params.symbol -- string symbol
     * @param params.startAt -- timestamp
     * @param params.endAt -- timestamp
     * @param params.reverse -- boolean default true
     * @param params.offset -- long
     * @param params.forward -- boolean default true
     * @param params.maxCount -- number default 10 | max 100
     * @param callback -- callback function
     */
    futuresPremiums: (params?: IndexListParams, callback?: Function) => Promise<any>;
    futuresGetSocketInstance: (isPrivate: boolean) => Promise<WebSocketClient>;
    futuresGetCacheSocketInstance: (isPrivate: boolean) => Promise<WebSocketClient>;
    futuresSocketSubscribe: (topic: string, callback?: Callback, isPrivate?: boolean, strict?: boolean) => Promise<false | undefined>;
    get websocket(): {
        tickerV2: (symbols: string | [
        ], callback?: (d: any) => void) => Promise<false | (false | undefined)[] | undefined>;
        ticker: (symbols: string | [
        ], callback?: (d: any) => void) => Promise<false | (false | undefined)[] | undefined>;
        level2: (symbols: string | [
        ], callback?: (d: any) => void) => Promise<false | (false | undefined)[] | undefined>;
        execution: (symbols: string | [
        ], callback?: (d: any) => void) => Promise<false | (false | undefined)[] | undefined>;
        level2Depth5: (symbols: string | [
        ], callback?: (d: any) => void) => Promise<false | (false | undefined)[] | undefined>;
        level2Depth50: (symbols: string | [
        ], callback?: (d: any) => void) => Promise<false | (false | undefined)[] | undefined>;
        instrument: (symbols: string | [
        ], callback?: (d: any) => void) => Promise<false | (false | undefined)[] | undefined>;
        announcement: (callback?: (d: any) => void) => Promise<false | undefined>;
        snapshot: (symbols: string | [
        ], callback?: (d: any) => void) => Promise<false | (false | undefined)[] | undefined>;
        tradeOrders: (symbols: string | [
        ], callback?: (d: any) => void) => Promise<false | (false | undefined)[] | undefined>;
        advancedOrders: (callback?: (d: any) => void) => Promise<false | undefined>;
        wallet: (callback?: (d: any) => void) => Promise<false | undefined>;
        position: (symbols: string | [
        ], callback?: (d: any) => void) => Promise<false | (false | undefined)[] | undefined>;
    };
}
