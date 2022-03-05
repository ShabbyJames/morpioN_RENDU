import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

const createMock = (): { client: TelegramClient; mock: MockAdapter } => {
  const client = new TelegramClient({
    accessToken: ACCESS_TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('group api', () => {
  describe('#kickChatMember', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
    };

    it('should kick chat member with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/kickChatMember', {
          chat_id: 427770117,
          user_id: 313534466,
          until_date: 1502855973,
        })
        .reply(200, reply);

      const res = await client.kickChatMember(427770117, 313534466, {
        until_date: 1502855973,
      });
      expect(res).toEqual(result);
    });

    it('should kick chat member with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/kickChatMember', {
          chat_id: 427770117,
          user_id: 313534466,
          until_date: 1502855973,
        })
        .reply(200, reply);

      const res = await client.kickChatMember(427770117, 313534466, {
        untilDate: 1502855973,
      });
      expect(res).toEqual(result);
    });
  });

  describe('#unbanChatMember', () => {
    it('should unban chat member', async () => {
      const { client, mock } = createMock();
      const result = true;
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/unbanChatMember', {
          chat_id: 427770117,
          user_id: 313534466,
        })
        .reply(200, reply);

      const res = await client.unbanChatMember(427770117, 313534466);
      expect(res).toEqual