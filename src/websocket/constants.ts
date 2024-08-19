// Apply for Connection Token

export const PUBLIC_BULLET_EP = '/api/v1/bullet-public';
export const PRIVATE_BULLET_EP = '/api/v1/bullet-private';

export const CONNECT_ID = '_futures_socket_welcome';

// public socket topic
export const TICKER_V2 = '/contractMarket/tickerV2';
export const TICKER = '/contractMarket/ticker';
export const LEVEL2 = '/contractMarket/level2';
export const LEVEL2_DEPTH5 = '/contractMarket/level2Depth5';
export const LEVEL2_DEPTH50 = '/contractMarket/level2Depth50';
export const INSTRUMENT = '/contract/instrument';
export const ANNOUNCEMENT = '/contract/announcement';
export const SNAPSHOT = '/contractMarket/snapshot';
export const EXECUTION = '/contractMarket/execution';
export const KLINE_CANDLE = '/contractMarket/limitCandle';


// private socket topic
export const TRADE_ORDERS = '/contractMarket/tradeOrders';
export const ADVANCE_ORDERS = '/contractMarket/advancedOrders';
export const WALLET = '/contractAccount/wallet';
export const POSITION = '/contract/position';
export const POSITION_ALL = '/contract/positionAll';