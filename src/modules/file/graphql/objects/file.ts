import { Field, ObjectType } from '@nestjs/graphql';

import { FileCategory, MimeType } from '../enums';

import { FileDataObject } from './data';

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

  @Field(() => MimeType, { nullable: true, defaultValue: MimeType.JPG })
  mime: MimeType;

  @Field(() => FileDataObject)
  data: FileDataObject;
}
