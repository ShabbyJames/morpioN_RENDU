# messaging-api-telegram

> Messaging API client for Telegram

<img src="https://telegram.org/img/t_logo.png" alt="Telegram" width="150" />

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Webhook API](#webhook-api)
  - [Send API](#send-api)
  - [Get API](#get-api)
  - [Updating API](#updating-api)
  - [Group API](#group-api)
  - [Payments API](#payments-api)
  - [Inline Mode API](#inline-mode-api)
  - [Game API](#game-api)
  - [Others](#others)
- [Debug Tips](#debug-tips)
- [Testing](#testing)

## Installation

```sh
npm i --save messaging-api-telegram
```

or

```sh
yarn add messaging-api-telegram
```

<br />

## Usage

### Initialize

```js
const { TelegramClient } = require('messaging-api-telegram');

// get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
const client = new TelegramClient({
  accessToken: '12345678:AaBbCcDdwhatever',
});
```

### Error Handling

`messaging-api-telegram` uses [axios](https://github.com/axios/axios) as HTTP client. We use [axios-error](https://github.com/bottenderjs/messaging-apis/tree/master/packages/axios-error) package to wrap API error instances for better formatting error messages. Directly calling `console.log` with the error instance will return formatted message. If you'd like to get the axios `request`, `response`, or `config`, you can still get them via those keys on the error instance.

```js
client.getWebhookInfo().catch((error) => {
  console.log(error); // formatted error message
  console.log(error.stack); // error stack trace
  console.log(error.config); // axios request config
  console.log(error.request); // HTTP request
  console.log(error.response); // HTTP response
});
```

<br />

## API Reference

All methods return a Promise.

<br />

### Webhook API

- [getWebhookInfo](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getwebhookinfo)
- [getUpdates](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getupdates)
- [setWebhook](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#setwebhook)
- [deleteWebhook](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#deletewebhook)

<br />

<a id="send-api" />

### Send API - [Official Docs](https://core.telegram.org/bots/api#available-methods)

- [sendMessage](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendmessage)
- [sendPhoto](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendphoto)
- [sendAudio](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendaudio)
- [sendDocument](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#senddocument)
- [sendSticker](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendsticker)
- [sendVideo](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendvideo)
- [sendVoice](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendvoice)
- [sendVideoNote](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendvideonote)
- [sendMediaGroup](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendmediagroup)
- [sendLocation](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendlocation)
- [sendVenue](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendvenue)
- [sendContact](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendcontact)
- [sendChatAction](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendchataction)

<br />

### Get API

- [getMe](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getme)
- [getUserProfilePhotos](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getuserprofilephotos)
- [getFile](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getfile)
- [getFileLink](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getfilelink)
- [getChat](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getchat)
- [getChatAdministrators](htt