import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ImageInput {
  @Field(() => String)
  id: string;
}
