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
    