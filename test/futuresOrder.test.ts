import returnBodyAndEndpoint, {
  makeFuturesOrderBody
} from '../src/resetAPI/futuresOrder';

describe('makeFuturesOrderBody', () => {
  it('should throw an error if size is not an integer', () => {
    const orderBody = {
      side: 'buy',
      symbol: 'BTCUSD',
      size: 1.5,
      price: 10000
    };

    expect(() => makeFuturesOrderBody(orderBody)).toThrow(
      'The order size must be an integer!'
    );
  });

  it('should create a market order if price is not provided', () => {
    const orderBody = {
      side: 'buy',
      symbol: 'BTCUSD',
      size: 1
    };

    const result = makeFuturesOrderBody(orderBody);
    expect(result).toHaveProperty('type', 'market');
  });

  it('should create a limit order if price is provided', () => {
    const orderBody = {
      side: 'buy',
      symbol: 'BTCUSD',
      size: 1,
      price: 10000
    };

    const result = makeFuturesOrderBody(orderBody);
    expect(result).toHaveProperty('type', 'limit');
  });

  it('should throw an error if stop is not accepted', () => {
    const orderBody = {
      side: 'buy',
      symbol: 'BTCUSD',
      size: 1,
      price: 10000,
      optional: {
        stop: 'invalid'
      }
    };

    expect(() => makeFuturesOrderBody(orderBody)).toThrow(
      'The value of stop is not accepted, must be (down | up).'
    );
  });

  it('should throw an error if stopPrice is not accepted', () => {
    const orderBody = {
      side: 'buy',
      symbol: 'BTCUSD',
      size: 1,
      price: 10000,
      optional: {
        stop: 'up',
        stopPriceType: 'WP',
      }
    };

    expect(() => makeFuturesOrderBody(orderBody)).toThrow(
      'To set the stop attribute, you must set the stopPrice and stopPriceType parameters.'
    );
  });

  it('should throw an error if stopPriceType is not accepted', () => {
    const orderBody = {
      side: 'buy',
      symbol: 'BTCUSD',
      size: 1,
      price: 10000,
      optional: {
        stop: 'up',
        stopPrice: 100,
        stopPriceType: 'WP',
      }
    };

    expect(() => makeFuturesOrderBody(orderBody)).toThrow(
      'The value of stopPriceType is not accepted, must be (TP | IP | MP).'
    );
  });
});

describe('futuresOrder', () => {
  it('should return the correct body and endpoint for POST method', () => {
    const params = {
      side: 'buy',
      symbol: 'BTC',
      size: 1,
      price: 10000,
      leverage: 10,
      optional: {}
    };

    const result = returnBodyAndEndpoint(params, 'POST');
    expect(result.body).toBeDefined();
    expect(result.endpoint).toBe('/api/v1/orders');
  });

  it('should return the correct endpoint and body for POST method', () => {
    const params = {
      side: 'buy',
      symbol: 'BTCUSD',
      size: 1,
      price: 10000
    };
    const result = returnBodyAndEndpoint(params, 'POST');
    expect(result.endpoint).toBe('/api/v1/orders');
    expect(result.body).toMatchObject({
      side: 'buy',
      symbol: 'BTCUSD',
      type: 'limit',
      size: 1,
      leverage: 1,
      timeInForce: 'GTC',
      postOnly: undefined
    });
  });

  it('should return the correct endpoint for DELETE method with string parameter', () => {
    const params = 'order123';
    const result = returnBodyAndEndpoint(params, 'DELETE');
    expect(result.body).toBe('');
    expect(result.endpoint).toBe('/api/v1/orders/order123');
  });

  it('should return the correct endpoint for GET method with object parameter containing clientOid', () => {
    const params = { clientOid: 'client123' };
    const result = returnBodyAndEndpoint(params, 'GET');
    expect(result.body).toBe(params);
    expect(result.endpoint).toBe('/api/v1/orders/byClientOid');
  });

  it('should return the default endpoint for GET method with no parameters', () => {
    const result = returnBodyAndEndpoint(undefined, 'GET');
    expect(result.body).toBeUndefined();
    expect(result.endpoint).toBe('/api/v1/orders');
  });
});
