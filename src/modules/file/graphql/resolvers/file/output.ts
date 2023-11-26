import { Field, ObjectType } from '@nestjs/graphql';

import { FileObject } from '../../objects';

@ObjectType()
export class FileOutput {
  @Field(() => FileObject)
  file: FileObject;
}
