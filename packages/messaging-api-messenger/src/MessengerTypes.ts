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
 * Used for Private Replies to reference the visitor post to reply to.
 */
export type RecipientWithPostId = {
  postId: string;
};

/**
 * Used for Private Replies to reference the post comment to reply to.
 */
export type RecipientWithCommentId = {
  commentId: string;
};

/**
 * Used for the Messenger Platform's One-Time Notification API.
 */
export type RecipientWithOneTimeNotifToken = {
  oneTimeNotifToken: string;
};

/**
 * Description of the message recipient. All requests must include one to identify the recipient.
 */
export type Recipient =
  | RecipientWithID
  | RecipientWithPhoneNumber
  | RecipientWithUserRef
  | RecipientWithPostId
  | RecipientWithCommentId
  | RecipientWithOneTimeNotifToken;

/**
 * Description of the message recipient. If a string is provided, it will be recognized as a psid.
 */
export type PsidOrRecipient = string | Recipient;

export type UrlMediaAttachmentPayload = {
  url: string;
  isReusable?: boolean;
};

export type AttachmentIdAttachmentPayload = {
  attachmentId: string;
};

export type MediaAttachmentPayload =
  | UrlMediaAttachmentPayload
  | AttachmentIdAttachmentPayload;

export type MediaAttachmentType = 'audio' | 'video' | 'image' | 'file';

export type FileDataAttachmentPayload = {
  isReusable