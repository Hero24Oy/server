import { Field, ObjectType } from '@nestjs/graphql';

import { FileObject } from '../file';

import { ImageDataDto } from './data';

@ObjectType()
export class ImageObject extends FileObject {
  @Field(() => ImageDataDto)
  data: ImageDataDto;
}
