
import crypto from 'crypto';
import fs from 'fs';
import querystring from 'querystring';
import url from 'url';

import AxiosError from 'axios-error';
import FormData from 'form-data';
import appendQuery from 'append-query';
import axios, {
  AxiosInstance,
  AxiosTransformer,
  AxiosError as BaseAxiosError,
} from 'axios';
import get from 'lodash/get';
import invariant from 'ts-invariant';
import isPlainObject from 'lodash/isPlainObject';
import omit from 'lodash/omit';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as Messenger from './Messenger';
import * as MessengerTypes from './MessengerTypes';

function extractVersion(version: string): string {
  if (version.startsWith('v')) {
    return version.slice(1);
  }
  return version;
}

function handleError(
  err: BaseAxiosError<{
    error: {
      code: number;
      type: string;
      message: string;
    };
  }>
): never {
  if (err.response && err.response.data) {
    const error = get(err, 'response.data.error');
    if (error) {
      const msg = `Messenger API - ${error.code} ${error.type} ${error.message}`;
      throw new AxiosError(msg, err);
    }
  }
  throw new AxiosError(err.message, err);
}

export default class MessengerClient {
  /**
   * @deprecated Use `new MessengerClient(...)` instead.
   */
  static connect(config: MessengerTypes.ClientConfig): MessengerClient {
    warning(
      false,
      '`MessengerClient.connect(...)` is deprecated. Use `new MessengerClient(...)` instead.'
    );
    return new MessengerClient(config);
  }

  /**
   * The underlying axios instance.
   */
  readonly axios: AxiosInstance;

  /**
   * The version of the Facebook Graph API.
   */
  readonly version: string;

  /**
   * The access token used by the client.
   */
  readonly accessToken: string;

  /**
   * The app secret used by the client.
   */
  readonly appSecret?: string;

