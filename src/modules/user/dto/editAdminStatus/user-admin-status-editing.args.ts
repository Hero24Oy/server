import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class UserAdminStatusEditingArgs {
  @Field(() => Boolean)
  isAdmin: boolean;

  @Field(() => String)
  userId: string;
}
