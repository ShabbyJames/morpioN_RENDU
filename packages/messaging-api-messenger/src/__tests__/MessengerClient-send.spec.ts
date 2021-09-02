import fs from 'fs';

import FormData from 'form-data';
import MockAdapter from 'axios-mock-adapter';

import { MessengerBatch, MessengerClient } from '..';

const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '123