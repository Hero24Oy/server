import { Field, ObjectType } from '@nestjs/graphql';

import { ImageDataDto } from '../../image/image-data.dto';
import { FileObject } from '../file';

@ObjectType()
export class ImageObject extends FileObject {
  @Field(() => ImageDataDto)
  data: ImageDataDto;
}
