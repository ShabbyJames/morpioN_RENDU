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
          event_types: ['delivered', 'seen', 'conversation_started'],
        })
        .reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/', [
        EventType.Delivered,
        EventType.Seen,
        EventType.ConversationStarted,
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#removeWebhook', () => {
    it('should remove subscribed webhook', async () => {
      const { client, mock } = createMock();
      const reply = {
        status: 0,
        statusMessage: 'ok',
      };

      mock.onPost('/set_webhook', { url: '' }).reply(200, reply);

      const res = await client.removeWebhook();

      expect(res).toEqual(reply);
    });
  });
});

describe('send message', () => {
  describe('#sendMessage', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'text',
          text: 'Hello',
        })
        .reply(200, reply);

      const res = await client.sendMessage(RECEIVER, {
        type: 'text',
        text: 'Hello',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendText', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'text',
          text: 'Hello',
        })
        .reply(200, reply);

      const res = await client.sendText(RECEIVER, 'Hello');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendPicture', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'picture',
          text: 'Photo description',
          media: 'http://www.images.com/img.jpg',
          thumbnail: 'http://www.images.com/thumb.jpg',
        })
        .reply(200, reply);

      const res = await client.sendPicture(RECEIVER, {
        text: 'Photo description',
        media: 'http://www.images.com/img.jpg',
        thumbnail: 'http://www.images.com/thumb.jpg',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVideo', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'video',
          media: 'http://www.images.com/video.mp4',
          size: 10000,
          thumbnail: 'http://www.images.com/thumb.jpg',
          duration: 10,
        })
        .reply(200, reply);

      const res = await client.sendVideo(RECEIVER, {
        media: 'http://www.images.com/video.mp4',
        size: 10000,
        thumbnail: 'http://www.images.com/thumb.jpg',
        duration: 10,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendFile', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'file',
          media: 'http://www.images.com/file.doc',
          size: 10000,
          file_name: 'name_of_file.doc',
        })
        .reply(200, reply);

      const res = await client.sendFile(RECEIVER, {
        media: 'http://www.images.com/file.doc',
        size: 10000,
        fileName: 'name_of_file.doc',
      });

      expect(res).toEqual(reply);
    });

    it('should support snakecase', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'file',
          media: 'http://www.images.com/file.doc',
          size: 10000,
          file_name: 'name_of_file.doc',
        })
        .reply(200, reply);

      const res = await client.sendFile(RECEIVER, {
        media: 'http://www.images.com/file.doc',
        size: 10000,
        // @ts-expect-error
        file_name: 'name_of_file.doc',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendContact', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'contact',
          contact: {
            name: 'Itamar',
            phone_number: '+972511123123',
          },
        })
        .reply(200, reply);

      const res = await client.sendContact(RECEIVER, {
        name: 'Itamar',
        phoneNumber: '+972511123123',
      });

      expect(res).toEqual(reply);
    });

    it('should support snakecase', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'contact',
          contact: {
            name: 'Itamar',
            phone_number: '+972511123123',
          },
        })
        .reply(200, reply);

      const res = await client.sendContact(RECEIVER, {
        name: 'Itamar',
        // @ts-expect-error
        phone_number: '+972511123123',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendLocation', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'location',
          location: {
            lat: '37.7898',
            lon: '-122.3942',
          },
        })
        .reply(200, reply);

      const res = await client.sendLocation(RECEIVER, {
        lat: '37.7898',
        lon: '-122.3942',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendURL', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'url',
          media: 'http://developers.viber.com',
        })
        .reply(200, reply);

      const res = await client.sendURL(RECEIVER, 'http://developers.viber.com');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendSticker', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'sticker',
          sticker_id: 46105,
        })
        .reply(200, reply);

      const res = await client.sendSticker(RECEIVER, 46105);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendCarouselContent', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        statusMessage: 'ok',
        messageToken: 5098034272017990000,
      };

      const richMedia = {
        type: 'rich_media',
        buttonsGroupColumns: 6,
        buttonsGroupRows: 7,
        bgColor: '#FFFFFF',
        buttons: [
          {
            columns: 6,
            rows: 3,
            actionType: 'open-url',
            actionBody: 'https://www.google.com',
            image: 'http://html-test:8080/myweb/guy/assets/imageRMsmall2.png',
          },
          {
            columns: 6,
            rows: 2,
            text: '<font color=#323232><b>Headphones with Microphone, On-ear Wired earphones</b></font><font color=#777777><br>Sound Intone </font><font color=#6fc133>$17.99</font>',
            actionType: 'open-url',
            actionBody: 'https://www.google.com',
            textSize: 'medium',
            textVAlign: 'middle',
            textHAlign: 'left',
          },
          {
            columns: 6,
            rows: 1,
            actionType: 'reply',
            actionBody: 'https://www.google.com',
            text: '<font color=#ffffff>Buy</font>',
            textSize: 'large',
            textVAlign: 'middle',
            textHAlign: 'middle',
            image: 'https://s14.postimg.org/4mmt4rw1t/Button.png',
          },
          {
            columns: 6,
            rows: 1,
            actionType: 'reply',
            actionBody: 'https://www.google.com',
            text: '<font color=#8367db>MORE DETAILS</font>',
            textSize: 'small',
            textVAlign: 'middle',
            textHAlign: 'middle',
          },
          {
            columns: 6,
            rows: 3,
            ActionType: 'open-url',
            ActionBody: 'https://www.google.com',
            Image: 'https://s16.postimg.org/wi8jx20wl/image_RMsmall2.png',
          },
          {
            columns: 6,
            rows: 2,
            text: "<font color=#323232><b>Hanes Men's Humor Graphic T-Shirt</b></font><font color=#777777><br>Hanes</font><font color=#6fc133>$10.99</font>",
            actionType: 'open-url',
            actionBody: 'https://www.google.com',
            textSize: 'medium',
            textVAlign: 'middle',
            textHAlign: 'left',
          },
        