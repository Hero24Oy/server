import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserAdminStatusEditInput {
  @Field(() => Boolean)
  isAdmin: boolean;

  @Field(() => String)
  id: string;
}
