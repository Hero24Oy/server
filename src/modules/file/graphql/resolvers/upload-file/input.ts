import { Field, InputType, PickType } from '@nestjs/graphql';

import { FileObject } from '../../objects';

import { UploadFileDataInput } from './data';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class UploadFileInput extends PickType(
  FileObject,
  ['id', 'category', 'subcategory', 'mime'],
  InputType,
) {
  @Field(() => String)
  base64: string;

  @Field(() => UploadFileDataInput, { nullable: true })
  data?: MaybeType<UploadFileDataInput>;
}
