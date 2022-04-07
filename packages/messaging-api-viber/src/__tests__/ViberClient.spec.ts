import MockAdapter from 'axios-mock-adapter';

import ViberClient from '../ViberClient';
import * as ViberTypes from '../ViberTypes';

const { EventType } = ViberTypes;

const AUTH_TOKEN = '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9';

const RECEIVER = '1234567890';

const SENDER = {
  name: 'John McClane',
