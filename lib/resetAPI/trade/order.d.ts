export declare const STOP_TYPES: string[];
export declare const STOP_PRICE_TYPES: string[];
export declare const TIME_IN_FORCE_TYPES: string[];
export declare const OPTIONAL_PARAMS: string[];
/**
 * create order-(buy|sell) body
 * @param side
 * @param symbol
 * @param size
 * @param price
 * @param leverage
 * @param optional
 */
declare const Order: (side: string, symbol: string, size: number, price: number | string, leverage?: number | string, optional?: any) => object;
export default Order;
