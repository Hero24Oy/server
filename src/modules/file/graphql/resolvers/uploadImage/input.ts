import { Field, InputType, PickType } from '@nestjs/graphql';

import { FileObject, ImageDataWithoutStoragePathObject } from '../../objects';

@InputType()
export class ImageCreationInput extends PickType(
  FileObject,
  ['id', 'category', 'subcategory'],
  InputType,
) {
  @Field(() => String)
  base64: string;

  @Field(() => ImageDataWithoutStoragePathObject)
  data: ImageDataWithoutStoragePathObject;
}
