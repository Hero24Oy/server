import { Field, ObjectType } from '@nestjs/graphql';

import { ImageCategory } from '../image/image-category.enum';
import { ImageDataDto } from '../image/image-data.dto';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class ImageDto {
  @Field(() => String)
  id: string;

  @Field(() => ImageCategory)
  category: ImageCategory;

  @Field(() => String)
  subcategory: string;

  @Field(() => String, { nullable: true })
  base64?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  downloadURL?: MaybeType<string>;

  @Field(() => ImageDataDto)
  data: ImageDataDto;
}
