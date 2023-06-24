"use strict";
// Apply for Connection Token
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSITION = exports.WALLET = exports.ADVANCE_ORDERS = exports.TRADE_ORDERS = exports.EXECUTION = exports.SNAPSHOT = exports.ANNOUNCEMENT = exports.INSTRUMENT = exports.LEVEL2_DEPTH50 = exports.LEVEL2_DEPTH5 = exports.LEVEL2 = exports.TICKER = exports.TICKER_V2 = exports.CONNECT_ID = exports.PRIVATE_BULLET_EP = exports.PUBLIC_BULLET_EP = void 0;
exports.PUBLIC_BULLET_EP = '/api/v1/bullet-public';
exports.PRIVATE_BULLET_EP = '/api/v1/bullet-private';
exports.CONNECT_ID = '_futures_socket_welcome';
// public socket topic
exports.TICKER_V2 = '/contractMarket/tickerV2';
exports.TICKER = '/contractMarket/ticker';
exports.LEVEL2 = '/contractMarket/level2';
exports.LEVEL2_DEPTH5 = '/contractMarket/level2Depth5';
exports.LEVEL2_DEPTH50 = '/contractMarket/level2Depth50';
exports.INSTRUMENT = '/contract/instrument';
exports.ANNOUNCEMENT = '/contract/announcement';
exports.SNAPSHOT = '/contractMarket/snapshot';
exports.EXECUTION = '/contractMarket/execution';
// private socket topic
exports.TRADE_ORDERS = '/contractMarket/tradeOrders';
exports.ADVANCE_ORDERS = '/contractMarket/advancedOrders';
exports.WALLET = '/contractAccount/wallet';
exports.POSITION = '/contract/position';
