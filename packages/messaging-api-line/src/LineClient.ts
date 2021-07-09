
import querystring from 'querystring';
import { Readable } from 'stream';

import AxiosError from 'axios-error';
import axios, { AxiosInstance, AxiosError as BaseAxiosError } from 'axios';
import imageType from 'image-type';
import invariant from 'ts-invariant';
import warning from 'warning';
import {
  OnRequestFunction,
  createRequestInterceptor,
} from 'messaging-api-common';

import * as Line from './Line';
import * as LineTypes from './LineTypes';

function handleError(
  err: BaseAxiosError<{
    message: string;
    details: {
      property: string;
      message: string;
    }[];
  }>
): never {
  if (err.response && err.response.data) {
    const { message, details } = err.response.data;
    let msg = `LINE API - ${message}`;
    if (details && details.length > 0) {
      details.forEach((detail) => {
        msg += `\n- ${detail.property}: ${detail.message}`;
      });
    }
    throw new AxiosError(msg, err);
  }
  throw new AxiosError(err.message, err);
}

/**
 * LineClient is a client for LINE API calls.
 */
export default class LineClient {
  /**
   * @deprecated Use `new LineClient(...)` instead.
   */
  static connect(config: LineTypes.ClientConfig): LineClient {
    warning(
      false,
      '`LineClient.connect(...)` is deprecated. Use `new LineClient(...)` instead.'
    );
    return new LineClient(config);
  }

  /**
   * The underlying axios instance.
   */
  readonly axios: AxiosInstance;

  /**
   * The underlying axios instance for api-data.line.me APIs.
   */
  readonly dataAxios: AxiosInstance;

  /**
   * The access token used by the client
   */
  readonly accessToken: string;

  /**
   * The channel secret used by the client
   */
  readonly channelSecret: string | undefined;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  /**
   * Constructor of LineClient
   *
   * Usage:
   * ```ts
   * new LineClient({
   *   accessToken: ACCESS_TOKEN,
   * })
   * ```
   *
   * @param config - [[ClientConfig]]
   */
  constructor(config: LineTypes.ClientConfig) {
    invariant(
      typeof config !== 'string',
      `LineClient: do not allow constructing client with ${config} string. Use object instead.`
    );

    this.accessToken = config.accessToken;
    this.channelSecret = config.channelSecret;
    this.onRequest = config.onRequest;
    const { origin, dataOrigin } = config;

    this.axios = axios.create({
      baseURL: `${origin || 'https://api.line.me'}/`,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    this.axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this.onRequest })
    );

