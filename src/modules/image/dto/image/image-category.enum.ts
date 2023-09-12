/* eslint-disable @typescript-eslint/naming-convention */
import { registerEnumType } from '@nestjs/graphql';

import { ImageCategoryType } from '../../image.types';

export const ImageCategory = {
  CHATS: 'chats',
  PORTFOLIOS: 'portfolios',
  QUESTION: 'question',
  FILES: 'files',
  NEWS: 'news',
} satisfies Record<Uppercase<ImageCategoryType>, ImageCategoryType>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ImageCategory = ImageCategoryType;

registerEnumType(ImageCategory, {
  name: 'ImageCategory',
});
