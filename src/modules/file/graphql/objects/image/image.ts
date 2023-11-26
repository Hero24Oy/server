import { Field, ObjectType } from '@nestjs/graphql';

import { ImageDataObject } from '../file/data';
import { FileObject } from '../file/file';

@ObjectType()
export class ImageObject extends FileObject {
  @Field(() => ImageDataObject)
  data: ImageDataObject;
}
