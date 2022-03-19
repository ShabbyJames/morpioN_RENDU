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

describe('sticker set api', () => {
  describe('#getStickerSet', () => {
    it('should return a stickerSet', async () => {
      const { client, mock } = createMock();
      const result = {
        name: 'sticker set name',
        title: 'sticker set title',
        isAnimated: false,
        containsMasks: false,
        stickers: [
          {
            width: 512,
            height: 512,
            emoji: '💛',
            setName: 'sticker set name',
            isAnimated: false,
            thumb: {
              fileId: 'AAQEAANDAQACEDVoAAFVA7aGNPt1If3eYTAABAEAB20AAzkOAAIWB',
              fileSize: 5706,
              width: 128,
              height: 128,
            },
            fileId: 'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB',
            fileSize: 36424,
          },
        ],
      };
      const reply = {
        ok: true,
        result: {
          name: 'sticker set name',
          title: 'sticker set title',
          is_animated: false,
          contains_masks: false,
          stickers: [
            {
              width: 512,
              height: 512,
              emoji: '💛',
              set_name: 'sticker set name',
              is_animated: false,
              thumb: {
                file_id:
                