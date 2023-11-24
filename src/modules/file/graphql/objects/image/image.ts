import { Field, ObjectType } from '@nestjs/graphql';

import { FileObject } from '../file';

import { ImageDataObject } from './data';

@ObjectType()
export class ImageObject extends FileObject {
  @Field(() => ImageDataObject)
  data: ImageDataObject;
}
