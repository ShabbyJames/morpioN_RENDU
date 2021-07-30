
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

describe('Multicast', () => {
  describe('#multicastRawBody', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastRawBody({
        to: [RECIPIENT_ID],
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

  describe('#multicast', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicast(
        [RECIPIENT_ID],
        [
          {
            type: 'text',
            text: 'Hello!',
          },
        ]
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastText', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastText([RECIPIENT_ID], 'Hello!');

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastImage', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
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

      const res = await client.multicastImage([RECIPIENT_ID], {
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
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
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

      const res = await client.multicastImage([RECIPIENT_ID], {
        originalContentUrl: 'https://example.com/original.jpg',
      });

      expect(res).toEqual(reply);
    });

    it('should call multicast api with object image arg', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
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

      const res = await client.multicastImage([RECIPIENT_ID], {
        originalContentUrl: 'https://example.com/original.jpg',
        previewImageUrl: 'https://example.com/preview.jpg',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastVideo', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
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

      const res = await client.multicastVideo([RECIPIENT_ID], {
        originalContentUrl: 'https://example.com/original.mp4',
        previewImageUrl: 'https://example.com/preview.jpg',
      });

      expect(res).toEqual(reply);
    });

    it('should call multicast api with object video arg', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
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

      const res = await client.multicastVideo([RECIPIENT_ID], {
        originalContentUrl: 'https://example.com/original.mp4',
        previewImageUrl: 'https://example.com/preview.jpg',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastAudio', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
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

      const res = await client.multicastAudio([RECIPIENT_ID], {
        originalContentUrl: 'https://example.com/original.m4a',
        duration: 240000,
      });

      expect(res).toEqual(reply);
    });

    it('should call multicast api with object audio arg', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
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

      const res = await client.multicastAudio([RECIPIENT_ID], {
        originalContentUrl: 'https://example.com/original.m4a',
        duration: 240000,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastLocation', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
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

      const res = await client.multicastLocation([RECIPIENT_ID], {
        title: 'my location',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastSticker', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
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

      const res = await client.multicastSticker([RECIPIENT_ID], {
        packageId: '1',
        stickerId: '1',
      });

      expect(res).toEqual(reply);
    });

    it('should call multicast api with object sticker arg', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
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

      const res = await client.multicastSticker([RECIPIENT_ID], {
        packageId: '1',
        stickerId: '1',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastImagemap', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
          messages: [
            {
              type: 'imagemap',
              baseUrl: 'https://example.com/bot/images/rm001',
              altText: 'this is an imagemap',
              baseSize: {
                height: 1040,
                width: 1040,
              },
              actions: [
                {
                  type: 'uri',
                  linkUri: 'https://example.com/',
                  area: {
                    x: 0,
                    y: 0,
                    width: 520,
                    height: 1040,
                  },
                },
                {
                  type: 'message',
                  text: 'hello',
                  area: {
                    x: 520,
                    y: 0,
                    width: 520,
                    height: 1040,
                  },
                },
              ],
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastImagemap(
        [RECIPIENT_ID],
        'this is an imagemap',
        {
          baseUrl: 'https://example.com/bot/images/rm001',
          baseSize: {
            height: 1040,
            width: 1040,
          },
          actions: [
            {
              type: 'uri',
              linkUri: 'https://example.com/',
              area: {
                x: 0,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
            {
              type: 'message',
              text: 'hello',
              area: {
                x: 520,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });

    it('should support baseSize argument', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
          messages: [
            {
              type: 'imagemap',
              baseUrl: 'https://example.com/bot/images/rm001',
              altText: 'this is an imagemap',
              baseSize: {
                height: 1040,
                width: 1040,
              },
              actions: [
                {
                  type: 'uri',
                  linkUri: 'https://example.com/',
                  area: {
                    x: 0,
                    y: 0,
                    width: 520,
                    height: 1040,
                  },
                },
                {
                  type: 'message',
                  text: 'hello',
                  area: {
                    x: 520,
                    y: 0,
                    width: 520,
                    height: 1040,
                  },
                },
              ],
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastImagemap(
        [RECIPIENT_ID],
        'this is an imagemap',
        {
          baseUrl: 'https://example.com/bot/images/rm001',
          baseSize: {
            height: 1040,
            width: 1040,
          },
          actions: [
            {
              type: 'uri',
              linkUri: 'https://example.com/',
              area: {
                x: 0,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
            {
              type: 'message',
              text: 'hello',
              area: {
                x: 520,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });

    it('should support video', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
          messages: [
            {
              type: 'imagemap',
              baseUrl: 'https://example.com/bot/images/rm001',
              altText: 'this is an imagemap',
              baseSize: {
                height: 1040,
                width: 1040,
              },
              video: {
                originalContentUrl: 'https://example.com/video.mp4',
                previewImageUrl: 'https://example.com/video_preview.jpg',
                area: {
                  x: 0,
                  y: 0,
                  width: 1040,
                  height: 585,
                },
                externalLink: {
                  linkUri: 'https://example.com/see_more.html',
                  label: 'See More',
                },
              },
              actions: [
                {
                  type: 'uri',
                  linkUri: 'https://example.com/',
                  area: {
                    x: 0,
                    y: 0,
                    width: 520,
                    height: 1040,
                  },
                },
                {
                  type: 'message',
                  text: 'hello',
                  area: {
                    x: 520,
                    y: 0,
                    width: 520,
                    height: 1040,
                  },
                },
              ],
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastImagemap(
        [RECIPIENT_ID],
        'this is an imagemap',
        {
          baseUrl: 'https://example.com/bot/images/rm001',
          baseSize: {
            height: 1040,
            width: 1040,
          },
          video: {
            originalContentUrl: 'https://example.com/video.mp4',
            previewImageUrl: 'https://example.com/video_preview.jpg',
            area: {
              x: 0,
              y: 0,
              width: 1040,
              height: 585,
            },
            externalLink: {
              linkUri: 'https://example.com/see_more.html',
              label: 'See More',
            },
          },
          actions: [
            {
              type: 'uri',
              linkUri: 'https://example.com/',
              area: {
                x: 0,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
            {
              type: 'message',
              text: 'hello',
              area: {
                x: 520,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
          ],
        }
      );

      expect(res).toEqual(reply);