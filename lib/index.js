"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var lodash_1 = require("lodash");
var ws_1 = __importDefault(require("ws"));
var request_1 = __importDefault(require("./tools/request"));
var tools_1 = require("./tools/tools");
var resetAPI_1 = require("./resetAPI");
var websocket_1 = require("./websocket");
var constants_1 = require("./tools/constants");
var tools_2 = require("./tools/tools");
var websocket_2 = require("./websocket");
var KuCoinFutures = /** @class */ (function () {
    function KuCoinFutures(props) {
        var _this_1 = this;
        this.socketInstanceCache = new Map();
        this.makeRequest = function (_a) {
            var _b = _a.body, body = _b === void 0 ? '' : _b, method = _a.method, endpoint = _a.endpoint, callback = _a.callback, _c = _a.isPrivate, isPrivate = _c === void 0 ? true : _c;
            return __awaiter(_this_1, void 0, void 0, function () {
                var params, data, _d, err_1;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 5, , 6]);
                            params = (0, tools_2.filterEmptyValues)(body);
                            if (!isPrivate) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.request.signatureRequest(endpoint, params, method)];
                        case 1:
                            _d = _e.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.request.requestPublic(endpoint, params, method)];
                        case 3:
                            _d = _e.sent();
                            _e.label = 4;
                        case 4:
                            data = _d;
                            if (callback) {
                                return [2 /*return*/, callback(data)];
                            }
                            else {
                                return [2 /*return*/, data];
                            }
                            return [3 /*break*/, 6];
                        case 5:
                            err_1 = _e.sent();
                            console.log(err_1);
                            return [2 /*return*/, err_1];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        this.futuresAccount = function (currency, callback) {
            if (currency === void 0) { currency = 'XBT'; }
            return __awaiter(_this_1, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.makeRequest({
                            body: { currency: currency },
                            method: constants_1.GET,
                            endpoint: resetAPI_1.FUTURES_ACCOUNT_OVERVIEW_EP,
                            callback: callback
                        })];
                });
            });
        };
        this.futuresAccountOverview = function (currency, callback) {
            if (currency === void 0) { currency = 'XBT'; }
            return __awaiter(_this_1, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.makeRequest({
                            body: { currency: currency },
                            method: constants_1.GET,
                            endpoint: resetAPI_1.FUTURES_ACCOUNT_OVERVIEW_ALL_EP,
                            callback: callback
                        })];
                });
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
        this.futuresTransactionHistory = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_TRANSACTION_HISTORY_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresSubApi = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_SUB_API_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresCreateSubApi = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.POST,
                        endpoint: resetAPI_1.FUTURES_SUB_API_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresUpdateSubApi = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.POST,
                        endpoint: resetAPI_1.FUTURES_UPDATE_SUB_API_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futureDeleteSubApi = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.DELETE,
                        endpoint: resetAPI_1.FUTURES_UPDATE_SUB_API_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futureTransferOut = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.POST,
                        endpoint: resetAPI_1.FUTURES_TRANSFER_OUT_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futureTransferIn = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.POST,
                        endpoint: resetAPI_1.FUTURES_TRANSFER_IN_EP,
                        callback: callback
                    })];
            });
        }); };
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
        this.futureTransfers = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.POST,
                        endpoint: resetAPI_1.FUTURES_TRANSFER_LIST_EP,
                        callback: callback
                    })];
            });
        }); };
        this.order = function (params, method, callback) {
            if (method === void 0) { method = constants_1.GET; }
            return __awaiter(_this_1, void 0, void 0, function () {
                var _a, body, endpoint;
                return __generator(this, function (_b) {
                    _a = (0, resetAPI_1.returnBodyAndEndpoint)(params, method), body = _a.body, endpoint = _a.endpoint;
                    return [2 /*return*/, this.makeRequest({ body: body, method: method, endpoint: endpoint, callback: callback })];
                });
            });
        };
        this.orderTest = function (params, method, callback) {
            if (method === void 0) { method = constants_1.GET; }
            return __awaiter(_this_1, void 0, void 0, function () {
                var _a, body, endpoint;
                return __generator(this, function (_b) {
                    _a = (0, resetAPI_1.returnBodyAndEndpoint)(params, method, true), body = _a.body, endpoint = _a.endpoint;
                    return [2 /*return*/, this.makeRequest({ body: body, method: method, endpoint: endpoint, callback: callback })];
                });
            });
        };
        this.stopOrder = function (params, method, callback) {
            if (method === void 0) { method = constants_1.GET; }
            return __awaiter(_this_1, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.makeRequest({
                            body: params,
                            method: method,
                            endpoint: resetAPI_1.FUTURES_STOP_ORDER_EP,
                            callback: callback
                        })];
                });
            });
        };
        this.futuresBuy = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            var price, symbol, size, _a, leverage, _b, clientOid, optional;
            return __generator(this, function (_c) {
                price = params.price, symbol = params.symbol, size = params.size, _a = params.leverage, leverage = _a === void 0 ? 1 : _a, _b = params.clientOid, clientOid = _b === void 0 ? (0, uuid_1.v4)() : _b, optional = params.optional;
                if (!symbol) {
                    throw new TypeError('Order buy symbol must be set!');
                }
                return [2 /*return*/, this.order({ side: 'buy', price: price, symbol: symbol, size: size, leverage: leverage, clientOid: clientOid, optional: optional }, constants_1.POST, callback)];
            });
        }); };
        this.futuresSell = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            var price, symbol, size, _a, leverage, _b, clientOid, optional;
            return __generator(this, function (_c) {
                price = params.price, symbol = params.symbol, size = params.size, _a = params.leverage, leverage = _a === void 0 ? 1 : _a, _b = params.clientOid, clientOid = _b === void 0 ? (0, uuid_1.v4)() : _b, optional = params.optional;
                if (!symbol) {
                    throw new TypeError('Order sell symbol must be set!');
                }
                return [2 /*return*/, this.order({ side: 'sell', price: price, symbol: symbol, size: size, leverage: leverage, clientOid: clientOid, optional: optional }, constants_1.POST, callback)];
            });
        }); };
        // Place Order Test, After placing an order, the order will not enter the matching system, and the order cannot be queried.
        this.futuresBuyTest = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            var price, symbol, size, _a, leverage, _b, clientOid, optional;
            return __generator(this, function (_c) {
                price = params.price, symbol = params.symbol, size = params.size, _a = params.leverage, leverage = _a === void 0 ? 1 : _a, _b = params.clientOid, clientOid = _b === void 0 ? (0, uuid_1.v4)() : _b, optional = params.optional;
                if (!symbol) {
                    throw new TypeError('Order buy symbol must be set!');
                }
                return [2 /*return*/, this.orderTest({ side: 'buy', price: price, symbol: symbol, size: size, leverage: leverage, clientOid: clientOid, optional: optional }, constants_1.POST, callback)];
            });
        }); };
        // Place Order Test, After placing an order, the order will not enter the matching system, and the order cannot be queried.
        this.futuresSellTest = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            var price, symbol, size, _a, leverage, _b, clientOid, optional;
            return __generator(this, function (_c) {
                price = params.price, symbol = params.symbol, size = params.size, _a = params.leverage, leverage = _a === void 0 ? 1 : _a, _b = params.clientOid, clientOid = _b === void 0 ? (0, uuid_1.v4)() : _b, optional = params.optional;
                if (!symbol) {
                    throw new TypeError('Order sell symbol must be set!');
                }
                return [2 /*return*/, this.orderTest({ side: 'sell', price: price, symbol: symbol, size: size, leverage: leverage, clientOid: clientOid, optional: optional }, constants_1.POST, callback)];
            });
        }); };
        this.futuresOrderMulti = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.POST,
                        endpoint: resetAPI_1.FUTURES_ORDER_MULTI_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresCancel = function (orderId, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.order(orderId, constants_1.DELETE, callback)];
            });
        }); };
        this.futuresCancelAllOpenOrders = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.order({ symbol: symbol }, constants_1.DELETE, callback)];
            });
        }); };
        this.futuresCancelAllStopOrders = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stopOrder({ symbol: symbol }, constants_1.DELETE, callback)];
            });
        }); };
        this.futuresCancelAll = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            var cancelAllOpenOrders, cancelAllStopOrders;
            return __generator(this, function (_a) {
                cancelAllOpenOrders = this.futuresCancelAllOpenOrders(symbol, callback);
                cancelAllStopOrders = this.futuresCancelAllStopOrders(symbol, callback);
                return [2 /*return*/, Promise.all([cancelAllOpenOrders, cancelAllStopOrders])];
            });
        }); };
        this.futuresCancelOrderByClientOid = function (symbol, clientOid, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: '',
                        method: constants_1.DELETE,
                        endpoint: "".concat(resetAPI_1.FUTURES_ORDER_CLIENT_ORDER_EP, "/").concat(clientOid, "?symbol=").concat(symbol),
                        callback: callback
                    })];
            });
        }); };
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
        this.futuresOpenOrders = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.order(params, constants_1.GET, callback)];
            });
        }); };
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
        this.futuresStopOrders = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stopOrder(params, constants_1.GET, callback)];
            });
        }); };
        this.futuresRecentDoneOrders = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: { symbol: symbol },
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_RECENT_DONE_ORDERS_EP,
                        callback: callback
                    })];
            });
        }); };
        /**
         * search to order detail
         * @param params -- string orderId || object { clientOid }
         * @param callback -- callback function
         */
        this.futuresOrderDetail = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.order(params, constants_1.GET, callback)];
            });
        }); };
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
        this.futuresFills = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_FILLS_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresRecentFills = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: { symbol: symbol },
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_RECENT_FILLS_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresMarginOpenOrders = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!symbol) {
                    console.error('Required String parameter symbol');
                    return [2 /*return*/];
                }
                return [2 /*return*/, this.makeRequest({
                        body: { symbol: symbol },
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_TOTAL_OPEN_ORDERS_MARGIN_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresPositionDetail = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: { symbol: symbol },
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_POSITION_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresPositions = function (currency, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: { currency: currency },
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_POSITIONS_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresPositionAutoDeposit = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.POST,
                        endpoint: resetAPI_1.FUTURES_POSITION_AUTO_DEPOSIT_STATUS_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresPositionMargin = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            var symbol, margin, bizNo, makeBizNo;
            return __generator(this, function (_a) {
                symbol = params.symbol, margin = params.margin, bizNo = params.bizNo;
                makeBizNo = bizNo || (0, uuid_1.v4)();
                return [2 /*return*/, this.makeRequest({
                        body: { symbol: symbol, margin: margin, bizNo: makeBizNo },
                        method: constants_1.POST,
                        endpoint: resetAPI_1.FUTURES_POSITION_MARGIN_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresRiskLimit = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: symbol,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_RISK_LIMIT_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresChangeRiskLimit = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.POST,
                        endpoint: resetAPI_1.FUTURES_CHANGE_RISK_LIMIT_EP,
                        callback: callback
                    })];
            });
        }); };
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
        this.futuresFundingHistory = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_FUNDING_HISTORY_EP,
                        callback: callback
                    })];
            });
        }); };
        /**
         * search to stop orders list
         * @param params.symbol -- string symbol
         * @param params.startAt -- timestamp
         * @param params.endAt -- timestamp
         * @param callback -- callback function
         */
        this.futuresFundingRates = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_FUNDING_RATES_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresFundingRate = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        method: constants_1.GET,
                        endpoint: "".concat(resetAPI_1.FUTURES_FUNDING_RATE_EP, "/").concat(symbol, "/current"),
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresContractsActive = function (callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_CONTRACTS_ACTIVE_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresContractDetail = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!symbol) {
                    console.log('Required Parameter. Symbol of the contract');
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, this.makeRequest({
                        body: symbol,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_CONTRACTS_DETAIL_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresTicker = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: { symbol: symbol },
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_TICKER_EP,
                        callback: callback
                    })];
            });
        }); };
        this.futuresLevel2 = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: { symbol: symbol },
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_LEVEL2_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresLevel2Depth20 = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: { symbol: symbol },
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_LEVEL2_20_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresLevel2Depth100 = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: { symbol: symbol },
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_LEVEL2_100_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresTradeHistory = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: { symbol: symbol },
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_TRADE_HISTORY_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresTimestamp = function (callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_TIMESTAMP_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresStatus = function (callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_SERVICE_STATUS_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        /**
         * search to kline
         * @param params.symbol -- string symbol
         * @param params.granularity -- number
         * @param params.form -- timestamp
         * @param params.to -- boolean
         */
        this.futuresKline = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_KLINE_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresTradeStatistics = function (callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_TRADE_STATISTICS_EP,
                        callback: callback
                    })];
            });
        }); };
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
        this.futuresInterests = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_INTEREST_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
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
        this.futuresIndexList = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_INDEX_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresMarkPrice = function (symbol, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        method: constants_1.GET,
                        endpoint: "".concat(resetAPI_1.FUTURES_MARK_PRICE_EP, "/").concat(symbol, "/current"),
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
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
        this.futuresPremiums = function (params, callback) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeRequest({
                        body: params,
                        method: constants_1.GET,
                        endpoint: resetAPI_1.FUTURES_PREMIUM_EP,
                        callback: callback,
                        isPrivate: false
                    })];
            });
        }); };
        this.futuresGetSocketInstance = function (isPrivate) { return __awaiter(_this_1, void 0, void 0, function () {
            var _a, instanceServers, token, wssUri, websocket, socketInstance;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.makeRequest({
                            method: constants_1.POST,
                            endpoint: isPrivate ? websocket_1.PRIVATE_BULLET_EP : websocket_1.PUBLIC_BULLET_EP,
                            isPrivate: isPrivate
                        })];
                    case 1:
                        _a = (_b.sent()).data, instanceServers = _a.instanceServers, token = _a.token;
                        wssUri = "".concat(instanceServers[0].endpoint, "?token=").concat(token, "&acceptUserMessage=true&connectId=").concat(websocket_2.CONNECT_ID);
                        websocket = new ws_1.default(wssUri);
                        socketInstance = new websocket_2.WebSocketClient(wssUri, websocket);
                        return [2 /*return*/, socketInstance];
                }
            });
        }); };
        this.futuresGetCacheSocketInstance = function (isPrivate) { return __awaiter(_this_1, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                key = "futures_".concat(isPrivate);
                if (!this.socketInstanceCache.has(key)) {
                    this.socketInstanceCache.set(key, this.futuresGetSocketInstance(isPrivate));
                }
                return [2 /*return*/, this.socketInstanceCache.get(key)];
            });
        }); };
        this.futuresSocketSubscribe = function (topic, callback, isPrivate, strict) {
            if (callback === void 0) { callback = tools_2.log; }
            if (isPrivate === void 0) { isPrivate = false; }
            if (strict === void 0) { strict = true; }
            return __awaiter(_this_1, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!topic) {
                        console.log('Required parameter topic');
                        return [2 /*return*/, false];
                    }
                    this.futuresGetCacheSocketInstance(isPrivate)
                        .then(function (socketInstance) {
                        return socketInstance.subscribe(topic, callback, isPrivate, strict);
                    })
                        .catch(function (err) {
                        console.log("execute ".concat(topic, " error: ").concat(JSON.stringify(err)));
                        return false;
                    });
                    return [2 /*return*/];
                });
            });
        };
        var _a = props || {}, key = _a.key, secret = _a.secret, passphrase = _a.passphrase, _b = _a.axiosProps, axiosProps = _b === void 0 ? {} : _b;
        this.request = new request_1.default(__assign({ key: key, secret: secret, passphrase: passphrase }, axiosProps));
    }
    Object.defineProperty(KuCoinFutures.prototype, "websocket", {
        get: function () {
            var _this = this;
            function makeSubscribe(symbols, topic, callback, privateChannel) {
                if (callback === void 0) { callback = tools_2.log; }
                if (privateChannel === void 0) { privateChannel = false; }
                return __awaiter(this, void 0, void 0, function () {
                    var symbolSplit, subscribeList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!Array.isArray(symbols)) return [3 /*break*/, 2];
                                symbolSplit = (0, tools_1.splitArray)(symbols);
                                subscribeList = (0, lodash_1.map)(symbolSplit, function (symbolStr) {
                                    if (symbolStr) {
                                        return _this.futuresSocketSubscribe("".concat(topic, ":").concat(symbolStr), callback, privateChannel, false);
                                    }
                                });
                                return [4 /*yield*/, Promise.all(subscribeList)];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2:
                                if (!symbols) return [3 /*break*/, 4];
                                return [4 /*yield*/, _this.futuresSocketSubscribe("".concat(topic, ":").concat(symbols), callback, privateChannel)];
                            case 3: return [2 /*return*/, _a.sent()];
                            case 4: return [4 /*yield*/, _this.futuresSocketSubscribe(topic, callback, privateChannel)];
                            case 5: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            /* === public socket === */
            function tickerV2(symbols, callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, makeSubscribe(symbols, websocket_2.TICKER_V2, callback)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function ticker(symbols, callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, makeSubscribe(symbols, websocket_1.TICKER, callback)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function level2(symbols, callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, makeSubscribe(symbols, websocket_1.LEVEL2, callback)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function execution(symbols, callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, makeSubscribe(symbols, websocket_1.EXECUTION, callback)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function level2Depth5(symbols, callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, makeSubscribe(symbols, websocket_1.LEVEL2_DEPTH5, callback)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function level2Depth50(symbols, callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, makeSubscribe(symbols, websocket_1.LEVEL2_DEPTH50, callback)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function instrument(symbols, callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, makeSubscribe(symbols, websocket_1.INSTRUMENT, callback)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function announcement(callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _this.futuresSocketSubscribe(websocket_1.ANNOUNCEMENT, callback, false)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function snapshot(symbols, callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, makeSubscribe(symbols, websocket_1.SNAPSHOT, callback)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            /* === private socket === */
            function tradeOrders(symbols, callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, makeSubscribe(symbols, websocket_1.TRADE_ORDERS, callback, true)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function advancedOrders(callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _this.futuresSocketSubscribe(websocket_1.ADVANCE_ORDERS, callback, true)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function wallet(callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _this.futuresSocketSubscribe(websocket_1.WALLET, callback, true)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function position(symbols, callback) {
                if (callback === void 0) { callback = tools_2.log; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, makeSubscribe(symbols, websocket_1.POSITION, callback, true)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            return {
                tickerV2: tickerV2,
                ticker: ticker,
                level2: level2,
                execution: execution,
                level2Depth5: level2Depth5,
                level2Depth50: level2Depth50,
                instrument: instrument,
                announcement: announcement,
                snapshot: snapshot,
                tradeOrders: tradeOrders,
                advancedOrders: advancedOrders,
                wallet: wallet,
                position: position
            };
        },
        enumerable: false,
        configurable: true
    });
    return KuCoinFutures;
}());
exports.default = KuCoinFutures;
