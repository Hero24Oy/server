import { Field, ObjectType } from '@nestjs/graphql';

import { FileCategory, MimeType } from '../../enums';

import { DEFAULT_MIME } from './constants';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class FileObject {
  @Field(() => String)
  id: string;

  @Field(() => FileCategory)
  category: FileCategory;

  @Field(() => String)
  subcategory: string;

  @Field(() => String, { nullable: true })
  base64?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  downloadURL?: MaybeType<string>;

  @Field(() => MimeType, { defaultValue: DEFAULT_MIME })
  mime?: MaybeType<MimeType>;
}
