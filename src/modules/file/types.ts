import { MimeType } from './graphql';

export type FileCategoryType =
  | 'chats'
  | 'question'
  | 'portfolios'
  | 'files'
  | 'news';

// TODO remove after type will be added to hero24-types
export type FileDB = {
  data: {
    height?: number;
    name?: string;
    storagePath?: string;
    width?: number;
  };
};

export type FirebaseMetadata = {
  contentType: MimeType;
};

export type UploadFileToStorageArgs = {
  base64: string;
  mime: MimeType;
  storagePath: string;
};

export enum MimeTypeGroup {
  IMAGE = 'image/',
  APPLICATION = 'application/',
}
