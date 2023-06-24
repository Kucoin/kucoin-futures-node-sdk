"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.cryptoHmac = exports.splitArray = exports.joinSymbol = exports.filterEmptyValues = exports.makeQueryString = void 0;
var omitBy_1 = __importDefault(require("lodash/omitBy"));
var crypto_1 = __importDefault(require("crypto"));
/**
 * make object query to string
 * @param {object} query
 */
var makeQueryString = function (query) {
    return Object.keys(query)
        .reduce(function (acc, key) {
        if (query[key] !== undefined) {
            acc.push("".concat(key, "=").concat(encodeURIComponent(query[key])));
        }
        return acc;
    }, [])
        .join('&');
};
exports.makeQueryString = makeQueryString;
/**
 * filter empty values
 * @param obj
 * @returns filterObj
 */
var filterEmptyValues = function (obj) {
    if (typeof obj !== 'object')
        return obj;
    var omitValue = (0, omitBy_1.default)(obj, function (value) { return value === null || value === undefined || value === ''; });
    if (!omitValue || !Object.keys(omitValue).length)
        return '';
    return omitValue;
};
exports.filterEmptyValues = filterEmptyValues;
/**
 * make symbol
 * @param symbols
 * @returns string
 */
var joinSymbol = function (symbols) {
    if (!symbols) {
        console.log('Required parameter symbol');
        return false;
    }
    var symbolStr = symbols;
    if (Array.isArray(symbols)) {
        symbolStr = symbols.join(',');
    }
    return symbolStr;
};
exports.joinSymbol = joinSymbol;
/**
 * Currently there is a limit of 100 parameters, too many parameters need to be divided
 * @param arr array
 * @param chunkSize number default 90
 * @returns array
 */
var splitArray = function (arr, chunkSize) {
    if (chunkSize === void 0) { chunkSize = 90; }
    var result = [];
    for (var i = 0; i < arr.length; i += chunkSize) {
        result.push((0, exports.joinSymbol)(arr.slice(i, i + chunkSize)));
    }
    return result;
};
exports.splitArray = splitArray;
/**
 * make sha256
 * @param text string
 * @param secret string
 * @returns sha256 - base64
 */
var cryptoHmac = function (text, secret) {
    if (text === void 0) { text = ''; }
    if (secret === void 0) { secret = ''; }
    return crypto_1.default.createHmac('sha256', secret).update(text).digest('base64');
};
exports.cryptoHmac = cryptoHmac;
var log = function (d) { return console.log(d); };
exports.log = log;
