import { MaybeType } from '$modules/common/common.types';

export type FileCategoryType =
  | 'chats'
  | 'question'
  | 'portfolios'
  | 'files'
  | 'news';

export type FileDB = {
  data: {
    height?: MaybeType<number>;
    name?: MaybeType<string>;
    storagePath?: string;
    width?: MaybeType<number>;
  };
};
