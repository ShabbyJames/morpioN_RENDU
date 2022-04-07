import MockAdapter from 'axios-mock-adapter';

import ViberClient from '../ViberClient';
import * as ViberTypes from '../ViberTypes';

const { EventType } = ViberTypes;

const AUTH_TOKEN = '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9';

const RECEIVER = '1234567890';

const SENDER = {
  name: 'John McClane',
  avatar: 'http://avatar.example.com',
};

const createMock = (): { client: ViberClient; mock: MockAdapter } => {
  const client = new ViberClient({
    accessToken: AUTH_TOKEN,
    sender: SENDER,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('webhooks', () => {
  describe('#setWebhook', () => {
    it('should response eventTypes was set', async () => {
      const { client, mock } = createMock();
      const reply = {
        status: 0,
        statusMessage: 'ok',
        eventTypes: [
          'delivered',
          'seen',
          'failed',
          'subscribed',
          'unsubscribed',
          'conversation_started',
        ],
      };

      mock
        .onPost('/set_webhook', { url: 'https://4a16faff.ngrok.io/' })
        .reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/');

      expect(res).toEqual(reply);
    });

    it('should work with custom event types', async () => {
      const { client, mock } = createMock();
      const reply = {
        status: 0,
        statusMessage: 'ok',
        eventTypes: ['delivered', 'seen', 'conversation_started'],
      };

      mock
        .onPost('/set_webhook', {
          url: 'https://4a16faff.ngrok.io/',
          event_types: ['delivered', 'seen