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
      typeof config !== 'string',
      `SlackWebhookClient: do not allow constructing client with ${config} string. Use object instead.`
    );

    this.onRequest = config.onRequest;

    // incoming webhooks
    // https://api.slack.com/incoming-webhooks
    this.axios = axios.create({
      baseURL: config.url,
      headers: { 'Content-Type': 'application/json' },
    });

    this.axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this.onRequest })
    );
  }

  /**
   * Send message by using raw body.
   *
   * @param body - Raw data to be sent.
   *
   * @see https://api.slack.com/docs/messages
   *
   * @example
   *
   * ```js
   * await client.sendRawBody({ text: 'Hello!' });
   * ```
   */
  sendRawBody(
    body: Record<string, any>
  ): Promise<SlackTypes.SendMessageSuccessResponse> {
    return this.axios.post('', snakecaseKeysDeep(body)).then((res) => res.data);
  }

  /**
   * Send text message.
   *
   * @param text - Text of the message to be sent.
   *
   * @see https://api.slack.com/docs/messages
   *
   * @example
   *
   * ```js
   * await client.sendText('Hello!');
   * ```
   */
  sendText(text: string): Promise<SlackTypes.SendMessageSuccessResponse> {
    return this.sendRawBody({ text });
  }

  /**
   * Send multiple attachments which let you add more context to a message.
   *
   * @param attachments