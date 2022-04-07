
import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accessToken: string;
  sender: Sender;
  origin?: string;
  onRequest?: OnRequestFunction;
};

export type SucceededResponseData<T extends object> = {
  status: 0;
  statusMessage: 'ok';
} & T;

export type FailedResponseData<T extends object> = (
  | {
      status: 1;
      statusMessage: 'invalidUrl';
    }
  | {
      status: 2;
      statusMessage: 'invalidAuthToken';
    }
  | {
      status: 3;
      statusMessage: 'badData';
    }
  | {
      status: 4;
      statusMessage: 'missingData';
    }
  | {
      status: 5;
      statusMessage: 'receiverNotRegistered';
    }
  | {
      status: 6;
      statusMessage: 'receiverNotSubscribed';
    }
  | {
      status: 7;
      statusMessage: 'publicAccountBlocked';
    }
  | {
      status: 8;
      statusMessage: 'publicAccountNotFound';
    }
  | {
      status: 9;
      statusMessage: 'publicAccountSuspended';
    }
  | {
      status: 10;
      statusMessage: 'webhookNotSet';
    }
  | {
      status: 11;
      statusMessage: 'receiverNoSuitableDevice';
    }
  | {
      status: 12;
      statusMessage: 'tooManyRequests';
    }
  | {
      status: 13;
      statusMessage: 'apiVersionNotSupported';
    }
  | {
      status: 14;
      statusMessage: 'incompatibleWithVersion';
    }
  | {
      status: 15;
      statusMessage: 'publicAccountNotAuthorized';
    }
  | {
      status: 16;
      statusMessage: 'inchatReplyMessageNotAllowed';
    }
  | {
      status: 17;
      statusMessage: 'publicAccountIsNotInline';
    }
  | {
      status: 18;
      statusMessage: 'noPublicChat';
    }
  | {
      status: 19;
      statusMessage: 'cannotSendBroadcast';
    }
  | {
      status: 20;
      statusMessage: 'broadcastNotAllowed';
    }
) &
  T;

export type SucceededBroadcastResponseData = SucceededResponseData<{
  messageToken: string;
  failedList: Failed[];
}>;

export type Failed = FailedResponseData<{ receiver: string }>;

export type ResponseData<T extends object> =
  | SucceededResponseData<T>
  | FailedResponseData<{}>;

export type BroadcastResponseData =
  | SucceededBroadcastResponseData
  | FailedResponseData<{}>;

export enum EventType {
  Delivered = 'delivered',
  Seen = 'seen',
  Failed = 'failed',
  Subscribed = 'subscribed',
  Unsubscribed = 'unsubscribed',
  ConversationStarted = 'conversation_started',
}

export type Sender = {
  name: string;
  avatar?: string;
};

export type Message =
  | TextMessage
  | PictureMessage
  | VideoMessage
  | FileMessage
  | ContactMessage
  | LocationMessage
  | UrlMessage
  | StickerMessage
  | RichMediaMessage;

export type MessageOptions = {
  minApiVersion?: number;
  sender?: Sender;
  trackingData?: string;
  keyboard?: Keyboard;
};

export type TextMessage = {
  type: 'text';
  text: string;
} & MessageOptions;

export type Picture = {
  text: string;
  media: string;
  thumbnail?: string;
};

export type PictureMessage = {
  type: 'picture';
} & Picture &
  MessageOptions;

export type Video = {
  media: string;
  size: number;
  duration?: number;
  thumbnail?: string;
};

export type VideoMessage = {
  type: 'video';
} & Video &
  MessageOptions;

export type File = {
  media: string;
  size: number;
  fileName: string;
};

export type FileMessage = {
  type: 'file';
} & File &
  MessageOptions;

export type Contact = {
  name: string;
  phoneNumber: string;
};

export type ContactMessage = {
  type: 'contact';
  contact: Contact;
} & MessageOptions;

export type Location = {
  lat: string;
  lon: string;
};

export type LocationMessage = {
  type: 'location';
  location: Location;
} & MessageOptions;

export type UrlMessage = {
  type: 'url';
  media: string;
} & MessageOptions;

export type StickerMessage = {
  type: 'sticker';
  stickerId: number;
} & MessageOptions;

export type RichMedia = {
  type: 'rich_media';
  buttonsGroupColumns: number;
  buttonsGroupRows: number;
  bgColor: string;
  buttons: RichMediaButton[];
};

export type RichMediaButton = {
  columns: number;
  rows: number;
  text?: string;
  actionType: 'open-url' | 'reply';
  actionBody: string;
  textSize?: 'small' | 'medium' | 'large';
  textVAlign?: 'middle';