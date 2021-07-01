# axios-error

> Axios error wrapper that aim to provide clear error message to developers

## Installation

```sh
npm i --save axios-error
```

or

```sh
yarn add axios-error
```

<br />

## Usage

```js
const AxiosError = require('axios-error');

// You can construct it from the error thrown by axios
const error = new AxiosError(errorThrownByAxios);

// Or with an custom error message
const error = new AxiosError(message, errorThrownByAxios);

// Or construct it from axios config, axios request and axios response
const error = new AxiosError(message, { config, request, response });
```

Calling `console.log` on th