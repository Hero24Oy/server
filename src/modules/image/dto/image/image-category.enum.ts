import { registerEnumType } from '@nestjs/graphql';

import { ImageCategoryType } from '../../image.types';

export const ImageCategory = {
  CHATS: 'chats',
  PORTFOLIOS: 'portfolios',
  QUESTION: 'question',
  FILES: 'files',
  NEWS: 'news',
} satisfies Record<Uppercase<ImageCategoryType>, ImageCategoryType>;

export type ImageCategory = ImageCategoryType;

registerEnumType(ImageCategory, {
  name: 'ImageCategory',
});
