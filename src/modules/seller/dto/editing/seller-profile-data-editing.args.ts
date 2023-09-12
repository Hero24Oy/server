import { ArgsType, Field } from '@nestjs/graphql';

import { PartialSellerProfileDataInput } from './partial-seller-profile-data.input';

@ArgsType()
export class SellerProfileDataEditingArgs {
  @Field(() => String)
  id: string;

  @Field(() => PartialSellerProfileDataInput)
  data: PartialSellerProfileDataInput;
}
