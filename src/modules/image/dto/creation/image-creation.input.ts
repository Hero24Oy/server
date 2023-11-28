import { Field, InputType, PickType } from '@nestjs/graphql';

import { ImageDto } from '../image/image.dto';

import { ImageCreationDataInput } from './image-creation-data.input';

@InputType()
export class ImageCreationInput extends PickType(
  ImageDto,
  ['id', 'category', 'subcategory'],
  InputType,
) {
  @Field(() => String)
  base64: string;

  @Field(() => ImageCreationDataInput)
  data: ImageCreationDataInput;
}
