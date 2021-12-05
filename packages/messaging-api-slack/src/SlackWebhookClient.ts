import axios, { AxiosInstance } from 'axios';
import invariant from 'ts-invariant';
import warning from 'warning';
import {
  OnRequestFunction,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as SlackTypes from './SlackTypes';

interface ClientConfig {
  url: string;
  onRequest?: OnRequestFunction;
}

export default class SlackWebhookClient {
  /**
   * @deprecated Use `new SlackWebhookClient(...)` instead.
   */
  static connect(config: ClientConfig): SlackWebhookClient {
    warning(
      false,
      '`SlackWebhookClient.connect(...)` is deprecated. Use `new SlackWebhookClient(...)` instead.'
    );
    return new SlackWebhookClient(config);
  }

  /**
   * The underlying axios instance.
   */
  readonly axios: AxiosInstance;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  constructor(config: ClientConfig) {
    invariant(
      typeof config !== 'st