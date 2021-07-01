/*
 * ref: https://github.com/line/line-bot-sdk-nodejs/blob/master/lib/validate-signature.ts
 */

const { createHmac, timingSafeEqual } = require('crypto');

function s2b(str, encoding) {
  if (Buffer.from) {
    try {