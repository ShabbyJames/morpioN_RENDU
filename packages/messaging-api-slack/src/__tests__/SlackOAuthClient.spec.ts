import querystring from 'querystring';

import MockAdapter from 'axios-mock-adapter';

import SlackOAuthClient from '../SlackOAuthClient';

const TOKEN = 'xxxx-xxxxxxxxx-xxxx';
const CHANNEL = 'C1234567890';
const USER = 'U56781234';

const VIEW_PAYLOAD = {
  id: 'VMHU10V25',
  teamId: 'T8N4K1JN',
  type: 'modal',
  title: {
    type: 'plain_text',
    text: 'Quite a plain modal',
  },
  submit: {
    type: 'plain_text',
    text: 'Create',
  },
  blocks: [
    {
      type: 'input',
      blockId: 'a_block_id',
      label: {
        type: 'plain_text',
        text: 'A simple label',
        emoji: true,
      },
      optional: false,
      element: {
        type: 'plain_text_input',
        actionId: 'an_action_id',
      },
    },
  ],
  privateMetadata: 'Shh it is a secret',
  callbackId: 'identify_your_modals',
  externalId: '',
  state: {
    values: [],
  },
  hash: '156772938.1827394',
  clearOnClose: false,
  notifyOnClose: false,
};

const VIEW_PAYLOAD_STRING =
  '{"id":"VMHU10V25","team_id":"T8N4K1JN","type":"modal","title":{"type":"plain_text","text":"Quite a plain modal"},"submit":{"type":"plain_text","text":"Create"},"blocks":[{"type":"input","block_id":"a_block_id","label":{"type":"plain_text","text":"A simple label","emoji":true},"optional":false,"element":{"type":"plain_text_input","action_id":"an_action_id"}}],"private_metadata":"Shh it is a secret","callback_id":"identify_your_modals","external_id":"","state":{"values":[]},"hash":"156772938.1827394","clear_on_close":false,"notify_on_close":false}';

const snakecaseMembers = [
  {
    id: 'U023BECGF',
    team_id: 'T021F9ZE2',
    name: 'bobby',
    deleted: false,
    color: '9f69e7',
    real_name: 'Bobby Tables',
    tz: 'America/Los_Angeles',
    tz_label: 'Pacific Daylight Time',
    tz_offset: -25200,
    profile: {
      avatar_hash: 'ge3b51ca72de',
      current_status: ':mountain_railway: riding a train',
      first_name: 'Bobby',
      last_name: 'Tables',
      real_name: 'Bobby Tables',
      email: 'bobby@slack.com',
      skype: 'my-skype-name',
      phone: '+1 (123) 456 7890',
      image_24: 'https://...',
      image_32: 'https://...',
      image_48: 'https://...',
      image_72: 'https://...',
      image_192: 'https://...',
    },
    is_admin: true,
    is_owner: true,
    updated: 1490054400,
    has_2fa: false,
  },
  {
    id: 'W07QCRPA4',
    team_id: 'T0G9PQBBK',
    name: 'glinda',
    deleted: false,
    color: '9f69e7',
    real_name: 'Glinda Southgood',
    tz: 'America/Los_Angeles',
    tz_label: 'Pacific Daylight Time',
    tz_offset: -25200,
    profile: {
      avatar_hash: '8fbdd10b41c6',
      image_24: 'https://a.slack-edge.com...png',
      image_32: 'https://a.slack-edge.com...png',
      image_48: 'https://a.slack-edge.com...png',
      image_72: 'https://a.slack-edge.com...png',
      image_192: 'https://a.slack-edge.com...png',
      image_512: 'https://a.slack-edge.com...png',
      image_1024: 'https://a.slack-edge.com...png',
      image_original: 'https://a.slack-edge.com...png',
      first_name: 'Glinda',
      last_name: 'Southgood',
      title: 'Glinda the Good',
      phone: '',
      skype: '',
      real_name: 'Glinda Southgood',
      real_name_normalized: 'Glinda Southgood',
      email: 'glenda@south.oz.coven',
    },
    is_admin: true,
    is_owner: false,
    is_primary_owner: false,
    is_restricted: false,
    is_ultra_restricted: false,
    is_bot: false,
    updated: 1480527098,
    has_2fa: false,
  },
];

