import omitBy from 'lodash/omitBy';
import crypto from 'crypto';

/**
 * make object query to string
 * @param {object} query
 */
export const makeQueryString = (query: any): string => {
  return Object.keys(query)
    .reduce((acc: Array<String>, key) => {
      if (query[key] !== undefined) {
        acc.push(`${key}=${encodeURIComponent(query[key])}`);
      }
      return acc;
    }, [])
    .join('&');
};

/**
 * filter empty values
 * @param obj
 * @returns filterObj
 */
export const filterEmptyValues = (obj: any) => {
  if (typeof obj !== 'object') return obj;
  const omitValue = omitBy(
    obj,
    (value) => value === null || value === undefined || value === ''
  );
  if (!omitValue || !Object.keys(omitValue).length) return '';
  return omitValue;
};

/**
 * make symbol
 * @param symbols
 * @returns string
 */
export const joinSymbol = (symbols: string | any[]) => {
  if (!symbols) {
    console.log('Required parameter symbol');
    return false;
  }
  let symbolStr = symbols;
  if (Array.isArray(symbols)) {
    symbolStr = symbols.join(',');
  }
  return symbolStr;
};
/**
 * Currently there is a limit of 100 parameters, too many parameters need to be divided
 * @param arr array
 * @param chunkSize number default 90
 * @returns array
 */
export const splitArray = (arr: any[], chunkSize: number = 90) => {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(joinSymbol(arr.slice(i, i + chunkSize)));
  }
  return result;
};

/**
 * make sha256
 * @param text string
 * @param secret string
 * @returns sha256 - base64
 */
export const cryptoHmac = (text = '', secret = '') => {
  return crypto.createHmac('sha256', secret).update(text).digest('base64');
};

export const log = (d: any) => console.log(d);