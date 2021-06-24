
# 1.1.0 / 2021-10-04

### messaging-api-line

- [new] Added support for broadcast API:

```js
await client.broadcast([
  {
    type: 'text',
    text: 'Hello, world1',
  },
]);
```

- [new] Added `.getBotInfo()`:

```js
await client.getBotInfo();
// {
//   "userId": "Ub9952f8...",
//   "basicId": "@216ru...",
//   "displayName": "Example name",
//   "pictureUrl": "https://obs.line-apps.com/...",
//   "chatMode": "chat",
//   "markAsReadMode": "manual"
// }
```

- [new] Added support for webhook APIs:

```js
await client.getWebhookEndpointInfo();
// {
//   "endpoint": "https://example.com/test",
//   "active": true
// }
await client.setWebhookEndpointUrl('https://www.example.com/callback');
await client.testWebhookEndpoint();
// {
//   "success": true,
//   "timestamp": "2020-09-30T05:38:20.031Z",
//   "statusCode": 200,
//   "reason": "OK",
//   "detail": "200"
// }
```

# 1.0.6 / 2021-09-03

### messaging-api-viber

- fix: add `type: 'keyboard'` to the `Keyboard` type

# 1.0.5 / 2021-04-15

### messaging-api-messenger

- fix: type TemplateElement should allow optional attributes

# 1.0.4 / 2021-01-11

- deps: bump axios.

# 1.0.3 / 2020-10-20

### messaging-api-slack

- fix: add the missing `warning` package.

# 1.0.2 / 2020-09-21

### messaging-api-messenger

- feat: add persona support to typing_on and typing_off

# 1.0.1 / 2020-09-21

- chore: remove namespace and export types from module instead #627

# 1.0.0 / 2020-09-07

## Breaking Changes

The whole project has been rewritten with TypeScript and all APIs now accept camelcase keys instead of snakecase keys.

