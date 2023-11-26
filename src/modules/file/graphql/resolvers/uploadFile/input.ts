import { Field, InputType, PickType } from '@nestjs/graphql';

import { FileDataWithoutStoragePathObject, FileObject } from '../../objects';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class UploadFileInput extends PickType(
  FileObject,
  ['id', 'category', 'subcategory', 'mime'],
  InputType,
) {
  @Field(() => String)
  base64: string;

  @Field(() => FileDataWithoutStoragePathObject, { nullable: true })
  data?: MaybeType<FileDataWithoutStoragePathObject>;
}
