import { Field, InputType, PickType } from '@nestjs/graphql';

import { FileDataWithoutStoragePathObject, FileObject } from '../../objects';

@InputType()
export class UploadImageInput extends PickType(
  FileObject,
  ['id', 'category', 'subcategory'],
  InputType,
) {
  @Field(() => String)
  base64: string;

  @Field(() => FileDataWithoutStoragePathObject)
  data: FileDataWithoutStoragePathObject;
}
