import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

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

describe('LINE Front-end Framework', () => {
  describe('#getLiffAppList', () => {
    it('should call api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {
        apps: [
          {
            liffId: 'liff-12345',
            view: {
              type: 'full',
              url: 'https://example.com/myservice',
            },
          },
          {
            liffId: 'liff-67890',
            view: {
              type: 'tall',
              url: 'https://example.com/myservice2',
            },
          },
        ],
      };

      mock.onGet().reply((config) => {
        expect(config.url).toEqual('/liff/v1/apps');
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getLiffAppList();

      expect(res).toEqual([
        {
          liffId: 'liff-12345',
          view: {
            type: 'full',
            url: 'https://example.com/myservice',
          },
        },
        {
          liffId: 'liff-67890',
      