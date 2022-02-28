
import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import difference from 'lodash/difference';
import invariant from 'ts-invariant';
import isPlainObject from 'lodash/isPlainObject';
import pick from 'lodash/pick';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  snakecase,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as TelegramTypes from './TelegramTypes';

export default class TelegramClient {
  /**
   * @deprecated Use `new TelegramClient(...)` instead.
   */
  static connect(config: TelegramTypes.ClientConfig): TelegramClient {
    warning(
      false,
      '`TelegramClient.connect(...)` is deprecated. Use `new TelegramClient(...)` instead.'
    );
    return new TelegramClient(config);
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
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  constructor(config: TelegramTypes.ClientConfig) {
    invariant(
      typeof config !== 'string',
      `TelegramClient: do not allow constructing client with ${config} string. Use object instead.`
    );

    this.accessToken = config.accessToken;
    this.onRequest = config.onRequest;
    const { origin } = config;

    this.axios = axios.create({
      baseURL: `${origin || 'https://api.telegram.org'}/bot${
        this.accessToken
      }/`,
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

  private async request(path: string, body: Record<string, any> = {}) {
    try {
      const response = await this.axios.post(path, snakecaseKeysDeep(body));

      const { data, config, request } = response;

      if (!data.ok) {
        throw new AxiosError(`Telegram API - ${data.description || ''}`, {
          config,
          request,
          response,
        });
      }

      if (isPlainObject(data.result) || Array.isArray(data.result)) {
        return camelcaseKeysDeep(data.result);
      }
      return data.result;
    } catch (err: any) {
      if (err.response && err.response.data) {
        const { error_code, description } = err.response.data;
        const msg = `Telegram API - ${error_code} ${description || ''}`;

        throw new AxiosError(msg, err);
      }
      throw new AxiosError(err.message, err);
    }
  }

  private optionWithoutKeys(
    option: any,
    removeKeys: string[]
  ): Record<string, any> {
    let keys = Object.keys(option);
    keys = difference(keys, removeKeys);
    keys = difference(
      keys,
      removeKeys.map((key) => snakecase(key))
    );
    return pick(option, keys);
  }

  /**
   * Use this method to receive incoming updates using long polling.
   * - This method will not work if an outgoing webhook is set up.
   * - In order to avoid getting duplicate updates, recalculate offset after each server response.
   *
   * @param options - Optional parameters.
   * @param options.offset - Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned.
   * @param options.limit - Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.
   * @param options.timeout - Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.
   * @param options.allowedUpdates - A JSON-serialized list of the update types you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types.
   * @returns An array of [Update](https://core.telegram.org/bots/api#update) objects is returned.
   *
   * @see https://core.telegram.org/bots/api#getupdates
   *
   * @example
   *
   * ```js
   * await client.getUpdates({ limit: 10 });
   * // [
   * //   {
   * //     updateId: 513400512,
   * //     message: {
   * //     messageId: 3,
   * //     from: {
   * //       id: 313534466,
   * //       firstName: 'first',
   * //       lastName: 'last',
   * //       username: 'username',
   * //     },
   * //     chat: {
   * //       id: 313534466,
   * //       firstName: 'first',
   * //       lastName: 'last',
   * //       username: 'username',
   * //       type: 'private',
   * //     },
   * //     date: 1499402829,
   * //     text: 'hi',
   * //   },
   * // },
   * // ...
   * // ]
   * ```
   */
  getUpdates(
    options?: TelegramTypes.GetUpdatesOption
  ): Promise<TelegramTypes.Update[]> {
    return this.request('/getUpdates', {
      ...options,
    });
  }

  /**
   * Use this method to get current webhook status.
   *
   * @returns On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.
   *
   * @see https://core.telegram.org/bots/api#getwebhookinfo
   *
   * @example
   *
   * ```js
   * await client.getWebhookInfo();
   * // {
   * //   url: 'https://4a16faff.ngrok.io/',
   * //   hasCustomCertificate: false,
   * //   pendingUpdateCount: 0,
   * //   maxConnections: 40,
   * // }
   * ```
   */
  getWebhookInfo(): Promise<TelegramTypes.WebhookInfo> {
    return this.request('/getWebhookInfo');
  }

  /**
   * Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts.
   *
   * If you'd like to make sure that the Webhook request comes from Telegram, we recommend using a secret path in the URL, e.g. https://www.example.com/<token>. Since nobody else knows your bot‘s token, you can be pretty sure it’s us.
   *
   * @param url - HTTPS url to send updates to. Use an empty string to remove webhook integration.
   * @param options - Optional parameters.
   * @param options.certificate - not supported yet.
   * @param options.maxConnections - Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40.
   * @param options.allowedUpdates - List the types of updates you want your bot to receive.
   * @returns True on success.
   *
   * @see https://core.telegram.org/bots/api#setwebhook
   *
   * @example
   *
   * ```js
   * await client.setWebhook('https://4a16faff.ngrok.io/');
   * ```
   */
  setWebhook(
    url: string,
    options: TelegramTypes.SetWebhookOption = {}
  ): Promise<boolean> {
    const optionsWithoutCertificate = this.optionWithoutKeys(options, [
      'certificate',
    ]);
    return this.request('/setWebhook', {
      url,
      ...optionsWithoutCertificate,
    });
  }

  /**
   * Use this method to remove webhook integration if you decide to switch back to getUpdates.
   *
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#deletewebhook
   *
   * @example
   *
   * ```js
   * await client.deleteWebhook();
   * ```
   */
  deleteWebhook(): Promise<boolean> {
    return this.request('/deleteWebhook');
  }

  /**
   * A simple method for testing your bot's auth token.
   *
   * @returns Returns basic information about the bot in form of a User object.
   *
   * @see https://core.telegram.org/bots/api#getme
   *
   * @example
   *
   * ```js
   * await client.getMe();
   * // {
   * //   id: 313534466,
   * //   firstName: 'first',
   * //   username: 'a_bot'
   * // }
   * ```
   */
  getMe(): Promise<TelegramTypes.User> {
    return this.request('/getMe');
  }

  /**
   * Use this method to send text messages.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param text - Text of the message to be sent.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendmessage
   *
   * @example
   *
   * ```js
   * await client.sendMessage(CHAT_ID, 'hi', {
   *   disableWebPagePreview: true,
   *   disableNotification: true,
   * });
   * ```
   */
  sendMessage(
    chatId: string | number,
    text: string,
    options?: TelegramTypes.SendMessageOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendMessage', {
      chatId,
      text,
      ...options,
    });
  }

  /**
   * Use this method to forward messages of any kind.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param fromChatId - Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
   * @param messageId - Message identifier in the chat specified in fromChatId
   * @param options - Options for other optional parameters.
   * @param options.disableNotification - Sends the message silently. Users will receive a notification with no sound
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#forwardmessage
   *
   * @example
   *
   * ```js
   * await client.forwardMessage(CHAT_ID, USER_ID, MESSAGE_ID, {
   *   disableNotification: true,
   * });
   * ```
   */
  forwardMessage(
    chatId: string | number,
    fromChatId: string | number,
    messageId: number,
    options?: TelegramTypes.ForwardMessageOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/forwardMessage', {
      chatId,
      fromChatId,
      messageId,
      ...options,
    });
  }

