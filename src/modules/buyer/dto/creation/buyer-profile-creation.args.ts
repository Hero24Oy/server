import { ArgsType, Field } from '@nestjs/graphql';
import { BuyerProfileDataInput } from './buyer-profile-data.input';

@ArgsType()
export class BuyerProfileCreationArgs {
  @Field(() => String)
  id: string;

  @Field(() => BuyerProfileDataInput)
  data: BuyerProfileDataInput;
}
