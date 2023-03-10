import fs from 'fs';

import AxiosError from 'axios-error';
import FormData from 'form-data';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import invariant from 'ts-invariant';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeys,
  createRequestInterceptor,
  onRequest,
  snakecaseKeys,
} from 'messaging-api-common';

import * as WechatTypes from './WechatTypes';

function throwErrorIfAny(response: AxiosResponse): AxiosResponse {
  const { errcode, errmsg } = response.data;
  if (!errcode || errcode === 0) return response;
  const msg = `WeChat API - ${errcode} ${errmsg}`;
  throw new AxiosError(msg, {
    response,
    config: response.config,
    request: response.request,
  });
}

export default class WechatClient {
  /**
   * @deprecated Use `new WechatClient(...)` instead.
   */
  static connect(config: WechatTypes.ClientConfig): WechatClient {
    warning(
      false,
      '`WechatClient.connect(...)` is deprecated. Use `new WechatClient(...)` instead.'
    );
    return new WechatClient(config);
  }

  /**
   * The underlying axios instance.
   */
  readonly axios: AxiosInstance;

  /**
   * The current access token used by the client.
   */
  accessToken = '';

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  /**
   * The app ID used by the client.
   */
  private appId: string;

  /**
   * The app secret used by the client.
   */
  private appSecret: string;

  /**
   * The timestamp of the token expired time.
   */
  private tokenExpiresAt = 0;

