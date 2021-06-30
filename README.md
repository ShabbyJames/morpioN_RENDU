# Messaging APIs

[![Build Status](https://github.com/Yoctol/messaging-apis/workflows/Node.js%20CI/badge.svg)](https://github.com/Yoctol/messaging-apis/actions?query=workflow%3ANode.js%20CI+branch%3Amaster)
[![coverage](https://codecov.io/gh/Yoctol/messaging-apis/branch/master/graph/badge.svg)](https://codecov.io/gh/Yoctol/messaging-apis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Messaging APIs is a [mono repo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) which collects APIs needed for bot development.

It helps you build your bots using similar API for multiple platforms, e.g. Messenger, LINE. Learn once and make writing cross-platform bots easier.

If you are looking for a framework to build your bots, [Bottender](https://github.com/Yoctol/bottender) may suit for your needs. It is built on top of [Messaging APIs](https://github.com/Yoctol/messaging-apis) and provides some powerful features for bot building.

![](https://user-images.githubusercontent.com/3382565/33652388-3644799e-daa4-11e7-97f1-e9af5788ff6e.png)

## Packages

| Package                                                        | Version                                                                                                                                     | Platform                                |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`messaging-api-messenger`](/packages/messaging-api-messenger) | [![npm](https://img.shields.io/npm/v/messaging-api-messenger.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-messenger) | [Messenger](https://www.messenger.com/) |
| [`messaging-api-line`](/packages/messaging-api-line)           | [![npm](https://img.shields.io/npm/v/messaging-api-line.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-line)           | [LINE](https://line.me/)                |
| [`messaging-api-slack`](/packages/messaging-api-slack)         | [![npm](https://img.shields.io/npm/v/messaging-api-slack.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-slack)         | [Slack](https://slack.com/)             |
| [`messaging-api-telegram`](/packages/messaging-api-telegram)   | [![npm](https://img.shields.io/npm/v/messaging-api-telegram.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-telegram)   | [Telegram](https://telegram.org/)       |
| [`messaging-api-viber`](/packages/messaging-api-viber)         | [![npm](https://img.shields.io/npm/v/messaging-api-viber.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-viber)         | [Viber](https://www.viber.com/)         |
| [`messaging-api-wechat`](/packages/messaging-api-wechat)       | [![npm](https://img.shields.io/npm/v/messaging-api-wechat.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-wechat)       | [WeChat](https://weixin.qq.com/)        |

## Usage

## Messenger

<img src="https://static.xx.fbcdn.net/rsrc.php/yg/r/4_vfHVmZ5XD.ico" alt="Messenger" width="100" />

Install `messaging-api-messenger` package from the registry:

```sh
npm i --save messaging-api-messenger
```

or

```sh
yarn add messaging-api-messenger
```

Then, create a `MessengerClient` to call Messenger APIs:

```js
const { MessengerClient } = require('messaging-api-messenger');

// get accessToken from facebook developers website
const client = new MessengerClient({
  accessToken: 'ACCESS_TOKEN',
});

client.sendText(userId, 'Hello World').then(() => {
  console.log('sent');
});
```

Check out [full API documentation](./packages/messaging-api-messenger/README.md) for more detail information.

## LINE

<img src="http://is5.mzstatic.com/image/thumb/Purple117/v4/01/c2/4d/01c24d99-4aae-71ea-24e2-d0b68f8c53d2/source/1200x630bb.jpg" alt="LINE" width="100" />

Install `messaging-api-line` package from the registry:

```sh
npm i --save messaging-api-line
```

or

```sh
yarn add messaging-api-line
```

Then, create a `LineClient` to call LINE APIs:

```js
const { LineClient } = require('messaging-api-line');

// get accessToken and channelSecret from LINE developers website
const client = new LineClient({
  accessToken: 'ACCESS_TOKEN',
  channelSecret: 'CHANNEL_SECRET',
});

client.pushText(userId, 'Hello World').then(() => {
  console.log('pushed');
});
```

Check out [full API documentation](./packages/messaging-api-line/README.md) for more detail information.

## Slack

<img src="https://cdn-imag