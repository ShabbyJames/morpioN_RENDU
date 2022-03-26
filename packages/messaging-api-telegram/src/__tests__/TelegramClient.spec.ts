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
          timeout: 0,
          allowed_updates: [],
        })
        .reply(200, reply);

      const res = await client.getUpdates({
        offset: 9527,
        limit: 10,
        timeout: 0,
        allowedUpdates: [],
      });

      expect(res).toEqual(result);
    });
  });

  describe('#getWebhookInfo', () => {
    it('should response webhook info', async () => {
      const { client, mock } = createMock();
      const result = {
        url: 'https://4a16faff.ngrok.io/',
        hasCustomCertificate: false,
        pendingUpdateCount: 0,
        maxConnections: 40,
      };
      const reply = {
        ok: true,
        result: {
          url: 'https://4a16faff.ngrok.io/',
          has_custom_certificate: false,
          pending_update_count: 0,
          max_connections: 40,
        },
      };

      mock.onPost('/getWebhookInfo').reply(200, reply);

      const res = await client.getWebhookInfo();

      expect(res).toEqual(result);
    });
  });

  describe('#setWebhook', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
      description: 'Webhook was set',
    };

    it('should response webhook was set', async () => {
      const { client, mock } = createMock();
      mock.onPost('/setWebhook').reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/');

      expect(res).toEqual(result);
    });

    it('should ignore certificate options and transform all options to snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/setWebhook', {
          url: 'https://4a16faff.ngrok.io/',
          max_connections: 40,
          allowed_updates: [],
        })
        .reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/', {
        certificate: 'qq',
        maxConnections: 40,
        allowedUpdates: [],
      });

      expect(res).toEqual(result);
    });

    it('should work well with snakecase options', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/setWebhook', {
          url: 'https://4a16faff.ngrok.io/',
          max_connections: 40,
          allowed_updates: [],
        })
        .reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/', {
        certificate: 'qq',
        // @ts-expect-error
        max_connections: 40,
        allowed_updates: [],
      });

      expect(res).toEqual(result);
    });
  });

  describe('#deleteWebhook', () => {
    it('should response webhook is already deleted', async () => {
      const { client, mock } = createMock();
      const result = true;
      const reply = {
        ok: true,
        result,
        description: 'Webhook is already deleted',
      };

      mock.onPost('/deleteWebhook').reply(200, reply);

      const res = await client.deleteWebhook();

      expect(res).toEqual(result);
    });
  });
});

describe('get api', () => {
  describe('#getMe', () => {
    it('should response bot profile', async () => {
      const { client, mock } = createMock();
      const result = {
        id: 313534466,
        firstName: 'first',
        username: 'a_bot',
      };
      const reply = {
        ok: true,
        result: {
          id: 313534466,
          first_name: 'first',
          username: 'a_bot',
        },
      };

      mock.onPost('/getMe').reply(200, reply);

      const res = await client.getMe();

      expect(res).toEqual(result);
    });
  });

  describe('#getUserProfilePhotos', () => {
    const result = {
      totalCount: 3,
      photos: [
        [
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
            fileSize: 14650,
            width: 160,
            height: 160,
          },
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
            fileSize: 39019,
            width: 320,
            height: 320,
          },
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
            fileSize: 132470,
            width: 640,
            height: 640,
          },
        ],
        [
          {
            fileId: 'AgABXQSPEUo4Gz8cZAeR-ouu7XBx93EeqRkABHahi76pN-aO0UoDO203',
            fileSize: 14220,
            width: 160,
            height: 160,
          },
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAT90',
            fileSize: 35122,
            width: 320,
            height: 320,
          },
          {
            fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
            fileSize: 106356,
            width: 640,
            height: 640,
          },
        ],
      ],
    };
    const reply = {
      ok: true,
      result: {
        total_count: 3,
        photos: [
          [
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
              file_size: 14650,
              width: 160,
              height: 160,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
              file_size: 39019,
              width: 320,
              height: 320,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
              file_size: 132470,
              width: 640,
              height: 640,
            },
          ],
          [
            {
              file_id:
                'AgABXQSPEUo4Gz8cZAeR-ouu7XBx93EeqRkABHahi76pN-aO0UoDO203',
              file_size: 14220,
              width: 160,
              height: 160,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAT90',
              file_size: 35122,
              width: 320,
              height: 320,
            },
            {
              file_id:
                'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
              file_size: 106356,
              width: 640,
              height: 640,
            },
          ],
        ],
      },
    };

    it('should response a list of profile pictures for the user', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/getUserProfilePhotos', {
          user_id: 313534466,
          offset: 0,
          limit: 2,
        })
        .reply(200, reply);

      const res = await client.getUserProfilePhotos(313534466, {
        offset: 0,
        limit: 2,
      });

      expect(res).toEqual(result);
    });
  });

  describe('#getFile', () => {
    it('should response info about the file', async () => {
      const { client, mock } = createMock();
      const result = {
        fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
        fileSize: 106356,
        filePath: 'photos/1068230105874016297.jpg',
      };
      const reply = {
        ok: true,
        result: {
          file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
          file_size: 106356,
          file_path: 'photos/1068230105874016297.jpg',
        },
      };

      mock
        .onPost('/getFile', {
          file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
        })
        .reply(200, reply);

      const res = await client.getFile(
        'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2'
      );

      expect(res).toEqual(result);
    });
  });

  describe('#getFileLink', () => {
    it('should response file link about the file', async () => {
      const { client, mock } = createMock();
      const filePath = 'photos/1068230105874016297.jpg';
      const reply = {
        ok: true,
        result: {
          file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
          file_size: 106356,
          file_path: filePath,
        },
      };

      mock
        .onPost('/getFile', {
          file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
        })
        .reply(200, reply);

      const res = await client.getFileLink(
        'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2'
      );

      expect(res).toEqual(
        `https://api.telegram.org/file/bot${ACCESS_TOKEN}/${filePath}`
      );
    });
  });

  describe('#getChat', () => {
    it('should response information about the chat', async () => {
      const { client, mock } = createMock();
      const result = {
        id: 313534466,
        firstName: 'first',
        lastName: 'last',
        username: 'username',
        type: 'private',
      };
      const reply = {
        ok: true,
        result: {
          id: 313534466,
          first_name: 'first',
          last_name: 'last',
          username: 'username',
          type: 'private',
        },
      };

      mock
        .onPost('/getChat', {
          chat_id: 313534466,
        })
        .reply(200, reply);

      const res = await client.getChat(313534466);

      expect(res