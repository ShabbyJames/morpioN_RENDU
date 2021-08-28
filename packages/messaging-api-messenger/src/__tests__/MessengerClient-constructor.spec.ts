import MockAdapter from 'axios-mock-adapter';

import { MessengerBatch, MessengerClient } from '..';

const ACCESS_TOKEN = 'foo_token';
const APP_SECRET = 'shhhhh!is.my.secret';

let axios;
let _create;
beforeEach(() => {
  axios = require('axios');
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

describe('connect', () => {
  describe('create axios with default graphAPI version', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      MessengerClient.connect({ accessToken: ACCESS_TOKEN });

      expect(axios.create).toBeCalledWith(
        expect.objectContaining({
          baseURL: 'https://graph.facebook.com/v6.0/',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  describe('create axios with custom graphAPI version', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      MessengerClient.connect({ accessToken: ACCESS_TOKEN, version: '2.6' });

      expect(axios.create).toBeCalledWith(
        expect.objectContaining({
          baseURL: 'https://graph.facebook.com/v2.6/',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('support origin', () => {
    axios.create = jest.fn().mockReturnValue({
      interceptors: {
        request: {
          use: jest.fn(),
        },
      },
    });
    MessengerClient.connect({
      accessToken: ACCESS_TOKEN,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith(
      expect.objectContaining({
        baseURL: 'https://mydummytestserver.com/v6.0/',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
});

describe('constructor', () => {
  describe('create axios with default graphAPI version', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      new MessengerClient({ accessToken: ACCESS_TOKEN }); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith(
        expect.objectContaining({
          baseURL: 'https://graph.facebook.com/v6.0/',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  describe('create axios with custom graphAPI version', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: '2.6' }); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith(
        expect.objectContaining({
          baseURL: 'https://graph.facebook.com/v2.6/',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('support origin', () => {
    axios.create = jest.fn().mockReturnValue({
      interceptors: {
        request: {
          use: jest.fn(),
        },
      },
    });
    // eslint-disable-next-line no-new
    new MessengerClient({
      accessToken: ACCESS_TOKEN,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith(
      expect.objectContaining({
        baseURL: 'https://mydummytestserver.com/v6.0/',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
});

describe('#version', () => {
  it('should return version of graph api', () => {
    expect(new MessengerClient({ accessToken: ACCESS_TOKEN }).version).toEqual(
      '6.0'
    );
    expect(
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: 'v2.6' })
        .version
    ).toEqual('2.6');
    expect(
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: '2.6' }).version
    ).toEqual('2.6');
    expect(() => {
      // eslint-disable-next-line no-new
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: 2.6 } as any);
    }).toThrow('Type of `version` must be string.');
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new MessengerClient({ accessToken: ACCESS_TOKEN });

    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    const client = new MessengerClient({ accessToken: ACCESS_TOKEN });

    expect(client.accessToken).toBe(ACCESS_TOKEN);
  });
});

describe('#appSecret', () => {
  it('should return underlying appSecret', () => {
    const client = new MessengerClient({
      accessToken: ACCESS_TOKEN,
      appSecret: APP_SECRET,
    });

    expect(client.appSecret).toEqual(APP_SECRET);
  });
});

describe('#onRequest', () => {
  it('should call onRequest when calling any API', async () => {
    