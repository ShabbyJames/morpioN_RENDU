
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
  }

  /**
   * Push Flex Message
   *
   * Flex Messages are messages with a customizable layout.
   * You can customize the layout freely based on the specification for [CSS Flexible Box (CSS Flexbox)](https://www.w3.org/TR/css-flexbox-1/).
   * For more information, see [Sending Flex Messages](https://developers.line.biz/en/docs/messaging-api/using-flex-messages/) in the API documentation.
   *
   * [Official document - flex message](https://developers.line.biz/en/reference/messaging-api/#flex-message)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param altText - Alternative text
   * @param flex - Flex Message [container](https://developers.line.biz/en/reference/messaging-api/#container)
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushFlex(
    to: string,
    altText: string,
    flex: LineTypes.FlexContainer,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [Line.createFlex(altText, flex, options)]);
  }

  /**
   * Push Template Message
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
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param altText - Alternative text
   * @param template - A [Buttons](https://developers.line.biz/en/reference/messaging-api/#buttons), [Confirm](https://developers.line.biz/en/reference/messaging-api/#confirm), [Carousel](https://developers.line.biz/en/reference/messaging-api/#carousel), or [Image carousel](https://developers.line.biz/en/reference/messaging-api/#image-carousel) object.
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushTemplate(
    to: string,
    altText: string,
    template: LineTypes.Template,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [Line.createTemplate(altText, template, options)]);
  }

  /**
   * Push Button Template Message
   *
   * Template with an image, title, text, and multiple action buttons.
   *
   * [Official document - button template message](https://developers.line.biz/en/reference/messaging-api/#buttons)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param altText - Alternative text
   * @param buttonTemplate - Button template object
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushButtonTemplate(
    to: string,
    altText: string,
    buttonTemplate: Omit<LineTypes.ButtonsTemplate, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [
      Line.createButtonTemplate(altText, buttonTemplate, options),
    ]);
  }

  /**
   * Push Button Template Message
   *
   * Template with an image, title, text, and multiple action buttons.
   *
   * Because of the height limitation for buttons template messages, the lower part of the text display area will get cut off if the height limitation is exceeded. For this reason, depending on the character width, the message text may not be fully displayed even when it is within the character limits.
   *
   * [Official document - button template message](https://developers.line.biz/en/reference/messaging-api/#buttons)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param altText - Alternative text
   * @param buttonTemplate - Button template object
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushButtonsTemplate(
    to: string,
    altText: string,
    buttonTemplate: Omit<LineTypes.ButtonsTemplate, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.pushButtonTemplate(to, altText, buttonTemplate, options);
  }

  /**
   * Push Confirm Template Message
   *
   * Template with two action buttons.
   *
   * Because of the height limitation for confirm template messages, the lower part of the text display area will get cut off if the height limitation is exceeded. For this reason, depending on the character width, the message text may not be fully displayed even when it is within the character limits.
   *
   * [Official document - confirm template message](https://developers.line.biz/en/reference/messaging-api/#confirm)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param altText - Alternative text
   * @param confirmTemplate - Confirm template object
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushConfirmTemplate(
    to: string,
    altText: string,
    confirmTemplate: Omit<LineTypes.ConfirmTemplate, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [
      Line.createConfirmTemplate(altText, confirmTemplate, options),
    ]);
  }

  /**
   * Push Carousel Template Message
   *
   * Template with multiple columns which can be cycled like a carousel. The columns are shown in order when scrolling horizontally.
   *
   * [Official document - carousel template message](https://developers.line.biz/en/reference/messaging-api/#carousel)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param altText - Alternative text
   * @param columns - Array of columns for carousel
   *
   * Max columns: 10
   *
   * @param options - Carousel template options
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushCarouselTemplate(
    to: string,
    altText: string,
    columns: LineTypes.ColumnObject[],
    options: LineTypes.CarouselTemplateOptions = {}
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [
      Line.createCarouselTemplate(altText, columns, options),
    ]);
  }

  /**
   * Push Image Carousel Template Message
   *
   * Template with multiple images which can be cycled like a carousel. The images are shown in order when scrolling horizontally.
   *
   * [Official document - image carousel template message](https://developers.line.biz/en/reference/messaging-api/#image-carousel)
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param altText - Alternative text
   * @param columns - Array of columns for image carousel
   *
   * Max columns: 10
   *
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  pushImageCarouselTemplate(
    to: string,
    altText: string,
    columns: LineTypes.ImageCarouselColumnObject[],
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.push(to, [
      Line.createImageCarouselTemplate(altText, columns, options),
    ]);
  }

  /**
   * Multicast Message
   *
   * Sends push messages to multiple users at any time. Messages cannot be sent to groups or rooms.
   *
   * Note: LINE\@ accounts under the free or basic plan cannot call this API endpoint.
   *
   * [Official document - send multicast message](https://developers.line.biz/en/reference/messaging-api/#send-multicast-message)
   *
   * @param body - Request body
   * @param body.to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param body.messages - Messages to send (Max: 5)
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicastRawBody(body: {
    to: string[];
    messages: LineTypes.Message[];
  }): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post<LineTypes.MutationSuccessResponse>(
        '/v2/bot/message/multicast',
        body
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Multicast Message
   *
   * Sends push messages to multiple users at any time. Messages cannot be sent to groups or rooms.
   *
   * Note: LINE\@ accounts under the free or basic plan cannot call this API endpoint.
   *
   * [Official document - send multicast message](https://developers.line.biz/en/reference/messaging-api/#send-multicast-message)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param messages - Messages to send (Max: 5)
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicast(
    to: string[],
    messages: LineTypes.Message[]
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicastRawBody({ to, messages });
  }

  /**
   * Multicast Message
   *
   * Sends push messages to multiple users at any time. Messages cannot be sent to groups or rooms.
   *
   * Note: LINE\@ accounts under the free or basic plan cannot call this API endpoint.
   *
   * [Official document - send multicast message](https://developers.line.biz/en/reference/messaging-api/#send-multicast-message)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param messages - Messages to send (Max: 5)
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicastMessages(
    to: string[],
    messages: LineTypes.Message[]
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, messages);
  }

  /**
   * Multicast Text Message
   *
   * [Official document - text message](https://developers.line.biz/en/reference/messaging-api/#text-message)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
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
  multicastText(
    to: string[],
    text: string,
    options?: LineTypes.MessageOptions & { emojis?: LineTypes.Emoji[] }
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [Line.createText(text, options)]);
  }

  /**
   * Multicast Image Message
   *
   * [Official document - image message](https://developers.line.biz/en/reference/messaging-api/#image-message)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
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
  multicastImage(
    to: string[],
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [Line.createImage(image, options)]);
  }

  /**
   * Multicast Video Message
   *
   * [Official document - video message](https://developers.line.biz/en/reference/messaging-api/#video-message)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
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
  multicastVideo(
    to: string[],
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [Line.createVideo(video, options)]);
  }

  /**
   * Multicast Audio Message
   *
   * [Official document - audio message](https://developers.line.biz/en/reference/messaging-api/#audio-message)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
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
  multicastAudio(
    to: string[],
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [Line.createAudio(audio, options)]);
  }

  /**
   * Multicast Location Message
   *
   * [Official document - location message](https://developers.line.biz/en/reference/messaging-api/#location-message)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
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
  multicastLocation(
    to: string[],
    location: LineTypes.Location,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [Line.createLocation(location, options)]);
  }

  /**
   * Multicast Sticker Message
   *
   * [Official document - sticker message](https://developers.line.biz/en/reference/messaging-api/#sticker-message)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
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
  multicastSticker(
    to: string[],
    sticker: Omit<LineTypes.StickerMessage, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [Line.createSticker(sticker, options)]);
  }

  /**
   * Multicast Imagemap Message
   *
   * Imagemap messages are messages configured with an image that has multiple tappable areas. You can assign one tappable area for the entire image or different tappable areas on divided areas of the image.
   *
   * You can also play a video on the image and display a label with a hyperlink after the video is finished.
   *
   * [Official document - imagemap message](https://developers.line.biz/en/reference/messaging-api/#imagemap-message)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param altText - Alternative text
   * @param imagemap - Imagemap
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicastImagemap(
    to: string[],
    altText: string,
    imagemap: Omit<LineTypes.ImagemapMessage, 'type' | 'altText'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [
      Line.createImagemap(altText, imagemap, options),
    ]);
  }

  /**
   * Multicast Flex Message
   *
   * Flex Messages are messages with a customizable layout.
   * You can customize the layout freely based on the specification for [CSS Flexible Box (CSS Flexbox)](https://www.w3.org/TR/css-flexbox-1/).
   * For more information, see [Sending Flex Messages](https://developers.line.biz/en/docs/messaging-api/using-flex-messages/) in the API documentation.
   *
   * [Official document - flex message](https://developers.line.biz/en/reference/messaging-api/#flex-message)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param altText - Alternative text
   * @param flex - Flex Message [container](https://developers.line.biz/en/reference/messaging-api/#container)
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicastFlex(
    to: string[],
    altText: string,
    flex: LineTypes.FlexContainer,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [Line.createFlex(altText, flex, options)]);
  }

  /**
   * Multicast Template Message
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
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param altText - Alternative text
   * @param template - A [Buttons](https://developers.line.biz/en/reference/messaging-api/#buttons), [Confirm](https://developers.line.biz/en/reference/messaging-api/#confirm), [Carousel](https://developers.line.biz/en/reference/messaging-api/#carousel), or [Image carousel](https://developers.line.biz/en/reference/messaging-api/#image-carousel) object.
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicastTemplate(
    to: string[],
    altText: string,
    template: LineTypes.Template,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [
      Line.createTemplate(altText, template, options),
    ]);
  }

  /**
   * Multicast Button Template Message
   *
   * Template with an image, title, text, and multiple action buttons.
   *
   * [Official document - button template message](https://developers.line.biz/en/reference/messaging-api/#buttons)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param altText - Alternative text
   * @param buttonTemplate - Button template object
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicastButtonTemplate(
    to: string[],
    altText: string,
    buttonTemplate: Omit<LineTypes.ButtonsTemplate, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [
      Line.createButtonTemplate(altText, buttonTemplate, options),
    ]);
  }

  /**
   * Multicast Button Template Message
   *
   * Template with an image, title, text, and multiple action buttons.
   *
   * Because of the height limitation for buttons template messages, the lower part of the text display area will get cut off if the height limitation is exceeded. For this reason, depending on the character width, the message text may not be fully displayed even when it is within the character limits.
   *
   * [Official document - button template message](https://developers.line.biz/en/reference/messaging-api/#buttons)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param altText - Alternative text
   * @param buttonTemplate - Button template object
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicastButtonsTemplate(
    to: string[],
    altText: string,
    buttonTemplate: Omit<LineTypes.ButtonsTemplate, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicastButtonTemplate(to, altText, buttonTemplate, options);
  }

  /**
   * Multicast Confirm Template Message
   *
   * Template with two action buttons.
   *
   * Because of the height limitation for confirm template messages, the lower part of the text display area will get cut off if the height limitation is exceeded. For this reason, depending on the character width, the message text may not be fully displayed even when it is within the character limits.
   *
   * [Official document - confirm template message](https://developers.line.biz/en/reference/messaging-api/#confirm)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param altText - Alternative text
   * @param confirmTemplate - Confirm template object
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicastConfirmTemplate(
    to: string[],
    altText: string,
    confirmTemplate: Omit<LineTypes.ConfirmTemplate, 'type'>,
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [
      Line.createConfirmTemplate(altText, confirmTemplate, options),
    ]);
  }

  /**
   * Multicast Carousel Template Message
   *
   * Template with multiple columns which can be cycled like a carousel. The columns are shown in order when scrolling horizontally.
   *
   * [Official document - carousel template message](https://developers.line.biz/en/reference/messaging-api/#carousel)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param altText - Alternative text
   * @param columns - Array of columns for carousel
   *
   * Max columns: 10
   *
   * @param options - Carousel template options
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicastCarouselTemplate(
    to: string[],
    altText: string,
    columns: LineTypes.ColumnObject[],
    options: LineTypes.CarouselTemplateOptions = {}
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [
      Line.createCarouselTemplate(altText, columns, options),
    ]);
  }

  /**
   * Multicast Image Carousel Template Message
   *
   * Template with multiple images which can be cycled like a carousel. The images are shown in order when scrolling horizontally.
   *
   * [Official document - image carousel template message](https://developers.line.biz/en/reference/messaging-api/#image-carousel)
   *
   * @param to - Array of user IDs. Use userId values which are returned in [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use LINE IDs found on LINE.
   * - Max: 150 user IDs
   * @param altText - Alternative text
   * @param columns - Array of columns for image carousel
   *
   * Max columns: 10
   *
   * @param options - Common properties for messages
   * @returns Returns status code `200` and an empty JSON object.
   */
  multicastImageCarouselTemplate(
    to: string[],
    altText: string,
    columns: LineTypes.ImageCarouselColumnObject[],
    options?: LineTypes.MessageOptions
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.multicast(to, [
      Line.createImageCarouselTemplate(altText, columns, options),
    ]);
  }

  /**
   * Broadcast Message
   *
   * Sends push messages to multiple users at any time.
   *
   * [Official document](https://developers.line.biz/en/reference/messaging-api/#send-broadcast-message)
   *
   * @param body - Request body
   * @param body.messages - Messages to send (Max: 5)
   *
   * @returns Returns status code `200` and an empty JSON object.
   */
  broadcastRawBody(body: {
    messages: LineTypes.Message[];
  }): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post<LineTypes.MutationSuccessResponse>(
        '/v2/bot/message/broadcast',
        body
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Broadcast Message
   *
   * Sends push messages to multiple users at any time.
   *
   * [Official document - send broadcast message](https://developers.line.biz/en/reference/messaging-api/#send-reply-message)
   *
   * @param messages - Messages to send (Max: 5)
   * @returns Returns status code `200` and an empty JSON object.
   */
  broadcast(
    messages: LineTypes.Message[]
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.broadcastRawBody({ messages });
  }

  /**
   * Get Message Content
   *
   * Gets images, videos, audio, and files sent by users.
   *
   * 【No API for retrieving text】
   *
   * You can't use the Messaging API to retrieve text sent by users.
   *
   * [Official document - get content](https://developers.line.biz/en/reference/messaging-api/#get-content)
   *
   * @param messageId - Message ID
   * @returns Returns status code `200` and the content in binary.
   *
   * Content is automatically deleted after a certain period from when the message was sent. There is no guarantee for how long content is stored.
   */
  getMessageContent(messageId: string): Promise<Buffer> {
    return this.dataAxios
      .get(`/v2/bot/message/${messageId}/content`, {
        responseType: 'arraybuffer',
      })
      .then((res) => res.data, handleError);
  }

  getMessageContentStream(messageId: string): Promise<Readable> {
    return this.dataAxios
      .get(`/v2/bot/message/${messageId}/content`, {
        responseType: 'stream',
      })
      .then((res) => res.data, handleError);
  }

  /**
   * `retrieveMessageContent` is deprecated. Use `getMessageContent` instead.
   */
  retrieveMessageContent(messageId: string): Promise<Buffer> {
    warning(
      false,
      '`retrieveMessageContent` is deprecated. Use `getMessageContent` instead.'
    );
    return this.getMessageContent(messageId);
  }

  /**
   * Get User Profile
   *
   * Gets user profile information.
   *
   * [Official document - get user profile](https://developers.line.biz/en/reference/messaging-api/#get-profile)
   *
   * @param userId - User ID that is returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID found on LINE.Message IDUser ID that is returned in a webhook event object. Do not use the LINE ID found on LINE.
   * @returns Returns status code `200` and a JSON object with the following information.
   *
   * displayName:
   * - User's display name
   *
   * userId:
   * - User ID
   *
   * pictureUrl:
   * - Profile image URL. "https" image URL. Not included in the response if the user doesn't have a profile image.
   *
   * statusMessage:
   * - User's status message. Not included in the response if the user doesn't have a status message.
   */
  getUserProfile(userId: string): Promise<LineTypes.User> {
    return this.axios
      .get(`/v2/bot/profile/${userId}`)
      .then((res) => res.data, handleError)
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  /**
   * Get Group Member Profile
   *
   * Gets the user profile of a member of a group that the LINE Official Account is in if the user ID of the group member is known. You can get user profiles of users who have not added the LINE Official Account as a friend or have blocked the LINE Official Account.
   *
   * [Official document - get group member profile](https://developers.line.biz/en/reference/messaging-api/#get-group-member-profile)
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @param userId - User ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID used in LINE.
   * @returns Returns status code `200` and a JSON object with the following information.
   *
   * displayName:
   * - User's display name
   *
   * userId:
   * - User ID
   *
   * pictureUrl:
   * - Profile image URL. "https" image URL. Not included in the response if the user doesn't have a profile image.
   */
  getGroupMemberProfile(
    groupId: string,
    userId: string
  ): Promise<LineTypes.User> {
    return this.axios
      .get(`/v2/bot/group/${groupId}/member/${userId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Get Room Member Profile
   *
   * Gets the user profile of a member of a room that the LINE Official Account is in if the user ID of the room member is known. You can get user profiles of users who have not added the LINE Official Account as a friend or have blocked the LINE Official Account.
   *
   * [Official document - get room member profile](https://developers.line.biz/en/reference/messaging-api/#get-room-member-profile)
   *
   * @param roomId - Room ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @param userId - User ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID used in LINE.
   * @returns Returns status code `200` and a JSON object with the following information.
   *
   * displayName:
   * - User's display name
   *
   * userId:
   * - User ID
   *
   * pictureUrl:
   * - Profile image URL. "https" image URL. Not included in the response if the user doesn't have a profile image.
   */
  getRoomMemberProfile(
    roomId: string,
    userId: string
  ): Promise<LineTypes.User> {
    return this.axios
      .get(`/v2/bot/room/${roomId}/member/${userId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Get Group Summary
   *
   * Gets the group ID, group name, and group icon URL of a group where the LINE Official Account is a member.
   *
   * [Official document - get group summary](https://developers.line.biz/en/reference/messaging-api/#get-group-summary)
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and a JSON object with the following information.
   *
   * groupId:
   * - Group ID
   *
   * groupName:
   * - Group name
   *
   * pictureUrl:
   * - Group icon URL
   */
  getGroupSummary(groupId: string): Promise<LineTypes.Group> {
    return this.axios
      .get(`/v2/bot/group/${groupId}/summary`)
      .then((res) => res.data, handleError);
  }

  /**
   * Get Members In Group Count
   *
   * Gets the count of members in a group. You can get the member in group count even if the user hasn't added the LINE Official Account as a friend or has blocked the LINE Official Account.
   *
   * [Official document - get members in group count](https://developers.line.biz/en/reference/messaging-api/#get-members-group-count)
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and a number representing group member count.
   *
   * count:
   * - The count of members in the group. The number returned excludes the LINE Official Account.
   */
  getGroupMembersCount(groupId: string): Promise<number> {
    return this.axios
      .get(`/v2/bot/group/${groupId}/members/count`)
      .then((res) => res.data.count, handleError);
  }

  /**
   * Get Group Member Ids
   *
   * Gets the user IDs of the members of a group that the bot is in. This includes the user IDs of users who have not added the LINE Official Account as a friend or has blocked the LINE Official Account.
   *
   * This feature is available only to verified or premium accounts. For more information about account types, see the [LINE Account Connect](https://www.linebiz.com/jp-en/service/line-account-connect/) page on the LINE for Business website.
   *
   * [Official document - get group member profile](https://developers.line.biz/en/reference/messaging-api/#get-group-member-profile)
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @param start - Value of the continuation token found in the `next` property of the JSON object returned in the [response](https://developers.line.biz/en/reference/messaging-api/#get-group-member-user-ids-response). Include this parameter to get the next array of user IDs for the members of the group.
   * @returns Returns status code `200` and a JSON object with the following information.
   *
   * memberIds:
   * - List of user IDs of members in the group. Users of LINE version 7.4.x or earlier are not included in `memberIds`. For more information, see [User consent](https://developers.line.biz/en/docs/messaging-api/user-consent/).
   * - Max: 100 user IDs
   *
   * next:
   * - A continuation token to get the next array of user IDs of the members in the group. Returned only when there are remaining user IDs that were not returned in `memberIds` in the original request.
   */
  getGroupMemberIds(
    groupId: string,
    start?: string
  ): Promise<{ memberIds: string[]; next?: string }> {
    return this.axios
      .get(
        `/v2/bot/group/${groupId}/members/ids${start ? `?start=${start}` : ''}`
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Get All Member Ids in the Group
   *
   * Gets the user IDs of the members of a group that the bot is in. This includes the user IDs of users who have not added the LINE Official Account as a friend or has blocked the LINE Official Account.
   *
   * This feature is available only to verified or premium accounts. For more information about account types, see the [LINE Account Connect](https://www.linebiz.com/jp-en/service/line-account-connect/) page on the LINE for Business website.
   *
   * [Official document - get group member profile](https://developers.line.biz/en/reference/messaging-api/#get-group-member-profile)
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and a JSON object with the following information.
   *
   * memberIds:
   * - List of user IDs of members in the group. Users of LINE version 7.4.x or earlier are not included in `memberIds`. For more information, see [User consent](https://developers.line.biz/en/docs/messaging-api/user-consent/).
   */
  async getAllGroupMemberIds(groupId: string): Promise<string[]> {
    let allMemberIds: string[] = [];
    let continuationToken;

    do {
      const {
        memberIds,
        next,
      }: // eslint-disable-next-line no-await-in-loop
      { memberIds: string[]; next?: string } = await this.getGroupMemberIds(
        groupId,
        continuationToken
      );

      allMemberIds = allMemberIds.concat(memberIds);
      continuationToken = next;
    } while (continuationToken);

    return allMemberIds;
  }

  /**
   * Get Members In Room Count
   *
   * Gets the count of members in a room. You can get the member in room count even if the user hasn't added the LINE Official Account as a friend or has blocked the LINE Official Account.
   *
   * [Official document - get members in room count](https://developers.line.biz/en/reference/messaging-api/#get-members-room-count)
   *
   * @param roomId - Room ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and a number representing room member count.
   *
   * count:
   * - The count of members in the group. The number returned excludes the LINE Official Account.
   */
  getRoomMembersCount(roomId: string): Promise<number> {
    return this.axios
      .get(`/v2/bot/room/${roomId}/members/count`)
      .then((res) => res.data.count, handleError);
  }

  /**
   * Get Room Member Ids
   *
   * Gets the user IDs of the members of a room that the LINE Official Account is in. This includes the user IDs of users who have not added the LINE Official Account as a friend or have blocked the LINE Official Account.
   *
   * This feature is available only to verified or premium accounts. For more information about account types, see the [LINE Account Connect](https://www.linebiz.com/jp-en/service/line-account-connect/) page on the LINE for Business website.
   *
   * [Official document - get room member profile](https://developers.line.biz/en/reference/messaging-api/#get-room-member-user-ids)
   *
   * @param roomId - Room ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @param start - Value of the continuation token found in the `next` property of the JSON object returned in the [response](https://developers.line.biz/en/reference/messaging-api/#get-room-member-user-ids-response). Include this parameter to get the next array of user IDs for the members of the group.
   * @returns Returns status code `200` and a JSON object with the following information.
   *
   * memberIds:
   * - List of user IDs of members in the room. Users of LINE version 7.4.x or earlier are not included in `memberIds`. For more information, see [User consent](https://developers.line.biz/en/docs/messaging-api/user-consent/).
   * - Max: 100 user IDs
   *
   * next:
   * - A continuation token to get the next array of user IDs of the members in the room. Returned only when there are remaining user IDs that were not returned in `memberIds` in the original request.
   */
  getRoomMemberIds(
    roomId: string,
    start?: string
  ): Promise<{ memberIds: string[]; next?: string }> {
    return this.axios
      .get(
        `/v2/bot/room/${roomId}/members/ids${start ? `?start=${start}` : ''}`
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Get All Member Ids in the Room
   *
   * Gets the user IDs of the members of a room that the LINE Official Account is in. This includes the user IDs of users who have not added the LINE Official Account as a friend or have blocked the LINE Official Account.
   *
   * This feature is available only to verified or premium accounts. For more information about account types, see the [LINE Account Connect](https://www.linebiz.com/jp-en/service/line-account-connect/) page on the LINE for Business website.
   *
   * [Official document - get room member profile](https://developers.line.biz/en/reference/messaging-api/#get-room-member-user-ids)
   *
   * @param roomId - Room ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and a JSON object with the following information.
   *
   * memberIds:
   * - List of user IDs of members in the room. Users of LINE version 7.4.x or earlier are not included in `memberIds`. For more information, see [User consent](https://developers.line.biz/en/docs/messaging-api/user-consent/).
   */
  async getAllRoomMemberIds(roomId: string): Promise<string[]> {
    let allMemberIds: string[] = [];
    let continuationToken;

    do {
      const {
        memberIds,
        next,
      }: // eslint-disable-next-line no-await-in-loop
      { memberIds: string[]; next?: string } = await this.getRoomMemberIds(
        roomId,
        continuationToken
      );

      allMemberIds = allMemberIds.concat(memberIds);
      continuationToken = next;
    } while (continuationToken);

    return allMemberIds;
  }

  /**
   * Leave Group
   *
   * Leaves a [group](https://developers.line.biz/en/docs/messaging-api/group-chats/#group).
   *
   * [Official document - leave group](https://developers.line.biz/en/reference/messaging-api/#leave-group)
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and an empty JSON object.
   */
  leaveGroup(groupId: string): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post(`/v2/bot/group/${groupId}/leave`)
      .then((res) => res.data, handleError);
  }

  /**
   * Leave Room
   *
   * Leaves a [room](https://developers.line.biz/en/docs/messaging-api/group-chats/#room).
   *
   * [Official document - leave room](https://developers.line.biz/en/reference/messaging-api/#leave-room)
   *
   * @param roomId - Room ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and an empty JSON object.
   */
  leaveRoom(roomId: string): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post(`/v2/bot/room/${roomId}/leave`)
      .then((res) => res.data, handleError);
  }

  /**
   * Get Rich Menu List
   *
   * Gets a list of the rich menu response object of all rich menus created by [Create a rich menu](https://developers.line.biz/en/reference/messaging-api/#create-rich-menu).
   *
   * You can't retrieve rich menus created with LINE Official Account Manager.
   *
   * [Official document - get rich menu list](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-list)
   *
   * @returns Returns status code `200` and a list of [rich menu response objects](https://developers.line.biz/en/reference/messaging-api/#rich-menu-response-object).
   *
   * richmenus:
   * Array of [rich menu response objects](https://developers.line.biz/en/reference/messaging-api/#rich-menu-response-object)
   */
  getRichMenuList(): Promise<LineTypes.RichMenu[]> {
    return this.axios
      .get('/v2/bot/richmenu/list')
      .then((res) => res.data.richmenus, handleError);
  }

  /**
   * Get Rich Menu
   *
   * Gets a rich menu via a rich menu ID.
   *
   * [Official document - get rich menu](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu)
   *
   * @param richMenuId - ID of a rich menu
   * @returns Returns status code `200` and a [rich menu response objects](https://developers.line.biz/en/reference/messaging-api/#rich-menu-response-object).
   *
   * richmenus:
   * Array of [rich menu response objects](https://developers.line.biz/en/reference/messaging-api/#rich-menu-response-object)
   */
  getRichMenu(richMenuId: string): Promise<LineTypes.RichMenu> {
    return this.axios
      .get(`/v2/bot/richmenu/${richMenuId}`)
      .then((res) => res.data)
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  /**
   * Create Rich Menu
   *
   * Creates a rich menu.
   *
   * You must [upload a rich menu image](https://developers.line.biz/en/reference/messaging-api/#upload-rich-menu-image), and [set the rich menu as the default rich menu](https://developers.line.biz/en/reference/messaging-api/#set-default-rich-menu) or [link the rich menu to a user](https://developers.line.biz/en/reference/messaging-api/#link-rich-menu-to-user) for the rich menu to be displayed. You can create up to 1000 rich menus for one LINE Official Account with the Messaging API.
   *
   * [Official document - create rich menu](https://developers.line.biz/en/reference/messaging-api/#create-rich-menu)
   *
   * @param richMenu - The rich menu represented as a rich menu object.
   * @returns Returns status code `200` and a JSON object with the rich menu ID.
   */
  createRichMenu(
    richMenu: LineTypes.RichMenu
  ): Promise<{ richMenuId: string }> {
    return this.axios
      .post('/v2/bot/richmenu', richMenu)
      .then((res) => res.data, handleError);
  }

  /**
   * Delete Rich Menu
   *
   * Deletes a rich menu.
   *
   * If you have reached the maximum of 1,000 rich menus with the Messaging API for your LINE Official Account, you must delete a rich menu before you can create a new one.
   *
   * [Official document - delete rich menu](https://developers.line.biz/en/reference/messaging-api/#delete-rich-menu)
   *
   * @param richMenuId - ID of a rich menu
   * @returns Returns status code `200` and an empty JSON object.
   */
  deleteRichMenu(
    richMenuId: string
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .delete(`/v2/bot/richmenu/${richMenuId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Get Linked Rich Menu
   *
   * Gets the ID of the rich menu linked to a user.
   *
   * [Official document - get rich menu id of user](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-id-of-user)
   *
   * @param userId - User ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID used in LINE.
   * @returns Returns status code `200` and a JSON object with the rich menu ID.
   */
  getLinkedRichMenu(userId: string): Promise<{ richMenuId: string }> {
    return this.axios
      .get(`/v2/bot/user/${userId}/richmenu`)
      .then((res) => res.data)
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  /**
   * Link Rich Menu
   *
   * Links a rich menu to a user. Only one rich menu can be linked to a user at one time. If a user already has a rich menu linked, calling this endpoint replaces the existing rich menu with the one specified in your request.
   *
   * The rich menu is displayed in the following order of priority (highest to lowest):
   *
   * 1. The per-user rich menu set with the Messaging API
   * 2. The [default rich menu set with the Messaging API](https://developers.line.biz/en/reference/messaging-api/#set-default-rich-menu)
   * 3. The [default rich menu set with LINE Official Account Manager](https://developers.line.biz/en/docs/messaging-api/using-rich-menus/#creating-a-rich-menu-with-the-line-manager)
   *
   * [Official document - link rich menu to user](https://developers.line.biz/en/reference/messaging-api/#link-rich-menu-to-user)
   *
   * @param userId - User ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID used in LINE.
   * @param richMenuId - ID of a rich menu
   * @returns Returns status code `200` and an empty JSON object.
   */
  linkRichMenu(
    userId: string,
    richMenuId: string
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post(`/v2/bot/user/${userId}/richmenu/${richMenuId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Unlink Rich Menu
   *
   * Unlinks a rich menu from a user.
   *
   * [Official document - unlink rich menu from user](https://developers.line.biz/en/reference/messaging-api/#unlink-rich-menu-from-user)
   *
   * @param userId - User ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID used in LINE.
   * @returns Returns status code `200` and an empty JSON object.
   */
  unlinkRichMenu(userId: string): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .delete(`/v2/bot/user/${userId}/richmenu`)
      .then((res) => res.data, handleError);
  }

  /**
   * Get Default Rich Menu
   *
   * Gets the ID of the default rich menu set with the Messaging API.
   *
   * [Official document - get default rich menu id](https://developers.line.biz/en/reference/messaging-api/#get-default-rich-menu-id)
   *
   * @returns Returns status code `200` and a JSON object with the rich menu ID.
   */
  getDefaultRichMenu(): Promise<{ richMenuId: string }> {
    return this.axios
      .get(`/v2/bot/user/all/richmenu`)
      .then((res) => res.data)
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  /**
   * Set Default Rich Menu
   *
   * Sets the default rich menu. The default rich menu is displayed to all users who have added your LINE Official Account as a friend and are not linked to any per-user rich menu. If a default rich menu has already been set, calling this endpoint replaces the current default rich menu with the one specified in your request.
   *
   * The rich menu is displayed in the following order of priority (highest to lowest):
   *
   * 1. [The per-user rich menu set with the Messaging API](https://developers.line.biz/en/reference/messaging-api/#link-rich-menu-to-user)
   * 2. The default rich menu set with the Messaging API
   * 3. [The default rich menu set with LINE Official Account Manager](https://developers.line.biz/en/docs/messaging-api/using-rich-menus/#creating-a-rich-menu-with-the-line-manager)
   *
   * [Official document - set default rich menu](https://developers.line.biz/en/reference/messaging-api/#set-default-rich-menu)
   *
   * @param richMenuId - ID of a rich menu
   * @returns Returns status code `200` and an empty JSON object.
   */
  setDefaultRichMenu(
    richMenuId: string
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post(`/v2/bot/user/all/richmenu/${richMenuId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Delete Default Rich Menu
   *
   * Cancels the default rich menu set with the Messaging API.
   *
   * [Official document - cancel default rich menu](https://developers.line.biz/en/reference/messaging-api/#cancel-default-rich-menu)
   *
   * @returns Returns status code `200` and a JSON object with the rich menu ID.
   */
  deleteDefaultRichMenu(): Promise<{ richMenuId: string }> {
    return this.axios
      .delete(`/v2/bot/user/all/richmenu`)
      .then((res) => res.data, handleError);
  }

  /**
   * Upload Rich Menu Image
   *
   * Uploads and attaches an image to a rich menu.
   *
   * You can use rich menu images with the following specifications:
   *
   * - Image format: JPEG or PNG
   * - Image size (pixels): 2500x1686, 2500x843, 1200x810, 1200x405, 800x540, 800x270
   * - Max file size: 1 MB
   *
   * Note: You cannot replace an image attached to a rich menu. To update your rich menu image, create a new rich menu object and upload another image.
   *
   * [Official document - upload rich menu image](https://developers.line.biz/en/reference/messaging-api/#upload-rich-menu-image)
   *
   * @param richMenuId - The ID of the rich menu to attach the image to
   * @param image - image
   * @returns Returns status code `200` and an empty JSON object.
   */
  uploadRichMenuImage(
    richMenuId: string,
    image: Buffer
  ): Promise<LineTypes.MutationSuccessResponse> {
    const type = imageType(image);
    invariant(
      type && (type.mime === 'image/jpeg' || type.mime === 'image/png'),
      'Image must be `image/jpeg` or `image/png`'
    );

    return this.dataAxios
      .post(`/v2/bot/richmenu/${richMenuId}/content`, image, {
        headers: {
          'Content-Type': (type as { mime: string }).mime,
        },
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Download Rich Menu Image
   *
   * Downloads an image associated with a rich menu.
   *
   * [Official document - download rich menu image](https://developers.line.biz/en/reference/messaging-api/#download-rich-menu-image)
   *
   * @param richMenuId - ID of the rich menu with the image to be downloaded
   * @returns Returns status code `200` and the binary data of the rich menu image. The image can be downloaded as shown in the example request.
   */