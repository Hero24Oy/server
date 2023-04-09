import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDataActiveRoute {
  @Field(() => String, { nullable: true })
  chatId?: string;
}
