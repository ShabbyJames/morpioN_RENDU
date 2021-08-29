
import MockAdapter from 'axios-mock-adapter';

import { MessengerClient } from '..';

const ACCESS_TOKEN = '1234567890';
const USER_ID = '1QAZ2WSX';

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

describe('Handover Protocol API', () => {
  describe('#passThreadControl', () => {
    it('should call messages api to pass thread control', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.passThreadControl(
        USER_ID,
        123456789,
        'free formed text for another app'
      );

      expect(url).toEqual(
        `/me/pass_thread_control?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        target_app_id: 123456789,
        metadata: 'free formed text for another app',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#passThreadControlToPageInbox', () => {
    it('should call messages api to pass thread control to page inbox', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.passThreadControlToPageInbox(
        USER_ID,
        'free formed text for another app'
      );

      expect(url).toEqual(
        `/me/pass_thread_control?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,