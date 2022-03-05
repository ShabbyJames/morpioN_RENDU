
import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accessToken: string;
  origin?: string;
  onRequest?: OnRequestFunction;
};

export type Update = {
  updateId: number;
  message?: Message;
  editedMessage?: Message;
  channelPost?: Message;
  editedChannelPost?: Message;
  inlineQuery?: InlineQuery;
  chosenInlineResult?: ChosenInlineResult;
  callbackQuery?: CallbackQuery;
  shippingQuery?: ShippingQuery;
  preCheckoutQuery?: PreCheckoutQuery;
  poll?: Poll;
  pollAnswer?: PollAnswer;
};

/**
 * Contains information about the current status of a webhook.
 */
export type WebhookInfo = {
  /**
   * Webhook URL, may be empty if webhook is not set up
   */
  url: string;

  /**
   * True, if a custom certificate was provided for webhook certificate checks
   */
  hasCustomCertificate: boolean;

  /**
   * Number of updates awaiting delivery
   */
  pendingUpdateCount: number;

  /**
   * Optional. Unix time for the most recent error that happened when trying to deliver an update via webhook
   */
  lastErrorDate?: number;

  /**
   * Optional. Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook
   */
  lastErrorMessage?: string;

  /**
   * Optional. Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
   */
  maxConnections?: number;

  /**
   * Optional. A list of update types the bot is subscribed to. Defaults to all update types
   */
  allowedUpdates?: string[];
};

/**
 * This object represents a Telegram user or bot.
 */
export type User = {
  /**
   * Unique identifier for this user or bot
   */
  id: number;

  /**
   * True, if this user is a bot
   */
  isBot: boolean;

  /**
   * User‘s or bot’s first name
   */
  firstName: string;

  /**
   * Optional. User‘s or bot’s last name
   */
  lastName?: string;

  /**
   * Optional. User‘s or bot’s username
   */
  username?: string;

  /**
   * Optional. (IETF language tag)[https://en.wikipedia.org/wiki/IETF_language_tag] of the user's language
   */
  languageCode?: string;

  /**
   * Optional. True, if the bot can be invited to groups. Returned only in getMe.
   */
  canJoinGroups?: boolean;

  /**
   * Optional. True, if privacy mode is disabled for the bot. Returned only in getMe.
   */
  canReadAllGroupMessages?: boolean;

  /**
   * Optional. True, if the bot supports inline queries. Returned only in getMe.
   */
  supportsInlineQueries?: boolean;
};

// TODO: separate different type because some fields returned only in getChat.
export type Chat = {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photo?: ChatPhoto;
  description?: string;
  inviteLink?: string;
  pinnedMessage?: Message;
  permissions?: ChatPermissions;
  stickerSetName?: string;
  canSetStickerSet?: boolean;
};

export type Message = {
  messageId: number;
  from?: User; // TODO: empty for messages sent to channels
  date: number;
  chat: Chat;
  forwardFrom?: User;
  forwardFromChat?: Chat;
  forwardFromMessageId?: number;
  forwardSignature?: string;
  forwardSenderName?: string;
  forwardDate?: number;
  replyToMessage?: Message;
  editDate?: number;
  mediaGroupId?: string;
  authorSignature?: string;
  text?: string;
  entities?: MessageEntity[];
  captionEntities?: MessageEntity[];
  audio?: Audio;
  document?: Document;
  animation?: Animation;
  game?: Game;
  photo?: PhotoSize[];
  sticker?: Sticker;
  video?: Video;
  voice?: Voice;
  videoNote?: VideoNote;
  caption?: string;
  contact?: Contact;
  location?: Location;
  venue?: Venue;
  poll?: Poll;
  newChatMembers?: User[];
  leftChatMember?: User;
  newChatTitle?: string;
  newChatPhoto?: PhotoSize[];
  deleteChatPhoto?: boolean;
  groupChatCreated?: boolean;
  supergroupChatCreated?: boolean;
  channelChatCreated?: boolean;
  migrateToChatId?: number;
  migrateFromChatId?: number;
  pinnedMessage?: Message;
  invoice?: Invoice;
  successfulPayment?: SuccessfulPayment;
  connectedWebsite?: string;
  passportData?: PassportData;
  replyMarkup?: InlineKeyboardMarkup;
};

