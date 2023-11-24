import { Field, ObjectType } from '@nestjs/graphql';

import { ImageObject } from '../../objects';

@ObjectType()
export class UploadImageOutput {
  @Field(() => ImageObject)
  image: ImageObject;
}
