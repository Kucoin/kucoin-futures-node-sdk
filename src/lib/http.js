
import request from 'request'
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

    // timestamp + method + requestEndpoint + body

    const timestamp = Date.now();
    const signature = Http.sign(timestamp + configs.method.toUpperCase() + configs.url + data, secret);

    if (!HttpConfig.signatureConfig.key) {
      log('KC-API-KEY is not specified');
    }
    if (!HttpConfig.signatureConfig.passphrase) {
      log('KC-API-PASSPHRASE is not specified');
    }
    // log('auth --->', data)
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
    const _config = Http.auth({
        method: 'POST',
        url,
    }, params, HttpConfig.signatureConfig.secret)
    return this._request({
        url: _url,
        method: 'POST',
        headers: _config,
        agentOptions: {
            securityOptions: 'SSL_OP_NO_SSLv3',
        },
        rejectUnauthorized : false,
    });
  }

  paramsStr (params = {}) {
    return Object.keys(params).join('&')
  }

  get(url = '', params = {}) {
    const _url = HttpConfig.baseUrl + url;
    const _config = Http.auth({
        method: 'GET',
        url,
    }, '', HttpConfig.signatureConfig.secret)
    return this._request({
        url: _url,
        method: 'GET',
        headers: _config,
        agentOptions: {
            securityOptions: 'SSL_OP_NO_SSLv3',
            
        },
        rejectUnauthorized : false,

    });
  }

  _request(config) {
    return new Promise((resolve, reject) => {
        request(config, (error, response, body) => {
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
        log(e);
      });
  }
}

const httpInstance = new Http()

export default httpInstance;