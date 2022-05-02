
import MockAdapter from 'axios-mock-adapter';

import WechatClient from '../WechatClient';
import * as WechatTypes from '../WechatTypes';

const { MediaType } = WechatTypes;

const APP_ID = 'APP_ID';
const APP_SECRET = 'APP_SECRET';

const RECIPIENT_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';

const createMock = (): { client: WechatClient; mock: MockAdapter } => {
  const client = new WechatClient({
    appId: APP_ID,
    appSecret: APP_SECRET,
  });
  const mock = new MockAdapter(client.axios);

  mock
    .onGet('/token?grant_type=client_credential&appid=APP_ID&secret=APP_SECRET')
    .reply(200, {
      access_token: ACCESS_TOKEN,
      expires_in: 7200,
    });

  return { client, mock };
};

describe('access token', () => {
  describe('#getAccessToken', () => {
    it('should response access_token and expires_in', async () => {
      const { client } = createMock();

      const reply = {
        accessToken: ACCESS_TOKEN,
        expiresIn: 7200,
      };

      const res = await client.getAccessToken();

      expect(res).toEqual(reply);
    });
  });
});

describe('media', () => {
  describe('#uploadMedia', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        type: 'image',
        media_id: 'MEDIA_ID',
        created_at: 123456789,
      };

      const camelcaseReply = {
        type: 'image',
        mediaId: 'MEDIA_ID',
        createdAt: 123456789,
      };

      mock
        .onPost(`/media/upload?access_token=${ACCESS_TOKEN}&type=image`)
        .reply(200, reply);

      const res = await client.uploadMedia(
        MediaType.Image,
        Buffer.from('1234')
      );

      expect(res).toEqual(camelcaseReply);
    });
  });

  describe('#getMedia', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        video_url: 'http://www.example.com/image.jpg',
      };

      const camelcaseReply = {
        videoUrl: 'http://www.example.com/image.jpg',
      };

      mock
        .onGet(`/media/get?access_token=${ACCESS_TOKEN}&media_id=MEDIA_ID`)
        .reply(200, reply);

      const res = await client.getMedia('MEDIA_ID');

      expect(res).toEqual(camelcaseReply);
    });
  });
});

describe('send api', () => {
  describe('#sendRawBody', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'text',
          text: {
            content: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendRawBody({
        touser: RECIPIENT_ID,
        msgtype: 'text',
        text: {
          content: 'Hello!',
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendText', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'text',
          text: {
            content: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendText(RECIPIENT_ID, 'Hello!');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendImage', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'image',
          image: {
            media_id: 'MEDIA_ID',
          },
        })
        .reply(200, reply);

      const res = await client.sendImage(RECIPIENT_ID, 'MEDIA_ID');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVoice', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'voice',
          voice: {
            media_id: 'MEDIA_ID',
          },
        })
        .reply(200, reply);

      const res = await client.sendVoice(RECIPIENT_ID, 'MEDIA_ID');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVideo', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'video',
          video: {
            media_id: 'MEDIA_ID',
            thumb_media_id: 'MEDIA_ID',
            title: 'TITLE',
            description: 'DESCRIPTION',
          },
        })
        .reply(200, reply);

      const res = await client.sendVideo(RECIPIENT_ID, {
        mediaId: 'MEDIA_ID',
        thumbMediaId: 'MEDIA_ID',
        title: 'TITLE',
        description: 'DESCRIPTION',
      });

      expect(res).toEqual(reply);
    });

    it('should support snakecase', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'video',
          video: {
            media_id: 'MEDIA_ID',
            thumb_media_id: 'MEDIA_ID',
            title: 'TITLE',
            description: 'DESCRIPTION',
          },
        })
        .reply(200, reply);

      const res = await client.sendVideo(RECIPIENT_ID, {
        // @ts-expect-error
        media_id: 'MEDIA_ID',
        thumb_media_id: 'MEDIA_ID',
        title: 'TITLE',
        description: 'DESCRIPTION',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendMusic', () => {
    it('should call wechat api', async () => {