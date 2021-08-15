import { MessengerBatch } from '..';

const RECIPIENT_ID = '1QAZ2WSX';
const LABEL_ID = 123456;

describe('sendRequest', () => {
  it('should create send text request', () => {
    expect(
      MessengerBatch.sendRequest({
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      })
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.sendRequest(
        {
          messagingType: 'UPDATE',
          message: {
            text: 'Hello',
          },
          recipient: {
            id: RECIPIENT_ID,
          },
        },
        {
          name: 'second',
          dependsOn: 'first',
          omitResponseOnSuccess: false,
        }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('sendMessage', () => {
  it('should create send text request', () => {
    expect(MessengerBatch.sendMessage(RECIPIENT_ID, { text: 'Hello' })).toEqual(
      {
        method: 'POST',
        relativeUrl: 'me/messages',
        body: {
          messagingType: 'UPDATE',
          message: {
            text: 'Hello',
          },
          recipient: {
            id: RECIPIENT_ID,
          },
        },
      }
    );
  });

  it('should create send text with RESPONSE type', () => {
    expect(
      MessengerBatch.sendMessage(
        RECIPIENT_ID,
        { text: 'Hello' },
        { messagingType: 'RESPONSE' }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'RESPONSE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });

  it('can create request with phone_number', () => {
    expect(
      MessengerBatch.sendMessage(
        {
          phoneNumber: '+1(212)555-2368',
          name: { firstName: 'John', lastName: 'Doe' },
        },
        { text: 'Hello' }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          phoneNumber: '+1(212)555-2368',
          name: { firstName: 'John', lastName: 'Doe' },
        },
      },
    });
  });

  it('can create request with user_ref', () => {
    expect(
      MessengerBatch.sendMessage(
        {
          userRef: 'user-ref',
        },
        { text: 'Hello' }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          userRef: 'user-ref',
        },
      },
    });
  });

  it('can create request with post_id', () => {
    expect(
      MessengerBatch.sendMessage(
        {
          postId: 'post-id',
        },
        { text: 'Hello' }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          postId: 'post-id',
        },
      },
    });
  });

  it('can create request with comment_id', () => {
    expect(
      MessengerBatch.sendMessage(
        {
          commentId: 'comment-id',
        },
        { text: 'Hello' }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          commentId: 'comment-id',
        },
      },
    });
  });

  it('should omit options with undefined value', () => {
    expect(
      MessengerBatch.sendMessage(
        RECIPIENT_ID,
        { text: 'Hello' },
        {
          messagingType: 'RESPONSE',
          accessToken: undefined,
        }
      )
    ).not.toHaveProperty('body.accessToken');
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.sendMessage(
        RECIPIENT_ID,
        { text: 'Hello' },
        {
          name: 'second',
          dependsOn: 'first',
          omitResponseOnSuccess: false,
        }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('sendText', () => {
  it('should create send text request', () => {
    expect(MessengerBatch.sendText(RECIPIENT_ID, 'Hello')).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendAttachment', () => {
  it('should create send attachment request', () => {
    expect(
      MessengerBatch.sendAttachment(RECIPIENT_ID, {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      })
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
       