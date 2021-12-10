import MockAdapter from 'axios-mock-adapter';

import SlackOAuthClient from '../SlackOAuthClient';

const TOKEN = 'xxxx-xxxxxxxxx-xxxx';

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

  describe('create axios with slack api url', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      SlackOAuthClient.connect({ accessToken: TOKEN });

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://slack.com/api/',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    });
  });

  it('support origin', () => {
    axios.create = jest.fn().mockReturnValue({
      interceptors: {
        request: {
          use: 