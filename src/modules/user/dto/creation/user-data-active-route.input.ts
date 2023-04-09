import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserDataActiveRouteInput {
  @Field(() => String, { nullable: true })
  chatId?: string;
}
