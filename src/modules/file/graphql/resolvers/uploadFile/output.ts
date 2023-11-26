import { Field, ObjectType } from '@nestjs/graphql';

import { FileObject } from '../../objects';

@ObjectType()
export class UploadFileOutput {
  @Field(() => FileObject)
  image: FileObject;
}
