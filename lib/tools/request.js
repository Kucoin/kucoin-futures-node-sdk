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
exports.apiAuth = void 0;
var axios_1 = __importDefault(require("axios"));
var https_1 = __importDefault(require("https"));
var tools_1 = require("./tools");
var constants_1 = require("./constants");
var httpsAgent = new https_1.default.Agent({ rejectUnauthorized: false });
/**
 * return api signature header
 * @param {object} configs
 * @param {string | object} data
 */
var apiAuth = function (configs, data) {
    if (data === void 0) { data = ''; }
    var _a = configs.key, key = _a === void 0 ? '' : _a, _b = configs.passphrase, passphrase = _b === void 0 ? '' : _b, secret = configs.secret, method = configs.method, endpoint = configs.url, _c = configs.version, version = _c === void 0 ? '2' : _c;
    if (!key) {
        console.log('KC-API-KEY is not specified more information see here https://docs.kucoin.com/futures/#general');
    }
    if (!passphrase) {
        console.log('KC-API-PASSPHRASE is not specified more information see here https://docs.kucoin.com/futures/#general');
    }
    var timestamp = Date.now();
    var signature = (0, tools_1.cryptoHmac)(timestamp + (method || '').toUpperCase() + endpoint + data, secret);
    var authParams = {
        'KC-API-KEY': key,
        'KC-API-SIGN': signature,
        'KC-API-TIMESTAMP': timestamp.toString(),
        'KC-API-PASSPHRASE': passphrase,
        'KC-API-KEY-VERSION': version,
        'Content-Type': 'application/json',
        'User-Agent': "KuCoin-Futures-Node-SDK/".concat(version)
    };
    if (version && version == 2) {
        authParams['KC-API-PASSPHRASE'] = (0, tools_1.cryptoHmac)(passphrase, secret);
    }
    return authParams;
};
exports.apiAuth = apiAuth;
/**
 * create axios request
 * @param {string} env -- set baseURL
 * @param {string} key -- set KC-API-KEY
 * @param {string} passphrase -- KC-API-PASSPHRASE
 * @param {string} secret -- set Secret
 * @param {object} other -- set axios instance
 * @function setSignatureConfig -- set {key,passphrase,secret}
 * @function request -- axios request return promise
 */
var Request = /** @class */ (function () {
    function Request(props) {
        var _a = props || {}, _b = _a.env, env = _b === void 0 ? 'prod' : _b, _c = _a.key, key = _c === void 0 ? '' : _c, secret = _a.secret, _d = _a.passphrase, passphrase = _d === void 0 ? '' : _d, _e = _a.version, version = _e === void 0 ? 2 : _e, other = __rest(_a, ["env", "key", "secret", "passphrase", "version"]);
        var baseURL = env === 'prod' ? constants_1.PROD_ADDR_EP : constants_1.SANDBOX_ADDR_EP;
        this.axiosInstance = axios_1.default.create(__assign({ baseURL: baseURL, timeout: constants_1.TIME_OUT, httpsAgent: httpsAgent }, other));
        this.key = key;
        this.secret = secret;
        this.passphrase = passphrase;
        this.version = version;
    }
    Request.prototype.setSignatureConfig = function (config) {
        if (config === void 0) { config = {}; }
        var key = config.key, secret = config.secret, passphrase = config.passphrase;
        if (key) {
            this.key = key;
        }
        if (secret) {
            this.secret = secret;
        }
        if (passphrase) {
            this.passphrase = passphrase;
        }
    };
    Request.prototype.signatureRequest = function (url, data, method, config) {
        var _this = this;
        if (method === void 0) { method = 'GET'; }
        if (config === void 0) { config = {}; }
        var authUrl = url;
        var body = data;
        var axiosConfig = __assign({ method: method, url: authUrl }, config);
        if (method === 'GET') {
            authUrl =
                typeof data === 'object'
                    ? "".concat(url, "?").concat((0, tools_1.makeQueryString)(data))
                    : data
                        ? "".concat(url, "/").concat(data)
                        : url;
            axiosConfig.url = authUrl;
            body = '';
        }
        else {
            if (data) {
                axiosConfig.data = data;
                body = JSON.stringify(data);
            }
        }
        var headerAuth = (0, exports.apiAuth)({
            method: method,
            secret: this.secret,
            key: this.key,
            passphrase: this.passphrase,
            url: authUrl,
            version: this.version
        }, body);
        axiosConfig.headers = headerAuth;
        return new Promise(function (resolve, reject) {
            _this.axiosInstance(axiosConfig)
                .then(function (response) {
                resolve(response.data);
            })
                .catch(function (err) {
                reject(err);
                console.log(JSON.stringify(err));
            });
        });
    };
    Request.prototype.requestPublic = function (url, data, method, config) {
        var _this = this;
        if (method === void 0) { method = 'GET'; }
        if (config === void 0) { config = {}; }
        var authUrl = url;
        var axiosConfig = __assign({ method: method, url: authUrl }, config);
        if (method === 'GET') {
            authUrl =
                typeof data === 'object'
                    ? "".concat(url, "?").concat((0, tools_1.makeQueryString)(data))
                    : data
                        ? "".concat(url, "/").concat(data)
                        : url;
            axiosConfig.url = authUrl;
        }
        else {
            if (data) {
                axiosConfig.data = data;
            }
        }
        return new Promise(function (resolve, reject) {
            _this.axiosInstance(axiosConfig)
                .then(function (response) {
                resolve(response.data);
            })
                .catch(function (err) {
                reject(err);
                console.log(JSON.stringify(err));
            });
        });
    };
    return Request;
}());
exports.default = Request;
