import { ObjectType } from '@nestjs/graphql';

import { ImageObject } from '../../objects';

@ObjectType()
export class ImageOutput {
  image: ImageObject;
}
