# messaging-api-common

> Helpers for common usages in Messaging API clients

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

```sh
npm i --save messaging-api-common
```

or

```sh
yarn add messaging-api-common
```

<br />

## Usage

Case Convertors:

```js
const {
  snakecase,
  snakecaseKeys,
  snakecaseKeysDeep,
  camelcase,
  camelcaseKeys,
  camelcaseKeysDeep,
  pascalcase,
  pascalcaseKeys,
  pascalcaseKeysDeep,
} = require('messaging-api-common');

snakecase('fooBar');
//=> 'foo_bar'
snakecaseKeys({ fooBar: true });
//=> { 'foo_bar': true }
sn