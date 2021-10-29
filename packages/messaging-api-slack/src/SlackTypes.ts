import { OnRequestFunction } from 'messaging-api-common';

export type Attachment = {
  fallback: string;
  pretext?: string;
  color?: string;
  authorName?: string;
  authorLink?: string;
  authorIcon?: string;
  title?: string;
  titleLink?: string;
  text?: string;
  fields?: {
    title: string;
    value: string;
    short: boolean;
  }[];
  imageUrl?: string;
  thumbUrl?: string;
  footer?: string;
  footerIcon?: string;
  callbackId?: string;
  attachmentType?: string;
  actions: {
    name?: string;
    text?: string;
    type?: string;
    value?: string;
    style?: string;
    options?: { text: string; value: string }[];
    confirm?: {
      title?: string;
      text?: string;
      okText?: string;
      dismissText?: string;
    };
  }[];
  ts?: number;
};

export type Message = {
  text?: string;
  attachments?: Attachment[] | string;
  blocks?: MessageBlock[] | string;
};

// Block Kit

// Composition Objects
// https://api.slack.com/reference/block-kit/composition-objects

export type CompositionObject = TextObject | ConfirmObject | OptionObject;

export type TextObject = PlainTextObject | MrkdwnObject;

export type PlainTextObject = {
  type: 'plain_text';
  text: string;
  emoji?: boolean;
};

export type MrkdwnObject = {
  type: 'mrkdwn';
  text: string;
  verbatim?: boolean;
};

// https://api.slack.com/reference/block-kit/composition-objects#confirm
export type ConfirmObject = {
  title: PlainTextObject;
  text: TextObject;
  confirm: PlainTextObject;
  deny: PlainTextObject;
};

// https://api.slack.com/reference/block-kit/composition-objects#option
export type OptionObject = {
  text: PlainTextObject;
  value: string;
  url?: string; // TODO: The url attribute is only available in overflow menus
};

// https://api.slack.com/reference/block-kit/composition-objects#option_group
export type OptionGroupObject = {
  label: PlainTextObject;
  options: OptionObject[];
};

// Block Elements
// https://api.slack.com/reference/block-kit/block-elements

export type BlockElement =
  | ButtonElement
  | DatepickerElement
  | ImageElement
  | MultiSelectElement
  | OverflowElement
  | PlainTextInputElement
  | RadioButtonsElement
  | SelectElement;

export type ButtonElement = {
  type: 'button';
  text: PlainTextObject;
  actionId: string;
  url?: string;
  value?: string;
  style?: 'primary' | 'danger';
  confirm?: ConfirmObject;
};

export type DatepickerElement = {
  type: 'datepicker';
  actionId: string;
  placeholder?: PlainTextObject;
  initialDate?: string;
  confirm?: ConfirmObject;
};

export type ImageElement = {
  type: 'image';
  imageUrl: string;
  altText: string;
};

export type MultiSelectElement =
  | MultiStaticSelectElement
  | MultiExternalSelectElement
  | MultiUsersSelectElement
  | MultiConversationsSelectElement
  | MultiChannelsSelectElement;

export type MultiStaticSelectElement = {
  type: 'multi_static