    this.dataAxios = axios.create({
      baseURL: `${dataOrigin || 'https://api-data.line.me'}/`,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    this.dataAxios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this.onRequest })
    );
  }

  /**
   * Gets a bot's basic information.
   *
   * [Official document](https://developers.line.biz/en/reference/messaging-api/#get-bot-info)
   *
   * @returns Returns status code 200 and a JSON object with the bot information.
   */
  getBotInfo(): Promise<LineTypes.BotInfoResponse> {
    return this.axios
      .get<LineTypes.BotInfoResponse>('/v2/bot/info')
      .then((res) => res.data, handleError);
  }

  /**
   * Gets information on a webhook endpoint.
   *
   * [Official document](https://developers.line.biz/en/reference/messaging-api/#get-webhook-endpoint-information)
   *
   * @returns Returns status code 200 and a JSON object with the webhook information.
   */
  getWebhookEndpointInfo(): Promise<LineTypes.WebhookEndpointInfoResponse> {
    return this.axios
      .get<LineTypes.WebhookEndpointInfoResponse>(
        '/v2/bot/channel/webhook/endpoint'
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Sets the webhook endpoint URL. It may take up to 1 minute for changes to take place due to caching.
   *
   * [Official document](https://developers.line.biz/en/reference/messaging-api/#get-webhook-endpoint-information)
   *
   * @param endpoint - Webhook URL.
   *
   * @returns Returns status code `200` and an empty JSON object.
   */
  setWebhookEndpointUrl(
    endpoint: string
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .put<LineTypes.MutationSuccessResponse>(
        '/v2/bot/channel/webhook/endpoint',
        { endpoint }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Checks if the configured webhook endpoint can receive a test webhook event.
   *
   * [Official document](https://developers.line.biz/en/reference/messaging-api/#test-webhook-endpoint)
   *
   * @returns Returns status code 200 and a JSON object with the webhook information.
   */
  testWebhookEndpoint(): Promise<LineTypes.TestWebhookEndpointResponse> {
    return this.axios
      .post<LineTypes.TestWebhookEndpointResponse>(
        '/v2/bot/channel/webhook/test'
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Reply Message
   * Sends a reply message in response to an event from a user, group, or room.
   *
   * To send reply messages, you must have a reply token which is included in a webhook event object.
   *
   * [Webhooks](https://developers.line.biz/en/reference/messaging-api/#webhooks) are used to notify you when an event occurs. For events that you can respond to, a reply token is issued for replying to messages.
   *
   * Because the reply token becomes invalid after a certain period of time, responses should be sent as soon as a message is received. Reply tokens can only be used once.
   *
   * [Official document](https://developers.line.biz/en/reference/messaging-api/#send-reply-message)
   *
   * @param body - Request body
   * @param body.replyToken - Reply token received via webhook
   * @param body.messages - Messages to send (Max: 5)
   *
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyRawBody(body: {
    replyToken: string;
    messages: LineTypes.Message[];
  }): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post<LineTypes.MutationSuccessResponse>('/v2/bot/message/reply', body)
      .then((res) => res.data, handleError);
  }

  /**
   * Reply Message
   *
   * Sends a reply message in response to an event from a user, group, or room.
   *
   * To send reply messages, you must have a reply token which is included in a webhook event object.
   *
   * [Webhooks](https://developers.line.biz/en/reference/messaging-api/#webhooks) are used to notify you when an event occurs. For events that you can respond to, a reply token is issued for replying to messages.
   *
   * Because the reply token becomes invalid after a certain period of time, responses should be sent as soon as a message is received. Reply tokens can only be used once.
   *
   * [Official document - send reply message](https://developers.line.biz/en/reference/messaging-api/#send-reply-message)
   *
   * @param replyToken - Reply token received via webhook
   * @param messages - Messages to send (Max: 5)
   * @returns Returns status code `200` and an empty JSON object.
   */
  reply(
    replyToken: string,
    messages: LineTypes.Message[]
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.replyRawBody({ replyToken, messages });
  }

  /**
   * Reply Message
   *
   * Sends a reply message in response to an event from a user, group, or room.
   *
   * To send reply messages, you must have a reply token which is included in a webhook event object.
   *
   * [Webhooks](https://developers.line.biz/en/reference/messaging-api/#webhooks) are used to notify you when an event occurs. For events that you can respond to, a reply token is issued for replying to messages.
   *
   * Because the reply token becomes invalid after a certain period of time, responses should be sent as soon as a message is received. Reply tokens can only be used once.
   *
   * [Official document - send reply message](https://developers.line.biz/en/reference/messaging-api/#send-reply-message)
   *
   * @param replyToken - Reply token received via webhook
   * @param messages - Messages to send (Max: 5)
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyMessages(
    replyToken: string,
    messages: LineTypes.Message[]
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, messages);
  }

  /**
   * Reply Text Message
   *
   * [Official document - text message](https://developers.line.biz/en/reference/messaging-api/#text-message)
   *
   * @param replyToken - Reply token received via webhook
   * @param text - Message text.
   *
   * You can include the following emoji:
   * - Unicode emoji
   * - LINE original emoji [(Unicode code point table for LINE original emoji)](https://developers.line.biz/media/messaging-api/emoji-list.pdf)
   *
   * Max character limit: 2000
   *
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyText(
    replyToken: string,
    text: string,
    options?: LineTypes.MessageOptions & { emojis?: LineTypes.Emoji[] }
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createText(text, options)]);
  }

  /**
   * Reply Image Message
   *
   * [Official document - image message](https://developers.line.biz/en/reference/messaging-api/#image-message)
   *
   * @param replyToken - Reply token received via webhook
   * @param image - Image
   * @param options - Common properties for messages
   * @param image.originalContentUrl - Image URL
   * - Max character limit: 1000
   * - HTTPS over TLS 1.2 or later
   * - JPEG
   * - Max: 4096 x 4096
   * - Max: 1 MB
   * @param image.previewImageUrl - Preview image URL
   * - Max character limit: 1000
   * - HTTPS over TLS 1.2 or later
   * - JPEG
   * - Max: 240 x 240
   * - Max: 1 MB
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyImage(
    replyToken: string,
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createImage(image, options)]);
  }

  /**
   * Reply Video Message
   *
   * [Official document - video message](https://developers.line.biz/en/reference/messaging-api/#video-message)
   *
   * @param replyToken - Reply token received via webhook
   * @param video - Video
   * @param options - Common properties for messages
   * @param video.originalContentUrl - URL of video file
   *
   * A very wide or tall video may be cropped when played in some environments.
   * - Max character limit: 1000
   * - HTTPS over TLS 1.2 or later
   * - mp4
   * - Max: 1 minute
   * - Max: 10 MB
   *
   * @param video.previewImageUrl - URL of preview image
   * - Max character limit: 1000
   * - HTTPS over TLS 1.2 or later
   * - JPEG
   * - Max: 240 x 240
   * - Max: 1 MB
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyVideo(
    replyToken: string,
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createVideo(video, options)]);
  }

  /**
   * Reply Audio Message
   *
   * [Official document - audio message](https://developers.line.biz/en/reference/messaging-api/#audio-message)
   *
   * @param replyToken - Reply token received via webhook
   * @param audio - Audio
   * @param options - Common properties for messages
   * @param audio.originalContentUrl - URL of audio file
   * - Max character limit: 1000
   * - HTTPS over TLS 1.2 or later
   * - m4a
   * - Max: 1 minute
   * - Max: 10 MB
   * @param audio.duration - Length of audio file (milliseconds)
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyAudio(
    replyToken: string,
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createAudio(audio, options)]);
  }

  /**
   * Reply Location Message
   *
   * [Official document - location message](https://developers.line.biz/en/reference/messaging-api/#location-message)
   *
   * @param replyToken - Reply token received via webhook
   * @param location - Location
   *
   * location.title:
   * - Max character limit: 100
   *
   * location.address:
   * - Max character limit: 100
   *
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyLocation(
    replyToken: string,
    location: LineTypes.Location,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createLocation(location, options)]);
  }

  /**
   * Reply Sticker Message
   *
   * [Official document - sticker message](https://developers.line.biz/en/reference/messaging-api/#sticker-message)
   *
   * @param replyToken - Reply token received via webhook
   * @param sticker - Sticker
   *
   * sticker.packageId:
   * - Package ID for a set of stickers. For information on package IDs, see the [Sticker list](https://developers.line.biz/media/messaging-api/sticker_list.pdf).
   *
   * sticker.stickerId:
   * - Sticker ID. For a list of sticker IDs for stickers that can be sent with the Messaging API, see the [Sticker list](https://developers.line.biz/media/messaging-api/sticker_list.pdf).
   *
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  replySticker(
    replyToken: string,
    sticker: Omit<LineTypes.StickerMessage, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createSticker(sticker, options)]);
  }

  /**
   * Reply Imagemap Message
   *
   * Imagemap messages are messages configured with an image that has multiple tappable areas. You can assign one tappable area for the entire image or different tappable areas on divided areas of the image.
   *
   * You can also play a video on the image and display a label with a hyperlink after the video is finished.
   *
   * [Official document - imagemap message](https://developers.line.biz/en/reference/messaging-api/#imagemap-message)
   *
   * @param replyToken - Reply token received via webhook
   * @param altText - Alternative text
   * @param imagemap - Imagemap
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyImagemap(
    replyToken: string,
    altText: string,
    imagemap: Omit<LineTypes.ImagemapMessage, 'type' | 'altText'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [
      Line.createImagemap(altText, imagemap, options),
    ]);
  }

  /**
   * Reply Flex Message
   *
   * Flex Messages are messages with a customizable layout.
   * You can customize the layout freely based on the specification for [CSS Flexible Box (CSS Flexbox)](https://www.w3.org/TR/css-flexbox-1/).
   * For more information, see [Sending Flex Messages](https://developers.line.biz/en/docs/messaging-api/using-flex-messages/) in the API documentation.
   *
   * [Official document - flex message](https://developers.line.biz/en/reference/messaging-api/#flex-message)
   *
   * @param replyToken - Reply token received via webhook
   * @param altText - Alternative text
   * @param flex - Flex Message [container](https://developers.line.biz/en/reference/messaging-api/#container)
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyFlex(
    replyToken: string,
    altText: string,
    flex: LineTypes.FlexContainer,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createFlex(altText, flex, options)]);
  }

  /**
   * Reply Template Message
   *
   * Template messages are messages with predefined layouts which you can customize. For more information, see [Template messages](https://developers.line.biz/en/docs/messaging-api/message-types/#template-messages).
   *
   * The following template types are available:
   * - [Buttons](https://developers.line.biz/en/reference/messaging-api/#buttons)
   * - [Confirm](https://developers.line.biz/en/reference/messaging-api/#confirm)
   * - [Carousel](https://developers.line.biz/en/reference/messaging-api/#carousel)
   * - [Image carousel](https://developers.line.biz/en/reference/messaging-api/#image-carousel)
   *
   * [Official document - template message](https://developers.line.biz/en/reference/messaging-api/#template-messages)
   *
   * @param replyToken - Reply token received via webhook
   * @param altText - Alternative text
   * @param template - A [Buttons](https://developers.line.biz/en/reference/messaging-api/#buttons), [Confirm](https://developers.line.biz/en/reference/messaging-api/#confirm), [Carousel](https://developers.line.biz/en/reference/messaging-api/#carousel), or [Image carousel](https://developers.line.biz/en/reference/messaging-api/#image-carousel) object.
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyTemplate(
    replyToken: string,
    altText: string,
    template: LineTypes.Template,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [
      Line.createTemplate(altText, template, options),
    ]);
  }

  /**
   * Reply Button Template Message
   *
   * Template with an image, title, text, and multiple action buttons.
   *
   * [Official document - button template message](https://developers.line.biz/en/reference/messaging-api/#buttons)
   *
   * @param replyToken - Reply token received via webhook
   * @param altText - Alternative text
   * @param buttonTemplate - Button template object
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyButtonTemplate(
    replyToken: string,
    altText: string,
    buttonTemplate: Omit<LineTypes.ButtonsTemplate, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [
      Line.createButtonTemplate(altText, buttonTemplate, options),
    ]);
  }

  /**
   * Reply Button Template Message
   *
   * Template with an image, title, text, and multiple action buttons.
   *
   * Because of the height limitation for buttons template messages, the lower part of the text display area will get cut off if the height limitation is exceeded. For this reason, depending on the character width, the message text may not be fully displayed even when it is within the character limits.
   *
   * [Official document - button template message](https://developers.line.biz/en/reference/messaging-api/#buttons)
   *
   * @param replyToken - Reply token received via webhook
   * @param altText - Alternative text
   * @param buttonTemplate - Button template object
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyButtonsTemplate(
    replyToken: string,
    altText: string,
    buttonTemplate: Omit<LineTypes.ButtonsTemplate, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.replyButtonTemplate(
      replyToken,
      altText,
      buttonTemplate,
      options
    );
  }

  /**
   * Reply Confirm Template Message
   *
   * Template with two action buttons.
   *
   * Because of the height limitation for confirm template messages, the lower part of the text display area will get cut off if the height limitation is exceeded. For this reason, depending on the character width, the message text may not be fully displayed even when it is within the character limits.
   *
   * [Official document - confirm template message](https://developers.line.biz/en/reference/messaging-api/#confirm)
   *
   * @param replyToken - Reply token received via webhook
   * @param altText - Alternative text
   * @param confirmTemplate - Confirm template object
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyConfirmTemplate(
    replyToken: string,
    altText: string,
    confirmTemplate: Omit<LineTypes.ConfirmTemplate, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [
      Line.createConfirmTemplate(altText, confirmTemplate, options),
    ]);
  }

  /**
   * Reply Carousel Template Message
   *
   * Template with multiple columns which can be cycled like a carousel. The columns are shown in order when scrolling horizontally.
   *
   * [Official document - carousel template message](https://developers.line.biz/en/reference/messaging-api/#carousel)
   *
   * @param replyToken - Reply token received via webhook
   * @param altText - Alternative text
   * @param columns - Array of columns for carousel
   *
   * Max columns: 10
   *
   * @param options - Carousel template options
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyCarouselTemplate(
    replyToken: string,
    altText: string,
    columns: LineTypes.ColumnObject[],
    options: LineTypes.CarouselTemplateOptions = {}
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [
      Line.createCarouselTemplate(altText, columns, options),
    ]);
  }

  /**
   * Reply Image Carousel Template Message
   *
   * Template with multiple images which can be cycled like a carousel. The images are shown in order when scrolling horizontally.
   *
   * [Official document - image carousel template message](https://developers.line.biz/en/reference/messaging-api/#image-carousel)
   *
   * @param replyToken - Reply token received via webhook
   * @param altText - Alternative text
   * @param columns - Array of columns for image carousel
   *
   * Max columns: 10
   *
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  replyImageCarouselTemplate(
    replyToken: string,
    altText: string,
    columns: LineTypes.ImageCarouselColumnObject[],
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.reply(replyToken, [
      Line.createImageCarouselTemplate(altText, columns, options),
    ]);
  }

  /**
   * Push Message
   *
   * Sends a push message to a user, group, or room at any time.
   *
   * Note: LINE\@ accounts under the free or basic plan cannot call this API endpoint.
   *
   * [Official document - send push message](https://developers.line.biz/en/reference/messaging-api/#send-push-message)
   *
   * @param body - Request body
   * @param body.to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param body.messages - Messages to send (Max: 5)
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushRawBody(body: {
    to: string;
    messages: LineTypes.Message[];
  }): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post<LineTypes.MutationSuccessResponse>('/v2/bot/message/push', body)
      .then((res) => res.data, handleError);
  }

  /**
   * Push Message
   *
   * Sends a push message to a user, group, or room at any time.
   *
   * Note: LINE\@ accounts under the free or basic plan cannot call this API endpoint.
   *
   * [Official document - send push message](https://developers.line.biz/en/reference/messaging-api/#send-push-message)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param messages - Messages to send (Max: 5)
   * @returns Returns status code `200` and an empty JSON object.
   */
  push(
    to: string,
    messages: LineTypes.Message[]
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.pushRawBody({ to, messages });
  }

  /**
   * Push Message
   *
   * Sends a push message to a user, group, or room at any time.
   *
   * Note: LINE\@ accounts under the free or basic plan cannot call this API endpoint.
   *
   * [Official document - send push message](https://developers.line.biz/en/reference/messaging-api/#send-push-message)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param messages - Messages to send (Max: 5)
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushMessages(
    to: string,
    messages: LineTypes.Message[]
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, messages);
  }

  /**
   * Push Text Message
   *
   * [Official document - text message](https://developers.line.biz/en/reference/messaging-api/#text-message)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param text - Message text.
   *
   * You can include the following emoji:
   * - Unicode emoji
   * - LINE original emoji [(Unicode code point table for LINE original emoji)](https://developers.line.biz/media/messaging-api/emoji-list.pdf)
   *
   * Max character limit: 2000
   *
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushText(
    to: string,
    text: string,
    options?: LineTypes.MessageOptions & { emojis?: LineTypes.Emoji[] }
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [Line.createText(text, options)]);
  }

  /**
   * Push Image Message
   *
   * [Official document - image message](https://developers.line.biz/en/reference/messaging-api/#image-message)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param image - Image
   * @param options - Common properties for messages
   * @param image.originalContentUrl - Image URL
   * - Max character limit: 1000
   * - HTTPS over TLS 1.2 or later
   * - JPEG
   * - Max: 4096 x 4096
   * - Max: 1 MB
   * @param image.previewImageUrl - Preview image URL
   * - Max character limit: 1000
   * - HTTPS over TLS 1.2 or later
   * - JPEG
   * - Max: 240 x 240
   * - Max: 1 MB
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushImage(
    to: string,
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [Line.createImage(image, options)]);
  }

  /**
   * Push Video Message
   *
   * [Official document - video message](https://developers.line.biz/en/reference/messaging-api/#video-message)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param video - Video
   * @param options - Common properties for messages
   * @param video.originalContentUrl - URL of video file
   *
   * A very wide or tall video may be cropped when played in some environments.
   * - Max character limit: 1000
   * - HTTPS over TLS 1.2 or later
   * - mp4
   * - Max: 1 minute
   * - Max: 10 MB
   *
   * @param video.previewImageUrl - URL of preview image
   * - Max character limit: 1000
   * - HTTPS over TLS 1.2 or later
   * - JPEG
   * - Max: 240 x 240
   * - Max: 1 MB
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushVideo(
    to: string,
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [Line.createVideo(video, options)]);
  }

  /**
   * Push Audio Message
   *
   * [Official document - audio message](https://developers.line.biz/en/reference/messaging-api/#audio-message)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param audio - Audio
   * @param options - Common properties for messages
   * @param audio.originalContentUrl - URL of audio file
   * - Max character limit: 1000
   * - HTTPS over TLS 1.2 or later
   * - m4a
   * - Max: 1 minute
   * - Max: 10 MB
   * @param audio.duration - Length of audio file (milliseconds)
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushAudio(
    to: string,
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [Line.createAudio(audio, options)]);
  }

  /**
   * Push Location Message
   *
   * [Official document - location message](https://developers.line.biz/en/reference/messaging-api/#location-message)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param location - Location
   *
   * location.title:
   * - Max character limit: 100
   *
   * location.address:
   * - Max character limit: 100
   *
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushLocation(
    to: string,
    location: LineTypes.Location,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [Line.createLocation(location, options)]);
  }

  /**
   * Push Sticker Message
   *
   * [Official document - sticker message](https://developers.line.biz/en/reference/messaging-api/#sticker-message)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param sticker - Sticker
   *
   * sticker.packageId:
   * - Package ID for a set of stickers. For information on package IDs, see the [Sticker list](https://developers.line.biz/media/messaging-api/sticker_list.pdf).
   *
   * sticker.stickerId:
   * - Sticker ID. For a list of sticker IDs for stickers that can be sent with the Messaging API, see the [Sticker list](https://developers.line.biz/media/messaging-api/sticker_list.pdf).
   *
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushSticker(
    to: string,
    sticker: Omit<LineTypes.StickerMessage, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [Line.createSticker(sticker, options)]);
  }

  /**
   * Push Imagemap Message
   *
   * Imagemap messages are messages configured with an image that has multiple tappable areas. You can assign one tappable area for the entire image or different tappable areas on divided areas of the image.
   *
   * You can also play a video on the image and display a label with a hyperlink after the video is finished.
   *
   * [Official document - imagemap message](https://developers.line.biz/en/reference/messaging-api/#imagemap-message)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param altText - Alternative text
   * @param imagemap - Imagemap
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushImagemap(
    to: string,
    altText: string,
    imagemap: Omit<LineTypes.ImagemapMessage, 'type' | 'altText'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [Line.createImagemap(altText, imagemap, options)]);