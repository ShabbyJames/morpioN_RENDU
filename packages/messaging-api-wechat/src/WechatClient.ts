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
        `/token?grant_type=client_creden