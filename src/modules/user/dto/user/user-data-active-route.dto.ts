import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDataActiveRouteDto {
  @Field(() => String, { nullable: true })
  chatId?: string;
}
