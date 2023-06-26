import { v4 as uuidV4 } from 'uuid';
import { map } from 'lodash';
import WebSocket from 'ws';

import Request from './tools/request';
import { splitArray } from './tools/tools';

import {
  returnBodyAndEndpoint,
  FUTURES_STOP_ORDER_EP,
  FUTURES_RECENT_DONE_ORDERS_EP,
  FUTURES_FILLS_EP,
  FUTURES_RECENT_FILLS_EP,
  FUTURES_TOTAL_OPEN_ORDERS_MARGIN_EP,
  FUTURES_POSITION_EP,
  FUTURES_POSITIONS_EP,
  FUTURES_POSITION_AUTO_DEPOSIT_STATUS_EP,
  FUTURES_POSITION_MARGIN_EP,
  FUTURES_RISK_LIMIT_EP,
  FUTURES_CHANGE_RISK_LIMIT_EP,
  FUTURES_FUNDING_HISTORY_EP,
  FUTURES_CONTRACTS_ACTIVE_EP,
  FUTURES_CONTRACTS_DETAIL_EP,
  FUTURES_TICKER_EP,
  FUTURES_LEVEL2_EP,
  FUTURES_LEVEL2_20_EP,
  FUTURES_LEVEL2_100_EP,
  FUTURES_TRADE_HISTORY_EP,
  FUTURES_TIMESTAMP_EP,
  FUTURES_SERVICE_STATUS_EP,
  FUTURES_KLINE_EP,
  FUTURES_INTEREST_EP,
  FUTURES_INDEX_EP,
  FUTURES_MARK_PRICE_EP,
  FUTURES_PREMIUM_EP,
  FUTURES_FUNDING_RATE_EP,
  FUTURES_ACCOUNT_OVERVIEW_EP,
  FUTURES_TRANSACTION_HISTORY_EP,
  FUTURES_SUB_API_EP,
  FUTURES_UPDATE_SUB_API_EP,
  FUTURES_TRANSFER_OUT_EP,
  FUTURES_TRANSFER_IN_EP,
  FUTURES_TRANSFER_LIST_EP
} from './resetAPI';
import {
  PUBLIC_BULLET_EP,
  PRIVATE_BULLET_EP,
  TICKER,
  TRADE_ORDERS,
  LEVEL2,
  LEVEL2_DEPTH5,
  LEVEL2_DEPTH50,
  EXECUTION,
  INSTRUMENT,
  ANNOUNCEMENT,
  SNAPSHOT,
  ADVANCE_ORDERS,
  WALLET,
  POSITION
} from './websocket';

import { GET, POST, DELETE } from './tools/constants';
import { filterEmptyValues, log } from './tools/tools';
import {
  CreateSubApiParams,
  FillsParams,
  FundingHistoryParams,
  MakeRequestParams,
  OpenOrderListParams,
  StopOrderListParams,
  TransactionHistoryParams,
  TransferListParams,
  UpdateSubApiParams,
  IndexListParams,
  klineParams,
  Callback
} from './dataType';
import { WebSocketClient, CONNECT_ID, TICKER_V2 } from './websocket';

export default class KuCoinFutures {
  private request: Request;
  private socketInstanceCache: any = new Map();
  constructor(props: {
    key: string | number;
    secret: string | number;
    passphrase: string | number;
    axiosProps: object;
  }) {
    const { key, secret, passphrase, axiosProps = {} } = props || {};
    this.request = new Request({
      key,
      secret,
      passphrase,
      ...axiosProps
    });
  }

