# messaging-api-viber

> Messaging API client for Viber

<img src="https://user-images.githubusercontent.com/3382565/31753411-0be75dfc-b456-11e7-9eea-b976d21fcc53.png" alt="Viber" width="150" />

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Webhook API](#webhook-api)
  - [Send API](#send-api)
  - [Keyboards](#keyboards)
  - [Broadcast API](#broadcast-api)
  - [Get Account Info](#get-account-info)
  - [Get User Details](#get-user-details)
  - [Get Online](#get-online)
- [Debug Tips](#debug-tips)
- [Testing](#testing)

## Installation

```sh
npm i --save messaging-api-viber
```

or

```sh
yarn add messaging-api-viber
```

<br />

## Usage

### Initialize

```js
const { ViberClient } = require('messaging-api-viber');

// get authToken from the "edit info" screen of your Public Account.
const client = new ViberClient({
  accessToken: authToken,
  sender: {
    name: 'Sender',
  },
});
```

### Error Handling

`messaging-api-viber` uses [axios](https://github.com/axios/axios) as HTTP client. We use [axios-error](https://github.com/Yoctol/messaging-apis/tree/master/packages/axios-error) package to wrap API error instances for better formatting error messages. Directly calling `console.log` with the error instance will return formatted message. If you'd like to get the axios `request`, `response`, or `config`, you can still get them via those keys on the error instance.

```js
client.setWebhook(url).catch((error) => {
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

- [setWebhook](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#setwebhook)
- [removeWebhook](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#removewebhook)

<br />

### Send API

- [sendMessage](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendmessage)
- [sendText](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendtext)
- [sendPicture](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendpicture)
- [sendVideo](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendvideo)
- [sendFile](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendfile)
- [sendContact](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendcontact)
- [sendLocation](https://bottenderjs.github.io/messaging-apis/latest/clas