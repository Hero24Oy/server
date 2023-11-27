import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveFileInput {
  @Field(() => String)
  id: string;
}
