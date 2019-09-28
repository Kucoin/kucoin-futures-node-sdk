
import querystring  from 'querystring';
import request from 'request';
import CryptoJS  from 'crypto';
import codes from './codes';
import log from './log';

const IS_PRODUCT = process.env.PRODUCTION === 'true';
const baseUrl = IS_PRODUCT ? 'https://api.kumex.com' : 'https://sandbox-api.kumex.com';

log(`http use baseUrl: (${baseUrl})`);

let HttpConfig = {
    signatureConfig: {
      
    },
    baseUrl,
};

class Http {

   setSignatureConfig(config) {
    HttpConfig.signatureConfig = config;
   }

    static sign(text = '', secret = '') {
        return CryptoJS
          .createHmac('sha256', secret)
          .update(text)
          .digest('base64');
    }


    //
  static auth(configs, data = '', secret = '') {

    const timestamp =  Date.now();

    const signature = Http.sign(timestamp + configs.method.toUpperCase() + configs.url + data, secret);

    if (!HttpConfig.signatureConfig.key) {
      log('KC-API-KEY is not specified');
    }
    if (!HttpConfig.signatureConfig.passphrase) {
      log('KC-API-PASSPHRASE is not specified');
    }
    return {
    //   ...(configs.headers || {}),
      'KC-API-KEY': HttpConfig.signatureConfig.key || '',
      'KC-API-SIGN': signature,
      'KC-API-TIMESTAMP': timestamp,
      'KC-API-PASSPHRASE': HttpConfig.signatureConfig.passphrase || '',
      'Content-Type': 'application/json',
    };
  }


  post(url = '', params = {}) {
    const _url = HttpConfig.baseUrl + url;
    const body =  JSON.stringify(params || '{}');
    const _config = Http.auth({
        method: 'POST',
        url,
    }, body, HttpConfig.signatureConfig.secret)
    return this._request({
        url: _url,
        method: 'POST',
        headers: _config,
        body,
    });
  }

  paramsStr (params = {}) {
    return Object.keys(params).join('&')
  }


  /**
   * 处理get/delete 的参数
   */
  resolveQueryParams(url, params = {}) {
    const [ urlStr, urlParamsStr ] = url.split('?');
    const _p = Object.assign({}, querystring.parse(urlParamsStr || ''), params);
    const _hasParams = Object.keys(_p || {}).length > 0
    const _params = _hasParams ? ('?' + querystring.stringify(_p)) : ''
    const uri =urlStr + _params;
    return {
      url:  HttpConfig.baseUrl + uri, //最终请求地址
      params: _params,  // 参数字符串
      uri,  // uri
    }
  }
  

  get(url = '', params = {}) {
    
    const resolvedConfig = this.resolveQueryParams(url, params);

    const _config = Http.auth({
        method: 'GET',
        url: resolvedConfig.uri,
    }, '', HttpConfig.signatureConfig.secret)

    return this._request({
        url: resolvedConfig.url,
        method: 'GET',
        headers: _config,
    });
  }

  del(url = '', params = {}) {

    const resolvedConfig = this.resolveQueryParams(url, params);

    const _config = Http.auth({
        method: 'DELETE',
        url: resolvedConfig.uri,
    }, '', HttpConfig.signatureConfig.secret)

    return this._request({
        url: resolvedConfig.url,
        method: 'DELETE',
        headers: _config,
    });
  }

  _request(config) {
    return new Promise((resolve, reject) => {
        request(Object.assign({}, config, {
          agentOptions: {
            securityOptions: 'SSL_OP_NO_SSLv3',
          },
          rejectUnauthorized : false,
        }), (error, response, body) => {
            // log(response)
          if (error) {
            reject(error);
          } else {
            const res = JSON.parse(body);
            if (res.code == codes.SUCCESS) {
              resolve(res);
            } else {
              reject(res);
            }
          }
        });
      }).catch((e) => {
        log('HTTP ERROR',JSON.stringify(config), e);
     });
  }
}

export default new Http();