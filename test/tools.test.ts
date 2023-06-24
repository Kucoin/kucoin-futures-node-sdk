import {
  makeQueryString,
  filterEmptyValues,
  joinSymbol,
  splitArray,
  cryptoHmac
} from '../src/tools/tools';

describe('Utils', () => {
  test('makeQueryString', () => {
    const query = {
      key1: 'value1',
      key2: 'value2',
      key3: undefined
    };

    expect(makeQueryString(query)).toBe('key1=value1&key2=value2');
  });

  test('filterEmptyValues', () => {
    const obj = {
      key1: 'value1',
      key2: null,
      key3: '',
      key4: undefined
    };

    expect(filterEmptyValues(obj)).toEqual({ key1: 'value1' });

    const obj2 = '';
    expect(filterEmptyValues(obj2)).toEqual('');
  });

  test('joinSymbol', () => {
    const symbols = ['AAPL', 'GOOGL', 'TSLA'];

    expect(joinSymbol(symbols)).toBe('AAPL,GOOGL,TSLA');

    expect(joinSymbol('AAPL')).toBe('AAPL');

    expect(joinSymbol('')).toBe(false);
  });

  test('splitArray', () => {
    const arr = Array.from({ length: 200 }, (_, i) => i + 1);

    const result: any[] = splitArray(arr);

    expect(result.length).toBe(3);

    expect(result[0].split(',').length).toBe(90);
    expect(result[1].split(',').length).toBe(90);
    expect(result[2].split(',').length).toBe(20);
  });

  test('cryptoHmac', () => {
    const text = 'Hello, world!';
    const secret = 'mysecretkey';

    const expected = 'k0jiDQEBW3xYgc/dh0c+RBQp5tcWug4rEZUeX35Awx0=';

    expect(cryptoHmac(text, secret)).toBe(expected);
  });
});
