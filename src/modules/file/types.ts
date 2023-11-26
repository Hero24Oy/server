import { MimeType } from './graphql';

export type FileCategoryType =
  | 'chats'
  | 'question'
  | 'portfolios'
  | 'files'
  | 'news';

export type FileDB = {
  data: {
    name?: string;
    storagePath?: string;
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
