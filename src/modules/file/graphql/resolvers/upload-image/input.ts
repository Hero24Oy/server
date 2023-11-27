import { Field, InputType, PickType } from '@nestjs/graphql';

import { FileDataWithoutStoragePath, FileObject } from '../../objects';

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

  @Field(() => FileDataWithoutStoragePath)
  data: FileDataWithoutStoragePath;
}
