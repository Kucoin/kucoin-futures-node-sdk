/**
 * return api signature header
 * @param {object} configs
 * @param {string | object} data
 */
export declare const apiAuth: (configs: any, data?: string) => {
    'KC-API-KEY': any;
    'KC-API-SIGN': string;
    'KC-API-TIMESTAMP': string;
    'KC-API-PASSPHRASE': any;
    'KC-API-KEY-VERSION': any;
    'Content-Type': string;
    'User-Agent': string;
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
    private axiosInstance;
    private key;
    private secret;
    private passphrase;
    private version;
    constructor(props: {
        key: string | number;
        secret: string | number;
        passphrase: string | number;
        env?: string;
        version?: string | number;
    });
    setSignatureConfig(config?: any): void;
    signatureRequest(url: string, data: any, method?: string, config?: {}): Promise<unknown>;
    requestPublic(url: string, data: any, method?: string, config?: {}): Promise<unknown>;
}