  /**
   * The app ID used by the client.
   */
  readonly appId?: string;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  constructor(config: MessengerTypes.ClientConfig) {
    invariant(
      typeof config !== 'string',
      `MessengerClient: do not allow constructing client with ${config} string. Use object instead.`
    );

    this.accessToken = config.accessToken;
    invariant(
      !config.version || typeof config.version === 'string',
      'Type of `version` must be string.'
    );

    this.appId = config.appId;
    this.appSecret = config.appSecret;
    this.version = extractVersion(config.version || '6.0');
    this.onRequest = config.onRequest;
    const { origin } = config;

    let skipAppSecretProof;
    if (typeof config.skipAppSecretProof === 'boolean') {
      skipAppSecretProof = config.skipAppSecretProof;
    } else {
      skipAppSecretProof = this.appSecret == null;
    }

    this.axios = axios.create({
      baseURL: `${origin || 'https://graph.facebook.com'}/v${this.version}/`,
      headers: { 'Content-Type': 'application/json' },
      transformRequest: [
        // axios use any as type of the data in AxiosTransformer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any): any =>
          data && isPlainObject(data) ? snakecaseKeysDeep(data) : data,
        ...(axios.defaults.transformRequest as AxiosTransformer[]),
      ],

      // `transformResponse` allows changes to the response data to be made before
      // it is passed to then/catch
      transformResponse: [
        ...(axios.defaults.transformResponse as AxiosTransformer[]),
        // axios use any as type of the data in AxiosTransformer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any): any =>
          data && isPlainObject(data) ? camelcaseKeysDeep(data) : data,
      ],
    });

    this.axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this.onRequest })
    );

    // add appsecret_proof to request
    if (!skipAppSecretProof) {
      invariant(
        this.appSecret,
        'Must provide appSecret when skipAppSecretProof is false'
      );

      const appSecret = this.appSecret as string;

      this.axios.interceptors.request.use((requestConfig) => {
        const isBatch =
          requestConfig.url === '/' && Array.isArray(requestConfig.data.batch);

        if (isBatch) {
          // eslint-disable-next-line no-param-reassign
          requestConfig.data.batch = requestConfig.data.batch.map(
            (item: any) => {
              const urlParts = url.parse(item.relativeUrl, true);
              let accessToken = get(urlParts, 'query.access_token');
              if (!accessToken && item.body) {
                const entries = decodeURIComponent(item.body)
                  .split('&')
                  .map((pair) => pair.split('='));

                const accessTokenEntry = entries.find(
                  ([key]) => key === 'access_token'
                );
                if (accessTokenEntry) {
                  accessToken = accessTokenEntry[1];
                }
              }

              if (accessToken) {
                const appSecretProof = crypto
                  .createHmac('sha256', appSecret)
                  .update(accessToken, 'utf8')
                  .digest('hex');
                return {
                  ...item,
                  relativeUrl: appendQuery(item.relativeUrl, {
                    appsecret_proof: appSecretProof,
                  }),
                };
              }

              return item;
            }
          );
        }

        const urlParts = url.parse(requestConfig.url || '', true);
        const accessToken = get(
          urlParts,
          'query.access_token',
          this.accessToken
        );

        const appSecretProof = crypto
          .createHmac('sha256', appSecret)
          .update(accessToken, 'utf8')
          .digest('hex');

        // eslint-disable-next-line no-param-reassign
        requestConfig.url = appendQuery(requestConfig.url || '', {
          appsecret_proof: appSecretProof,
        });

        return requestConfig;
      });
    }
  }

  /**
   * Gets page info using Graph API.
   *
   * @returns Page info
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/page/
   *
   * @example
   *
   * ```js
   * await client.getPageInfo();
   * // {
   * //   name: 'Bot Demo',
   * //   id: '1895382890692546',
   * // }
   * ```
   */
  getPageInfo({
    fields,
  }: { fields?: string[] } = {}): Promise<MessengerTypes.PageInfo> {
    return this.axios
      .get('/me', {
        params: {
          access_token: this.accessToken,
          fields: fields ? fields.join(',') : undefined,
        },
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Gets token information.
   *
   * @returns Token information
   *
   * @see https://developers.facebook.com/docs/facebook-login/access-tokens/debugging-and-error-handling
   *
   * @example
   *
   * ```js
   * await client.debugToken();
   * // {
   * //   appId: '000000000000000',
   * //   application: 'Social Cafe',
   * //   expiresAt: 1352419328,
   * //   isValid: true,
   * //   issuedAt: 1347235328,
   * //   scopes: ['email', 'user_location'],
   * //   userId: 1207059,
   * // }
   * ```
   */
  debugToken(): Promise<MessengerTypes.TokenInfo> {
    invariant(this.appId, 'App ID is required to debug token');
    invariant(this.appSecret, 'App Secret is required to debug token');

    const accessToken = `${this.appId}|${this.appSecret}`;

    return this.axios
      .get(`/debug_token`, {
        params: {
          input_token: this.accessToken,
          access_token: accessToken,
        },
      })
      .then((res) => res.data.data, handleError);
  }

  /**
   * Create new Webhooks subscriptions.
   *
   * @param subscription - Subscription parameters.
   * @param subscription.accessToken - App access token.
   * @param subscription.callbackUrl - The URL to receive the POST request when an update is triggered, and a GET request when attempting this publish operation.
   * @param subscription.verifyToken - An arbitrary string that can be used to confirm to your server that the request is valid.
   * @param subscription.fields - One or more of the set of valid fields in this object to subscribe to. Default Fields: `messages`, `messaging_postbacks`, `messaging_optins`, `messaging_referrals`, `messaging_handovers` and `messaging_policy_enforcement`.
   * @param subscription.object - Indicates the object type that this subscription applies to. Defaults to `page`.
   * @param subscription.includeValues - Indicates if change notifications should include the new values.
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/app/subscriptions
   *
   * @example
   *
   * ```js
   * await client.createSubscription({
   *   accessToken: APP_ACCESS_TOKEN,
   *   callbackUrl: 'https://mycallback.com',
   *   fields: ['messages', 'messaging_postbacks', 'messaging_referrals'],
   *   verifyToken: VERIFY_TOKEN,
   * });
   *
   * // Or provide app id and app secret instead of app access token:
   * client.createSubscription({
   *   accessToken: `${APP_ID}|${APP_SECRET}`,
   *   callbackUrl: 'https://mycallback.com',
   *   fields: ['messages', 'messaging_postbacks', 'messaging_referrals'],
   *   verifyToken: VERIFY_TOKEN,
   * });
   * ```
   */
  createSubscription({
    object = 'page',
    callbackUrl,
    fields = [
      'messages',
      'messaging_postbacks',
      'messaging_optins',
      'messaging_referrals',
      'messaging_handovers',
      'messaging_policy_enforcement',
    ],
    includeValues,
    verifyToken,
    accessToken: appAccessToken,
  }: {
    object?: 'user' | 'page' | 'permissions' | 'payments';
    callbackUrl: string;
    fields?: string[];
    includeValues?: boolean;
    verifyToken: string;
    accessToken: string;
  }): Promise<{ success: boolean }> {
    const { appId } = this;

    invariant(appId, 'App ID is required to create subscription');
    invariant(
      this.appSecret || appAccessToken,
      'App Secret or App Token is required to create subscription'
    );

    const accessToken = appAccessToken || `${appId}|${this.appSecret}`;

    return this.axios
      .post(`/${appId}/subscriptions?access_token=${accessToken}`, {
        object,
        callbackUrl,
        fields: fields.join(','),
        includeValues,
        verifyToken,
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the current Webhook subscriptions set up on your app.
   *
   * @param options - The other parameters.
   * @param options.accessToken - App access token.
   * @returns An array of subscriptions.
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/app/subscriptions
   *
   * @example
   *
   * ```js
   * await client.getSubscriptions({
   *   accessToken: APP_ACCESS_TOKEN,
   * });
   * // [{
   * //   object: 'page',
   * //   callbackUrl: 'https://www.example.com/callback'
   * //   fields: ['messages', 'messaging_postbacks', 'messaging_optins'],
   * //   active: true,
   * // }]
   *
   * // Or provide app id and app secret instead of app access token:
   * await client.getSubscriptions({
   *   accessToken: `${APP_ID}|${APP_SECRET}`,
   * });
   * ```
   */
  getSubscriptions({
    accessToken: appAccessToken,
  }: {
    accessToken?: string;
  } = {}): Promise<MessengerTypes.MessengerSubscription[]> {
    const { appId } = this;
    invariant(appId, 'App ID is required to get subscriptions');
    invariant(
      this.appSecret || appAccessToken,
      'App Secret or App Token is required to get subscriptions'
    );

    const accessToken = appAccessToken || `${appId}|${this.appSecret}`;

    return this.axios
      .get(`/${appId}/subscriptions?access_token=${accessToken}`)
      .then((res) => res.data.data, handleError);
  }

  /**
   * Get the current page subscription set up on your app.
   *
   * @param options - The other parameters.
   * @param options.accessToken - App access token.
   * @returns The current page subscription
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/app/subscriptions
   *
   * @example
   *
   * ```js
   * await client.getPageSubscription({
   *   accessToken: APP_ACCESS_TOKEN,
   * });
   *
   * // Or provide app id and app secret instead of app access token:
   * await client.getPageSubscription({
   *   accessToken: `${APP_ID}|${APP_SECRET}`,
   * });
   * ```
   */
  getPageSubscription({
    accessToken: appAccessToken,
  }: {
    accessToken?: string;
  } = {}): Promise<MessengerTypes.MessengerSubscription> {
    const { appId } = this;
    invariant(appId, 'App ID is required to get subscription');
    invariant(
      this.appSecret || appAccessToken,
      'App Secret or App Token is required to get subscription'
    );

    const accessToken = appAccessToken || `${appId}|${this.appSecret}`;

    return this.getSubscriptions({
      accessToken,
    }).then(
      (subscriptions: MessengerTypes.MessengerSubscription[]) =>
        subscriptions.filter(
          (subscription) => subscription.object === 'page'
        )[0] || null
    );
  }

  /**
   * Programmatically check the feature submission status of page-level platform features
   *
   * @returns An array of all submitted feature submission requests. If no request has been submitted, the array will be empty.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messaging-feature-review-api
   *
   * @example
   *
   * ```js
   * await client.getMessagingFeatureReview();
   * // [{
   * //   "feature": "subscription_messaging",
   * //   "status": "<pending|rejected|approved|limited>"
   * // }]
   */
  getMessagingFeatureReview(): Promise<
    MessengerTypes.MessagingFeatureReview[]
  > {
    return this.axios
      .get<{ data: MessengerTypes.MessagingFeatureReview[] }>(
        `/me/messaging_feature_review?access_token=${this.accessToken}`
      )
      .then((res) => res.data.data, handleError);
  }

  /**
   * Retrieves a person's profile.
   *
   * @param userId - Facebook page-scoped user ID.
   * @param options - Other optional parameters.
   * @param options.fields - Value must be among `id`, `name`, `first_name`, `last_name`, `profile_pic`, `locale`, `timezone` and `gender`, default with `id`, `name`, `first_name`, `last_name` and `profile_pic`.
   * @returns Profile of the user.
   *
   * @see https://www.quora.com/How-connect-Facebook-user-id-to-sender-id-in-the-Facebook-messenger-platform
   *
   * @example
   *
   * ```js
   * await client.getUserProfile(USER_ID);
   * // {
   * //   id: '5566'
   * //   firstName: 'Johnathan',
   * //   lastName: 'Jackson',
   * //   profilePic: 'https://example.com/pic.png',
   * // }
   * ```
   */
  getUserProfile(
    userId: string,
    {
      fields = ['id', 'name', 'first_name', 'last_name', 'profile_pic'],
    }: { fields?: MessengerTypes.UserProfileField[] } = {}
  ): Promise<MessengerTypes.User> {
    return this.axios
      .get<MessengerTypes.User>(
        `/${userId}?fields=${fields.join(',')}&access_token=${this.accessToken}`
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves the current value of one or more Messenger Profile properties by name.
   *
   * @param fields - An array of Messenger profile properties to retrieve. Value must be among `account_linking_url`, `persistent_menu`, `get_started`, `greeting`, `ice_breakers` and `whitelisted_domains`.
   * @returns The current value of the requested properties
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
   *
   * @example
   *
   * ```js
   * await client.getMessengerProfile(['get_started', 'persistent_menu']);
   * // [
   * //   {
   * //     getStarted: {
   * //       payload: 'GET_STARTED',
   * //     },
   * //   },
   * //   {
   * //     persistentMenu: [
   * //       {
   * //         locale: 'default',
   * //         composerInputDisabled: true,
   * //         callToActions: [
   * //           {
   * //             type: 'postback',
   * //             title: 'Restart Conversation',
   * //             payload: 'RESTART',
   * //           },
   * //         ],
   * //       },
   * //     ],
   * //   },
   * // ]
   * ```
   */
  getMessengerProfile(
    fields: string[]
  ): Promise<MessengerTypes.MessengerProfile[]> {
    return this.axios
      .get<{ data: MessengerTypes.MessengerProfile[] }>(
        `/me/messenger_profile?fields=${fields.join(',')}&access_token=${
          this.accessToken
        }`
      )
      .then((res) => res.data.data, handleError);
  }

  /**
   * Sets the values of one or more Messenger Profile properties. Only properties set in the request body will be overwritten.
   *
   * @param profile - [Profile](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api#profile_properties) object.
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api#post
   *
   * @example
   *
   * ```js
   * await client.setMessengerProfile({
   *   getStarted: {
   *     payload: 'GET_STARTED',
   *   },
   *   persistentMenu: [
   *     {
   *       locale: 'default',
   *       composerInputDisabled: true,
   *       callToActions: [
   *         {
   *           type: 'postback',
   *           title: 'Restart Conversation',
   *           payload: 'RESTART',
   *         },
   *       ],
   *     },
   *   ],
   * });
   * ```
   */
  setMessengerProfile(
    profile: MessengerTypes.MessengerProfile
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.axios
      .post<MessengerTypes.MutationSuccessResponse>(
        `/me/messenger_profile?access_token=${this.accessToken}`,
        profile
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Deletes one or more Messenger Profile properties. Only properties specified in the fields array will be deleted.
   *
   * @param fields - An array of Messenger profile properties to delete. Value must be among `account_linking_url`, `persistent_menu`, `get_started`, `greeting`, `ice_breakers` and `whitelisted_domains`.
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api#delete
   *
   * @example
   *
   * ```js
   * await client.deleteMessengerProfile(['get_started', 'persistent_menu']);
   * ```
   */
  deleteMessengerProfile(
    fields: string[]
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.axios
      .delete<MessengerTypes.MutationSuccessResponse>(
        `/me/messenger_profile?access_token=${this.accessToken}`,
        {
          data: {
            fields,
          },
        }
      )
      .then((res) => res.data, handleError);
  }