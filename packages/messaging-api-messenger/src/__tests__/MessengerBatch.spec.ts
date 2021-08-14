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
          messagingType: