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
  quickReplies?: QuickReply[];
};

export type AttachmentMessage = {
  attachment?: Attachment;
  quickReplies?: QuickReply[];
};

export type Message = TextMessage | AttachmentMessage;

export type MessagingType =
  | 'RESPONSE'
  | 'UPDATE'
  | 'MESSAGE_TAG'
  | 'NON_PROMOTIONAL_SUBSCRIPTION';

export type MessageTag =
  | 'CONFIRMED_EVENT_UPDATE'
  | 'POST_PURCHASE_UPDATE'
  | 'ACCOUNT_UPDATE'
  | 'HUMAN_AGENT';

export type InsightMetric =
  | 'page_messages_blocked_conversations_unique'
  | 'page_messages_reported_conversations_unique'
  | 'page_messages_total_messaging_connections'
  | 'page_messages_new_conversations_unique';

export type InsightOptions = {
  since?: number;
  until?: number;
};

export type SendOption = {
  messagingType?: MessagingType;
  tag?: MessageTag;
  quickReplies?: QuickReply[];
  personaId?: string;
};

export type SenderActionOption = {
  personaId?: string;
};

export type UploadOption = {
  filename?: string;
  isReusable?: boolean;
};

export type TemplateButton = {
  type: string;
  title: string;
  url?: string;
  payload?: string;
  webviewHeightRatio?: 'compact' | 'tall' | 'full';
};

export type MenuItem = TemplateButton;

export type TemplateElement = {
  title: string;
  imageUrl?: string;
  subtitle?: string;
  defaultAction?: {
    type: string;
    url: string;
    messengerExtensions?: boolean;
    webviewHeightRatio?: string;
    fallbackUrl?: string;
  };
  buttons?: TemplateButton[];
};

export type MediaElement = {
  mediaType: 'image' | 'video';
  attachmentId?: string;
  url?: string;
  buttons?: TemplateButton[];
};

export type Address = {
  street1: string;
  street2?: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
};

export type Summary = {
  subtotal?: number;
  shippingCost?: number;
  totalTax?: number;
  totalCost: number;
};

export type Adjustment = {
  name?: string;
  amount?: number;
};

export type ReceiptElement = {
  title: string;
  subtitle?: string;
  quantity?: number;
  price: number;
  currency?: string;
  imageUrl: string;
};

export type ReceiptAttributes = {
  recipientName: string;
  merchantName?: string;
  orderNumber: string; // must be unique
  currency: string;
  paymentMethod: string;
  timestamp?: string;
  orderUrl?: string;
  elements?: ReceiptElement[];
  address?: Address;
  summary: Summary;
  adjustments?: Adjustment[];
};

export type Airport = {
  airportCode: string;
  city: string;
  terminal?: string;
  gate?: string;
};

export type FlightSchedule = {
  boardingTime?: string;
  departureTime: strin