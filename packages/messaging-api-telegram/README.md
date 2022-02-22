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

`messaging-api-telegram` uses [axios](https://github.com/axios/axios