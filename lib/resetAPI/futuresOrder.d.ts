import { OrderOptionalParamsType, OrderBody } from '../dataType';
export declare const STOP_TYPES: string[];
export declare const STOP_PRICE_TYPES: string[];
export declare const TIME_IN_FORCE_TYPES: string[];
export declare const OPTIONAL_PARAMS: OrderOptionalParamsType[];
/**
 * create order-(buy|sell) body
 * @param side
 * @param symbol
 * @param size
 * @param price
 * @param leverage
 * @param optional
 */
export declare const makeFuturesOrderBody: ({ side, symbol, size, price, leverage, clientOid, optional }: OrderBody) => object;
/**
 * return futures order make body and endpoint
 * @param {any} params。
 * @param {string} method - DEFAULT 'GET'。
 * @param {boolean} isTest - DEFAULT false
 * @returns {Object} return { body, endpoint }。
 */
declare const returnBodyAndEndpoint: (params: any, method?: string, isTest?: boolean) => {
    body: any;
    endpoint: string;
};
export default returnBodyAndEndpoint;
