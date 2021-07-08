import * as LineTypes from './LineTypes';

export function createText(
  text: string,
  options: LineTypes.MessageOptions & { emojis?: LineTypes.Emoji[] } = {}
): LineTypes.TextMessage {
  return {
    type: 'text',
    text,
    ...options,
  };
}

export function createImage(
  image: {
    originalContentUrl: string;
    previewImageUrl?: string;
  },
  options: LineTypes.MessageOptions = {}
): LineTypes.ImageMessage {
  return {
    type: 'image',
    originalContentUrl: image.originalContentUrl,
    previewImageUrl: image.previewImageUrl || image.originalContentUrl,
    ...options,
  };
}

export function createVideo(
  video: {
    originalContentUrl: string;
    previewImageUrl: string;
  },
  options: LineTypes.MessageOptions = {}
): LineTypes.VideoMessage {
  return {
    type: 'video',
    originalContentUrl: video.originalContentUrl,
    previewImageUrl: video.previewImageUrl,
    ...options,
  };
}

export function createAudio(
  audio: {
    originalContentUrl: string;
    duration: number;
  },
  options: LineTypes.MessageOptions = {}
): LineTypes.AudioMessage {
  return {
    type: 'audio',
    originalContentUrl: audio.originalContentUrl,
    duration: audio.duration,
    ...options,
  };
}

exp