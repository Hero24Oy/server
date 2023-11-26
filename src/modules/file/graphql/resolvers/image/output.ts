import { Field, ObjectType } from '@nestjs/graphql';

import { FileObject } from '../../objects';

@ObjectType()
export class ImageOutput {
  @Field(() => FileObject)
  image: FileObject;
}
