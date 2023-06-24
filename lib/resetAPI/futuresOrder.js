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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFuturesOrderBody = exports.OPTIONAL_PARAMS = exports.TIME_IN_FORCE_TYPES = exports.STOP_PRICE_TYPES = exports.STOP_TYPES = void 0;
var pick_1 = __importDefault(require("lodash/pick"));
var constants_1 = require("./constants");
exports.STOP_TYPES = ['down', 'up'];
exports.STOP_PRICE_TYPES = ['TP', 'IP', 'MP'];
exports.TIME_IN_FORCE_TYPES = ['GTC', 'IOC'];
exports.OPTIONAL_PARAMS = [
    'type',
    'remark',
    'stop',
    'stopPriceType',
    'stopPrice',
    'reduceOnly',
    'closeOrder',
    'forceHold',
    'timeInForce',
    'postOnly',
    'hidden',
    'iceberg',
    'visibleSize'
];
var LIMIT = 'limit';
var MARKET = 'market';
/**
 * create order-(buy|sell) body
 * @param side
 * @param symbol
 * @param size
 * @param price
 * @param leverage
 * @param optional
 */
var makeFuturesOrderBody = function (_a) {
    var side = _a.side, symbol = _a.symbol, size = _a.size, price = _a.price, _b = _a.leverage, leverage = _b === void 0 ? 1 : _b, clientOid = _a.clientOid, _c = _a.optional, optional = _c === void 0 ? {} : _c;
    if (!size || !(size % 1 === 0)) {
        throw new TypeError('The order size must be an integer!');
    }
    var type = LIMIT;
    if (!price) {
        type = MARKET;
    }
    var stop = optional.stop, stopPriceType = optional.stopPriceType, stopPrice = optional.stopPrice, _d = optional.timeInForce, timeInForce = _d === void 0 ? 'GTC' : _d, postOnly = optional.postOnly, _e = optional.hidden, hidden = _e === void 0 ? false : _e, _f = optional.iceberg, iceberg = _f === void 0 ? false : _f, other = __rest(optional, ["stop", "stopPriceType", "stopPrice", "timeInForce", "postOnly", "hidden", "iceberg"]);
    var body = __assign({ side: side, symbol: symbol, type: type, size: size, leverage: leverage, clientOid: clientOid }, (0, pick_1.default)(other, exports.OPTIONAL_PARAMS));
    if (stop) {
        if (!exports.STOP_TYPES.includes(stop)) {
            throw new RangeError('The value of stop is not accepted, must be (down | up).');
        }
        if (!stopPriceType || !stopPrice) {
            throw new TypeError('To set the stop attribute, you must set the stopPrice and stopPriceType parameters.');
        }
        if (!exports.STOP_PRICE_TYPES.includes(stopPriceType)) {
            throw new RangeError('The value of stopPriceType is not accepted, must be (TP | IP | MP).');
        }
        body = __assign(__assign({}, body), { stop: stop, stopPriceType: stopPriceType, stopPrice: stopPrice });
    }
    if (type === LIMIT || optional.type === LIMIT) {
        if (!exports.TIME_IN_FORCE_TYPES.includes(timeInForce)) {
            throw new RangeError('The value of timeInForce is not accepted, must be (GTC | IOC).');
        }
        if (timeInForce === 'IOC' || hidden || iceberg) {
            body = __assign(__assign({}, body), { timeInForce: timeInForce, hidden: hidden, iceberg: iceberg });
        }
        else {
            body = __assign(__assign({ price: price }, body), { timeInForce: timeInForce, postOnly: postOnly });
        }
    }
    return body;
};
exports.makeFuturesOrderBody = makeFuturesOrderBody;
/**
 * return futures order make body and endpoint
 * @param {any} params。
 * @param {string} method - DEFAULT 'GET'。
 * @returns {Object} return { body, endpoint }。
 */
var returnBodyAndEndpoint = function (params, method) {
    if (method === void 0) { method = 'GET'; }
    var endpoint = constants_1.FUTURES_ORDER_EP;
    var body = params;
    switch (method) {
        case 'POST': {
            if (typeof params === 'object') {
                var side = params.side, symbol = params.symbol, size = params.size, price = params.price, leverage = params.leverage, clientOid = params.clientOid, optional = params.optional;
                body = (0, exports.makeFuturesOrderBody)({
                    side: side,
                    symbol: symbol,
                    size: size,
                    price: price,
                    leverage: leverage,
                    clientOid: clientOid,
                    optional: optional
                });
            }
            break;
        }
        case 'DELETE': {
            if (params && typeof params === 'string') {
                endpoint = "".concat(endpoint, "/").concat(params);
                body = '';
            }
            break;
        }
        case 'GET': {
            if (typeof params === 'object' && params.clientOid) {
                endpoint = "".concat(endpoint, "/byClientOid");
            }
            break;
        }
    }
    return { body: body, endpoint: endpoint };
};
exports.default = returnBodyAndEndpoint;
