
import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import invariant from 'ts-invariant';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  onRequest,
  pascalcaseKeysDeep,
  snakecaseKeys,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as ViberTypes from './ViberTypes';

function transformMessageCase(message: ViberTypes.Message): any {
  const { keyboard, richMedia, ...others } = message as any;

  return {
    ...snakecaseKeysDeep(others),
    ...(keyboard ? { keyboard: pascalcaseKeysDeep(keyboard) } : undefined),
    ...(richMedia
      ? {
          richMedia: pascalcaseKeysDeep(richMedia),
        }
      : undefined),
  } as any;
}

/**
 * @see https://developers.viber.com/docs/api/rest-bot-api/#viber-rest-api
 */
export default class ViberClient {
  /**
   * @deprecated Use `new ViberClient(...)` instead.
   */
  static connect(config: ViberTypes.ClientConfig): ViberClient {
    warning(
      false,
      '`ViberClient.connect(...)` is deprecated. Use `new ViberClient(...)` instead.'
    );
    return new ViberClient(config);
  }

  /**
   * The underlying axios instance.
   */
  readonly axios: AxiosInstance;

  /**
   * The access token used by the client.
   */
  readonly accessToken: string;

  /**
   * The sender used by the client.
   */
  private sender: ViberTypes.Sender;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  constructor(config: ViberTypes.ClientConfig) {
    invariant(
      typeof config !== 'string',
      `ViberClient: do not allow constructing client with ${config} string. Use object instead.`
    );

    this.accessToken = config.accessToken;
    this.sender = config.sender;
    this.onRequest = config.onRequest || onRequest;
    const { origin } = config;

    this.axios = axios.create({
      baseURL: `${origin || 'https://chatapi.viber.com'}/pa/`,
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': this.accessToken,
      },