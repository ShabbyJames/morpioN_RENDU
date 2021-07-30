
import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const REPLY_TOKEN = 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA';
const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const createMock = (): {
  client: LineClient;
  mock: MockAdapter;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
} => {
  const client = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
  });
  const mock = new MockAdapter(client.axios);
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };
  return { client, mock, headers };
};

describe('Reply Message', () => {
  describe('#replyRawBody', () => {
    it('should call reply api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/reply');
        expect(JSON.parse(config.data)).toEqual({
          replyToken: REPLY_TOKEN,
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.replyRawBody({
        replyToken: REPLY_TOKEN,
        messages: [
          {
            type: 'text',
            text: 'Hello!',
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#reply', () => {
    it('should call reply api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/reply');
        expect(JSON.parse(config.data)).toEqual({
          replyToken: REPLY_TOKEN,
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.reply(REPLY_TOKEN, [
        {
          type: 'text',
          text: 'Hello!',
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#replyText', () => {
    it('should call reply api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/reply');
        expect(JSON.parse(config.data)).toEqual({
          replyToken: REPLY_TOKEN,
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.replyText(REPLY_TOKEN, 'Hello!');

      expect(res).toEqual(reply);
    });

    it('should call reply api and sender', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/reply');
        expect(JSON.parse(config.data)).toEqual({
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'text',
              text: 'Hello!',
              sender: {
                name: 'Cony',
                iconUrl: 'https://example.com/original.jpg',
              },
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.replyText(REPLY_TOKEN, 'Hello!', {
        sender: {
          name: 'Cony',
          iconUrl: 'https://example.com/original.jpg',
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#replyImage', () => {
    it('should call reply api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/reply');
        expect(JSON.parse(config.data)).toEqual({
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'image',
              originalContentUrl: 'https://example.com/original.jpg',
              previewImageUrl: 'https://example.com/preview.jpg',
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.replyImage(REPLY_TOKEN, {
        originalContentUrl: 'https://example.com/original.jpg',
        previewImageUrl: 'https://example.com/preview.jpg',
      });

      expect(res).toEqual(reply);
    });

    it('should use contentUrl as fallback', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};
