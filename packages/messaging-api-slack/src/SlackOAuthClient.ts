
import querystring from 'querystring';

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import invariant from 'ts-invariant';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as SlackTypes from './SlackTypes';

const DEFAULT_PAYLOAD_FIELDS_TO_STRINGIFY = ['attachments', 'blocks'];

function stringifyPayloadFields(
  payload: Record<string, any> = {},
  fields: Array<string> = DEFAULT_PAYLOAD_FIELDS_TO_STRINGIFY
): object {
  fields.forEach((field) => {
    if (payload[field] && typeof payload[field] !== 'string') {
      // eslint-disable-next-line no-param-reassign
      payload[field] = JSON.stringify(snakecaseKeysDeep(payload[field]));
    }
  });

  return payload;
}

export default class SlackOAuthClient {
  /**
   * @deprecated Use `new SlackOAuthClient(...)` instead.
   */
  static connect(config: SlackTypes.ClientConfig): SlackOAuthClient {
    warning(
      false,
      '`SlackOAuthClient.connect(...)` is deprecated. Use `new SlackOAuthClient(...)` instead.'
    );
    return new SlackOAuthClient(config);
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
   * chat.* APIs.
   */
  readonly chat: {
    /**
     * Sends a message to a channel.
     *
     * @returns Typical success response
     *
     * ```js
     * {
     *   "ok": true,
     *   "channel": "C1H9RESGL",
     *   "ts": "1503435956.000247",
     *   "message": {
     *      "text": "Here's a message for you",
     *      "username": "ecto1",
     *      "botId": "B19LU7CSY",
     *      "attachments": [
     *         {
     *           "text": "This is an attachment",
     *           "id": 1,
     *           "fallback": "This is an attachment's fallback"
     *         }
     *       ],
     *       "type": "message",
     *       "subtype": "bot_message",
     *       "ts": "1503435956.000247"
     *     }
     *   }
     * }
     * ```
     *
     * @see https://api.slack.com/methods/chat.postMessage
     *
     * @example
     *
     * ```js
     * await client.chat.postMessage({
     *   channel: 'C1234567890',
     *   text: 'Hello world',
     * });
     * ```
     */
    postMessage: (
      options: SlackTypes.PostMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;

    /**
     * Sends an ephemeral message to a user in a channel.
     *
     * @returns Typical success response
     *
     * ```js
     * {
     *   "ok": true,
     *   "messageTs": "1502210682.580145"
     * }
     * ```
     *
     * @see https://api.slack.com/methods/chat.postEphemeral
     *
     * @example
     *
     * ```js
     * await client.chat.postEphemeral({
     *   channel: 'C1234567890',
     *   text: 'Hello world',
     *   user: 'U0BPQUNTA',
     *   attachments: '[{"pretext": "pre-hello", "text": "text-world"}]',
     * });
     * ```
     */
    postEphemeral: (
      options: SlackTypes.PostEphemeralOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;

    /**
     * Updates a message.
     *
     * @returns Typical success response
     *
     * ```js
     * {
     *   "ok": true,
     *   "channel": "C024BE91L",
     *   "ts": "1401383885.000061",
     *   "text": "Updated text you carefully authored",
     *   "message": {
     *     "text": "Updated text you carefully authored",
     *     "user": "U34567890"
     *   }
     * }
     * ```
     *
     * @see https://api.slack.com/methods/chat.update
     *
     * @example
     *
     * ```js
     * await client.chat.update({
     *   channel: 'C1234567890',
     *   ts: '1405894322.002768',
     *   text: 'Hello world',
     * });
     * ```
     */
    update: (
      options: SlackTypes.UpdateMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;

    /**
     * Deletes a message.
     *
     * @returns Typical success response
     *
     * ```js
     * {
     *   "ok": true,
     *   "channel": "C024BE91L",
     *   "ts": "1401383885.000061"
     * }
     * ```
     *
     * @see https://api.slack.com/methods/chat.delete
     *
     * @example
     *
     * ```js
     * await client.chat.delete({
     *   channel: 'C1234567890',
     *   ts: 'Timestamp of the message to be deleted.',
     * });
     * ```
     */
    delete: (
      options: SlackTypes.DeleteMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;

    /**
     * Share a me message into a channel.
     *
     * @returns Typical success response
     *
     * ```js
     * {
     *   "ok": true,
     *   "channel": "C024BE7LR",
     *   "ts": "1417671948.000006"
     * }
     * ```
     *
     * @see https://api.slack.com/methods/chat.meMessage
     *
     * @example
     *
     * ```js
     * await client.chat.meMessage({
     *   channel: 'C1234567890',
     *   text: 'Hello world',
     * });
     * ```
     */
    meMessage: (
      options: SlackTypes.MeMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;

    /**
     * Retrieve a permalink URL for a specific extant message.
     *
     * @returns Standard success response
     *
     * ```js
     * {
     *   "ok": true,
     *   "channel": "C1H9RESGA",
     *   "permalink": "https://ghostbusters.slack.com/archives/C1H9RESGA/p135854651500008"
     * }
     * ```
     *
     * @see https://api.slack.com/methods/chat.getPermalink
     *
     * @example
     *
     * ```js
     * await client.chat.getPermalink({
     *   channel: 'C1H9RESGA',
     *   messageTs: '1234567890.123456',
     * });
     * ```
     */
    getPermalink: (
      options: SlackTypes.GetPermalinkOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;

    /**
     * Schedules a message to be sent to a channel.
     *
     * @returns Typical success response
     *
     * ```js
     * {
     *   "ok": true,
     *   "channel": "C1H9RESGL",
     *   "scheduledMessageId": "Q1298393284",
     *   "postAt": "1562180400",
     *   "message": {
     *     "text": "Here's a message for you in the future",
     *     "username": "ecto1",
     *     "botId": "B19LU7CSY",
     *     "attachments": [
     *       {
     *         "text": "This is an attachment",
     *         "id": 1,
     *         "fallback": "This is an attachment's fallback"
     *       }
     *     ],
     *     "type": "delayed_message",
     *     "subtype": "bot_message"
     *   }
     * }
     * ```
     *
     * @see https://api.slack.com/methods/chat.scheduleMessage
     *
     * @example
     *
     * ```js
     * await client.chat.scheduleMessage({
     *   channel: 'C1234567890',
     *   postAt: '299876400',
     *   text: 'Hello world',
     * });
     * ```
     */
    scheduleMessage: (
      options: SlackTypes.ScheduleMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;