  constructor(config: WechatTypes.ClientConfig) {
    invariant(
      typeof config !== 'string',
      `WechatClient: do not allow constructing client with ${config} string. Use object instead.`
    );

    this.appId = config.appId;
    this.appSecret = config.appSecret;
    this.onRequest = config.onRequest || onRequest;
    const { origin } = config;

    this.axios = axios.create({
      baseURL: `${origin || 'https://api.weixin.qq.com'}/cgi-bin/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axios.interceptors.request.use(
      createRequestInterceptor({
        onRequest: this.onRequest,
      })
    );
  }

  private async refreshToken(): Promise<void> {
    const { accessToken, expiresIn } = await this.getAccessToken();

    this.accessToken = accessToken;
    this.tokenExpiresAt = Date.now() + expiresIn * 1000;
  }

  private async refreshTokenWhenExpired(): Promise<void> {
    if (Date.now() > this.tokenExpiresAt) {
      await this.refreshToken();
    }
  }

  /**
   * ?????? access_token
   *
   * @returns Access token info
   *
   * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
   *
   * @example
   *
   * ```js
   * await client.getAccessToken();
   * // {
   * //   accessToken: "ACCESS_TOKEN",
   * //   expiresIn: 7200
   * // }
   * ```
   */
  getAccessToken(): Promise<WechatTypes.AccessToken> {
    return this.axios
      .get<
        | { access_token: string; expires_in: number }
        | WechatTypes.FailedResponseData
      >(
        `/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`
      )
      .then(throwErrorIfAny)
      .then(
        (res) =>
          camelcaseKeys(res.data, {
            deep: true,
          }) as any
      );
  }

  /**
   * ????????????
   *
   * ??????????????????????????? 3 ????????? 3 ?????? media_id ?????????
   *
   * ?????????image???- 2M????????? PNG,JPEG,JPG,GIF ??????
   * ?????????voice???- 2M???????????????????????? 60s????????? AMR,MP3 ??????
   * ?????????video???- 10MB????????? MP4 ??????
   * ????????????thumb???- 64KB????????? JPG ??????
   */

  /**
   * ???????????????????????????
   *
   * @param type - Type of the media to upload.
   * @param media - Buffer or stream of the media to upload.
   * @returns Info of the uploaded media.
   *
   * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738726
   *
   * @example
   *
   * ```js
   * const fs = require('fs');
   *
   * const buffer = fs.readFileSync('test.jpg');
   *
   * await client.uploadMedia('image', buffer);
   * // {
   * //   type: 'image',
   * //   mediaId: 'MEDIA_ID',
   * //   createdAt: 123456789
   * // }
   * ```
   */
  async uploadMedia(
    type: WechatTypes.MediaType,
    media: Buffer | fs.ReadStream
  ): Promise<WechatTypes.UploadedMedia> {
    await this.refreshTokenWhenExpired();

    const form = new FormData();

    form.append('media', media);

    return this.axios
      .post<
        | { type: string; media_id: string; created_at: number }
        | WechatTypes.FailedResponseData
      >(`/media/upload?access_token=${this.accessToken}&type=${type}`, form, {
        headers: form.getHeaders(),
      })
      .then(throwErrorIfAny)
      .then(
        (res) =>
          camelcaseKeys(res.data, {
            deep: true,
          }) as any
      );
  }

  /**
   * ???????????????????????????
   *
   * @param mediaId - ID of the media to get.
   * @returns Info of the media.
   *
   * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738727
   *
   * @example
   *
   * ```js
   * await client.getMedia(MEDIA_ID);
   * // {
   * //   videoUrl: "..."
   * // }
   * ```
   */
  async getMedia(mediaId: string): Promise<WechatTypes.Media> {
    await this.refreshTokenWhenExpired();

    return this.axios
      .get<{ video_url: string } | WechatTypes.FailedResponseData>(
        `/media/get?access_token=${this.accessToken}&media_id=${mediaId}`
      )
      .then(throwErrorIfAny)
      .then(
        (res) =>
          camelcaseKeys(res.data, {
            deep: true,
          }) as any
      );
  }

  /**
   * ????????????-????????????
   *
   * @internal
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   */
  async sendRawBody(
    body: {
      touser: string;
    } & WechatTypes.SendMessageOptions &
      (
        | {
            msgtype: 'text';
            text: {
              content: string;
            };
          }
        | {
            msgtype: 'image';
            image: {
              mediaId: string;
            };
          }
        | {
            msgtype: 'voice';
            voice: {
              mediaId: string;
            };
          }
        | {
            msgtype: 'video';
            video: WechatTypes.Video;
          }
        | {
            msgtype: 'music';
            music: WechatTypes.Music;
          }
        | {
            msgtype: 'news';
            news: WechatTypes.News;
          }
        | {
            msgtype: 'mpnews';
            mpnews: {
              mediaId: string;
            };
          }
        | {
            msgtype: 'msgmenu';
            msgmenu: WechatTypes.MsgMenu;
          }
        | {
            msgtype: 'wxcard';
            wxcard: {
              cardId: string;
            };
          }
        | {
            msgtype: 'miniprogrampage';
            miniprogrampage: WechatTypes.MiniProgramPage;
          }
      )
  ): Promise<WechatTypes.SucceededResponseData> {
    await this.refreshTokenWhenExpired();

    return this.axios
      .post<WechatTypes.ResponseData>(
        `/message/custom/send?access_token=${this.accessToken}`,
        snakecaseKeys(body, { deep: true })
      )
      .then(throwErrorIfAny)
      .then(
        (res) =>
          camelcaseKeys(res.data, {
            deep: true,
          }) as any
      );
  }

  /**
   * ??????????????????
   *
   * @param userId - User ID of the recipient
   * @param text - Text to be sent.
   * @param options - The other parameters.
   * @returns Error code and error message.
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   *
   * @example
   *
   * ```js
   * await client.sendText(USER_ID, 'Hello!');
   * ```
   */
  sendText(
    userId: string,
    text: string,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'text',
      text: {
        content: text,
      },
      ...options,
    });
  }

  /**
   * ??????????????????
   *
   * @param userId - User ID of the recipient
   * @param mediaId - ID of the media to be sent.
   * @param options - The other parameters.
   * @returns Error code and error message.
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   *
   * @example
   *
   * ```js
   * await client.sendImage(USER_ID, 'MEDIA_ID');
   * ```
   */
  sendImage(
    userId: string,
    mediaId: string,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'image',
      image: {
        mediaId,
      },
      ...options,
    });
  }

  /**
   * ??????????????????
   *
   * @param userId - User ID of the recipient
   * @param mediaId - ID of the media to be sent.
   * @param options - The other parameters.
   * @returns Error code and error message.
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   *
   * @example
   *
   * ```js
   * await client.sendVoice(USER_ID, 'MEDIA_ID');
   * ```
   */
  sendVoice(
    userId: string,
    mediaId: string,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'voice',
      voice: {
        mediaId,
      },
      ...options,
    });
  }

  /**
   * ??????????????????
   *
   * @param userId - User ID of the recipient
   * @param video - Info of the video to be sent.
   * @param options - The other parameters.
   * @returns Error code and error message.
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   *
   * @example
   *
   * ```js
   * await client.sendVideo(USER_ID, {
   *   mediaId: 'MEDIA_ID',
   *   thumbMediaId: 'THUMB_MEDIA_ID',
   *   title: 'VIDEO_TITLE',
   *   description: 'VIDEO_DESCRIPTION',
   * });
   * ```
   */
  sendVideo(
    userId: string,
    video: WechatTypes.Video,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'video',
      video,
      ...options,
    });
  }

  /**
   * ??????????????????
   *
   * @param userId - User ID of the recipient
   * @param news - Data of the music to be sent.
   * @param options - The other parameters.
   * @returns Error code and error message.
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   *
   * @example
   *
   * ```js
   * await client.sendMusic(USER_ID, {
   *   musicurl: 'MUSIC_URL',
   *   hqmusicurl: 'HQ_MUSIC_URL',
   *   thumbMediaId: 'THUMB_MEDIA_ID',
   *   title: 'MUSIC_TITLE',
   *   description: 'MUSIC_DESCRIPTION',
   * });
   * ```
   */
  sendMusic(
    userId: string,
    music: WechatTypes.Music,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'music',
      music,
      ...options,
    });
  }

  /**
   * ?????????????????????????????????????????????
   *
   * ??????????????????????????? 8 ?????????????????????????????????????????? 8????????????????????????
   *
   * @param userId - User ID of the recipient
   * @param news - Data of the news to be sent.
   * @param options - The other parameters.
   * @returns Error code and error message.
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   *
   * @example
   *
   * ```js
   * await client.sendNews(USER_ID, {
   *   articles: [
   *     {
   *       title: 'Happy Day',
   *       description: 'Is Really A Happy Day',
   *       url: 'URL',
   *       picurl: 'PIC_URL',
   *     },
   *     {
   *       title: 'Happy Day',
   *       description: 'Is Really A Happy Day',
   *       url: 'URL',
   *       picurl: 'PIC_URL',
   *     },
   *   ],
   * });
   * ```
   */
  sendNews(
    userId: string,
    news: WechatTypes.News,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'news',
      news,
      ...options,
    });
  }

  /**
   * ?????????????????????????????????????????????????????????
   *
   * ??????????????????????????? 8 ?????????????????????????????????????????? 8????????????????????????
   *
   * @param userId - User ID of the recipient
   * @param mediaId - ID of the media to be sent.
   * @param options - The other parameters.
   * @returns Error code and error message.
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   *
   * @example
   *
   * ```js
   * await client.sendMPNews(USER_ID, 'MEDIA_ID');
   * ```
   */
  sendMPNews(
    userId: string,
    mediaId: string,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'mpnews',
      mpnews: {
        mediaId,
      },
      ...options,
    });
  }

  /**
   * ??????????????????
   *
   * @param userId - User ID of the recipient
   * @param msgMenu - Data of the msg menu to be sent.
   * @param options - The other parameters.
   * @returns Error code and error message.
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   *
   * @example
   *
   * ```js
   * await client.sendMsgMenu(USER_ID, {
   *   headContent: 'HEAD',
   *   list: [
   *     {
   *       id: '101',
   *       content: 'Yes',
   *     },
   *     {
   *       id: '102',
   *       content: 'No',
   *     },
   *   ],
   *   'tailContent': 'Tail',
   * });
   * ```
   */
  sendMsgMenu(
    userId: string,
    msgMenu: WechatTypes.MsgMenu,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'msgmenu',
      msgmenu: msgMenu,
      ...options,
    });
  }

  /**
   * ????????????
   *
   * @param userId - User ID of the recipient
   * @param cardId - ID of the card to be sent.
   * @param options - The other parameters.
   * @returns Error code and error message.
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   *
   * @example
   *
   * ```js
   * await client.sendWXCard(USER_ID, '123dsdajkasd231jhksad');
   * ```
   */
  sendWXCard(
    userId: string,
    cardId: string,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'wxcard',
      wxcard: {
        cardId,
      },
      ...options,
    });
  }

  /**
   * ???????????????????????????????????????????????????????????????
   *
   * @param userId - User ID of the recipient
   * @param miniProgramPage - Info of the mini program page to be sent.
   * @param options - The other parameters.
   * @returns Error code and error message.
   *
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   *
   * @example
   *
   * ```js
   * await client.sendMiniProgramPage(USER_ID, {
   *   title: 'title',
   *   appid: 'appid',
   *   pagepath: 'pagepath',
   *   thumbMediaId: 'thumb_media_id',
   * });
   * ```
   */
  sendMiniProgramPage(
    userId: string,
    miniProgramPage: WechatTypes.MiniProgramPage,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'miniprogrampage',
      miniprogrampage: miniProgramPage,
      ...options,
    });
  }

  // TODO: implement typing

  // TODO: ??????????????????
}
