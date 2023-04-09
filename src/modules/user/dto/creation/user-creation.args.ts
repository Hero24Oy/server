import { ArgsType, Field } from '@nestjs/graphql';
import { UserDataInput } from './user-data.input';

@ArgsType()
export class UserCreationArgs {
  @Field(() => UserDataInput)
  data: UserDataInput;

  @Field(() => Boolean)
  isCreatedFromWeb: boolean;
}
