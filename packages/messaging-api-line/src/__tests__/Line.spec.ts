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

  it('should work with quickRe