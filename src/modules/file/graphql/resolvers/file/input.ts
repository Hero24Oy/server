import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FileInput {
  @Field(() => String)
  id: string;
}