const camelcaseMembers = [
  {
    id: 'U023BECGF',
    teamId: 'T021F9ZE2',
    name: 'bobby',
    deleted: false,
    color: '9f69e7',
    realName: 'Bobby Tables',
    tz: 'America/Los_Angeles',
    tzLabel: 'Pacific Daylight Time',
    tzOffset: -25200,
    profile: {
      avatarHash: 'ge3b51ca72de',
      currentStatus: ':mountain_railway: riding a train',
      firstName: 'Bobby',
      lastName: 'Tables',
      realName: 'Bobby Tables',
      email: 'bobby@slack.com',
      skype: 'my-skype-name',
      phone: '+1 (123) 456 7890',
      image24: 'https://...',
      image32: 'https://...',
      image48: 'https://...',
      image72: 'https://...',
      image192: 'https://...',
    },
    isAdmin: true,
    isOwner: true,
    updated: 1490054400,
    has2fa: false,
  },
  {
    id: 'W07QCRPA4',
    teamId: 'T0G9PQBBK',
    name: 'glinda',
    deleted: false,
    color: '9f69e7',
    realName: 'Glinda Southgood',
    tz: 'America/Los_Angeles',
    tzLabel: 'Pacific Daylight Time',
    tzOffset: -25200,
    profile: {
      avatarHash: '8fbdd10b41c6',
      image24: 'https://a.slack-edge.com...png',
      image32: 'https://a.slack-edge.com...png',
      image48: 'https://a.slack-edge.com...png',
      image72: 'https://a.slack-edge.com...png',
      image192: 'https://a.slack-edge.com...png',
      image512: 'https://a.slack-edge.com...png',
      image1024: 'https://a.slack-edge.com...png',
      imageOriginal: 'https://a.slack-edge.com...png',
      firstName: 'Glinda',
      lastName: 'Southgood',
      title: 'Glinda the Good',
      phone: '',
      skype: '',
      realName: 'Glinda Southgood',
      realNameNormalized: 'Glinda Southgood',
      email: 'glenda@south.oz.coven',
    },
    isAdmin: true,
    isOwner: false,
    isPrimaryOwner: false,
    isRestricted: false,
    isUltraRestricted: false,
    isBot: false,
    updated: 1480527098,
    has2fa: false,
  },
];

const snakecaseUser = {
  id: 'U023BECGF',
  name: 'bobby',
  deleted: false,
  color: '9f69e7',
  profile: {
    avatar_hash: 'ge3b51ca72de',
    current_status: ':mountain_railway: riding a train',
    first_name: 'Bobby',
    last_name: 'Tables',
    real_name: 'Bobby Tables',
    tz: 'America/Los_Angeles',
    tz_label: 'Pacific Daylight Time',
    tz_offset: -25200,
    email: 'bobby@slack.com',
    skype: 'my-skype-name',
    phone: '+1 (123) 456 7890',
    image_24: 'https://...',
    image_32: 'https://...',
    image_48: 'https://...',
    image_72: 'https://...',
    image_192: 'https://...',
  },
  is_admin: true,
  is_owner: true,
  updated: 1490054400,
  has_2fa: true,
};

const camelcaseUser = {
  id: 'U023BECGF',
  name: 'bobby',
  deleted: false,
  color: '9f69e7',
  profile: {
    avatarHash: 'ge3b51ca72de',
    currentStatus: ':mountain_railway: riding a train',
    firstName: 'Bobby',
    lastName: 'Tables',
    realName: 'Bobby Tables',
    tz: 'America/Los_Angeles',
    tzLabel: 'Pacific Daylight Time',
    tzOffset: -25200,
    email: 'bobby@slack.com',
    skype: 'my-skype-name',
    phone: '+1 (123) 456 7890',
    image24: 'https://...',
    image32: 'https://...',
    image48: 'https://...',
    image72: 'https://...',
    image192: 'https://...',
  },
  isAdmin: true,
  isOwner: true,
  updated: 1490054400,
  has2fa: true,
};

const createMock = (): { client: SlackOAuthClient; mock: MockAdapter } => {
  const client = new SlackOAuthClient({
    accessToken: TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('#callMethod', () => {
  it('should call slack api', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.callMethod('chat.postMessage', {
      channel: CHANNEL,
      text: 'hello',
    });

    expect(res).toEqual(reply);
  });

  it('should throw if slack api return not ok', async () => {
    expect.assertions(1);
    const { client, mock } = createMock();

    const reply = {
      ok: false,
      error: 'something wrong',
      ts: '1405895017.000506',
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    try {
      await client.callMethod('chat.postMessage', {
        channel: CHANNEL,
        text: 'hello',
      });
    } catch (err) {
      expect(err.message).toEqual('Slack API - something wrong');
    }
  });
});

describe('#chat.postMessage', () => {
  it('should call chat.postMessage with channel and text message', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.postMessage({
      channel: CHANNEL,
      text: 'hello',
    });

    expect(res).toEqual(reply);
  });

  it('should call chat.postMessage with channel and attachments message', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok