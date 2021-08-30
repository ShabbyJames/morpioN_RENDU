import MockAdapter from 'axios-mock-adapter';

import { MessengerClient } from '..';

const ACCESS_TOKEN = '1234567890';

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

describe('Page Messaging Insights API', () => {
  describe('#getInsights', () => {
    it('should call api get Insight data', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'page_messages_reported_conversations_unique',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/?metric=page_messages_reported_conversations_unique&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getInsights([
        'page_messages_reported_conversations_unique',
      ]);

      expect(res).toEqual([
        {
          name: 'page_messages_reported_conversations_unique',
        },
      ]);
    });

    it('support multiple metrics', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'page_messages_reported_conversations_unique',
          },
          {
            name: 'page_messages_blocked_conversations_unique',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/?metric=page_messages_reported_conversations_unique%2Cpage_messages_blocked_conversations_unique&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getInsights([
        'page_messages_reported_conversations_unique',
        'page_messages_blocked_conversations_unique',
      ]);

      expect(res).toEqual([
        {
          name: 'page_messages_reported_conversations_unique',
        },
        {
          name: 'page_messages_blocked_conversations_unique',
        },
      ]);
    });
  });

  describe('#getBlockedConversations', () => {
    it('should call api get Insight data', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'page_messages_blocked_conversations_unique',
            period: 'day',
            values: [
              {
                value: 83111,
                end_time: '2017-02-02T08:00:00+0000',
              },
              {
                value: 85215,
                end_time: '2017-02-03T08:00:00+0000',
              },
              {
                value: 87175,
                end_time: '2017-02-04T08:00:00+0000',
              },
            ],
            title: 'Daily unique blocked conversations count',
            description:
              'Daily: The number of conversations with the Page that have been blocked.',
            id: '1234567/insights/?metric=page_messages_blocked_conversations_unique/day',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/?metric=page_messages_blocked_conversations_unique&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getBlockedConversations();

      expect(res).toEqual({
        name: 'page_messages_blocked_conversations_unique',
        period: 'day',
        values: [
          {
            value: 83111,
            endTime: '2017-02-02T08:00:00+0000',
          },
          {
            value: 85215,
            endTime: '2017-02-03T08:00:00+0000',
          },
          {
            value: 87175,
            