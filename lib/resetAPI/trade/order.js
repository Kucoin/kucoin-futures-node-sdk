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
exports.OPTIONAL_PARAMS = exports.TIME_IN_FORCE_TYPES = exports.STOP_PRICE_TYPES = exports.STOP_TYPES = void 0;
var lodash_1 = __importDefault(require("lodash"));
exports.STOP_TYPES = ["down", "up"];
exports.STOP_PRICE_TYPES = ["TP", "IP", "MP"];
exports.TIME_IN_FORCE_TYPES = ["GTC", "IOC"];
exports.OPTIONAL_PARAMS = [
    "type",
    "remark",
    "stop",
    "stopPriceType",
    "stopPrice",
    "reduceOnly",
    "closeOrder",
    "forceHold",
    "timeInForce",
    "postOnly",
    "hidden",
    "iceberg",
    "visibleSize"
];
var LIMIT = "limit";
var MARKET = "market";
/**
 * create order-(buy|sell) body
 * @param side
 * @param symbol
 * @param size
 * @param price
 * @param leverage
 * @param optional
 */
var Order = function (side, symbol, size, price, leverage, optional) {
    if (leverage === void 0) { leverage = 1; }
    if (optional === void 0) { optional = {}; }
    if (!size || !(size % 1 === 0)) {
        throw new TypeError("The order size must be an integer!");
    }
    var type = LIMIT;
    if (!price) {
        type = MARKET;
    }
    var stop = optional.stop, stopPriceType = optional.stopPriceType, stopPrice = optional.stopPrice, _a = optional.timeInForce, timeInForce = _a === void 0 ? "GTC" : _a, postOnly = optional.postOnly, _b = optional.hidden, hidden = _b === void 0 ? false : _b, _c = optional.iceberg, iceberg = _c === void 0 ? false : _c, other = __rest(optional, ["stop", "stopPriceType", "stopPrice", "timeInForce", "postOnly", "hidden", "iceberg"]);
    var body = __assign({ side: side,
        symbol: symbol,
        type: type,
        size: size,
        leverage: leverage }, lodash_1.default.pick(other, exports.OPTIONAL_PARAMS));
    if (stop) {
        if (!exports.STOP_TYPES.includes(stop)) {
            throw new RangeError("The value of stop is not accepted, must be (down | up).");
        }
        if (!stopPriceType || !stopPrice) {
            throw new TypeError("To set the stop attribute, you must set the stopPrice and stopPriceType parameters.");
        }
        if (!exports.STOP_PRICE_TYPES.includes(stopPriceType)) {
            throw new RangeError("The value of stopPriceType is not accepted, must be (TP | IP | MP).");
        }
        body = __assign(__assign({}, body), { stop: stop,
            stopPriceType: stopPriceType,
            stopPrice: stopPrice });
    }
    if (type === LIMIT || optional.type === LIMIT) {
        if (!exports.TIME_IN_FORCE_TYPES.includes(timeInForce)) {
            throw new RangeError("The value of timeInForce is not accepted, must be (GTC | IOC).");
        }
        if (timeInForce === "IOC" || hidden || iceberg) {
            body = __assign(__assign({}, body), { timeInForce: timeInForce,
                hidden: hidden,
                iceberg: iceberg });
        }
        else {
            body = __assign(__assign({}, body), { timeInForce: timeInForce,
                postOnly: postOnly });
        }
    }
    return body;
};
exports.default = Order;
