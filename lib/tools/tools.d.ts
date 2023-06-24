/**
 * make object query to string
 * @param {object} query
 */
export declare const makeQueryString: (query: any) => string;
/**
 * filter empty values
 * @param obj
 * @returns filterObj
 */
export declare const filterEmptyValues: (obj: any) => any;
/**
 * make symbol
 * @param symbols
 * @returns string
 */
export declare const joinSymbol: (symbols: string | any[]) => string | false | any[];
/**
 * Currently there is a limit of 100 parameters, too many parameters need to be divided
 * @param arr array
 * @param chunkSize number default 90
 * @returns array
 */
export declare const splitArray: (arr: any[], chunkSize?: number) => (string | boolean | any[])[];
/**
 * make sha256
 * @param text string
 * @param secret string
 * @returns sha256 - base64
 */
export declare const cryptoHmac: (text?: string, secret?: string) => string;
export declare const log: (d: any) => void;
