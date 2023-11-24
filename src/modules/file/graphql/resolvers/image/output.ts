import { Field, ObjectType } from '@nestjs/graphql';

import { ImageObject } from '../../objects';

@ObjectType()
export class ImageOutput {
  @Field(() => ImageObject)
  image: ImageObject;
}
