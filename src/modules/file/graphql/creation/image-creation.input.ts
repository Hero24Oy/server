import { Field, InputType, PickType } from '@nestjs/graphql';

import { FileObject } from '../objects/file';

import { ImageCreationDataInput } from './image-creation-data.input';

@InputType()
export class ImageCreationInput extends PickType(
  FileObject,
  ['id', 'category', 'subcategory'],
  InputType,
) {
  @Field(() => String)
  base64: string;

  @Field(() => ImageCreationDataInput)
  data: ImageCreationDataInput;
}
