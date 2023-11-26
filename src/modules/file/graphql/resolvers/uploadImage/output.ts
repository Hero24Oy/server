import { Field, ObjectType } from '@nestjs/graphql';

import { FileObject } from '../../objects';

@ObjectType()
export class UploadImageOutput {
  @Field(() => FileObject)
  image: FileObject;
}
