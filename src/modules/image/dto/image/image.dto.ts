import { Field, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';

import { ImageCategory } from './image-category.enum';
import { ImageDataDto } from './image-data.dto';

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
