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
            type: 'image',
            payload: {
              url: 'https://example.com/pic.png',
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendAudio', () => {
  const request = {
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        attachment: {
          type: 'audio',
          payload: {
            url: 'https://example.com/audio.mp3',
          },
        },
      },
      recipient: {
        id: RECIPIENT_ID,
      },
    },
  };
  it('should create send audio request with url', () => {
    expect(
      MessengerBatch.sendAudio(RECIPIENT_ID, 'https://example.com/audio.mp3')
    ).toEqual(request);
  });

  it('should create send audio request with payload', () => {
    expect(
      MessengerBatch.sendAudio(RECIPIENT_ID, {
        url: 'https://example.com/audio.mp3',
      })
    ).toEqual(request);
  });
});

describe('sendImage', () => {
  const request = {
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: 'https://example.com/pic.png',
          },
        },
      },
      recipient: {
        id: RECIPIENT_ID,
      },
    },
  };
  it('should create send image request with url', () => {
    expect(
      MessengerBatch.sendImage(RECIPIENT_ID, 'https://example.com/pic.png')
    ).toEqual(request);
  });

  it('should create send image request with payload', () => {
    expect(
      MessengerBatch.sendImage(RECIPIENT_ID, {
        url: 'https://example.com/pic.png',
      })
    ).toEqual(request);
  });
});

describe('sendVideo', () => {
  const request = {
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        attachment: {
          type: 'video',
          payload: {
            url: 'https://example.com/video.mp4',
          },
        },
      },
      recipient: {
        id: RECIPIENT_ID,
      },
    },
  };
  it('should create send video request with url', () => {
    expect(
      MessengerBatch.sendVideo(RECIPIENT_ID, 'https://example.com/video.mp4')
    ).toEqual(request);
  });

  it('should create send video request with payload', () => {
    expect(
      MessengerBatch.sendVideo(RECIPIENT_ID, {
        url: 'https://example.com/video.mp4',
      })
    ).toEqual(request);
  });
});

describe('sendFile', () => {
  const request = {
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        attachment: {
          type: 'file',
          payload: {
            url: 'https://example.com/file.pdf',
          },
        },
      },
      recipient: {
        id: RECIPIENT_ID,
      },
    },
  };
  it('should create send file request with url', () => {
    expect(
      MessengerBatch.sendFile(RECIPIENT_ID, 'https://example.com/file.pdf')
    ).toEqual(request);
  });

  it('should create send file request with payload', () => {
    expect(
      MessengerBatch.sendFile(RECIPIENT_ID, {
        url: 'https://example.com/file.pdf',
      })
    ).toEqual(request);
  });
});

