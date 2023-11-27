import { MimeType } from './graphql';

export type FileCategoryType =
  | 'chats'
  | 'question'
  | 'portfolios'
  | 'files'
  | 'news';

// TODO remove after type will be added to hero24-types
export type File = {
  data: {
    height?: number;
    name?: string;
    storagePath?: string;
    width?: number;
  };
};

export type FileWithStoragePath = File & {
  data: {
    storagePath: string;
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

export enum ErrorMessage {
  NO_FILE_DATA = 'No file data',
  INVALID_STORAGE_PATH = "Storage path isn't valid",
  UPLOADING_FAILED = 'Uploading file failed',
  DELETION_FAILED = 'File deletion failed',
  LOADING_FAILED = 'Loading file failed',
}
