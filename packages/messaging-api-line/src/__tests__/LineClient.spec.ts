import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const RECIPIENT_ID = '1QAZ2WSX';
const REPLY_TOKEN = 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA';
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

describe('Content', () => {
  describe('#getMessageContent', () => {
    it('should call getMessageContent api', async () => {
      const { client, dataMock } = createMock();

      const reply = Buffer.from('a content buffer');

      const MESSAGE_ID = '1234567890';

      dataMock.onGet(`/v2/bot/message/${MESSAGE_ID}/content`).reply(200, reply);

      const res = await client.getMessageContent(MESSAGE_ID);

      expect(res).toEqual(reply);
    });
  });
});

describe('Profile', () => {
  describe('#getUserProfile', () => {
    it('should response user profile', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
        statusMessage: 'Hello, LINE!',
      };

      mock.onGet().reply((config) => {
        expect(config.url).toEqual(`/v2/bot/profile/${RECIPIENT_ID}`);
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getUserProfile(RECIPIENT_ID);

      expect(res).toEqual(reply);
    });

    it('should r