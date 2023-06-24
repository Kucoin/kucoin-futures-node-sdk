import pick from 'lodash/pick';

import { FUTURES_ORDER_EP } from './constants';

import { OrderOptionalParamsType, OrderBody } from '../dataType';

export const STOP_TYPES = ['down', 'up'];
export const STOP_PRICE_TYPES = ['TP', 'IP', 'MP'];
export const TIME_IN_FORCE_TYPES = ['GTC', 'IOC'];
export const OPTIONAL_PARAMS: OrderOptionalParamsType[] = [
  'type',
  'remark',
  'stop',
  'stopPriceType',
  'stopPrice',
  'reduceOnly',
  'closeOrder',
  'forceHold',
  'timeInForce',
  'postOnly',
  'hidden',
  'iceberg',
  'visibleSize'
];

const LIMIT = 'limit';
const MARKET = 'market';

/**
 * create order-(buy|sell) body
 * @param side
 * @param symbol
 * @param size
 * @param price
 * @param leverage
 * @param optional
 */
export const makeFuturesOrderBody = ({
  side,
  symbol,
  size,
  price,
  leverage = 1,
  clientOid,
  optional = {}
}: OrderBody) => {
  if (!size || !(size % 1 === 0)) {
    throw new TypeError('The order size must be an integer!');
  }

  let type = LIMIT;
  if (!price) {
    type = MARKET;
  }

  const {
    stop,
    stopPriceType,
    stopPrice,
    timeInForce = 'GTC',
    postOnly,
    hidden = false,
    iceberg = false,
    ...other
  } = optional;

  let body: object = {
    side,
    symbol,
    type,
    size,
    leverage,
    clientOid,
    ...pick(other, OPTIONAL_PARAMS)
  };
  if (stop) {
    if (!STOP_TYPES.includes(stop)) {
      throw new RangeError(
        'The value of stop is not accepted, must be (down | up).'
      );
    }
    if (!stopPriceType || !stopPrice) {
      throw new TypeError(
        'To set the stop attribute, you must set the stopPrice and stopPriceType parameters.'
      );
    }
    if (!STOP_PRICE_TYPES.includes(stopPriceType)) {
      throw new RangeError(
        'The value of stopPriceType is not accepted, must be (TP | IP | MP).'
      );
    }
    body = {
      ...body,
      stop,
      stopPriceType,
      stopPrice
    };
  }
  if (type === LIMIT || optional.type === LIMIT) {
    if (!TIME_IN_FORCE_TYPES.includes(timeInForce)) {
      throw new RangeError(
        'The value of timeInForce is not accepted, must be (GTC | IOC).'
      );
    }
    if (timeInForce === 'IOC' || hidden || iceberg) {
      body = {
        ...body,
        timeInForce,
        hidden,
        iceberg
      };
    } else {
      body = {
        price,
        ...body,
        timeInForce,
        postOnly
      };
    }
  }
  return body;
};

/**
 * return futures order make body and endpoint
 * @param {any} params。
 * @param {string} method - DEFAULT 'GET'。
 * @returns {Object} return { body, endpoint }。
 */
const returnBodyAndEndpoint = (params: any, method = 'GET') => {
  let endpoint = FUTURES_ORDER_EP;
  let body = params;
  switch (method) {
    case 'POST': {
      if (typeof params === 'object') {
        const {
          side,
          symbol,
          size,
          price,
          leverage,
          clientOid,
          optional
        } = params;
        body = makeFuturesOrderBody({
          side,
          symbol,
          size,
          price,
          leverage,
          clientOid,
          optional
        });
      }
      break;
    }
    case 'DELETE': {
      if (params && typeof params === 'string') {
        endpoint = `${endpoint}/${params}`;
        body = '';
      }
      break;
    }
    case 'GET': {
      if (typeof params === 'object' && params.clientOid) {
        endpoint = `${endpoint}/byClientOid`;
      }
      break;
    }
  }
  return { body, endpoint };
};

export default returnBodyAndEndpoint;
