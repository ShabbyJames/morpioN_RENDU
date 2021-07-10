
import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accessToken: string;
  channelSecret?: string;
  origin?: string;
  dataOrigin?: string;
  onRequest?: OnRequestFunction;
};

/**
 * User Profile
 *
 */
export type User = {
  /** User's display name */
  displayName: string;

  /** User ID */
  userId: string;

  language?: string;

  /** Profile image URL. "https" image URL. Not included in the response if the user doesn't have a profile image. */
  pictureUrl: string;

  /** User's status message. Not included in the response if the user doesn't have a status message. */
  statusMessage: string;
};

/**
 * Group Summary
 */
export type Group = {
  /** Group ID */
  groupId: string;

  /** Group Name */
  groupName: string;

  /** Group icon URL */
  pictureUrl: string;
};

export type ImageMessage = {
  type: 'image';

  /**
   * Image URL (Max character limit: 1000)
   * - HTTPS over TLS 1.2 or later
   * - JPEG
   * - Max: 4096 x 4096
   * - Max: 1 MB
   */
  originalContentUrl: string;

  /**
   * Preview image URL (Max character limit: 1000)
   * - HTTPS over TLS 1.2 or later
   * - JPEG
   * - Max: 240 x 240