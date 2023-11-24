import { registerEnumType } from '@nestjs/graphql';

import { FileCategoryType } from '../../types';

export const FileCategory = {
  CHATS: 'chats',
  PORTFOLIOS: 'portfolios',
  QUESTION: 'question',
  FILES: 'files',
  NEWS: 'news',
} satisfies Record<Uppercase<FileCategoryType>, FileCategoryType>;

export type FileCategory = FileCategoryType;

registerEnumType(FileCategory, {
  name: 'FileCategory',
});
