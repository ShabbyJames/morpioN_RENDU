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
  type: 'multi_static_select';
  placeholder: PlainTextObject;
  actionId: string;
  options: OptionObject[]; // TODO: If option_groups is specified, this field should not be.
  optionGroups?: OptionGroupObject[]; // TODO: If options is specified, this field should not be.
  initialOptions?: OptionObject[];
  confirm?: ConfirmObject;
};

export type MultiExternalSelectElement = {
  type: 'multi_external_select';
  placeholder: PlainTextObject;
  actionId: string;
  minQueryLength?: number;
  initialOptions?: OptionObject[];
  confirm?: ConfirmObject;
};

export type MultiUsersSelectElement = {
  type: 'multi_users_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialUsers?: string[];
  confirm?: ConfirmObject;
};

export type MultiConversationsSelectElement = {
  type: 'multi_conversations_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialConversations?: string[];
  confirm?: ConfirmObject;
};

export type MultiChannelsSelectElement = {
  type: 'multi_channels_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialChannels?: string[];
  confirm?: ConfirmObject;
};

export type OverflowElement = {
  type: 'overflow';
  actionId: string;
  options: OptionObject[];
  confirm?: ConfirmObject;
};

export type PlainTextInputElement = {
  type: 'plain_text_input';
  actionId: string;
  placeholder?: PlainTextObject;
  initialValue: string;
  multiline?: boolean;
  minLength?: number;
  maxLength?: number;
};

export type RadioButtonsElement = {
  type: 'radio_buttons';
  actionId: string;
  options: OptionObject[];
  initialOption?: OptionObject;
  confirm?: ConfirmObject;
};

export type SelectElement =
  | StaticSelectElement
  | ExternalSelectElement
  | UsersSelectElement
  | ConversationsSelectElement
  | ChannelsSelectElement;

export type StaticSelectElement = {
  type: 'static_select';
  placeholder: PlainTextObject;
  actionId: string;
  options: OptionObject[]; // TODO: If option_groups is specified, this field should not be.
  optionGroups?: OptionGroupObject[]; // TODO: If options is specified, this field should not be.
  initialOption?: OptionObject;
  confirm?: ConfirmObject;
};

export type ExternalSelectElement = {
  type: 'external_select';
  placeholder: PlainTextObject;
  actionId: string;
  minQueryLength?: number;
  initialOption?: OptionObject;
  confirm?: ConfirmObject;
};

export type UsersSelectElement = {
  type: 'users_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialUser?: string;
  confirm?: ConfirmObject;
};

export type ConversationsSelectElement = {
  type: 'conversations_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialConversation?: string;
  confirm?: ConfirmObject;
};

export type ChannelsSelectElement = {
  type: 'channels_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialChannel?: string;
  confirm?: ConfirmObject;
};

// Layout Blocks
// https://api.slack.com/reference/block-kit/blocks

export type MessageBlock =
  | ActionsBlock
  | ContextBlock
  | DividerBlock
  | FileBlock
  | ImageBlock
  | SectionBlock;

export type ModalBlock =
  | ActionsBlock
  | ContextBlock
  | DividerBlock
  | ImageBlock
  | InputBlock
  | SectionBlock;

export type HomeBlock =
  | ActionsBlock
  | ContextBlock
  | DividerBlock
  | ImageBlock
  | SectionBlock;

export type ActionsBlockElement =
  | ButtonElement
  | SelectElement
  | OverflowElement
  | DatepickerElement;

export type ActionsBlock = {
  type: 'actions';
  elements: ActionsBlockElement[];
  blockId?: string;
};

export type ContextBlockElement = TextObject | ImageElement;

export type ContextBlock = {
  type: 'context';
  elements: ContextBlockElement[];
  blockId?: string;
};

export type DividerBlock = {
  type: 'divider';
  blockId?: string;
};

export type FileBlock = {
  type: 'file';
  externalId: string;
  source: string;
  blockId?: string;
};

export type ImageBlock = {