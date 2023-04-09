import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PartialUserDataActiveRouteInput {
  @Field(() => String, { nullable: true })
  chatId?: string;
}
