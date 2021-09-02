import fs from 'fs';

import FormData from 'form-data';
import MockAdapter from 'axios-mock-adapter';

import { MessengerBatch, MessengerClient } from '..';

const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';

let axios;
let _create;
beforeEach(() => {
  axios = require('axios');
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

const createMock = (): { client: MessengerClient; mock: MockAdapter } => {
  const client = new MessengerClient({
    accessToken: ACCESS_TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('send api', () => {
  describe('#sendRawBody', () => {
    it('should call messages api', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendRawBody({
        messagingType: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: