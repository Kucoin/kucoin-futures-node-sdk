"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FUTURES_ALL_TICKER_TP = exports.FUTURES_TRADE_STATISTICS_EP = exports.FUTURES_KLINE_EP = exports.FUTURES_SERVICE_STATUS_EP = exports.FUTURES_TIMESTAMP_EP = exports.FUTURES_PREMIUM_EP = exports.FUTURES_MARK_PRICE_EP = exports.FUTURES_INDEX_EP = exports.FUTURES_INTEREST_EP = exports.FUTURES_TRADE_HISTORY_EP = exports.FUTURES_LEVEL2_100_EP = exports.FUTURES_LEVEL2_20_EP = exports.FUTURES_LEVEL2_EP = exports.FUTURES_TICKER_EP = exports.FUTURES_CONTRACTS_DETAIL_EP = exports.FUTURES_CONTRACTS_ACTIVE_EP = exports.FUTURES_TRADE_FEE_EP = exports.FUTURES_FUNDING_RATES_EP = exports.FUTURES_FUNDING_HISTORY_EP = exports.FUTURES_FUNDING_RATE_EP = exports.FUTURES_CHANGE_RISK_LIMIT_EP = exports.FUTURES_RISK_LIMIT_EP = exports.FUTURES_MAX_OPEN_POSITIONS_EP = exports.FUTURES_HISTORY_POSITIONS_EP = exports.FUTURES_WITHDRAW_MARGIN_EP = exports.FUTURES_MAX_WITHDRAW_MARGIN_EP = exports.FUTURES_POSITION_MARGIN_EP = exports.FUTURES_POSITION_AUTO_DEPOSIT_STATUS_EP = exports.FUTURES_POSITIONS_EP = exports.FUTURES_POSITION_EP = exports.FUTURES_TOTAL_OPEN_ORDERS_MARGIN_EP = exports.FUTURES_RECENT_FILLS_EP = exports.FUTURES_FILLS_EP = exports.FUTURES_ORDER_MULTI_EP = exports.FUTURES_ORDER_TEST_EP = exports.FUTURES_ORDER_CLIENT_ORDER_EP = exports.FUTURES_RECENT_DONE_ORDERS_EP = exports.FUTURES_STOP_ORDER_EP = exports.FUTURES_ORDER_EP = exports.FUTURES_TRANSFER_LIST_EP = exports.FUTURES_TRANSFER_IN_EP = exports.FUTURES_TRANSFER_OUT_EP = exports.FUTURES_UPDATE_SUB_API_EP = exports.FUTURES_SUB_API_EP = exports.FUTURES_TRANSACTION_HISTORY_EP = exports.FUTURES_ACCOUNT_OVERVIEW_ALL_EP = exports.FUTURES_ACCOUNT_OVERVIEW_EP = void 0;
// account endpoint
exports.FUTURES_ACCOUNT_OVERVIEW_EP = '/api/v1/account-overview';
exports.FUTURES_ACCOUNT_OVERVIEW_ALL_EP = '/api/v1/account-overview-all';
exports.FUTURES_TRANSACTION_HISTORY_EP = '/api/v1/transaction-history';
exports.FUTURES_SUB_API_EP = '/api/v1/sub/api-key';
exports.FUTURES_UPDATE_SUB_API_EP = '/api/v1/sub/api-key/update';
// transfer endpoint
exports.FUTURES_TRANSFER_OUT_EP = '/api/v3/transfer-out';
exports.FUTURES_TRANSFER_IN_EP = '/api/v1/transfer-in';
exports.FUTURES_TRANSFER_LIST_EP = '/api/v1/transfer-list';
// order endpoint
exports.FUTURES_ORDER_EP = '/api/v1/orders';
exports.FUTURES_STOP_ORDER_EP = '/api/v1/stopOrders';
exports.FUTURES_RECENT_DONE_ORDERS_EP = '/api/v1/recentDoneOrders';
exports.FUTURES_ORDER_CLIENT_ORDER_EP = '/api/v1/orders/client-order';
exports.FUTURES_ORDER_TEST_EP = '/api/v1/orders/test';
exports.FUTURES_ORDER_MULTI_EP = '/api/v1/orders/multi';
// fills endpoint
exports.FUTURES_FILLS_EP = '/api/v1/fills';
exports.FUTURES_RECENT_FILLS_EP = '/api/v1/recentFills';
exports.FUTURES_TOTAL_OPEN_ORDERS_MARGIN_EP = '/api/v1/openOrderStatistics';
// position endpoint
exports.FUTURES_POSITION_EP = '/api/v1/position';
exports.FUTURES_POSITIONS_EP = '/api/v1/positions';
exports.FUTURES_POSITION_AUTO_DEPOSIT_STATUS_EP = '/api/v1/position/margin/auto-deposit-status';
exports.FUTURES_POSITION_MARGIN_EP = '/api/v1/position/margin/deposit-margin';
exports.FUTURES_MAX_WITHDRAW_MARGIN_EP = '/api/v1/margin/maxWithdrawMargin';
exports.FUTURES_WITHDRAW_MARGIN_EP = '/api/v1/margin/withdrawMargin';
exports.FUTURES_HISTORY_POSITIONS_EP = '/api/v1/history-positions';
exports.FUTURES_MAX_OPEN_POSITIONS_EP = '/api/v2/getMaxOpenSize';
// risk limit endpoint
exports.FUTURES_RISK_LIMIT_EP = '/api/v1/contracts/risk-limit';
exports.FUTURES_CHANGE_RISK_LIMIT_EP = '/api/v1/position/risk-limit-level/change';
// funding fees endpoint
exports.FUTURES_FUNDING_RATE_EP = '/api/v1/funding-rate';
exports.FUTURES_FUNDING_HISTORY_EP = '/api/v1/funding-history';
exports.FUTURES_FUNDING_RATES_EP = '/api/v1/contract/funding-rates';
// trading fees endpoint
exports.FUTURES_TRADE_FEE_EP = '/api/v1/trade-fees';
// market endpoint
exports.FUTURES_CONTRACTS_ACTIVE_EP = '/api/v1/contracts/active';
exports.FUTURES_CONTRACTS_DETAIL_EP = 'api/v1/contracts';
exports.FUTURES_TICKER_EP = '/api/v1/ticker';
exports.FUTURES_LEVEL2_EP = '/api/v1/level2/snapshot';
exports.FUTURES_LEVEL2_20_EP = '/api/v1/level2/depth20';
exports.FUTURES_LEVEL2_100_EP = '/api/v1/level2/depth100';
exports.FUTURES_TRADE_HISTORY_EP = '/api/v1/trade/history';
exports.FUTURES_INTEREST_EP = '/api/v1/interest/query';
exports.FUTURES_INDEX_EP = '/api/v1/index/query';
exports.FUTURES_MARK_PRICE_EP = '/api/v1/mark-price';
exports.FUTURES_PREMIUM_EP = '/api/v1/premium/query';
exports.FUTURES_TIMESTAMP_EP = '/api/v1/timestamp';
exports.FUTURES_SERVICE_STATUS_EP = '/api/v1/status';
exports.FUTURES_KLINE_EP = '/api/v1/kline/query';
exports.FUTURES_TRADE_STATISTICS_EP = '/api/v1/trade-statistics';
exports.FUTURES_ALL_TICKER_TP = '/api/v1/allTickers';
