
import request from 'request'
// import querystring from 'querystring';
import CryptoJS  from 'crypto';


let HttpConfig = {
    signatureConfig: {
      
    },
    baseUrl: 'https://api.kumex.com',
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
      console.warn('KC-API-KEY is not specified');
    }
    if (!HttpConfig.signatureConfig.passphrase) {
      console.warn('KC-API-PASSPHRASE is not specified');
    }
    // console.log('auth --->', data)
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
            // console.log(response)
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(body));
          }
        });
      }).catch((e) => {
        console.log(e);
      });
  }
}

const httpInstance = new Http()

export default httpInstance;