describe('sendTemplate', () => {
  it('should create send template request', () => {
    expect(
      MessengerBatch.sendTemplate(RECIPIENT_ID, {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      })
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              templateType: 'button',
              text: 'title',
              buttons: [
                {
                  type: 'postback',
                  title: 'Start Chatting',
                  payload: 'USER_DEFINED_PAYLOAD',
                },
              ],
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendButtonTemplate', () => {
  it('should create send button template request', () => {
    expect(
      MessengerBatch.sendButtonTemplate(RECIPIENT_ID, 'title', [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ])
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              templateType: 'button',
              text: 'title',
              buttons: [
                {
                  type: 'postback',
                  title: 'Start Chatting',
                  payload: 'USER_DEFINED_PAYLOAD',
                },
              ],
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendGenericTemplate', () => {
  const elements = [
    {
      title: "Welcome to Peter's Hats",
      imageUrl: 'https://petersfancybrownhats.com/company_image.png',
      subtitle: "We've got the right hat for everyone.",
      defaultAction: {
        type: 'web_url',
        url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
        messengerExtensions: true,
        webviewHeightRatio: 'tall',
        fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
      },
      buttons: [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'DEVELOPER_DEFINED_PAYLOAD',
        },
      ],
    },
  ];
  it('should create send generic template request', () => {
    expect(MessengerBatch.sendGenericTemplate(RECIPIENT_ID, elements)).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              templateType: 'generic',
              elements,
              imageAspectRatio: 'horizontal',
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendReceiptTemplate', () => {
  const receipt = {
    recipientName: 'Stephane Crozatier',
    orderNumber: '12345678902',
    currency: 'USD',
    paymentMethod: 'Visa 2345',
    orderUrl: 'http://petersapparel.parseapp.com/order?order_id=123456',
    timestamp: '1428444852',
    elements: [
      {
        title: 'Classic White T-Shirt',
        subtitle: '100% Soft and Luxurious Cotton',
        quantity: 2,
        price: 50,
        currency: 'USD',
        imageUrl: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
      },
      {
        title: 'Classic Gray T-Shirt',
        subtitle: '100% Soft and Luxurious Cotton',
        quantity: 1,
        price: 25,
        currency: 'USD',
        imageUrl: 'http://petersapparel.parseapp.com/img/grayshirt.png',
      },
    ],
    address: {
      street1: '1 Hacker Way',
      street2: '',
      city: 'Menlo Park',
      postalCode: '94025',
      state: 'CA',
      country: 'US',
    },
    summary: {
      subtotal: 75.0,
      shippingCost: 4.95,
      totalTax: 6.19,
      totalCost: 56.14,
    },
    adjustments: [
      {
        name: 'New Customer Discount',
        amount: 20,
      },
      {
        name: '$10 Off Coupon',
        amount: 10,
      },
    ],
  };
  it('should create send receipt template request', () => {
    expect(MessengerBatch.sendReceiptTemplate(RECIPIENT_ID, receipt)).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              templateType: 'receipt',
              ...receipt,
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendMediaTemplate', () => {
  const elements = [
    {
      mediaType: 'image',
      attachmentId: '1854626884821032',
      buttons: [
        {
          type: 'web_url',
          url: '<WEB_URL>',
          title: 'View Website',
        },
      ],
    },
  ];
  it('should create send media template request', () => {
    expect(MessengerBatch.sendMediaTemplate(RECIPIENT_ID, elements)).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              templateType: 'media',
              elements,
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendAirlineBoardingPassTemplate', () => {
  const attrs = {
    introMessage: 'You are checked in.',
    locale: 'en_US',
    boardingPass: [
      {
        passengerName: 'SMITH/NICOLAS',
        pnrNumber: 'CG4X7U',
        travelClass: 'business',
        seat: '74J',
        auxiliaryFields: [
          {
            label: 'Terminal',
            value: 'T1',
          },
          {
            label: 'Departure',
            value: '30OCT 19:05',
          },
        ],
        secondaryFields: [
          {
            label: 'Boarding',
            value: '18:30',
          },
          {
            label: 'Gate',
            value: 'D57',
          },
          {
            label: 'Seat',
            value: '74J',
          },
          {
            label: 'Sec.Nr.',
            value: '003',
          },
        ],
        logoImageUrl: 'https://www.example.com/en/logo.png',
        headerImageUrl: 'https://www.example.com/en/fb/header.png',
        qrCode: 'M1SMITH/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
        aboveBarCodeImageUrl: 'https://www.example.com/en/PLAT.png',
        flightInfo: {
          flightNumber: 'KL0642',
          departureAirport: {
            airportCode: 'JFK',
            city: 'New York',
            terminal: 'T1',
            gate: 'D57',
          },
          arrivalAirport: {
            airportCode: 'AMS',
            city: 'Amsterdam',
          },
          flightSchedule: {
            departureTime: '2016-01-02T19:05',
            arrivalTime: '2016-01-05T17:30',
          },
        },
      },
      {
        passengerName: 'JONES/FARBOUND',
        pnrNumber: 'CG4X7U',
        travelClass: 'business',
        seat: '74K',
        auxiliaryFields: [
          {
            label: 'Terminal',
            value: 'T1',
          },
          {
            label: 'Departure',
            value: '30OCT 19:05',
          },
        ],
        secondaryFields: [
          {
            label: 'Boarding',
            value: '18:30',
          },
          {
            label: 'Gate',
            value: 'D57',
          },
          {
            label: 'Seat',
            value: '74K',
          },
          {
            label: 'Sec.Nr.',
            value: '004',
          },
        ],
        logoImageUrl: 'https://www.example.com/en/logo.png',
        headerImageUrl: 'https://www.example.com/en/fb/header.png',
        qrCode: 'M1JONES/FARBOUND  CG4X7U nawouehgawgnapwi3jfa0wfh',
        aboveBarCodeImageUrl: 'https://www.example.com/en/PLAT.png',
        flightInfo: {
          flightNumber: 'KL0642',
          departureAirport: {
            airportCode: 'JFK',
            city: 'New York',
            terminal: 'T1',
            gate: 'D57',
          },
          arrivalAirport: {
            airportCode: 'AMS',
            city: 'Amsterdam',
          },
          flightSchedule: {
            departureTime: '2016-01-02T19:05',
            arrivalTime: '2016-01-05T17:30',
          },
        },
      },
    ],
  };
  it('should create send airline boarding pass template request', () => {
    expect(
      MessengerBatch.sendAirlineBoardingPassTemplate(RECIPIENT_ID, attrs)
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              templateType: 'airline_boardingpass',
              ...attrs,
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendAirlineCheckinTemplate', () => {
  const attrs = {
    introMessage: 'Check-in is available now.',
    locale: 'en_US',
    pnrNumber: 'ABCDEF',
    flightInfo: [
      {
        flightNumber: 'f001',
        departureAirport: {
          airportCode: 'SFO',
          city: 'San Francisco',
         