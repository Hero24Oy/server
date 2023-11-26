import { Field, InputType, PickType } from '@nestjs/graphql';

import { FileDataWithoutStoragePathObject, FileObject } from '../../objects';

@InputType()
export class UploadFileInput extends PickType(
  FileObject,
  ['id', 'category', 'subcategory'],
  InputType,
) {
  @Field(() => String)
  base64: string;

  @Field(() => FileDataWithoutStoragePathObject)
  data: FileDataWithoutStoragePathObject;
}
