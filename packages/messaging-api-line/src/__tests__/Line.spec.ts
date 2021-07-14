import * as Line from '../Line';
import * as Types from '../LineTypes';

const quickReply: Types.QuickReply = {
  items: [
    {
      type: 'action',
      action: {
        type: 'cameraRoll',
        label: 'Send photo',
      },
    },
    {
      type: 'action',
      action: {
        type: 'camera',
        label: 'Open camera',
      },
    },
  ],
};

describe('#createText', () => {
  it('should return text message object', () => {
    expect(Line.createText('t')).toEqual({ type: 'text', text: 't' });
  });

  it('should work with quickReply', () => {
    expect(Line.createText('t', { quickReply })).toEqual({
      type: 'text',
      text: 't',
      quickReply,
    });
  });
});

describe('#createImage', () => {
  it('should return image message object', () => {
    expect(
      Line.createImage({
        originalContentUrl: 'http://example.com/img1.jpg',
      })
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img1.jpg',
    });

    expect(
      Line.createImage({
        originalContentUrl: 'http://example.com/img1.jpg',
        previewImageUrl: 'http://example.com/img2.jpg',
      })
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img2.jpg',
    });
  });

  it('should work with quickReply', () => {
    expect(
      Line.createImage(
        {
          originalContentUrl: 'http://example.com/img1.jpg',
        },
        { quickReply }
      )
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img1.jpg',
      quickReply,
    });

    expect(
      Line.createImage(
        {
          originalContentUrl: 'http://example.com/img1.jpg',
          previewImageUrl: 'http://example.com/img2.jpg',
        },
        { quickReply }
      )
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img2.jpg',
      quickReply,
    });
  });
});

describe('#createVideo', () => {
  it('should return video message object', () => {
    expect(
      Line.createVideo({
        originalContentUrl: 'http://example.com/video.mp4',
        previewImageUrl: 'http://example.com/img.jpg',
      })
    ).toEqual({
      type: 'video',
      originalContentUrl: 'http://example.com/video.mp4',
      previewImageUrl: 'http://example.com/img.jpg',
    });
  });

  it('should work with quickReply', () => {
    expect(
      Line.createVideo(
        {
          originalContentUrl: 'http://example.com/video.mp4',
          previewImageUrl: 'http://example.com/img.jpg',
        },
        { quickReply }
      )
    ).toEqual({
      type: 'video',
      originalContentUrl: 'http://example.com/video.mp4',
      previewImageUrl: 'http://example.com/img.jpg',
      quickReply,
    });
  });
});

describe('#createAudio', () => {
  it('should return audio message object', () => {
    expect(
      Line.createAudio({
        originalContentUrl: 'http://example.com/audio.mp3',
        duration: 240000,
      })
    ).toEqual({
      type: 'audio',
      originalContentUrl: 'http://example.com/audio.mp3',
      duration: 240000,
    });
  });

  it('should work with quickReply', () => {
    expect(
      Line.createAudio(
        {
          originalContentUrl: 'http://example.com/audio.mp3',
          duration: 240000,
        },
        { quickReply }
      )
    ).toEqual({
      type: 'audio',
      originalContentUrl: 'http://example.com/audio.mp3',
      duration: 240000,
      quickReply,
    });
  });
});

describe('#createLocation', () => {
  it('should return location message object', () => {
    expect(
      Line.createLocation({
        title: 'my location',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203,
      })
    ).toEqual({
      type: 'location',
      title: 'my location',
      address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
      latitude: 35.65910807942215,
      longitude: 139.70372892916203,
    });
  });

  it('should work with quickReply', () => {
    expect(
      Line.createLocation(
        {
          title: 'my location',
          address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
          latitude: 35.65910807942215,
          longitude: 139.70372892916203,
        },
        { quickReply }
      )
    ).toEqual({
      type: 'location',
      title: 'my location',
      address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
      latitude: 35.65910807942215,
      longitude: 139.70372892916203,
      quickReply,
    });
  });
});

describe('#createSticker', () => {
  it('should return sticker message object', () => {
    expect(
      Line.createSticker({
        packageId: '1',
        stickerId: '1',
      })
    ).toEqual({
      type: 'sticker',
      packageId: '1',
      stickerId: '1',
    });
  });

  it('should work with quickReply', () => {
    expect(
      Line.createSticker(
        {
          packageId: '1',
          stickerId: '1',
        },
