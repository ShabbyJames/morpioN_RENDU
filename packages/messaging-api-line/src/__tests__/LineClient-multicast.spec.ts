
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
              address: '???150-0002 ?????????????????????????????????????????????',
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
        address: '???150-0002 ?????????????????????????????????????????????',
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
    });
  });

  describe('#multicastTemplate', () => {
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
              type: 'template',
              altText: 'this is a template',
              template: {
                type: 'buttons',
                thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
                title: 'Menu',
                text: 'Please select',
                actions: [
                  {
                    type: 'postback',
                    label: 'Buy',
                    data: 'action=buy&itemid=123',
                  },
                  {
                    type: 'postback',
                    label: 'Add to cart',
                    data: 'action=add&itemid=123',
                  },
                  {
                    type: 'uri',
                    label: 'View detail',
                    uri: 'http://example.com/page/123',
                  },
                ],
              },
            },
          ],
        });

        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastTemplate(
        [RECIPIENT_ID],
        'this is a template',
        {
          type: 'buttons',
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          title: 'Menu',
          text: 'Please select',
          actions: [
            {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=123',
            },
            {
              type: 'postback',
              label: 'Add to cart',
              data: 'action=add&itemid=123',
            },
            {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/123',
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastButtonTemplate', () => {
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
              type: 'template',
              altText: 'this is a template',
              template: {
                type: 'buttons',
                thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
                imageAspectRatio: 'rectangle',
                imageSize: 'cover',
                imageBackgroundColor: '#FFFFFF',
                title: 'Menu',
                text: 'Please select',
                defaultAction: {
                  type: 'uri',
                  label: 'View detail',
                  uri: 'http://example.com/page/123',
                },
                actions: [
                  {
                    type: 'postback',
                    label: 'Buy',
                    data: 'action=buy&itemid=123',
                  },
                  {
                    type: 'postback',
                    label: 'Add to cart',
                    data: 'action=add&itemid=123',
                  },
                  {
                    type: 'uri',
                    label: 'View detail',
                    uri: 'http://example.com/page/123',
                  },
                ],
              },
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastButtonTemplate(
        [RECIPIENT_ID],
        'this is a template',
        {
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
          imageBackgroundColor: '#FFFFFF',
          title: 'Menu',
          text: 'Please select',
          defaultAction: {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/123',
          },
          actions: [
            {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=123',
            },
            {
              type: 'postback',
              label: 'Add to cart',
              data: 'action=add&itemid=123',
            },
            {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/123',
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastConfirmTemplate', () => {
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
              type: 'template',
              altText: 'this is a confirm template',
              template: {
                type: 'confirm',
                text: 'Are you sure?',
                actions: [
                  {
                    type: 'message',
                    label: 'Yes',
                    text: 'yes',
                  },
                  {
                    type: 'message',
                    label: 'No',
                    text: 'no',
                  },
                ],
              },
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastConfirmTemplate(
        [RECIPIENT_ID],
        'this is a confirm template',
        {
          text: 'Are you sure?',
          actions: [
            {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
            {
              type: 'message',
              label: 'No',
              text: 'no',
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastCarouselTemplate', () => {
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
              type: 'template',
              altText: 'this is a carousel template',
              template: {
                type: 'carousel',
                imageAspectRatio: 'rectangle',
                imageSize: 'cover',
                columns: [
                  {
                    thumbnailImageUrl:
                      'https://example.com/bot/images/item1.jpg',
                    title: 'this is menu',
                    text: 'description',
                    actions: [
                      {
                        type: 'postback',
                        label: 'Buy',
                        data: 'action=buy&itemid=111',
                      },
                      {
                        type: 'postback',
                        label: 'Add to cart',
                        data: 'action=add&itemid=111',
                      },
                      {
                        type: 'uri',
                        label: 'View detail',
                        uri: 'http://example.com/page/111',
                      },
                    ],
                  },
                  {
                    thumbnailImageUrl:
                      'https://example.com/bot/images/item2.jpg',
                    title: 'this is menu',
                    text: 'description',
                    actions: [
                      {
                        type: 'postback',
                        label: 'Buy',
                        data: 'action=buy&itemid=222',
                      },
                      {
                        type: 'postback',
                        label: 'Add to cart',
                        data: 'action=add&itemid=222',
                      },
                      {
                        type: 'uri',
                        label: 'View detail',
                        uri: 'http://example.com/page/222',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastCarouselTemplate(
        [RECIPIENT_ID],
        'this is a carousel template',
        [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=111',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=111',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/111',
              },
            ],
          },
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=222',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=222',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/222',
              },
            ],
          },
        ],
        {
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
        }
      );

      expect(res).toEqual(reply);
    });

    it('should work without option', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
          messages: [
            {
              type: 'template',
              altText: 'this is a carousel template',
              template: {
                type: 'carousel',
                columns: [
                  {
                    thumbnailImageUrl:
                      'https://example.com/bot/images/item1.jpg',
                    title: 'this is menu',
                    text: 'description',
                    actions: [
                      {
                        type: 'postback',
                        label: 'Buy',
                        data: 'action=buy&itemid=111',
                      },
                      {
                        type: 'postback',
                        label: 'Add to cart',
                        data: 'action=add&itemid=111',
                      },
                      {
                        type: 'uri',
                        label: 'View detail',
                        uri: 'http://example.com/page/111',
                      },
                    ],
                  },
                  {
                    thumbnailImageUrl:
                      'https://example.com/bot/images/item2.jpg',
                    title: 'this is menu',
                    text: 'description',
                    actions: [
                      {
                        type: 'postback',
                        label: 'Buy',
                        data: 'action=buy&itemid=222',
                      },
                      {
                        type: 'postback',
                        label: 'Add to cart',
                        data: 'action=add&itemid=222',
                      },
                      {
                        type: 'uri',
                        label: 'View detail',
                        uri: 'http://example.com/page/222',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastCarouselTemplate(
        [RECIPIENT_ID],
        'this is a carousel template',
        [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=111',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=111',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/111',
              },
            ],
          },
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=222',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=222',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/222',
              },
            ],
          },
        ]
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastImageCarouselTemplate', () => {
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
              type: 'template',
              altText: 'this is an image carousel template',
              template: {
                type: 'image_carousel',
                columns: [
                  {
                    imageUrl: 'https://example.com/bot/images/item1.jpg',
                    action: {
                      type: 'postback',
                      label: 'Buy',
                      data: 'action=buy&itemid=111',
                    },
                  },
                  {
                    imageUrl: 'https://example.com/bot/images/item2.jpg',
                    action: {
                      type: 'message',
                      label: 'Yes',
                      text: 'yes',
                    },
                  },
                  {
                    imageUrl: 'https://example.com/bot/images/item3.jpg',
                    action: {
                      type: 'uri',
                      label: 'View detail',
                      uri: 'http://example.com/page/222',
                    },
                  },
                ],
              },
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastImageCarouselTemplate(
        [RECIPIENT_ID],
        'this is an image carousel template',
        [
          {
            imageUrl: 'https://example.com/bot/images/item1.jpg',
            action: {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=111',
            },
          },
          {
            imageUrl: 'https://example.com/bot/images/item2.jpg',
            action: {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
          },
          {
            imageUrl: 'https://example.com/bot/images/item3.jpg',
            action: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222',
            },
          },
        ]
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastFlex', () => {
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
              type: 'flex',
              altText: 'this is a flex message',
              contents: {
                type: 'bubble',
                header: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: 'Header text',
                    },
                  ],
                },
                hero: {
                  type: 'image',
                  url: 'https://example.com/flex/images/image.jpg',
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: 'Body text',
                    },
                  ],
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: 'Footer text',
                    },
                  ],
                },
                styles: {
                  comment: 'See the example of a bubble style object',
                },
              },
            },
          ],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastFlex(
        [RECIPIENT_ID],
        'this is a flex message',
        {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Header text',
              },
            ],
          },
          hero: {
            type: 'image',
            url: 'https://example.com/flex/images/image.jpg',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Body text',
              },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Footer text',
              },
            ],
          },
          styles: {
            comment: 'See the example of a bubble style object',
          },
        }
      );

      expect(res).toEqual(reply);
    });
  });
});