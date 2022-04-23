import fs from 'fs';

import AxiosError from 'axios-error';
import FormData from 'form-data';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import invariant from 'ts-invariant';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeys,
  createRequestInterceptor,
  onRequest,
  snakecaseKeys,
} from 'messaging-api-common';

import * as WechatTypes from './WechatTypes';

function throwErrorIfAny(response: AxiosResponse): AxiosResponse {
  const { errcode, errmsg } = response.data;
  if (!errcode || errcode === 0) return response;
  const msg = `WeChat API - ${errcode} ${errmsg}`;
  throw new AxiosError(msg, {
    response,
    config: response.config,
