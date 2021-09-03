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
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });
  });

  describe('#sendMessage', () => {
    it('should call messages api with default UPDATE type', async () => {
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

      const res = await client.sendMessage(USER_ID, {
        text: 'Hello!',
      });

      expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('should call messages api with MESSAGE_TAG type when tag exists', async () => {
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

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          tag: 'CONFIRMED_EVENT_UPDATE',
        }
      );

      expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'MESSAGE_TAG',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
        tag: 'CONFIRMED_EVENT_UPDATE',
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('should call messages api with RESPONSE type when it provided as messaging_type', async () => {
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

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          messagingType: 'RESPONSE',
        }
      );

      expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'RESPONSE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call messages api using recipient with phone_number', async () => {
      const { client, mock } = createMock();

      const reply = {
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(
        {
          phoneNumber: '+1(212)555-2368',
          name: { firstName: 'John', lastName: 'Doe' },
        },
        {
          text: 'Hello!',
        }
      );

      expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        mes