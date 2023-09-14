import { ArgsType, Field } from '@nestjs/graphql';

import { PartialBuyerProfileDataInput } from './partial-buyer-profile-data.input';

@ArgsType()
export class BuyerProfileDataEditingArgs {
  @Field(() => String)
  id: string;

  @Field(() => PartialBuyerProfileDataInput)
  data: PartialBuyerProfileDataInput;
}
