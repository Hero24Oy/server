import { ArgsType, Field } from '@nestjs/graphql';

import { PartialUserDataInput } from './partial-user-data.input';

@ArgsType()
export class UserDataEditingArgs {
  @Field(() => PartialUserDataInput)
  data: PartialUserDataInput;

  @Field(() => String)
  userId: string;
}
