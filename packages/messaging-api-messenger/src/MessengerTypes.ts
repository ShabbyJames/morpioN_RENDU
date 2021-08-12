import fs from 'fs';

import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accessToken: string;
  appId?: string;
  appSecret?: string;
  version?: string;
  origin?: string;
  onRequest?: OnRequestFunction;
  skipAppSecretProof?: boolean;
};

/**
 * Page Scoped User ID (PSID) of the message recipient.
 */
export type RecipientWithID = {
  id: string;
};

/**
 * Used for Customer Matching. (Closed Beta)
 */
export type RecipientWithPhoneNumber = {
  phoneNumber: string;
  name?: Record<string, any>;
};

/**
 * Used for the checkbox plugin.
 */
export type RecipientWithUserRef = {
  userRef: string;
};

/**
 * Used for Private Replies to reference the 