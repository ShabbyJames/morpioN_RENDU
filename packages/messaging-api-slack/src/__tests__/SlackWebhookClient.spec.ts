import MockAdapter from 'axios-mock-adapter';

import SlackWebhookClient from '../SlackWebhookClient';

const URL = 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ';

const createMock = (): { client: SlackWebhookClient; mock: MockAdapter } => {
  const client = new SlackWebhookClient({
    url: URL,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('sendRawBody', () => {
  it('should call messages api', async () => {
    const { client, mock } = createMock();

    const reply = 'ok';

    mock
      .onPost('', {
        text: 'hello',
      })
      .reply(200, reply);

    const res = await client.sendRawBody({
      text: 'hello',
    });

    expect(res).toEqual(reply);
  });
});

describe('sendText', () => {
  it('should c