  /**
   * Use this method to send photos.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param photo - Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a photo from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendphoto
   *
   * @example
   *
   * ```js
   * await client.sendPhoto(CHAT_ID, 'https://example.com/image.png', {
   *   caption: 'gooooooodPhoto',
   *   disableNotification: true,
   * });
   * ```
   */
  sendPhoto(
    chatId: string | number,
    photo: string,
    options: TelegramTypes.SendPhotoOption = {}
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendPhoto', {
      chatId,
      photo,
      ...options,
    });
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .mp3 format. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
   *
   * For sending voice messages, use the sendVoice method instead.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param audio -Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get an audio file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendaudio
   *
   * @example
   *
   * ```js
   * await client.sendAudio(CHAT_ID, 'https://example.com/audio.mp3', {
   *   caption: 'gooooooodAudio',
   *   disableNotification: true,
   * });
   * ```
   */
  sendAudio(
    chatId: string | number,
    audio: string,
    options: TelegramTypes.SendAudioOption = {}
  ): Promise<TelegramTypes.Message> {
    const optionsWithoutThumb = pick(options, [
      'caption',
      'parse_mode',
      'parseMode',
      'duration',
      'performer',
      'title',
      'disable_notification',
      'disableNotification',
      'reply_to_message_id',
      'replyToMessageId',
      'reply_markup',
      'replyMarkup',
    ]);
    return this.request('/sendAudio', {
      chatId,
      audio,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send general files. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param document - File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#senddocument
   *
   * @example
   *
   * ```js
   * await client.sendDocument(CHAT_ID, 'https://example.com/doc.gif', {
   *   caption: 'gooooooodDocument',
   *   disableNotification: true,
   * });
   * ```
   */
  sendDocument(
    chatId: string | number,
    document: string,
    options: TelegramTypes.SendDocumentOption = {}
  ): Promise<TelegramTypes.Message> {
    const optionsWithoutThumb = this.optionWithoutKeys(options, ['thumb']);

    return this.request('/sendDocument', {
      chatId,
      document,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param video - Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a video from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendvideo
   *
   * @example
   *
   * ```js
   * await client.sendVideo(CHAT_ID, 'https://example.com/video.mp4', {
   *   caption: 'gooooooodVideo',
   *   disableNotification: true,
   * });
   * ```
   */
  sendVideo(
    chatId: string | number,
    video: string,
    options: TelegramTypes.SendVideoOption = {}
  ): Promise<TelegramTypes.Message> {
    const optionsWithoutThumb = this.optionWithoutKeys(options, ['thumb']);

    return this.request('/sendVideo', {
      chatId,
      video,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param animation - Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get an animation from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendanimation
   *
   * @example
   *
   * ```js
   * ```
   */
  sendAnimation(
    chatId: string | number,
    animation: string,
    options: TelegramTypes.SendAnimationOption = {}
  ): Promise<TelegramTypes.Message> {
    const optionsWithoutThumb = this.optionWithoutKeys(options, ['thumb']);

    return this.request('/sendAnimation', {
      chatId,
      animation,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document). Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param voice - Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendvoice
   *
   * @example
   *
   * ```js
   * await client.sendVoice(CHAT_ID, 'https://example.com/voice.ogg', {
   *   caption: 'gooooooodVoice',
   *   disableNotification: true,
   * });
   * ```
   */
  sendVoice(
    chatId: string | number,
    voice: string,
    options: TelegramTypes.SendVoiceOption = {}
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendVoice', {
      chatId,
      voice,
      ...options,
    });
  }

  /**
   * As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param videoNote - Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers. Sending video notes by a URL is currently unsupported. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.