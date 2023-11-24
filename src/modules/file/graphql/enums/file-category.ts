import { registerEnumType } from '@nestjs/graphql';

export enum FileCategory {
  CHATS = 'chats',
  PORTFOLIOS = 'portfolios',
  QUESTION = 'question',
  FILES = 'files',
  NEWS = 'news',
}

registerEnumType(FileCategory, {
  name: 'FileCategory',
});
