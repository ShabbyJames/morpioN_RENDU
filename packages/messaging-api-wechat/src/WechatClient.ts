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
   * 获取 access_token
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
   * 临时素材
   *
   * 媒体文件保存时间为 3 天，即 3 天后 media_id 失效。
   *
   * 图片（image）- 2M，支持 PNG,JPEG,JPG,GIF 格式
   * 语音（voice）- 2M，播放长度不超过 60s，支持 AMR,MP3 格式
   * 视频（video）- 10MB，支持 MP4 格式
   * 缩略图（thumb）- 64KB，支持 JPG 格式
   */

  /**
   * 多媒体文件上传接口
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
        | {