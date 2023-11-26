import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveFileInput {
  @Field(() => String)
  id: string;
}
