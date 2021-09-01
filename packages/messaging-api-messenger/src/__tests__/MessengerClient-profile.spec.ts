
import MockAdapter from 'axios-mock-adapter';

import { MessengerClient } from '..';

const ACCESS_TOKEN = '1234567890';
const USER_ID = 'abcdefg';

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

describe('messenger profile', () => {
  describe('#getMessengerProfile', () => {
    it('should respond data of messenger profile', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            get_started: {
              payload: 'GET_STARTED',
            },
          },
          {
            persistent_menu: [
              {
                locale: 'default',
                composer_input_disabled: true,
                call_to_actions: [
                  {
                    type: 'postback',
                    title: 'Restart Conversation',
                    payload: 'RESTART',
                  },
                ],
              },
            ],
          },
        ],
      };

      let url;
      mock.onGet().reply((config) => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getMessengerProfile([
        'get_started',
        'persistent_menu',
      ]);

      expect(url).toEqual(
        `/me/messenger_profile?fields=get_started,persistent_menu&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual([
        {
          getStarted: {
            payload: 'GET_STARTED',
          },
        },
        {
          persistentMenu: [
            {
              locale: 'default',
              composerInputDisabled: true,
              callToActions: [
                {
                  type: 'postback',
                  title: 'Restart Conversation',
                  payload: 'RESTART',
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('#setMessengerProfile', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setMessengerProfile({
        getStarted: {
          payload: 'GET_STARTED',
        },
        persistentMenu: [
          {
            locale: 'default',
            composerInputDisabled: true,
            callToActions: [
              {
                type: 'postback',
                title: 'Restart Conversation',
                payload: 'RESTART',
              },
            ],
          },
        ],
      });

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        get_started: {
          payload: 'GET_STARTED',
        },
        persistent_menu: [
          {
            locale: 'default',
            composer_input_disabled: true,
            call_to_actions: [
              {
                type: 'postback',
                title: 'Restart Conversation',
                payload: 'RESTART',
              },
            ],
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteMessengerProfile', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onDelete().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.deleteMessengerProfile([
        'get_started',
        'persistent_menu',
      ]);

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        fields: ['get_started', 'persistent_menu'],
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('get started button', () => {
  describe('#getGetStarted', () => {
    it('should respond data of get started', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            get_started: {
              payload: 'GET_STARTED',
            },
          },
        ],
      };

      let url;
      mock.onGet().reply((config) => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getGetStarted();

      expect(url).toEqual(
        `/me/messenger_profile?fields=get_started&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual({
        payload: 'GET_STARTED',
      });
    });

    it('should respond null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      let url;
      mock.onGet().reply((config) => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getGetStarted();

      expect(url).toEqual(
        `/me/messenger_profile?fields=get_started&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual(null);
    });
  });

  describe('#setGetStarted', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setGetStarted('GET_STARTED');

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        get_started: {
          payload: 'GET_STARTED',
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteGetStarted', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onDelete().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.deleteGetStarted();

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        fields: ['get_started'],
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('persistent menu', () => {
  describe('#getPersistentMenu', () => {
    it('should respond data of persistent menu', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            persistent_menu: [
              {
                locale: 'default',
                composer_input_disabled: true,
                call_to_actions: [
                  {
                    type: 'postback',
                    title: 'Restart Conversation',
                    payload: 'RESTART',
                  },
                  {
                    type: 'web_url',