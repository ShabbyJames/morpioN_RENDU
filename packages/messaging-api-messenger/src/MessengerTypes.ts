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
  isReusable?: boolean;
};

export type FileDataMediaAttachment = {
  type: MediaAttachmentType;
  payload: FileDataAttachmentPayload;
};

export type FileDataMediaAttachmentMessage = {
  attachment: FileDataMediaAttachment;
  quickReplies?: QuickReply[];
};

export type MediaAttachment = {
  type: MediaAttachmentType;
  payload: MediaAttachmentPayload;
};

export type TemplateAttachmentPayload = {
  templateType:
    | 'button'
    | 'generic'
    | 'media'
    | 'receipt'
    | 'airline_boardingpass'
    | 'airline_checkin'
    | 'airline_itinerary'
    | 'airline_update'
    | 'one_time_notif_req';
  [key: string]: any; // FIXME: list all of templates
};

export type TemplateAttachment = {
  type: 'template';
  payload: TemplateAttachmentPayload;
};

export type Attachment = MediaAttachment | TemplateAttachment;

export type TextQuickReply = {
  contentType: 'text';
  title: string;
  payload: string;
  imageUrl?: string;
};

export type UserPhoneNumberQuickReply = {
  contentType: 'user_phone_number';
};

export type UserEmailQuickReply = {
  contentType: 'user_email';
};

export type QuickReply =
  | TextQuickReply
  | UserPhoneNumberQuickReply
  | UserEmailQuickReply;

export type TextMessage = {
  text?: string;
  quickReplies?: QuickRepl