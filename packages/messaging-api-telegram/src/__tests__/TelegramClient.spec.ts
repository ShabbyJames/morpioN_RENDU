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

describe('webhooks', () => {
  describe('#getUpdates', () => {
    it('should response array of Update objects', async () => {
      const { client, mock } = createMock();
      const result = [
        {
          updateId: 513400512,
          message: {
            messageId: 3,
            from: {
              id: 313534466,
              firstName: 'first',
              lastName: 'last',
              username: 'username',
            },
            chat: {
              id: 313534466,
              firstName: 'first',
              lastName: 'last',
              username: 'username',
              type: 'private',
            },
            date: 1499402829,
            text: 'hi',
          },
        },
        {
          updateId: 513400513,
          message: {
            messageId: 4,
            from: {
              id: 313534466,
              firstName: 'first',
              lastName: 'last',
              username: 'username',
            },
            chat: {
              id: 313534466,
              firstName: 'first',
              lastName: 'last',
              username: 'username',
              type: 'private',
            },
            date: 1484944975,
            sticker: {
              width: 512,
              height: 512,
              emoji: '\ud83d\ude0d',
              thumb: {
                fileId: 'AAQEABMr6HIwAAT9WnLtRCT6KIgiAAIC',
                fileSize: 2828,
                width: 128,
                height: 128,
              },
              fileId: 'BQADBAADrwgAAjn8EwY1EPt_ycp8OwI',
              fileSize: 14102,
            },
          },
        },
      ];
      const reply = {
        ok: true,
        result: [
          {
            update_id: 513400512,
            message: {
              message_id: 3,
              from: {
                id: 313534466,
                first_name: 'first',
                last_name: 'last',
                username: 'username',
              },
              chat: {
                id: 313534466,
                first_name: 'first',
                last_name: 'last',
                username: 'username',
                type: 'private',
              },
              date: 1499402829,
              text: 'hi',
            },
          },
          {
            update_id: 513400513,
            message: {
              message_id: 4,
              from: {
                id: 313534466,
                first_name: 'first',
                last_name: 'last',
                username: 'username',
              },
              chat: {
                id: 313534466,
                first_name: 'first',
                last_name: 'last',
                username: 'username',
                type: 'private',
              },
              date: 1484944975,
              sticker: {
                width: 512,
                height: 512,
                emoji: '\ud83d\ude0d',
                thumb: {
                  file_id: 'AAQEABMr6HIwAAT9WnLtRCT6KIgiAAIC',
                  file_size: 2828,
                  width: 128,
                  height: 128,
                },
                file_id: 'BQADBAADrwgAAjn8EwY1EPt_ycp8OwI',
                file_size: 14102,
              },
            },
          },
        ],
      };

      mock
        .onPost('/getUpdates', {
          offset: 9527,
          limit: 10,
          time