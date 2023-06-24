import axios, { AxiosRequestConfig } from 'axios';

import https from 'https';

import { makeQueryString, cryptoHmac } from './tools';
import { TIME_OUT, PROD_ADDR_EP, SANDBOX_ADDR_EP } from './constants';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });



/**
 * return api signature header
 * @param {object} configs
 * @param {string | object} data
 */
export const apiAuth = (configs: any, data = '') => {
  const {
    key = '',
    passphrase = '',
    secret,
    method,
    url: endpoint,
    version = '2'
  } = configs;

  if (!key) {
    console.log(
      'KC-API-KEY is not specified more information see here https://docs.kucoin.com/futures/#general'
    );
  }
  if (!passphrase) {
    console.log(
      'KC-API-PASSPHRASE is not specified more information see here https://docs.kucoin.com/futures/#general'
    );
  }

  const timestamp = Date.now();

  const signature = cryptoHmac(
    timestamp + (method || '').toUpperCase() + endpoint + data,
    secret
  );

  const authParams = {
    'KC-API-KEY': key,
    'KC-API-SIGN': signature,
    'KC-API-TIMESTAMP': timestamp.toString(),
    'KC-API-PASSPHRASE': passphrase,
    'KC-API-KEY-VERSION': version,
    'Content-Type': 'application/json',
    'User-Agent': `KuCoin-Futures-Node-SDK/${version}`
  };

  if (version && version == 2) {
    authParams['KC-API-PASSPHRASE'] = cryptoHmac(passphrase, secret);
  }

  return authParams;
};

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
export default class Request {
  private axiosInstance: any;
  private key: string | number;
  private secret: string | number;
  private passphrase: string | number;
  private version: string | number;
  constructor(props: {
    key: string | number;
    secret: string | number;
    passphrase: string | number;
    env?: string;
    version?: string | number;
  }) {
    const {
      env = 'prod',
      key = '',
      secret,
      passphrase = '',
      version = 2,
      ...other
    } = props || {};
    const baseURL = env === 'prod' ? PROD_ADDR_EP : SANDBOX_ADDR_EP;

    this.axiosInstance = axios.create({
      baseURL,
      timeout: TIME_OUT,
      httpsAgent,
      ...other
    });
    this.key = key;
    this.secret = secret;
    this.passphrase = passphrase;
    this.version = version;
  }

  setSignatureConfig(config: any = {}) {
    const { key, secret, passphrase } = config;
    if (key) {
      this.key = key;
    }
    if (secret) {
      this.secret = secret;
    }
    if (passphrase) {
      this.passphrase = passphrase;
    }
  }

  signatureRequest(url: string, data: any, method = 'GET', config = {}) {
    let authUrl = url;
    let body = data;

    const axiosConfig: AxiosRequestConfig = {
      method,
      url: authUrl,
      ...config
    };

    if (method === 'GET') {
      authUrl =
        typeof data === 'object'
          ? `${url}?${makeQueryString(data)}`
          : data
          ? `${url}/${data}`
          : url;
      axiosConfig.url = authUrl;
      body = '';
    } else {
      if (data) {
        axiosConfig.data = data;
        body = JSON.stringify(data);
      }
    }

    const headerAuth = apiAuth(
      {
        method,
        secret: this.secret,
        key: this.key,
        passphrase: this.passphrase,
        url: authUrl,
        version: this.version
      },
      body
    );

    axiosConfig.headers = headerAuth;

    return new Promise((resolve, reject) => {
      this.axiosInstance(axiosConfig)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((err: any) => {
          reject(err);
          console.log(JSON.stringify(err));
        });
    });
  }

  requestPublic(url: string, data: any, method = 'GET', config = {}) {
    let authUrl = url;

    const axiosConfig: AxiosRequestConfig = {
      method,
      url: authUrl,
      ...config
    };

    if (method === 'GET') {
      authUrl =
        typeof data === 'object'
          ? `${url}?${makeQueryString(data)}`
          : data
          ? `${url}/${data}`
          : url;
      axiosConfig.url = authUrl;
    } else {
      if (data) {
        axiosConfig.data = data;
      }
    }

    return new Promise((resolve, reject) => {
      this.axiosInstance(axiosConfig)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((err: any) => {
          reject(err);
          console.log(JSON.stringify(err));
        });
    });
  }
}
