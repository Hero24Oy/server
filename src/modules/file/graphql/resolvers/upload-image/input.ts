import { Field, InputType, PickType } from '@nestjs/graphql';

import { FileObject } from '../../objects';

import { ImageCreationDataInput } from './data';

/**
 * @deprecated `ImageCreationInput` object is legacy, use `UploadFileInput` instead.
 */
@InputType()
export class ImageCreationInput extends PickType(
  FileObject,
  ['id', 'category', 'subcategory', 'mime'],
  InputType,
) {
  @Field(() => String)
  base64: string;

  @Field(() => ImageCreationDataInput)
  data: ImageCreationDataInput;
}
