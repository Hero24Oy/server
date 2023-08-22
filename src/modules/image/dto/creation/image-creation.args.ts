import { Field, ArgsType } from '@nestjs/graphql';

import { ImageCreationInput } from './image-creation.input';

@ArgsType()
export class ImageCreationArgs {
  @Field(() => ImageCreationInput)
  input: ImageCreationInput;
}
