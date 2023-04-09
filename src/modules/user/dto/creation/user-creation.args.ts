import { ArgsType, Field } from '@nestjs/graphql';
import { UserDataInput } from './user-data.input';

@ArgsType()
export class UserCreationArgs {
  @Field(() => UserDataInput)
  data: UserDataInput;

  @Field(() => Boolean, { nullable: true })
  isCreatedFromWeb?: boolean;

  @Field(() => String, { nullable: true })
  userId?: string;
}
