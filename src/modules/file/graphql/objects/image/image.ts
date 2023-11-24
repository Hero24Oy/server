import { Field, ObjectType } from '@nestjs/graphql';

import { FileObject } from '../file';

import { ImageDataDto } from './image-data.dto';

@ObjectType()
export class ImageObject extends FileObject {
  @Field(() => ImageDataDto)
  data: ImageDataDto;
}
