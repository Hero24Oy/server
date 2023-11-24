import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveImageInput {
  @Field(() => String)
  id: string;
}
