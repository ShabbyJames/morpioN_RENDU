import omit from 'lodash/omit';
import pick from 'lodash/pick';

import * as Messenger from './Messenger';
import * as MessengerTypes from './MessengerTypes';

function omitUndefinedFields(obj = {}): object {
  return JSON.parse(JSON.stringify(obj));
}

function pickBatchOptions<T extends MessengerTypes.BatchRequestOptions>(
  options: T
): Pick<T, 'name' | 'dependsOn' | 'omitResponseOnSuccess'> {
  return pick(options, ['name', 'dependsOn', 'omitResponseOnSuccess']);
}

function omitBatchOptions<T extends MessengerTypes.BatchRequestOptions>(
  options: T
): Omit<T, 'name' | 'dependsOn' | 'omitResponseOnSuccess'> {
  return omit(options, ['name', 'dependsOn', 'omitResponseOnSuccess']);
}

export function sendRequest(
  body: object,
  options?: MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return {
    method: 'POST',
    relativeUrl: 'me/messages',
    body,
    ...options,
  };
}

export function sendMessage(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  msg: MessengerTypes.Message,
  options: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const recipient =
    typeof psidOrRecipient === 'string'
      ? {
          id: psidOrRecipient,
        }
      : psidOrRecipient;
  let messagingType = 'UPDATE';
  if (options.messagingType) {
    messagingType = options.messagingType;
  } else if (options.tag) {
    messagingType = 'MESSAGE_TAG';
  }

  const batchRequestOptions = pickBatchOptions(options);

  return sendRequest(
    {
      messagingType,
      recipient,
      message: Messenger.createMessage(msg, options),
      ...omitUndefinedFields(omitBatchOptions(options)),
    },
    batchRequestOptions
  );
}

export function sendText(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  text: string,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createText(text, options),
    options
  );
}

export function sendAttachment(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attachment: MessengerTypes.Attachment,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAttachment(attachment, options),
    options
  );
}

export function sendAudio(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  audio: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAudio(audio, options),
    options
  );
}

export function sendImage(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  image: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createImage(image, options),
    options
  );
}

export function sendVideo(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  video: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createVideo(video, options),
    options
  );
}

export function sendFile(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  file: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createFile(file, options),
    options
  );
}

export function sendTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  payload: MessengerTypes.TemplateAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createTemplate(payload, options),
    options
  );
}

export function sendButtonTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  text: string,
  buttons: MessengerTypes.TemplateButton[],
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createButtonTemplate(text, buttons, options),
    options
  );
}

export function sendGenericTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  elements: MessengerTypes.TemplateElement[],
  {
    imageAspectRatio = 'horizontal',
    ...options
  }: {
    imageAspectRatio?: 'horizontal' | 'square';
  } & MessengerTypes.SendOption = {}
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createGenericTemplate(elements, {
      ...options,
      imageAspectRatio,
    }),

    options
  );
}

export function sendReceiptTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  receipt: MessengerTypes.ReceiptAttributes,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createReceiptTemplate(receipt, options),
    options
  );
}

export function sendMediaTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  elements: MessengerTypes.MediaElement[],
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createMediaTemplate(elements, options),
    options
  );
}

export function sendAirlineBoardingPassTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attrs: MessengerTypes.AirlineBoardingPassAttributes,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAirlineBoardingPassTemplate(attrs, options),
    options
  );
}

export function sendAirlineCheckinTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attrs: MessengerTypes.AirlineCheckinAttributes,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAirlineCheckinTemplate(attrs, options),
    options
  );
}

export function sendAirlineItineraryTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attrs: MessengerTypes.AirlineItineraryAttributes,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.creat