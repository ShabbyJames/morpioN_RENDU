
import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const RECIPIENT_ID = '1QAZ2WSX';
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

describe('Push Message', () => {
  describe('#pushRawBody', () => {
    it('should call push api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.pushRawBody({
        to: RECIPIENT_ID,
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

  describe('#push', () => {
    it('should call push api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.push(RECIPIENT_ID, [
        {
          type: 'text',
          text: 'Hello!',
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#pushText', () => {
    it('should call push api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.pushText(RECIPIENT_ID, 'Hello!');

      expect(res).toEqual(reply);
    });
  });

  describe('#pushImage', () => {
    it('should call push api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
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

      const res = await client.pushImage(RECIPIENT_ID, {
        originalContentUrl: 'https://example.com/original.jpg',
        previewImageUrl: 'https://example.com/preview.jpg',
      });

      expect(res).toEqual(reply);
    });

    it('should use contentUrl as fallback', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'image',
              originalContentUrl: 'https://example.com/original.jpg',
              previewImageUrl: 'https://example.com/original.jpg',
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.pushImage(RECIPIENT_ID, {
        originalContentUrl: 'https://example.com/original.jpg',
      });

      expect(res).toEqual(reply);
    });

    it('should call push api with object image arg', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
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

      const res = await client.pushImage(RECIPIENT_ID, {
        originalContentUrl: 'https://example.com/original.jpg',
        previewImageUrl: 'https://example.com/preview.jpg',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#pushVideo', () => {
    it('should call push api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'video',
              originalContentUrl: 'https://example.com/original.mp4',
              previewImageUrl: 'https://example.com/preview.jpg',
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.pushVideo(RECIPIENT_ID, {
        originalContentUrl: 'https://example.com/original.mp4',
        previewImageUrl: 'https://example.com/preview.jpg',
      });

      expect(res).toEqual(reply);
    });

    it('should call push api with object video arg', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'video',
              originalContentUrl: 'https://example.com/original.mp4',
              previewImageUrl: 'https://example.com/preview.jpg',
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.pushVideo(RECIPIENT_ID, {
        originalContentUrl: 'https://example.com/original.mp4',
        previewImageUrl: 'https://example.com/preview.jpg',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#pushAudio', () => {
    it('should call push api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'audio',
              originalContentUrl: 'https://example.com/original.m4a',
              duration: 240000,
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.pushAudio(RECIPIENT_ID, {
        originalContentUrl: 'https://example.com/original.m4a',
        duration: 240000,
      });

      expect(res).toEqual(reply);
    });

    it('should call push api with object audio arg', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'audio',
              originalContentUrl: 'https://example.com/original.m4a',
              duration: 240000,
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.pushAudio(RECIPIENT_ID, {
        originalContentUrl: 'https://example.com/original.m4a',
        duration: 240000,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#pushLocation', () => {
    it('should call push api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'location',
              title: 'my location',
              address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
              latitude: 35.65910807942215,
              longitude: 139.70372892916203,
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.pushLocation(RECIPIENT_ID, {
        title: 'my location',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#pushSticker', () => {
    it('should call push api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'sticker',
              packageId: '1',
              stickerId: '1',
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.pushSticker(RECIPIENT_ID, {
        packageId: '1',
        stickerId: '1',
      });

      expect(res).toEqual(reply);
    });

    it('should call push api with object sticker arg', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/push');
        expect(JSON.parse(config.data)).toEqual({
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'sticker',
              packageId: '1',
              stickerId: '1',
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.pushSticker(RECIPIENT_ID, {
        packageId: '1',
        stickerId: '1',