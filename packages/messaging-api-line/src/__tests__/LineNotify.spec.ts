import querystring from 'querystring';

import MockAdapter from 'axios-mock-adapter';

import LineNotify from '../LineNotify';

const CLIENT_ID = 'client-id';
const CLIENT_SECRET = 'client-secret';
const REDIRECT_URI = 'https://example.com/callback';

const createMock = (): {
  client: LineNotify;
  mock: MockAdapter;
  apiMock: MockAdapter;
} => {
  const client = new LineNotify({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  });
  const mock = new MockAdapter(client.axios);
  const apiMock = new MockAdapter(client.apiAxios);
  return { client, mock, apiMock };
};

describe('connect', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios');
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  it('create axios with LINE Notify API', () => {
    axios.create = jest.fn();
    LineNotify.connect({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      redirectUri: REDIRECT_URI,
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://notify-bot.line.me/',
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://notify-api.line.me/',
    });
  });
});

describe('constructor', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios');
    _create = axios.create;
  });

  afterEach(() => {
    