import axios from 'axios';

import Request, { apiAuth } from '../src/tools/request';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('Request', () => {
  const mockKey = 'mockKey';

  const mockSecret = 'mockSecret';

  const mockPassphrase = 'mockPassphrase';

  beforeEach(() => {
    mockedAxios.create.mockImplementation((): any => () =>
      Promise.resolve({ data: { success: true } })
    );
  });

  test.each([
    {
      desc: 'apiAuth key is undefined',
      config: {}
    },
    {
      desc: 'apiAuth passphrase is undefined',
      config: { key: 'test' }
    }
  ])('%o', ({ config }) => {
    jest.spyOn(global.console, 'log');
    apiAuth(config);
    expect(console.log).toBeCalled();
  });

  test('apiAuth config', () => {
    const configs = {
      key: mockKey,
      passphrase: mockPassphrase,
      secret: mockSecret,
      method: 'GET',
      url: '/api/v1/symbols',
      version: '2'
    };

    const headers = apiAuth(configs);

    expect(headers['KC-API-KEY']).toBe(mockKey);

    expect(headers['KC-API-PASSPHRASE']).toBeDefined();

    expect(headers['KC-API-TIMESTAMP']).toBeDefined();

    expect(headers['KC-API-KEY-VERSION']).toBe('2');
  });

  test('constructor', () => {
    const request = new Request({
      key: mockKey,
      secret: mockSecret,
      passphrase: mockPassphrase,
      env: 'prod'
    });

    expect(request).toBeDefined();
  });

  test('setSignatureConfig', () => {
    const request = new Request({
      key: mockKey,
      secret: mockSecret,
      passphrase: mockPassphrase,
      env: 'prod'
    });

    request.setSignatureConfig({
      key: 'newKey',
      secret: 'newSecret',
      passphrase: 'newPassphrase'
    });

    expect(request).toBeDefined();
  });

  test('signatureRequest', async () => {
    const request = new Request({
      key: mockKey,
      secret: mockSecret,
      passphrase: mockPassphrase,
      env: 'prod'
    });

    const response = await request.signatureRequest(
      '/api/v1/symbols',
      'BTC',
    );

    expect(response).toEqual({ success: true });
  });

  test('signatureRequest post', async () => {
    mockedAxios.create.mockImplementationOnce((): any => () =>
      Promise.reject({ err: 'test' })
    );
    jest.spyOn(global.console, 'log');
    const request = new Request({
      key: '',
      secret: '',
      passphrase: '',
      env: 'sand'
    });

    try {
      await request.signatureRequest(
        '/api/v1/symbols',
        { symbol: 'BTC' },
        'POST'
      );

      expect(console.log).toBeCalled();
    } catch (err) {
      expect(err).toEqual({ err: 'test' });
    }
  });

  test('requestPublic', async () => {
    // @ts-ignore: test Request empty
    const request = new Request();

    const response = await request.requestPublic(
      '/api/v1/symbols',
      'BTC',
    );

    expect(response).toEqual({ success: true });
  });

  test('requestPublic post', async () => {
    mockedAxios.create.mockImplementationOnce((): any => () =>
      Promise.reject({ err: 'test' })
    );
    jest.spyOn(global.console, 'log');
    const request = new Request({
      key: mockKey,
      secret: mockSecret,
      passphrase: mockPassphrase,
      env: 'prod'
    });

    try {
      await request.requestPublic('/api/v1/symbols', { symbol: 'BTC' }, 'POST');

      expect(console.log).toBeCalled();
    } catch (err) {
      expect(err).toEqual({ err: 'test' });
    }
  });
});
