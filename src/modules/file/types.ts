import { MimeType } from './graphql';

import { MaybeType } from '$modules/common/common.types';

export type FileCategoryType =
  | 'chats'
  | 'question'
  | 'portfolios'
  | 'files'
  | 'news';

export type FileDB = {
  data: {
    name?: MaybeType<string>;
    storagePath?: string;
  };
};

export type FirebaseMetadata = {
  contentType: MimeType;
};
