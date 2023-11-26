import { Field, ObjectType } from '@nestjs/graphql';

import { FileObject } from '../../objects';

@ObjectType()
export class FileOutput {
  @Field(() => FileObject)
  image: FileObject;
}
