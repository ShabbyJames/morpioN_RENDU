import { OnRequestFunction } from 'messaging-api-common';

export type Attachment = {
  fallback: string;
  pretext?: string;
  color?: string;
  authorName?: string;
  authorLink?: string;
  authorIcon?: string;
  title?: string;
  titleLink?: string;
  text?: string;
  fields?: {
    title: string;
    value: string;
    sh