Please checkout [the new API document](https://bottenderjs.github.io/messaging-apis/latest/index.html).

# 0.8.4 / 2019-09-29

### messaging-api-wechat

- [fix] WechatClient: apply throwErrorIfAny to getAccessToken #502

# 0.8.3 / 2019-09-28

### messaging-api-line

- [fix] handle arraybuffer correctly in `retrieveMessageContent`

# 0.8.2 / 2019-09-05

- [fix] avoid printing undefined outgoing request body in `onRequest`.

# 0.8.1 / 2019-08-27

- [deps] update packages
- [deps] use babel 7 instead of babel 6 internally

# 0.8.0 / 2019-08-26

### messaging-api-messenger

- [breaking] remove deprecated `sendAirlineFlightUpdateTemplate`
- [breaking] remove deprecated createXxxx methods on `MessengerBatch`
- [breaking] remove deprecated insight methods `getActiveThreads` and `getReportedConversationsByReportType`
- [new] update default graph api version to `v4`
- [new] add `getThreadOwner` in `MessengerBatch`
- [deprecated] add warning for `createListTemplate` and `createOpenGraphTemplate`
- [deprecated] add waning to broadcast methods `createMessageCreative`, `sendBroadcastMessage`, `cancelBroadcast`, `getBroadcast`, `startReachEstimation`, `getReachEstimate`, `getBroadcastMessagesSent` and `generateMessengerCode`.
- [fix] add missing `options` to messenger batch functions [047db83](https://github.com/Yoctol/messaging-apis/commit/047db83cccab8a52f2b606ea8aa3ad70eeff18d1)
- [fix] parse batch response body

### messaging-api-line

- [breaking] refine rich menu getter functions error handling when getting 404
- [breaking] return null when no user found (#445)

# 0.7.16 / 2019-01-29

### messaging-api-messenger

- [new] add `options.fields` to `getUserProfile`:

```js
client
  .getUserProfile(USER_ID, {
    fields: [
      `id`,
      `name`,
      `first_name`,
      `last_name`,
      `profile_pic`,
      `locale`,
      `timezone`,
      `gender`,
    ],
  })
  .then((user) => {
    console.log(user);
    // {
    //   id: '5566'
    //   first_name: 'Johnathan',
    //   last_name: 'Jackson',
    //   profile_pic: 'https://example.com/pic.png',
    //   locale: 'en_US',
    //   timezone: 8,
    //   gender: 'male',
    // }
  });
```

- [new] implement `client.getSubscriptions`:

```js
client.getSubscriptions({
  access_token: APP_ACCESS_TOKEN,
});

// or

client.getSubscriptions({
  access_token: `${APP_ID}|${APP_SECRET}`,
});
```

- [new] implement `client.getPageSubscription`:

```js
client.getPageSubscription({
  access_token: APP_ACCESS_TOKEN,
});

// or

client.getPageSubscription({
  access_token: `${APP_ID}|${APP_SECRET}`,
});
```

# 0.7.15 / 2018-11-12

### messaging-api-messenger

- [new] implement `client.debugToken`:

```js
client.debugToken().then((pageInfo) => {
  console.log(pageInfo);
  // {
  //    app_id: '000000000000000',
  //    application: 'Social Cafe',
  //    expires_at: 1352419328,
  //    is_valid: true,
  //    issued_at: 1347235328,
  //    scopes: ['email', 'user_location'],
  //    user_id: 1207059,
  //  }
});
```

### messaging-api-line

- [new] add `client.multicastFlex`:

```js
client.multicastFlex([USER_ID], 'this is a flex', {
  type: 'bubble',
  header: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: 'Header text',
      },
    ],
  },
  hero: {
    type: 'image',
    url: 'https://example.com/flex/images/image.jpg',
  },
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: 'Body text',
      },
    ],
  },
  footer: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: 'Footer text',
      },
    ],
  },
  styles: {
    comment: 'See the example of a bubble style object',
  },
});
```

- [new] support `video` for imagemap:

```js
const res = await client.replyImagemap(REPLY_TOKEN, 'this is an imagemap', {
  baseUrl: 'https://example.com/bot/images/rm001',
  baseSize: {
    height: 1040,
    width: 1040,
  },
  video: {
    originalContentUrl: 'https://example.com/video.mp4',
    previewImageUrl: 'https://example.com/video_preview.jpg',
    area: {
      x: 0,
      y: 0,
      width: 1040,
      height: 585,
    },
    externalLink: {
      linkUri: 'https://example.com/see_more.html',
      label: 'See More',
    },
  },
  actions: [
    {
      type: 'uri',
      linkUri: 'https://example.com/',
      area: {
        x: 0,
        y: 0,
        width: 520,
        height: 1040,
      },
    },
    {
      type: 'message',
      text: 'hello',
      area: {
        x: 520,
        y: 0,
        width: 520,
        height: 1040,
      },
    },
  ],
});
```

# 0.7.14 / 2018-11-07

### messaging-api-messenger

- [new] Add `skipAppSecretProof` option to `MessengerClient`:

```js
const client = MessengerClient.connect({
  accessToken: ACCESS_TOKEN,
  appSecret: APP_SECRET,
  skipAppSecretProof: true,
});
```

# 0.7.13 / 2018-10-30

### messaging-api-messenger

- [new] Add `MessengerClient.appSecret` getter:

```js
const client = MessengerClient.connect({
  appSecret: 'APP_SECRET',
});

client.appSecret; // 'APP_SECRET'
```

# 0.7.12 / 2018-10-23

### messaging-api-line

- [new] Add Line Pay APIs:

## Initialize

```js
const { LinePay } = require('messaging-api-line');

const linePay = LinePay.connect({
  channelId: CHANNEL_ID,
  channelSecret: CHANNEL_SECRET,
  sandbox: true, // default false
});
```

- `getPayments(options)`:

```js
linePay
  .getPayments({
    transactionId: '20140101123123123',
    orderId: '1002045572',
  })
  .then((result) => {
    console.log(result);
    // [
    //   {
    //     transactionId: 1020140728100001997,
    //     transactionDate: '2014-07-28T09:48:43Z',
    //     transactionType: 'PARTIAL_REFUND',
    //     amount: -5,
    //     productName: '',
    //     currency: 'USD',
    //     orderId: '20140101123123123',
    //     originalTransactionId: 1020140728100001999,
    //   },
    // ]
  });
```

- `getAuthorizations(options)`:

```js
linePay
  .getAuthorizations({
    transactionId: '20140101123123123',
    orderId: '1002045572',
  })
  .then((result) => {
    console.log(result);
    // [
    //   {
    //     transactionId: 201612312312333401,
    //     transactionDate: '2014-07-28T09:48:43Z',
    //     transactionType: 'PAYMENT',
    //     payInfo: [
    //       {
    //         method: 'BALANCE',
    //         amount: 10,
    //       },
    //       {
    //         method: 'DISCOUNT',
    //         amount: 10,
    //       },
    //     ],

    //     productName: 'tes production',
    //     currency: 'USD',
    //     orderId: '20140101123123123',
    //     payStatus: 'AUTHORIZATION',
    //     authorizationExpireDate: '2014-07-28T09:48:43Z',
    //   },
    // ]
  });
```

- `reserve(payment)`:

```js
linePay
  .reserve({
    productName: 'test product',
    amount: 10,
    currency: 'USD',
    orderId: '20140101123456789',
    confirmUrl:
      'naversearchapp://inappbrowser?url=http%3A%2F%2FtestMall.com%2FcheckResult.nhn%3ForderId%3D20140101123456789',
  })
  .then((result) => {
    console.log(result);
    // {
    //   transactionId: 123123123123,
    //   paymentUrl: {
    //     web: 'http://web-pay.line.me/web/wait?transactionReserveId=blahblah',
    //     app: 'line://pay/payment/blahblah',
    //   },
    //   paymentAccessToken: '187568751124',
    // }
  });
```

- `confirm(transactionId, payment)`:

```js
linePay
  .confirm(TRANSACTION_ID, {
    amount: 1000,
    currency: 'TWD',
  })
  .then((result) => {
    console.log(result);
    // {
    //   orderId: 'order_210124213',
    //   transactionId: 20140101123123123,
    //   payInfo: [
    //     {
    //       method: 'BALANCE',
    //       amount: 10,
    //     },
    //     {
    //       method: 'DISCOUNT',
    //       amount: 10,
    //     },
    //   ],
    // }
  });
```

- `capture(transactionId, payment)`:

```js
linePay
  .capture(TRANSACTION_ID, {
    amount: 1000,
    currency: 'TWD',
  })
  .then((result) => {
    console.log(result);
    // {
    //   transactionId: 20140101123123123,
    //   orderId: 'order_210124213',
    //   payInfo: [
    //     {
    //       method: 'BALANCE',
    //       amount: 10,
    //     },
    //     {
    //       method: 'DISCOUNT',
    //       amount: 10,
    //     },
    //   ],
    // }
  });
```

- `void(transactionId)`:

```js
linePay.void(TRANSACTION_ID);
```

- `refund(transactionId, options)`:

```js
linePay.refund(TRANSACTION_ID).then((result) => {
  console.log(result);
  // {
  //   refundTransactionId: 123123123123,
  //   refundTransactionDate: '2014-01-01T06:17:41Z',
  // }
});
```

# 0.7.11 / 2018-10-17

### messaging-api-line

- [fix] fix LINE buttonsTemplate defaultAction support

### axios-error

- [new] add `.status` property

# 0.7.10 / 2018-10-09

### messaging-api-messenger

- [new] Implement persona apis:

- `createPersona()`:

```js
createPersona({
  name: 'John Mathew',
  profile_picture_url: 'https://facebook.com/john_image.jpg',
}).then((persona) => {
  console.log(persona);
  // {
  //  "id": "<PERSONA_ID>"
  // }
});
```

- `getPersona(personaId)`:

```js
getPersona(personaId).then((persona) => {
  console.log(persona);
  // {
  //   "name": "John Mathew",
  //   "profile_picture_url": "https://facebook.com/john_image.jpg",
  //   "id": "<PERSONA_ID>"
  // }
});
```

- `getPersonas(cursor?: string)`:

```js
getPersonas(cursor).then((personas) => {
  console.log(personas);
  // {
  //   "data": [
  //     {
  //       "name": "John Mathew",
  //       "profile_picture_url": "https://facebook.com/john_image.jpg",
  //       "id": "<PERSONA_ID>"
  //     },
  //     {
  //       "name": "David Mark",
  //       "profile_picture_url": "https://facebook.com/david_image.jpg",
  //       "id": "<PERSONA_ID>"
  //     }
  //   ],
  //   "paging": {
  //     "cursors": {
  //       "before": "QVFIUlMtR2ZATQlRtVUZALUlloV1",
  //       "after": "QVFIUkpnMGx0aTNvUjJNVmJUT0Yw"
  //     }
  //   }
  // }
});
```

- `getAllPersonas()`:

```js
getAllPersonas().then((personas) => {
  console.log(personas);
  //   [
  //     {
  //       "name": "John Mathew",
  //       "profile_picture_url": "https://facebook.com/john_image.jpg",
  //       "id": "<PERSONA_ID>"
  //     },
  //     {
  //       "name": "David Mark",
  //       "profile_picture_url": "https://facebook.com/david_image.jpg",
  //       "id": "<PERSONA_ID>"
  //     }
  //   ]
});
```

- `deletePersona(personaId)`:

```js
deletePersona(personaId);
```

- [fix] `getAssociatedLabels`: get name field by default and add options for fields.

# 0.7.9 / 2018-09-30

### messaging-api-line

- [new] add apis for default rich menu:

- `getDefaultRichMenu()`:

```js
client.getDefaultRichMenu().then((richMenu) => {
  console.log(richMenu);
  // {
  //   "richMenuId": "{richMenuId}"
  // }
});
```

- `setDefaultRichMenu(richMenuId)`:

```js
client.setDefaultRichMenu('{richMenuId}');
```

- `deleteDefaultRichMenu()`:

```js
client.deleteDefaultRichMenu();
```

# 0.7.8 / 2018-09-19

- [new] add request deubg hook, so now we can use `DEBUG` env variable to enable request debugger:

```
DEBUG=messaging-api*
```

- [deps] upgrade all of dependencies and migrate to lerna v3

# 0.7.7 / 2018-09-16

### axios-error

- [new] use util.inspect.custom instead of Object.inspect

### messaging-api-messenger

- [fix] add custom token support to appsecret_proof [#392](https://github.com/Yoctol/messaging-apis/pull/392)

# 0.7.6 / 2018-08-23

### messaging-api-slack

- [new] add custom token support to all `SlackOAuthClient` methods

### axios-error

- [new] support creating AxiosError with Error instance only

# 0.7.5 / 2018-08-04

### messaging-api-line

- [new] add `quickReply` support:

```js
client.replyText(REPLY_TOKEN, 'Hello!', {
  quickReply: {
    items: [
      {
        type: 'action',
        action: {
          type: 'cameraRoll',
          label: 'Send photo',
        },
      },
      {
        type: 'action',
        action: {
          type: 'camera',
          label: 'Open camera',
        },
      },
    ],
  },
});
```

# 0.7.4 / 2018-07-12

### messaging-api-messenger

- [fix] set maxContentLength for Messenger uploadAttachment

# 0.7.3 / 2018-06-19

### messaging-api-messenger

- [new] export `Messenger`, `MessengerBatch`, `MessengerBroadcast` from browser entry

### messaging-api-line

- [new] support LINE Front-end Framework (LIFF):

* [`createLiffApp(view)`](https://github.com/Yoctol/messaging-apis/blob/master/packages/messaging-api-line/README.md#createliffappview)
* [`updateLiffApp(liffId, view)`](https://github.com/Yoctol/messaging-apis/blob/master/packages/messaging-api-line/README.md#updateliffappliffid-view)
* [`getLiffAppList()`](https://github.com/Yoctol/messaging-apis/blob/master/packages/messaging-api-line/README.md#getliffapplist)
* [`deleteLiffApp(liffId)`](https://github.com/Yoctol/messaging-apis/blob/master/packages/messaging-api-line/README.md#deleteliffappliffid)

- [new] support Flex message:

![](https://camo.githubusercontent.com/27e44e07770cb5de7a431dfb710cf99cf16c19d4/68747470733a2f2f646576656c6f706572732e6c696e652e6d652f6d656469612f6d6573736167696e672d6170692f7573696e672d666c65782d6d657373616765732f627562626c6553616d706c652d37376438323565362e706e67)

- [`client.replyFlex`](https://github.com/Yoctol/messaging-apis/blob/master/packages/messaging-api-line/README.md#replyflextoken-alttext-contents---official-docs)
- [`client.pushFlex`](https://github.com/Yoctol/messaging-apis/blob/master/packages/messaging-api-line/README.md#pushflexuserid-alttext-contents---official-docs)

* [new] export `Line` from browser entry, so it can be used in the browser with module bundler:

```js
const { Line } = require('messaging-api-line');

liff.sendMessages([
  Line.createText('hello~~~~~~'),
  Line.createText('world~~~~~~'),
]);
```

# 0.7.2 / 2018-06-08

### messaging-api-messenger

- [new] Verifying Graph API Calls with `appsecret_proof`

If `appSecret` is provided, `MessengerClient` will enable this feature automatically and include `appsecret_proof` in every Graph API requests.

```js
const client = MessengerClient.connect({
  accessToken,
  appSecret,
});
```

# 0.7.1 / 2018-05-16

### messaging-api-messenger

There are no any visible breaking changes between 2.11 and 3.0, so after this version it uses Graph API 3.0 (`https://graph.facebook.com/v3.0/`) as default [(#349)](https://github.com/Yoctol/messaging-apis/pull/349).

In this version, we bring some fetaures in Messenger Platform 2.4 into `messaging-api-messenger`.

- [new] Support scheduling broadcasts

To schedule a broadcast, specify the `schedule_time` property when you call the `sendBroadcastMessage` API request to send the message.

```js
client
  .sendBroadcastMessage(938461089, {
    schedule_time: '2018-04-05T20:39:13+00:00',
  })
  .then((result) => {
    console.log(result);
    // {
    //   broadcast_id: '115517705935329',
    // }
  });
```

To cancel a scheduled broadcast:

```js
client.cancelBroadcast('115517705935329');
```

To check on broadcast status.

```js
client.getBroadcast('115517705935329').then((broadcast) => {
  console.log(broadcast);
  // {
  //   scheduled_time: '2018-04-05T20:39:13+00:00',
  //   status: 'SCHEDULED',
  //   id: "115517705935329"
  // }
});
```

- [new] Support nested predicate in Broadcast API, so you can send broadcast messages with label predicates (and, or, not):

```js
import { MessengerBroadcast } from 'messaging-api-messenger';

const { add, or, not } = MessengerBroadcast;

client.sendBroadcastMessage(938461089, {
  targeting: {
    labels: and(
      '<CUSTOM_LABEL_ID_1>'
      or(
        '<UNDER_25_CUSTOMERS_LABEL_ID>',
        '<OVER_50_CUSTOMERS_LABEL_ID>'
      )
    ),
  },
});
```

- [new] Support getting the thread owner when using Handover Protocol:

```js
client.getThreadOwner().then((threadOwner) => {
  console.log(threadOwner);
  // {
  //   app_id: '12345678910'
  // }
});
```

- [new] Support new insights API `getTotalMessagingConnections()`:

```js
client.getTotalMessagingConnections().then((result) => {
  console.log(result);
  // {
  //   name: 'page_messages_total_messaging_connections',
  //   period: 'day',
  //   values: [
  //   values: [
  //     { value: 1000, end_time: '2018-03-12T07:00:00+0000' },
  //     { value: 1000, end_time: '2018-03-13T07:00:00+0000' },
  //   ],
  //   title: 'Messaging connections',
  //     'Daily: The number of people who have sent a message to your business, not including people who have blocked or reported your business on Messenger. (This number only includes connections made since October 2016.)',
  //   id:
  //     '1386473101668063/insights/page_messages_total_messaging_connections/day',
  // }
});
```

- [new] Support programmatically checking the feature submission status of Page-level Platform features using `getMessagingFeatureReview`:

```js
client.getMessagingFeatureReview().then((data) => {
  console.log(data);
  // [
  //   {
  //     "feature": "subscription_messaging",
  //     "status": "<pending|rejected|approved|limited>"
  //   }
  // ]
});
```

- [deprecated] `getOpenConversations()` is deprecated and replaced by new `getTotalMessagingConnections()`

See [messenger official blog post](https://blog.messengerdevelopers.com/announcing-messenger-platform-v2-4-8a8ecd5f0f04) for more Messenger Platform 2.4 details.

# 0.7.0 / 2018-04-27

- [changed] use class methods instead of class properties [#310](https://github.com/Yoctol/messaging-apis/pull/310)
- [fix] handle network error better by fallback to original message [#338](https://github.com/Yoctol/messaging-apis/pull/338)

### messaging-api-messenger

- [new] move message creation api into singleton: [#255](https://github.com/Yoctol/messaging-apis/pull/255)

```js
Messenger.createMessage;
Messenger.createText;
Messenger.createAttachment;
Messenger.createAudio;
Messenger.createImage;
Messenger.createVideo;
Messenger.createFile;
Messenger.createTemplate;
Messenger.createButtonTemplate;
Messenger.createGenericTemplate;
Messenger.createListTemplate;
Messenger.createOpenGraphTemplate;
Messenger.createMediaTemplate;
Messenger.createReceiptTemplate;
Messenger.createAirlineBoardingPassTemplate;
Messenger.createAirlineCheckinTemplate;
Messenger.createAirlineItineraryTemplate;
Messenger.createAirlineUpdateTemplate;
```

- [new] implement more batching api: [#317](https://github.com/Yoctol/messaging-apis/pull/317), [#324](https://github.com/Yoctol/messaging-apis/pull/324)

```js
MessengerBatch.sendRequest;
MessengerBatch.sendMessage;
MessengerBatch.sendText;
MessengerBatch.sendAttachment;
MessengerBatch.sendAudio;
MessengerBatch.sendImage;
MessengerBatch.sendVideo;
MessengerBatch.sendFile;
MessengerBatch.sendTemplate;
MessengerBatch.sendButtonTemplate;
MessengerBatch.sendGenericTemplate;
MessengerBatch.sendListTemplate;
MessengerBatch.sendOpenGraphTemplate;
MessengerBatch.sendReceiptTemplate;
MessengerBatch.sendMediaTemplate;
MessengerBatch.sendAirlineBoardingPassTemplate;
MessengerBatch.sendAirlineCheckinTemplate;
MessengerBatch.sendAirlineItineraryTemplate;
MessengerBatch.sendAirlineUpdateTemplate;

MessengerBatch.getUserProfile;

MessengerBatch.sendSenderAction;
MessengerBatch.typingOn;
MessengerBatch.typingOff;
MessengerBatch.markSeen;

MessengerBatch.passThreadControl;
MessengerBatch.passThreadControlToPageInbox;
MessengerBatch.takeThreadControl;
MessengerBatch.requestThreadControl;

MessengerBatch.associateLabel;
MessengerBatch.dissociateLabel;
MessengerBatch.getAssociatedLabels;
```

- [new] add 2 new metrix to messenger insights: [#304](https://github.com/Yoctol/messaging-apis/pull/304)

`getOpenConversations(options)`:

```js
client.getOpenConversations().then((result) => {
  console.log(result);
  // {
  //   name: 'page_messages_open_conversations_unique',
  //   period: 'day',
  //   values: [
  //     { end_time: '2018-03-12T07:00:00+0000' },
  //     { end_time: '2018-03-13T07:00:00+0000' },
  //   ],
  //   title: 'Daily unique open conversations count',
  //   description:
  //     'Daily: The total number of open conversations between your Page and people in Messenger. This metric excludes blocked conversations.',
  //   id:
  //     '1386473101668063/insights/page_messages_open_conversations_unique/day',
  // }
});
```

`getNewConversations(options)`:

```js
client.getNewConversations().then((result) => {
  console.log(result);
  // {
  //   name: 'page_messages_new_conversations_unique',
  //   period: 'day',
  //   values: [
  //     { value: 1, end_time: '2018-03-12T07:00:00+0000' },
  //     { value: 0, end_time: '2018-03-13T07:00:00+0000' },
  //   ],
  //   title: 'Daily unique new conversations count',
  //   description:
  //     'Daily: The number of messaging conversations on Facebook Messenger that began with people who had never messaged with your business before.',
  //   id:
  //     '1386473101668063/insights/page_messages_new_conversations_unique/day',
  // }
});
```

- [breaking] rename `Messenger` to `MessengerBatch`: [#255](https://github.com/Yoctol/messaging-apis/pull/255)
- [breaking] rename `getDailyUniqueActiveThreadCounts` to `getActiveThreads` [#307](https://github.com/Yoctol/messaging-apis/pull/307)
- [breaking] remove deprecated MessengerClient method - `sendQuickReplies`
- [breaking] Messenger Insights API: resolve `obj` instead of `[obj]`: [#302](https://github.com/Yoctol/messaging-apis/pull/302)

Affected APIs:

- getActiveThreads
- getBlockedConversations
- getReportedConversations
- getReportedConversationsByReportType

Before:

```js
client.getBlockedConversations().then((counts) => {
  console.log(counts);
  // [
  //   {
  //     "name": "page_messages_blocked_conversations_unique",
  //     "period": "day",
  //     "values": [
  //       {
  //         "value": "<VALUE>",
  //         "end_time": "<UTC_TIMESTAMP>"
  //       },
  //       {
  //         "value": "<VALUE>",
  //         "end_time": "<UTC_TIMESTAMP>"
  //       }
  //    ]
  //   }
  // ]
});
```

After:

```js
client.getBlockedConversations().then((counts) => {
  console.log(counts);
  //   {
  //     "name": "page_messages_blocked_conversations_unique",
  //     "period": "day",
  //     "values": [
  //       {
  //         "value": "<VALUE>",
  //         "end_time": "<UTC_TIMESTAMP>"
  //       },
  //       {
  //         "value": "<VALUE>",
  //         "end_time": "<UTC_TIMESTAMP>"
  //       }
  //    ]
  //   }
});
```

- [breaking] removed deprecated `getDailyUniqueConversationCounts` insights API [#304](https://github.com/Yoctol/messaging-apis/pull/304)
- [changed] rename `AirlineFlightUpdateTemplate` to `AirlineUpdateTemplate` to match typename [#329](https://github.com/Yoctol/messaging-apis/pull/329)

```
AirlineFlightUpdateTemplate -> AirlineUpdateTemplate
```

- [fix] fix sending attachment with buffer (allow filename) [#335](https://github.com/Yoctol/messaging-apis/pull/335)
- [fix] fix getReportedConversationsByReportType and improve docs [#297](https://github.com/Yoctol/messaging-apis/pull/297)
- [fix] avoid pass undefined value to messenger in batch api [#326](https://github.com/Yoctol/messaging-apis/pull/326)

### messaging-api-line

- [new] support LINE issue link token for account linking: [#332](https://github.com/Yoctol/messaging-apis/pull/332)

```js
client.issueLinkToken(USER_ID).then((result) => {
  console.log(result);
  // {
  //   linkToken: 'NMZTNuVrPTqlr2IF8Bnymkb7rXfYv5EY',
  // }
});
```

- [new] allow pass object as image, audio, video, sticker args: [#309](https://github.com/Yoctol/messaging-apis/pull/309)

```js
client.pushImage(RECIPIENT_ID, {
  originalContentUrl: 'https://example.com/original.jpg',
  previewImageUrl: 'https://example.com/preview.jpg',
});
client.pushVideo(RECIPIENT_ID, {
  originalContentUrl: 'https://example.com/original.mp4',
  previewImageUrl: 'https://example.com/preview.jpg',
});
client.pushAudio(RECIPIENT_ID, {
  originalContentUrl: 'https://example.com/original.m4a',
  duration: 240000,
});
client.pushSticker(RECIPIENT_ID, {
  packageId: '1',
  stickerId: '1',
});
```

- [new] support LINE ButtonsTemplate alias to match typename `buttons`:

  - client.sendButtonsTemplate == client.sendButtonTemplate
  - client.replyButtonsTemplate == client.replyButtonTemplate
  - client.pushButtonsTemplate == client.pushButtonTemplate
  - client.multicastButtonsTemplate == client.multicastButtonTemplate

- [breaking] remove deprecated method `isValidSignature` in `LineClient`

### messaging-api-telegram

- [breaking] Throw error when `ok` is `false` in Telegram: [#268](https://github.com/Yoctol/messaging-apis/pull/268)

```js
{
  ok: false,
  result: { /* ... */ }
}
```

Now throws `Telegram API` error.

- [breaking] telegram api return result instead of `{ ok: true, result }`: [#313](https://github.com/Yoctol/messaging-apis/pull/313)

Before:
