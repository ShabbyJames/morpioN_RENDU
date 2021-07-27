import fs from 'fs';
import path from 'path';

import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const createMock = (): {
  client: LineClient;
  mock: MockAdapter;
  dataMock: MockAdapter;
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
  const dataMock = new MockAdapter(client.dataAxios);
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };
  return { client, mock, dataMock, headers };
};

describe('Rich Menu', () => {
  describe('#getRichMenuList', () => {
    it('should call api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {
        richmenus: [
          {
            richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
            size: {
              width: 2500,
              height: 1686,
            },
            selected: false,
            name: 'Nice richmenu',
            chatBarText: 'Tap here',
            areas: [
              {
                bounds: {
                  x: 0,
                  y: 0,
                  width: 2500,
                  height: 1686,
                },
                action: {
                  type: 'postback',
                  data: 'action=buy&itemid=123',
                },
              },
            ],
          },
        ],
      };

      mock.onGet().reply((config) => {
        expect(config.url).toEqual('/v2/bot/richmenu/list');
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getRichMenuList();

      expect(res).toEqual([
        {
          richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
          size: {
            width: 2500,
            height: 1686,
          },
          selected: false,
          name: 'Nice richmenu',
          chatBarText: 'Tap here',
          areas: [
            {
              bounds: {
                x: 0,
                y: 0,
                width: 2500,
                height: 1686,
              },
              action: {
                type: 'postback',
                data: 'action=buy&itemid=123',
              },
            },
          ],
        },
      ]);
    });
  });

  describe('#getRichMenu', () => {
    it('should call api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {
        richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
        size: {
          width: 2500,
          height: 1686,
        },
        selected: false,
        name: 'Nice richmenu',
        chatBarText: 'Tap here',
        areas: [
          {
            bounds: {
              x: 0,
              y: 0,
              width: 2500,
              height: 1686,
            },
            action: {
              type: 'postback',
              data: 'action=buy&itemid=123',
            },
          },
        ],
      };

      mock.onGet().reply((config) => {
        expect(config.url).toEqual(
          '/v2/bot/richmenu/richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getRichMenu(
        'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
      );

      expect(res).toEqual(reply);
    });

    it('should return null when no rich menu found', async () => {
      const { client, mock } = createMock();

      mock.onGet().reply(404, {
        message: 'richmenu not found',
        details: [],
      });

      const res = await client.getRichMenu(
        'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
      );

      expect(res).toEqual(null);
    });
  });

  describe('#createRichMenu', () => {
    it('should call api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {
        richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
      };

      const richMenuObject = {
        size: {
          width: 2500 as const,
          height: 1686 as const,
        },
        selected: false,
        name: 'Nice richmenu',
        chatBarText: 'Tap here',
        areas: [
          {
            bounds: {
              x: 0,
              y: 0,
              width: 2500,
              height: 1686,
            },
            action: {
              type: 'postback',
              data: 'action=buy&itemid=123',
            },
          },
        ],
      };

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/richmenu');
        expect(JSON.parse(config.data)).toEqual(richMenuObject);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.createRichMenu(richMenuObject);

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteRichMenu', () => {
    it('should call api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onDelete().reply((config) => {
        expect(config.url).toEqual('/v2/bot/richmenu/1');
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.deleteRichMenu('1');

      expect(res).toEqual(reply);
    });
  });

  describe('#getLinkedRichMenu', () => {
    it('should call api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {
        richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
      };

      mock.onGet().reply((config) => {
        expect(config.url).toEqual('/v2/bot/user/1/richmenu');
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getLinkedRichMenu('1');

      expect(res).toEqual(reply);
    });

    it('should return null when no rich menu found', async () => {
      const { client, mock } = createMock();

      mock.onGet().reply(404, {
        message: 'the user has no richmenu',
        details: [],
      });

      const res = await client.getLinkedRichMenu(
        'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
      );

      expect(res).toEqual(null);
    });
  });

  describe('#linkRichMenu', () => {
    it('should call api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/user/1/richmenu/2');
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.linkRichMenu('1', '2');

      expect(res).toEqual(reply);
    });
  });

  describe('#unlinkRichMenu', () => {
    it('should call api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onDelete().reply((config) => {
        expect(config.url).toEqual('/v2/bot/user/1/richmenu');
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.unlinkRichMenu('1');

      expect(res).toEqual(reply);
    });
  });

  describe('#uploadRichMenuImage', () => {
    it('should call api', async 