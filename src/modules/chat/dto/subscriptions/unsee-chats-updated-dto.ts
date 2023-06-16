import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UnseenChatsChangedDto {
  userIds: string[]; // used for filtration

  @Field(() => Int)
  delta: number;
}
