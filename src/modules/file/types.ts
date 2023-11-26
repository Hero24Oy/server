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
