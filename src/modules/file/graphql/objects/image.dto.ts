import { Field, ObjectType } from '@nestjs/graphql';

import { FileCategory } from '../image/image-category.enum';
import { ImageDataDto } from '../image/image-data.dto';

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

  @Field(() => ImageDataDto)
  data: ImageDataDto;
}
