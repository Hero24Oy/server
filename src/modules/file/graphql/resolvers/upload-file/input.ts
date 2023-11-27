import { Field, InputType, PickType } from '@nestjs/graphql';

import { FileDataWithoutStoragePath, FileObject } from '../../objects';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class UploadFileInput extends PickType(
  FileObject,
  ['id', 'category', 'subcategory', 'mime'],
  InputType,
) {
  @Field(() => String)
  base64: string;

  @Field(() => FileDataWithoutStoragePath, { nullable: true })
  data?: MaybeType<FileDataWithoutStoragePath>;
}