export type MessageEntity = {
  type:
    | 'mention'
    | 'hashtag'
    | 'cashtag'
    | 'bot_command'
    | 'url'
    | 'email'
    | 'phone_number'
    | 'bold'
    | 'italic'
    | 'code'
    | 'pre'
    | 'text_link'
    | 'text_mention';
  offset: number;
  length: number;
  url?: string;
  user?: User;
};

export type PhotoSize = {
  fileId: string;
  width: number;
  height: number;
  fileSize?: number;
};

export type Audio = {
  fileId: string;
  duration: number;
  performer?: string;
  title?: string;
  mimeType?: string;
  fileSize?: number;
  thumb?: PhotoSize;
};

export type Document = {
  fileId: string;
  thumb?: PhotoSize;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

export type Video = {
  fileId: string;
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize;
  mimeType?: string;
  fileSize?: number;
};

export type Animation = {
  fileId: string;
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

export type Voice = {
  fileId: string;
  duration: number;
  mimeType?: string;
  fileSize?: number;
};

export type VideoNote = {
  fileId: string;
  length: number;
  duration: number;
  thumb?: PhotoSize;
  fileSize?: number;
};

export type Contact = {
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  userId?: number;
  vcard?: string;
};

/**
 * This object represents a point on the map.
 */
export type Location = {
  /**
   * Longitude as defined by sender
   */
  longitude: number;
  /**
   * Latitude as defined by sender
   */
  latitude: number;
};

/**
 * This object represents a venue.
 */
export type Venue = {
  /**
   * Latitude of the venue
   */
  latitude: number;

  /**
   * Longitude of the venue
   */
  longitude: number;

  /**
   * Name of the venue
   */
  title: string;

  /**
   * Address of the venue
   */
  address: string;

  /**
   * Optional. Foursquare identifier of the venue
   */
  foursquareId?: string;

  /**
   * Optional. Foursquare type of the venue. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)
   */
  foursquareType?: string;
};

export type PollOption = {
  text: string;
  voterCount: number;
};

export type Poll = {
  /**
   * Unique poll identifier
   */
  id: string;

  /**
   * Poll question, 1-255 characters
   */
  question: string;

  /**
   * List of poll options
   */
  options: PollOption[];

  /**
   * Total number of users that voted in the poll
   */
  totalVoterCount: number;

  /**
   * True, if the poll is closed
   */
  isClosed: boolean;

  /**
   * True, if the poll is anonymous
   */
  isAnonymous: boolean;

  /**
   * Poll type, currently can be “regular” or “quiz”
   */
  type: string;

  /**
   * True, if the poll allows multiple answers
   */
  allowsMultipleAnswers: boolean;

  /**
   * Optional. 0-based identifier of the correct answer option. Available only for polls in the quiz mode, which are closed, or was sent (not forwarded) by the bot or to the private chat with the bot.
   */
  correctOptionId?: number;

  /**
   * Optional. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters
   */
  explanation?: string;

  /**
   * Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the explanation
   */
  explanationEntities?: MessageEntity[];

  /**
   * Optional. Amount of time in seconds the poll will be active after creation
   */
  openPeriod?: number;

  /**
   * Optional. Point in time (Unix timestamp) when the poll will be automatically closed
   */
  closeDate?: number;
};

/**
 * This object represents an answer of a user in a non-anonymous poll.
 */
export type PollAnswer = {
  /**
   * Unique poll identifier
   */
  pollId: string;

  /**
   * The user, who changed the answer to the poll
   */
  user: User;

  /**
   * 0-based identifiers of answer options, chosen by the user. May be empty if the user retracted their vote.
   */
  optionIds: number[];
};

export type UserProfilePhotos = {
  totalCount: number;
  photos: PhotoSize[][];
};

export type File = {
  fileId: string;
  fileSize?: number;
  filePath: string;
};

/**
 * This object represents a custom keyboard with reply options.
 *
 * - https://core.telegram.org/bots#keyboards
 * - https://core.telegram.org/bots/api#replykeyboardmarkup
 */
export type ReplyKeyboardMarkup = {
  /**
   * Array of button rows, each represented by an Array of KeyboardButton objects
   *
   * - https://core.telegram.org/bots/api#keyboardbutton
   */
  keyboard: KeyboardButton[][];

  /**
   * Optional. Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to false, in which case the custom keyboard is always of the same height as the app's standard keyboard.
   */
  resizeKeyboard?: boolean;

  /**
   * Optional. Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat – the user can press a special button in the input field to see the custom keyboard again. Defaults to false.
   */
  oneTimeKeyboard?: boolean;

  /**
   * Optional. Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are `@mentioned` in the text of the Message object; 2) if the bot's message is a reply (has replyToMessageId), sender of the original message.
   *
   * Example: A user requests to change the bot‘s language, bot replies to the request with a keyboard to select the new language. Other users in the group don’t see the keyboard.
   */
  selective?: boolean;
};

/**
 * This object represents one button of the reply keyboard. For simple text buttons String can be used instead of this object to specify text of the button. Optional fields are mutually exclusive.
 *
 * - https://core.telegram.org/bots/api#keyboardbutton
 */
export type KeyboardButton = {
  /**
   * Text of the button. If none of the optional fields are used, it will be sent as a message when the button is pressed
   */
  text: string;

  /**
   * Optional. If True, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only
   */
  requestContact?: boolean;

  /**
   * Optional. If True, the user's current location will be sent when the button is pressed. Available in private chats only
   */
  requestLocation?: boolean;
};

/**
 * Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard. By default, custom keyboards are displayed until a new keyboard is sent by a bot. An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see ReplyKeyboardMarkup).
 *
 * - https://core.telegram.org/bots/api#replykeyboardremove
 * - https://core.telegram.org/bots/api#replykeyboardmarkup
 */
export type ReplyKeyboardRemove = {
  /**
   * Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use oneTimeKeyboard in ReplyKeyboardMarkup)
   */
  removeKeyboard: true;

  /**
   * Optional. Use this parameter if you want to remove the keyboard for specific users only. Targets:
   * 1. users that are `@mentioned` in the text of the Message object
   * 2. if the bot's message is a reply (has replyToMessageId), sender of the original message.
   *
   * Example: A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven't voted yet.
   */
  selective?: boolean;
};

/**
 * This object represents an inline keyboard that appears right next to the message it belongs to.
 *
 * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
 */
export type InlineKeyboardMarkup = {
  /**
   * Array of button rows, each represented by an Array of InlineKeyboardButton objects
   *
   * - https://core.telegram.org/bots/api#inlinekeyboardbutton
   */
  inlineKeyboard: InlineKeyboardButton[][];
};

/**
 * This object represents one button of an inline keyboard. You must use exactly one of the optional fields.
 *
 * - https://core.telegram.org/bots/api#inlinekeyboardbutton
 */
export type InlineKeyboardButton = {
  /**
   * Label text on the button
   */
  text: string;

  /**
   * Optional. HTTP or tg:// url to be opened when button is pressed
   */
  url?: string;

  /**
   * Optional. An HTTP URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget.
   *
   * - https://core.telegram.org/bots/api#loginurl
   * - https://core.telegram.org/widgets/login
   */
  loginUrl?: LoginUrl;

  /**
   * Optional. Data to be sent in a callback query to the bot when button is pressed, 1-64 bytes
   */
  callbackData?: string;

  /**
   * Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot‘s username and the specified inline query in the input field. Can be empty, in which case just the bot’s username will be inserted.
   *
   * Note: This offers an easy way for users to start using your bot in inline mode when they are currently in a private chat with it. Especially useful when combined with switchPm… actions – in this case the user will be automatically returned to the chat they switched from, skipping the chat selection screen.
   */
  switchInlineQuery?: string;

  /**
   * Optional. If set, pressing the button will insert the bot‘s username and the specified inline query in the current chat's input field. Can be empty, in which case only the bot’s username will be inserted.
   *
   * This offers a quick way for the user to open your bot in inline mode in the same chat – good for selecting something from multiple options.
   */
  switchInlineQueryCurrentChat?: string;

  /**
   * Optional. Description of the game that will be launched when the user presses the button.
   *
   * NOTE: This type of button must always be the first button in the first row.
   *
   * - https://core.telegram.org/bots/api#callbackgame
   */
  callbackGame?: CallbackGame;

  /**
   * Optional. Specify True, to send a Pay button.
   *
   * NOTE: This type of button must always be the first button in the first row.
   *
   * - https://core.telegram.org/bots/api#payments
   */
  pay?: boolean;
};

/**
 * This object represents a parameter of the inline keyboard button used to automatically authorize a user. Serves as a great replacement for the Telegram Login Widget when the user is coming from Telegram. All the user needs to do is tap/click a button and confirm that they want to log in:
 *
 * - https://core.telegram.org/bots/api#loginurl
 */
export type LoginUrl = {
  /**
   * An HTTP URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in Receiving authorization data.
   *
   * NOTE: You must always check the hash of the received data to verify the authentication and the integrity of the data as described in Checking authorization.
   *
   * - https://core.telegram.org/widgets/login#receiving-authorization-data
   * - https://core.telegram.org/widgets/login#checking-authorization
   */
  url: string;

  /**
   * Optional. New text of the button in forwarded messages.
   */
  forwardText?: string;

  /**
   * Optional. Username of a bot, which will be used for user authorization. See Setting up a bot for more details. If not specified, the current bot's username will be assumed. The url's domain must be the same as the domain linked with the bot. See Linking your domain to the bot for more details.
   *
   * - https://core.telegram.org/widgets/login#setting-up-a-bot
   * - https://core.telegram.org/widgets/login#linking-your-domain-to-the-bot
   */
  botUsername?: string;

  /**
   * Optional. Pass True to request the permission for your bot to send messages to the user.
   */
  requestWriteAccess?: boolean;
};

export type CallbackQuery = {
  id: string;
  from: User;
  message?: Message;
  inlineMessageId?: string;
  chatInstance: string;
  data?: string;
  gameShortName?: string;
};

/**
 * Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot‘s message and tapped ’Reply'). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice privacy mode.
 *
 * - https://core.telegram.org/bots/api#forcereply
 * - https://core.telegram.org/bots#privacy-mode
 */
export type ForceReply = {
  /**
   * Shows reply interface to the user, as if they manually selected the bot‘s message and tapped ’Reply'
   */
  forceReply: boolean;

  /**
   * Optional. Use this parameter if you want to force reply from specific users only. Targets:
   * 1. users that are `@mentioned` in the text of the Message object;
   * 2. if the bot's message is a reply (has replyToMessageId), sender of the original message.
   */
  selective?: boolean;
};

export type ChatPhoto = {
  smallFileId: string;
  bigFileId: string;
};

export type ChatMember = any;

/**
 * Describes actions that a non-administrator user is allowed to take in a chat.
 */
export type ChatPermissions = {
  /**
   * Optional. True, if the user is allowed to send text messages, contacts, locations and venues
   */
  canSendMessages?: boolean;

  /**
   * Optional. True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages
   */
  canSendMediaMessages?: boolean;

  /**
   * Optional. True, if the user is allowed to send polls, implies can_send_messages
   */
  canSendPolls?: boolean;

  /**
   * Optional. True, if the user is allowed to send animations, games, stickers and use inline bots, implies can_send_media_messages
   */
  canSendOtherMessages?: boolean;

  /**
   * Optional. True, if the user is allowed to add web page previews to their messages, implies can_send_media_messages
   */
  canAddWebPagePreviews?: boolean;

  /**
   * Optional. True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups
   */
  canChangeInfo?: boolean;

  /**
   * Optional. True, if the user is allowed to invite new users to the chat
   */
  canInviteUsers?: boolean;

  /**
   * Optional. True, if the user is allowed to pin messages. Ignored in public supergroups
   */
  canPinMessages?: boolean;
};

export type ResponseParameters = any;

export type InputMedia =
  | InputMediaAnimation
  | InputMediaDocument
  | InputMediaAudio
  | InputMediaPhoto
  | InputMediaVideo;

export enum InputMediaType {
  Photo = 'photo',
  Video = 'video',
  Animation = 'animation',
  Audio = 'audio',
  Document = 'document',
}

export type InputMediaPhoto = {
  /**
   * Type of the result, must be photo
   */
  type: InputMediaType.Photo;

  /**
   * File to send. Pass a fileId to send a file that exists on the Telegram servers (recommended) or pass an HTTP URL for Telegram to get a file from the Internet. Upload file is not supported yet.
   */
  media: string;

  /**
   * Optional. Caption of the photo to be sent, 0-1024 characters
   */
  caption?: string;

  /**
   * Optional. Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
   */
  parseMode?: ParseMode;
};

export type InputMediaVideo = {
  /**
   * Type of the result, must be video
   */
  type: InputMediaType.Video;

  /**
   * File to send. Pass a fileId to send a file that exists on the Telegram servers (recommended) or pass an HTTP URL for Telegram to get a file from the Internet. Upload file is not supported yet.
   */
  media: string;

  /**
   * Thumb is not supported yet.
   */
  thumb?: string;

  /**
   * Optional. Caption of the video to be sent, 0-1024 characters
   */
  caption?: string;

  /**
   * Optional. Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
   */
  parseMode?: string;

  /**
   * Optional. Video width
   */
  width?: number;

  /**
   * Optional. Video height
   */
  height?: number;

  /**
   * Optional. Video duration
   */
  duration?: number;

  /**
   * Optional. Pass True, if the uploaded video is suitable for streaming
   */
  supportsStreaming?: boolean;
};

export type InputMediaAnimation = {
  type: InputMediaType.Animation;
  media: string;
  thumb?: string;
  caption?: string;
  parseMode?: string;
  width?: number;
  height?: number;
  duration?: number;
};

export type InputMediaAudio = {
  type: InputMediaType.Audio;
  media: string;
  thumb?: string;
  caption?: string;
  parseMode?: string;
  duration?: number;
  performer?: string;
  title?: string;
};

export type InputMediaDocument = {
  type: InputMediaType.Document;
  media: string;
  thumb?: string;
  caption?: string;
  parseMode?: string;
};

export enum ChatAction {
  Typing = 'typing',
  UploadPhoto = 'upload_photo',
  RecordVideo = 'record_video',
  UploadVideo = 'upload_video',
  RecordAudio = 'record_audio',
  UploadAudio = 'upload_audio',
  UploadDocument = 'upload_document',
  FindLocation = 'find_location',
  RecordVideoNote = 'record_video_note',
  UploadVideoNote = 'upload_video_note',
}

// Stickers
export type Sticker = {
  fileId: string;
  width: number;
  height: number;
  isAnimated: boolean;
  thumb?: PhotoSize;
  emoji?: string;
  setName?: string;
  maskPosition?: MaskPosition;
  fileSize?: number;
};

export type StickerSet = {
  name: string;
  title: string;
  isAnimated: boolean;
  containsMasks: boolean;
  stickers: Sticker[];
};

export type MaskPosition = {
  point: 'forehead' | 'eyes' | 'mouth' | 'chin';
  xShift: number;
  yShift: number;
  scale: number;
};

// Inline Mode
export type InlineQuery = {
  id: string;
  from: User;
  location?: Location;
  query: string;
  offset: string;
};

export type InlineQueryResult =
  | InlineQueryResultCachedAudio
  | InlineQueryResultCachedDocument
  | InlineQueryResultCachedGif
  | InlineQueryResultCachedMpeg4Gif
  | InlineQueryResultCachedPhoto
  | InlineQueryResultCachedSticker
  | InlineQueryResultCachedVideo
  | InlineQueryResultCachedVoice
  | InlineQueryResultArticle
  | InlineQueryResultAudio
  | InlineQueryResultContact
  | InlineQueryResultGame
  | InlineQueryResultDocument
  | InlineQueryResultGif
  | InlineQueryResultLocation
  | InlineQueryResultMpeg4Gif
  | InlineQueryResultPhoto
  | InlineQueryResultVenue
  | InlineQueryResultVideo
  | InlineQueryResultVoice;

export type InlineQueryResultArticle = {
  type: 'article';
  id: string;
  title: string;
  inputMessageContent: InputMessageContent;
  replyMarkup?: InlineKeyboardMarkup;
  url?: string;
  hideUrl?: boolean;
  description?: string;
  thumbUrl?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type InlineQueryResultPhoto = {
  type: 'photo';
  id: string;
  photoUrl: string;
  thumbUrl: string;
  title?: string;
  description?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultGif = {
  type: 'gif';
  id: string;
  gifUrl: string;
  gifWidth?: number;
  gifHeight?: number;
  gifDuration?: number;
  thumbUrl: string;
  title?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultMpeg4Gif = {
  type: 'mpeg4_gif';
  id: string;
  mpeg4Url: string;
  mpeg4Width?: number;
  mpeg4Height?: number;
  mpeg4Duration?: number;
  thumbUrl: string;
  title?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultVideo = {
  type: 'video';
  id: string;
  videoUrl: string;
  mimeType: string;
  thumbUrl: string;
  title: string;
  caption?: string;
  parseMode?: string;
  videoWidth?: number;
  videoHeight?: number;
  videoDuration?: number;
  description?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultAudio = {
  type: 'audio';
  id: string;
  audioUrl: string;
  title: string;
  caption?: string;
  parseMode?: string;
  performer?: string;
  audioDuration?: number;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultVoice = {
  type: 'voice';
  id: string;
  voiceUrl: string;
  title: string;
  caption?: string;
  parseMode?: string;
  voiceDuration?: number;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultDocument = {
  type: 'document';
  id: string;
  title: string;
  caption?: string;
  parseMode?: string;
  documentUrl: string;
  mimeType: string;
  description?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
  thumbUrl?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type InlineQueryResultLocation = {
  type: 'location';
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  livePeriod?: number;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
  thumbUrl?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type InlineQueryResultVenue = {
  type: 'venue';
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  foursquareId?: string;
  foursquareType?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
  thumbUrl?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type InlineQueryResultContact = {
  type: 'contact';
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  vcard?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
  thumbUrl?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type InlineQueryResultGame = {
  type: 'game';
  id: string;
  gameShortName: string;
  replyMarkup?: InlineKeyboardMarkup;
};

export type InlineQueryResultCachedPhoto = {
  type: 'photo';
  id: string;
  photoFileId: string;
  title?: string;
  description?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedGif = {
  type: 'gif';
  id: string;
  gifFileId: string;
  title?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedMpeg4Gif = {
  type: 'mpeg4_gif';
  id: string;
  mpeg4FileId: string;
  title?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedSticker = {
  type: 'sticker';
  id: string;
  stickerFileId: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedDocument = {
  type: 'document';
  id: string;
  title: string;
  documentFileId: string;
  description?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedVideo = {
  type: 'video';
  id: string;
  videoFileId: string;
  title: string;