  private makeRequest = async ({
    body = '',
    method,
    endpoint,
    callback,
    isPrivate = true
  }: MakeRequestParams): Promise<any> => {
    try {
      const params = filterEmptyValues(body);
      const data = isPrivate
        ? await this.request.signatureRequest(endpoint, params, method)
        : await this.request.requestPublic(endpoint, params, method);
      if (callback) {
        return callback(data);
      } else {
        return data;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  futuresAccount = async (currency: string = 'XBT', callback?: Function) => {
    return this.makeRequest({
      body: { currency },
      method: GET,
      endpoint: FUTURES_ACCOUNT_OVERVIEW_EP,
      callback
    });
  };

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
  futuresTransactionHistory = async (
    params?: TransactionHistoryParams,
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: GET,
      endpoint: FUTURES_TRANSACTION_HISTORY_EP,
      callback
    });
  };

  futuresSubApi = async (
    params: {
      subName: string;
      apiKey?: string;
    },
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: GET,
      endpoint: FUTURES_SUB_API_EP,
      callback
    });
  };

  futuresCreateSubApi = async (
    params: CreateSubApiParams,
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: POST,
      endpoint: FUTURES_SUB_API_EP,
      callback
    });
  };

  futuresUpdateSubApi = async (
    params: UpdateSubApiParams,
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: POST,
      endpoint: FUTURES_UPDATE_SUB_API_EP,
      callback
    });
  };

  futureDeleteSubApi = async (
    params: {
      subName: string;
      apiKey: string;
      passphrase: string;
    },
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: DELETE,
      endpoint: FUTURES_UPDATE_SUB_API_EP,
      callback
    });
  };

  futureTransferOut = async (
    params: {
      amount: number;
      currency: string;
      recAccountType: string;
    },
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: POST,
      endpoint: FUTURES_TRANSFER_OUT_EP,
      callback
    });
  };

  futureTransferIn = async (
    params: {
      amount: number;
      currency: string;
      payAccountType: string;
    },
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: POST,
      endpoint: FUTURES_TRANSFER_IN_EP,
      callback
    });
  };

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
  futureTransfers = async (
    params?: TransferListParams,
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: POST,
      endpoint: FUTURES_TRANSFER_LIST_EP,
      callback
    });
  };

  private order = async (params: any, method = GET, callback?: Function) => {
    const { body, endpoint } = returnBodyAndEndpoint(params, method);
    return this.makeRequest({ body, method, endpoint, callback });
  };

  private stopOrder = async (
    params: any,
    method = GET,
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method,
      endpoint: FUTURES_STOP_ORDER_EP,
      callback
    });
  };

  futuresBuy = async (
    params: {
      symbol: string;
      size: string | number;
      price: string | number;
      leverage?: number;
      clientOid?: string;
      optional?: object;
    },
    callback?: Function
  ) => {
    const {
      price,
      symbol,
      size,
      leverage = 1,
      clientOid = uuidV4(),
      optional
    } = params;
    if (!symbol) {
      throw new TypeError('Order buy symbol must be set!');
    }
    return this.order(
      { side: 'buy', price, symbol, size, leverage, clientOid, optional },
      POST,
      callback
    );
  };

  futuresSell = async (
    params: {
      symbol: string;
      size: string | number;
      price: string | number;
      leverage?: number;
      clientOid?: string;
      optional?: object;
    },
    callback?: Function
  ) => {
    const {
      price,
      symbol,
      size,
      leverage = 1,
      clientOid = uuidV4(),
      optional
    } = params;
    if (!symbol) {
      throw new TypeError('Order sell symbol must be set!');
    }
    return this.order(
      { side: 'sell', price, symbol, size, leverage, clientOid, optional },
      POST,
      callback
    );
  };

  futuresCancel = async (orderId: string, callback?: Function) => {
    return this.order(orderId, DELETE, callback);
  };

  futuresCancelAllOpenOrders = async (symbol?: string, callback?: Function) => {
    return this.order({ symbol }, DELETE, callback);
  };

  futuresCancelAllStopOrders = async (symbol?: string, callback?: Function) => {
    return this.stopOrder({ symbol }, DELETE, callback);
  };

  futuresCancelAll = async (symbol?: string, callback?: Function) => {
    const cancelAllOpenOrders = this.futuresCancelAllOpenOrders(
      symbol,
      callback
    );
    const cancelAllStopOrders = this.futuresCancelAllStopOrders(
      symbol,
      callback
    );
    return Promise.all([cancelAllOpenOrders, cancelAllStopOrders]);
  };

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
  futuresOpenOrders = async (
    params: OpenOrderListParams,
    callback?: Function
  ) => {
    return this.order(params, GET, callback);
  };

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
  futuresStopOrders = async (
    params: StopOrderListParams,
    callback?: Function
  ) => {
    return this.stopOrder(params, GET, callback);
  };

  futuresRecentDoneOrders = async (symbol?: string, callback?: Function) => {
    return this.makeRequest({
      body: { symbol },
      method: GET,
      endpoint: FUTURES_RECENT_DONE_ORDERS_EP,
      callback
    });
  };

  /**
   * search to order detail
   * @param params -- string orderId || object { clientOid }
   * @param callback -- callback function
   */
  futuresOrderDetail = async (params: string | object, callback?: Function) => {
    return this.order(params, GET, callback);
  };

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
  futuresFills = async (params?: FillsParams, callback?: Function) => {
    return this.makeRequest({
      body: params,
      method: GET,
      endpoint: FUTURES_FILLS_EP,
      callback
    });
  };

  futuresRecentFills = async (symbol?: string, callback?: Function) => {
    return this.makeRequest({
      body: { symbol },
      method: GET,
      endpoint: FUTURES_RECENT_FILLS_EP,
      callback
    });
  };

  futuresMarginOpenOrders = async (symbol: string, callback?: Function) => {
    if (!symbol) {
      console.error('Required String parameter symbol');
      return;
    }
    return this.makeRequest({
      body: { symbol },
      method: GET,
      endpoint: FUTURES_TOTAL_OPEN_ORDERS_MARGIN_EP,
      callback
    });
  };

  futuresPositionDetail = async (symbol?: string, callback?: Function) => {
    return this.makeRequest({
      body: { symbol },
      method: GET,
      endpoint: FUTURES_POSITION_EP,
      callback
    });
  };

  futuresPositions = async (currency?: string, callback?: Function) => {
    return this.makeRequest({
      body: { currency },
      method: GET,
      endpoint: FUTURES_POSITIONS_EP,
      callback
    });
  };

  futuresPositionAutoDeposit = async (
    params: { symbol: string; status: boolean },
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: POST,
      endpoint: FUTURES_POSITION_AUTO_DEPOSIT_STATUS_EP,
      callback
    });
  };

  futuresPositionMargin = async (
    params: {
      symbol: string;
      margin: number;
      bizNo?: string;
    },
    callback?: Function
  ) => {
    const { symbol, margin, bizNo } = params;
    const makeBizNo = bizNo || uuidV4();
    return this.makeRequest({
      body: { symbol, margin, bizNo: makeBizNo },
      method: POST,
      endpoint: FUTURES_POSITION_MARGIN_EP,
      callback
    });
  };

  futuresRiskLimit = async (symbol?: string, callback?: Function) => {
    return this.makeRequest({
      body: symbol,
      method: GET,
      endpoint: FUTURES_RISK_LIMIT_EP,
      callback
    });
  };

  futuresChangeRiskLimit = async (
    params: {
      symbol: string;
      level: number;
    },
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: POST,
      endpoint: FUTURES_CHANGE_RISK_LIMIT_EP,
      callback
    });
  };

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
  futuresFundingHistory = async (
    params?: FundingHistoryParams,
    callback?: Function
  ) => {
    return this.makeRequest({
      body: params,
      method: GET,
      endpoint: FUTURES_FUNDING_HISTORY_EP,
      callback
    });
  };

  futuresContractsActive = async (callback?: Function) => {
    return this.makeRequest({
      method: GET,
      endpoint: FUTURES_CONTRACTS_ACTIVE_EP,
      callback,
      isPrivate: false
    });
  };

  futuresContractDetail = async (symbol: string, callback?: Function) => {
    if (!symbol) {
      console.log('Required Parameter. Symbol of the contract');
      return false;
    }
    return this.makeRequest({
      body: symbol,
      method: GET,
      endpoint: FUTURES_CONTRACTS_DETAIL_EP,
      callback,
      isPrivate: false
    });
  };

  futuresTicker = async (symbol: string, callback?: Function) => {
    return this.makeRequest({
      body: { symbol },
      method: GET,
      endpoint: FUTURES_TICKER_EP,
      callback
    });
  };

  futuresLevel2 = async (symbol: string, callback?: Function) => {
    return this.makeRequest({
      body: { symbol },
      method: GET,
      endpoint: FUTURES_LEVEL2_EP,
      callback,
      isPrivate: false
    });
  };

  futuresLevel2Depth20 = async (symbol: string, callback?: Function) => {
    return this.makeRequest({
      body: { symbol },
      method: GET,
      endpoint: FUTURES_LEVEL2_20_EP,
      callback,
      isPrivate: false
    });
  };

  futuresLevel2Depth100 = async (symbol: string, callback?: Function) => {
    return this.makeRequest({
      body: { symbol },
      method: GET,
      endpoint: FUTURES_LEVEL2_100_EP,
      callback,
      isPrivate: false
    });
  };

  futuresTradeHistory = async (symbol: string, callback?: Function) => {
    return this.makeRequest({
      body: { symbol },
      method: GET,
      endpoint: FUTURES_TRADE_HISTORY_EP,
      callback,
      isPrivate: false
    });
  };

  futuresTimestamp = async (callback?: Function) => {
    return this.makeRequest({
      method: GET,
      endpoint: FUTURES_TIMESTAMP_EP,
      callback,
      isPrivate: false
    });
  };

  futuresStatus = async (callback?: Function) => {
    return this.makeRequest({
      method: GET,
      endpoint: FUTURES_SERVICE_STATUS_EP,
      callback,
      isPrivate: false
    });
  };

  /**
   * search to kline
   * @param params.symbol -- string symbol
   * @param params.granularity -- number
   * @param params.form -- timestamp
   * @param params.to -- boolean
   */
  futuresKline = async (params: klineParams, callback?: Function) => {
    return this.makeRequest({
      body: params,
      method: GET,
      endpoint: FUTURES_KLINE_EP,
      callback,
      isPrivate: false
    });
  };

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
  futuresInterests = async (params?: IndexListParams, callback?: Function) => {
    return this.makeRequest({
      body: params,
      method: GET,
      endpoint: FUTURES_INTEREST_EP,
      callback,
      isPrivate: false
    });
  };

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
  futuresIndexList = async (params?: IndexListParams, callback?: Function) => {
    return this.makeRequest({
      body: params,
      method: GET,
      endpoint: FUTURES_INDEX_EP,
      callback,
      isPrivate: false
    });
  };

  futuresMarkPrice = async (symbol: string, callback?: Function) => {
    return this.makeRequest({
      method: GET,
      endpoint: `${FUTURES_MARK_PRICE_EP}/${symbol}/current`,
      callback,
      isPrivate: false
    });
  };

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
  futuresPremiums = async (params?: IndexListParams, callback?: Function) => {
    return this.makeRequest({
      body: params,
      method: GET,
      endpoint: FUTURES_PREMIUM_EP,
      callback,
      isPrivate: false
    });
  };

  futuresFundingRate = async (symbol: string, callback?: Function) => {
    return this.makeRequest({
      method: GET,
      endpoint: `${FUTURES_FUNDING_RATE_EP}/${symbol}/current`,
      callback,
      isPrivate: false
    });
  };

  futuresGetSocketInstance = async (isPrivate: boolean) => {
    const {
      data: { instanceServers, token }
    } = await this.makeRequest({
      method: POST,
      endpoint: isPrivate ? PRIVATE_BULLET_EP : PUBLIC_BULLET_EP,
      isPrivate
    });
    const wssUri = `${instanceServers[0].endpoint}?token=${token}&acceptUserMessage=true&connectId=${CONNECT_ID}`;
    const websocket = new WebSocket(wssUri);
    const socketInstance = new WebSocketClient(wssUri, websocket);
    return socketInstance;
  };

  futuresGetCacheSocketInstance = async (
    isPrivate: boolean
  ): Promise<WebSocketClient> => {
    const key = `futures_${isPrivate}`;
    if (!this.socketInstanceCache.has(key)) {
      this.socketInstanceCache.set(
        key,
        this.futuresGetSocketInstance(isPrivate)
      );
    }
    return this.socketInstanceCache.get(key);
  };

  futuresSocketSubscribe = async (
    topic: string,
    callback: Callback = log,
    isPrivate: boolean = false,
    strict: boolean = true
  ) => {
    if (!topic) {
      console.log('Required parameter topic');
      return false;
    }
    this.futuresGetCacheSocketInstance(isPrivate)
      .then((socketInstance) => {
        return socketInstance.subscribe(topic, callback, isPrivate, strict);
      })
      .catch((err) => {
        console.log(`execute ${topic} error: ${JSON.stringify(err)}`);
        return false;
      });
  };

  get websocket() {
    const _this = this;

    async function makeSubscribe(
      symbols: string | [],
      topic: string,
      callback = log,
      privateChannel = false
    ) {
      if (Array.isArray(symbols)) {
        const symbolSplit = splitArray(symbols);
        const subscribeList = map(symbolSplit, (symbolStr) => {
          if (symbolStr) {
            return _this.futuresSocketSubscribe(
              `${topic}:${symbolStr}`,
              callback,
              privateChannel,
              false
            );
          }
        });
        return await Promise.all(subscribeList);
      } else if (symbols) {
        return await _this.futuresSocketSubscribe(
          `${topic}:${symbols}`,
          callback,
          privateChannel
        );
      }
      return await _this.futuresSocketSubscribe(
        topic,
        callback,
        privateChannel
      );
    }

    /* === public socket === */
    async function tickerV2(symbols: string | [], callback = log) {
      return await makeSubscribe(symbols, TICKER_V2, callback);
    }

    async function ticker(symbols: string | [], callback = log) {
      return await makeSubscribe(symbols, TICKER, callback);
    }

    async function level2(symbols: string | [], callback = log) {
      return await makeSubscribe(symbols, LEVEL2, callback);
    }

    async function execution(symbols: string | [], callback = log) {
      return await makeSubscribe(symbols, EXECUTION, callback);
    }

    async function level2Depth5(symbols: string | [], callback = log) {
      return await makeSubscribe(symbols, LEVEL2_DEPTH5, callback);
    }

    async function level2Depth50(symbols: string | [], callback = log) {
      return await makeSubscribe(symbols, LEVEL2_DEPTH50, callback);
    }

    async function instrument(symbols: string | [], callback = log) {
      return await makeSubscribe(symbols, INSTRUMENT, callback);
    }

    async function announcement(callback = log) {
      return await _this.futuresSocketSubscribe(ANNOUNCEMENT, callback, false);
    }

    async function snapshot(symbols: string | [], callback = log) {
      return await makeSubscribe(symbols, SNAPSHOT, callback);
    }

    /* === private socket === */
    async function tradeOrders(symbols: string | [], callback = log) {
      return await makeSubscribe(symbols, TRADE_ORDERS, callback, true);
    }

    async function advancedOrders(callback = log) {
      return await _this.futuresSocketSubscribe(ADVANCE_ORDERS, callback, true);
    }

    async function wallet(callback = log) {
      return await _this.futuresSocketSubscribe(WALLET, callback, true);
    }

    async function position(symbols: string | [], callback = log) {
      return await makeSubscribe(symbols, POSITION, callback, true);
    }

    return {
      tickerV2,
      ticker,
      level2,
      execution,
      level2Depth5,
      level2Depth50,
      instrument,
      announcement,
      snapshot,
      tradeOrders,
      advancedOrders,
      wallet,
      position
    };
  }
}
